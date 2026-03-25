'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Furniture, Room, ViewMode } from '@/types'
import { worldToCanvas, canvasToWorld, distance, logEvent } from '@/lib/geometry'
import styles from './RoomCanvas.module.css'

interface RoomCanvasProps {
  room: Room
  furniture: Furniture[]
  onFurnitureMoved: (furnitureId: string, position: { x: number; y: number }) => void
  selectedFurnitureId: string | null
  onFurnitureSelect: (furnitureId: string | null) => void
  viewMode: ViewMode
  showPath?: boolean
  pathPoints?: Array<{ x: number; y: number; status: 'clear' | 'tight' | 'blocked' }>
  povPosition?: { x: number; y: number; angle: number }
}

export function RoomCanvas({
  room,
  furniture,
  onFurnitureMoved,
  selectedFurnitureId,
  onFurnitureSelect,
  viewMode,
  showPath = false,
  pathPoints = [],
  povPosition,
}: RoomCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const CANVAS_PADDING = 40
  const WALL_COLOR = '#2a2a2a'
  const FLOOR_COLOR = '#f0f0f0'
  const GRID_COLOR = '#e0e0e0'

  // Draw the room canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const scale = (width - CANVAS_PADDING * 2) / room.width

    // Clear canvas
    ctx.fillStyle = FLOOR_COLOR
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth = 1
    for (let x = 0; x <= room.width; x += 1) {
      const px = CANVAS_PADDING + x * scale
      ctx.beginPath()
      ctx.moveTo(px, CANVAS_PADDING)
      ctx.lineTo(px, height - CANVAS_PADDING)
      ctx.stroke()
    }
    for (let y = 0; y <= room.depth; y += 1) {
      const py = CANVAS_PADDING + y * scale
      ctx.beginPath()
      ctx.moveTo(CANVAS_PADDING, py)
      ctx.lineTo(width - CANVAS_PADDING, py)
      ctx.stroke()
    }

    // Draw room walls
    ctx.strokeStyle = WALL_COLOR
    ctx.lineWidth = 3
    const roomRight = CANVAS_PADDING + room.width * scale
    const roomBottom = CANVAS_PADDING + room.depth * scale

    // Walls
    ctx.beginPath()
    ctx.rect(CANVAS_PADDING, CANVAS_PADDING, room.width * scale, room.depth * scale)
    ctx.stroke()

    // Draw door/opening
    const doorY = CANVAS_PADDING + room.depth * scale
    const doorWidth = 1 * scale
    ctx.clearRect(roomRight - doorWidth - 10, doorY - 2, doorWidth, 4)
    ctx.fillStyle = '#aaa'
    ctx.font = '12px Inter'
    ctx.fillText('Entry', roomRight - doorWidth - 5, doorY + 15)

    // Draw bathroom zone
    const bathroomSize = 1.2 * scale
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    ctx.rect(roomRight - bathroomSize - 10, CANVAS_PADDING + 10, bathroomSize, bathroomSize)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#ccc'
    ctx.font = '11px Inter'
    ctx.fillText('Bath', roomRight - bathroomSize - 8, CANVAS_PADDING + 25)

    // Draw path if visible
    if (showPath && pathPoints.length > 0) {
      // Draw path line
      for (let i = 0; i < pathPoints.length - 1; i++) {
        const p1 = pathPoints[i]
        const p2 = pathPoints[i + 1]
        const x1 = CANVAS_PADDING + p1.x * scale
        const y1 = CANVAS_PADDING + p1.y * scale
        const x2 = CANVAS_PADDING + p2.x * scale
        const y2 = CANVAS_PADDING + p2.y * scale

        let color = '#4ade80' // green
        if (p1.status === 'tight') color = '#facc15' // yellow
        if (p1.status === 'blocked') color = '#ef4444' // red

        ctx.strokeStyle = color
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }

    // Draw furniture
    furniture.forEach((furn) => {
      const [fx, fy] = worldToCanvas(furn.position, room.width, width, height, CANVAS_PADDING)
      const fw = furn.width * scale
      const fd = furn.depth * scale

      // Furniture shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(fx - fw / 2 + 1, fy - fd / 2 + 1, fw, fd)

      // Furniture body
      if (selectedFurnitureId === furn.id) {
        ctx.fillStyle = '#333'
        ctx.strokeStyle = '#ffb300'
        ctx.lineWidth = 3
      } else {
        ctx.fillStyle = '#555'
        ctx.strokeStyle = '#999'
        ctx.lineWidth = 1
      }
      ctx.fillRect(fx - fw / 2, fy - fd / 2, fw, fd)
      ctx.strokeRect(fx - fw / 2, fy - fd / 2, fw, fd)

      // Furniture label
      ctx.fillStyle = '#000'
      ctx.font = 'bold 11px Inter'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(furn.label, fx, fy)
    })

    // Draw POV indicator if in POV mode
    if (viewMode === 'pov' && povPosition) {
      const px = CANVAS_PADDING + povPosition.x * scale
      const py = CANVAS_PADDING + povPosition.y * scale
      
      ctx.fillStyle = '#ff6b6b'
      ctx.beginPath()
      ctx.arc(px, py, 8, 0, Math.PI * 2)
      ctx.fill()

      // Direction indicator
      const angle = povPosition.angle
      ctx.strokeStyle = '#ff6b6b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(
        px + Math.cos(angle) * 12,
        py + Math.sin(angle) * 12
      )
      ctx.stroke()
    }
  }, [room, furniture, selectedFurnitureId, viewMode, showPath, pathPoints, povPosition])

  useEffect(() => {
    draw()
  }, [draw])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let clicked = false
    for (let i = furniture.length - 1; i >= 0; i--) {
      const furn = furniture[i]
      const [fx, fy] = worldToCanvas(furn.position, room.width, canvas.width, canvas.height, CANVAS_PADDING)
      const scale = (canvas.width - CANVAS_PADDING * 2) / room.width
      const fw = furn.width * scale
      const fd = furn.depth * scale

      if (x >= fx - fw / 2 && x <= fx + fw / 2 && y >= fy - fd / 2 && y <= fy + fd / 2) {
        onFurnitureSelect(furn.id)
        setDraggingId(furn.id)
        setDragOffset({ x: x - fx, y: y - fy })
        clicked = true
        break
      }
    }

    if (!clicked) {
      onFurnitureSelect(null)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingId) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const furn = furniture.find((f) => f.id === draggingId)
    if (furn) {
      const newX = x - dragOffset.x
      const newY = y - dragOffset.y
      const worldPos = canvasToWorld(newX, newY, room.width, canvas.width, canvas.height, CANVAS_PADDING)
      onFurnitureMoved(draggingId, { x: worldPos.x, y: worldPos.y })
      logEvent('furniture_dragged', { furnitureId: draggingId, position: worldPos })
    }
  }

  const handleCanvasMouseUp = () => {
    setDraggingId(null)
  }

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className={styles.canvas}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
    />
  )
}

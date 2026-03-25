'use client'

import React, { useEffect, useRef } from 'react'
import { Furniture, Vector3 } from '@/types'
import styles from './POVView.module.css'

interface POVViewProps {
  furniture: Furniture[]
  room: { width: number; depth: number; height: number }
  currentPosition: Vector3
  angle: number
  isPOVWalking: boolean
}

export function POVView({ furniture, room, currentPosition, angle, isPOVWalking }: POVViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas with sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#87ceeb')
    gradient.addColorStop(1, '#e8e8e8')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw horizon line
    const horizonY = height * 0.6
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, horizonY)
    ctx.lineTo(width, horizonY)
    ctx.stroke()

    // Draw simple floor
    ctx.fillStyle = '#d4d4d4'
    ctx.fillRect(0, horizonY, width, height - horizonY)

    // Draw perspective furniture (simplified 3D projection)
    furniture.forEach((furn) => {
      const dx = furn.position.x - currentPosition.x
      const dy = furn.position.y - currentPosition.y

      // Convert to relative angle
      const furnitureAngle = Math.atan2(dy, dx)
      const angleDiff = furnitureAngle - angle

      // Only draw furniture in front (roughly)
      if (Math.abs(angleDiff) < Math.PI / 2) {
        // Perspective distortion
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0.3) {
          // Horizontal position based on angle
          const screenX = width / 2 + (angleDiff / (Math.PI / 2)) * (width / 3)
          // Vertical size based on distance
          const screenScale = 1 / (dist * 2)
          const screenHeight = room.height * screenScale * 100

          // Draw furniture as simple rectangle
          const boxWidth = furn.width * screenScale * 100
          const boxHeight = Math.min(screenHeight, height - horizonY)
          const boxX = screenX - boxWidth / 2
          const boxY = horizonY - boxHeight * 0.8

          if (boxX + boxWidth > 0 && boxX < width) {
            ctx.fillStyle = '#666'
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight)

            // Label
            ctx.fillStyle = '#fff'
            ctx.font = '12px Inter'
            ctx.textAlign = 'center'
            ctx.fillText(furn.label, screenX, boxY + 20)
          }
        }
      }
    })

    // Draw crosshair
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)'
    ctx.lineWidth = 1
    const crossSize = 20
    ctx.beginPath()
    ctx.moveTo(width / 2 - crossSize, height / 2)
    ctx.lineTo(width / 2 + crossSize, height / 2)
    ctx.moveTo(width / 2, height / 2 - crossSize)
    ctx.lineTo(width / 2, height / 2 + crossSize)
    ctx.stroke()

    // Draw pulsing indicator if walking
    if (isPOVWalking) {
      ctx.fillStyle = 'rgba(100, 200, 100, 0.2)'
      ctx.fillRect(0, 0, width, height)
    }
  }, [furniture, room, currentPosition, angle, isPOVWalking])

  return <canvas ref={canvasRef} width={800} height={600} className={styles.canvas} />
}

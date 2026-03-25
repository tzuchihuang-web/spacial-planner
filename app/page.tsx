'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Mode, ViewMode, Furniture, Vector3 } from '@/types'
import { STUDIO_A, STUDIO_B, GOALS_A, GOALS_B } from '@/lib/roomData'
import { ModeSelector } from '@/components/ModeSelector'
import { Sidebar } from '@/components/Sidebar'
import { RoomCanvas } from '@/components/RoomCanvas'
import { GoalsPanel } from '@/components/GoalsPanel'
import { ModeBPanel } from '@/components/ModeBPanel'
import { POVView } from '@/components/POVView'
import { logEvent } from '@/lib/geometry'
import styles from './page.module.css'

export default function Home() {
  const [experimentMode, setExperimentMode] = useState<Mode | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('top')
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [furniture, setFurniture] = useState<Furniture[]>([])
  const [isPOVWalking, setIsPOVWalking] = useState(false)
  const [walkProgress, setWalkProgress] = useState(0)
  const [revealedPath, setRevealedPath] = useState<Array<{ x: number; y: number; status: 'clear' | 'tight' | 'blocked' }>>([])
  const [roomDimensions, setRoomDimensions] = useState({ width: 5, depth: 7 })

  // Initialize room based on mode
  const room = useMemo(() => {
    if (experimentMode === 'A') {
      return STUDIO_A
    } else if (experimentMode === 'B') {
      return STUDIO_B
    }
    return STUDIO_A
  }, [experimentMode])

  // Initialize furniture when mode changes
  React.useEffect(() => {
    if (room) {
      setFurniture(JSON.parse(JSON.stringify(room.furniture)))
      setRoomDimensions({ width: room.width, depth: room.depth })
    }
  }, [room])

  const goals = experimentMode === 'B' ? GOALS_B : GOALS_A

  const handleModeSelect = useCallback((mode: Mode) => {
    setExperimentMode(mode)
    setSelectedFurnitureId(null)
    setSelectedGoalId(null)
    setViewMode('top')
    setIsPOVWalking(false)
    setRevealedPath([])
    logEvent('mode_entered', { mode })
  }, [])

  const handleFurnitureMoved = useCallback((furnitureId: string, position: { x: number; y: number }) => {
    setFurniture((prev) =>
      prev.map((f) =>
        f.id === furnitureId ? { ...f, position: { ...f.position, x: position.x, y: position.y } } : f
      )
    )
  }, [])

  const handleRoomDimensionsChange = useCallback((width: number, depth: number) => {
    setRoomDimensions({ width, depth })
  }, [])

  const handleReset = useCallback(() => {
    if (room) {
      setFurniture(JSON.parse(JSON.stringify(room.furniture)))
      setSelectedFurnitureId(null)
      setSelectedGoalId(null)
      setRevealedPath([])
      logEvent('room_reset', { mode: experimentMode })
    }
  }, [room, experimentMode])

  const handleViewModeToggle = useCallback(() => {
    setViewMode((prev) => (prev === 'top' ? 'pov' : 'top'))
    logEvent('view_mode_changed', { viewMode: viewMode === 'top' ? 'pov' : 'top' })
  }, [viewMode])

  const handlePOVWalkStart = useCallback(() => {
    setIsPOVWalking(true)
    setWalkProgress(0)

    let progress = 0
    const interval = setInterval(() => {
      progress += 0.05
      setWalkProgress(progress)

      if (progress >= 1) {
        clearInterval(interval)
        setIsPOVWalking(false)
      }
    }, 50)
  }, [])

  const handlePOVWalkEnd = useCallback(() => {
    setIsPOVWalking(false)
  }, [])

  // Calculate POV position based on path
  const povPosition = useMemo(() => {
    if (revealedPath.length > 0 && walkProgress > 0) {
      const index = Math.floor(walkProgress * revealedPath.length)
      const point = revealedPath[Math.min(index, revealedPath.length - 1)]
      return { x: point.x, y: point.y, angle: Math.atan2(1, 0) }
    }
    return { x: 0, y: 0, angle: 0 }
  }, [revealedPath, walkProgress])

  if (!experimentMode) {
    return <ModeSelector onModeSelect={handleModeSelect} isExperimentStarted={false} />
  }

  return (
    <div className={styles.container}>
      <Sidebar
        currentTool="select"
        onToolChange={() => {}}
        roomWidth={roomDimensions.width}
        roomDepth={roomDimensions.depth}
        onRoomDimensionsChange={handleRoomDimensionsChange}
        onReset={handleReset}
      >
        <GoalsPanel
          goals={goals}
          selectedGoalId={selectedGoalId}
          onGoalSelect={setSelectedGoalId}
          mode={experimentMode}
        />

        {experimentMode === 'B' && (
          <ModeBPanel
            selectedGoalId={selectedGoalId}
            furniture={furniture}
            onPathReveal={setRevealedPath}
            onPOVWalkStart={handlePOVWalkStart}
            onPOVWalkEnd={handlePOVWalkEnd}
            isPOVWalking={isPOVWalking}
            room={{ width: room.width, depth: room.depth }}
          />
        )}
      </Sidebar>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={() => setExperimentMode(null)}>
              ← Back to Mode Selection
            </button>
            <span className={styles.modeBadge}>Mode {experimentMode}</span>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.viewToggle} onClick={handleViewModeToggle}>
              {viewMode === 'top' ? '👁️ Top View' : '👤 POV View'}
            </button>
            {isPOVWalking && <div className={styles.walkingIndicator}>Walking...</div>}
          </div>
        </div>

        <div className={styles.canvasContainer}>
          {viewMode === 'top' ? (
            <RoomCanvas
              room={room}
              furniture={furniture}
              onFurnitureMoved={handleFurnitureMoved}
              selectedFurnitureId={selectedFurnitureId}
              onFurnitureSelect={setSelectedFurnitureId}
              viewMode={viewMode}
              showPath={experimentMode === 'B' && selectedGoalId !== null}
              pathPoints={revealedPath}
              povPosition={isPOVWalking ? povPosition : undefined}
            />
          ) : (
            <POVView
              furniture={furniture}
              room={room}
              currentPosition={povPosition}
              angle={0}
              isPOVWalking={isPOVWalking}
            />
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.statusPill}>
            {viewMode === 'pov' ? 'First-Person View' : 'Top-Down View'} •{' '}
            {selectedFurnitureId ? 'Moving' : selectedGoalId ? 'Goal Selected' : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Furniture, Vector3 } from '@/types'
import { distance, generatePath, getPathWarning, logEvent } from '@/lib/geometry'
import styles from './ModeBPanel.module.css'

interface ModeBPanelProps {
  selectedGoalId: string | null
  furniture: Furniture[]
  onPathReveal: (pathPoints: Array<{ x: number; y: number; status: 'clear' | 'tight' | 'blocked' }>) => void
  onPOVWalkStart: () => void
  onPOVWalkEnd: () => void
  isPOVWalking: boolean
  room: { width: number; depth: number }
}

export function ModeBPanel({
  selectedGoalId,
  furniture,
  onPathReveal,
  onPOVWalkStart,
  onPOVWalkEnd,
  isPOVWalking,
  room,
}: ModeBPanelProps) {
  const [pathWarning, setPathWarning] = useState<string>('')

  useEffect(() => {
    if (!selectedGoalId) {
      setPathWarning('')
      return
    }

    // Generate path based on goal
    let fromPos: Vector3
    let toPos: Vector3
    let goalType = ''

    if (selectedGoalId === 'goal-b1') {
      // Bed to bathroom - find bed furniture
      const bedFurn = furniture.find((f) => f.type === 'bed')
      fromPos = bedFurn?.position || { x: 3.8, y: 0.5, z: 0 }
      toPos = { x: room.width - 0.8, y: 0.8, z: 0 }
      goalType = 'bed-to-bath'
    } else {
      // Desk to shelf - find desk and shelf
      const deskFurn = furniture.find((f) => f.type === 'desk')
      const shelfFurn = furniture.find((f) => f.type === 'shelf')
      fromPos = deskFurn?.position || { x: 3.5, y: 3.5, z: 0 }
      toPos = shelfFurn?.position || { x: 0.5, y: 5.5, z: 0 }
      goalType = 'desk-to-shelf'
    }

    const pathSegments = generatePath(fromPos, toPos, furniture, 0.6)
    const pathPoints = pathSegments.map((seg) => ({
      x: seg.from.x,
      y: seg.from.y,
      status: seg.status,
    }))

    // Check for obstacles
    const obstacles = pathSegments
      .filter((s) => s.status === 'blocked' || s.status === 'tight')
      .map((s) => s.warning || 'Obstacle')

    const warning = getPathWarning(selectedGoalId, obstacles)
    setPathWarning(warning)
    onPathReveal(pathPoints)

    logEvent('path_revealed', {
      goalId: selectedGoalId,
      goalType,
      obstacleCount: obstacles.length,
    })
  }, [selectedGoalId, furniture, onPathReveal, room])

  const handlePOVWalkthrough = () => {
    if (!selectedGoalId) return
    onPOVWalkStart()
    logEvent('pov_walkthrough_started', { goalId: selectedGoalId })
    
    // End walkthrough after animation
    setTimeout(() => {
      onPOVWalkEnd()
      logEvent('pov_walkthrough_completed', { goalId: selectedGoalId })
    }, 4000)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Guided Tools</h3>
      </div>

      {selectedGoalId && (
        <div className={styles.content}>
          <div className={styles.pathWarning}>
            <div className={styles.warningLabel}>Path Status</div>
            <p className={styles.warningText}>{pathWarning}</p>
          </div>

          <button
            className={`${styles.povButton} ${isPOVWalking ? styles.active : ''}`}
            onClick={handlePOVWalkthrough}
            disabled={isPOVWalking}
          >
            {isPOVWalking ? 'Walking...' : 'POV Walkthrough'}
          </button>
        </div>
      )}

      {!selectedGoalId && (
        <div className={styles.placeholder}>
          <p>Select a goal to reveal path and view options</p>
        </div>
      )}
    </div>
  )
}

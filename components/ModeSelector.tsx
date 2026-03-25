'use client'

import React, { useState, useCallback } from 'react'
import { Mode } from '@/types'
import { logEvent } from '@/lib/geometry'
import styles from './ModeSelector.module.css'

interface ModeSelectorProps {
  onModeSelect: (mode: Mode) => void
  isExperimentStarted: boolean
}

export function ModeSelector({ onModeSelect, isExperimentStarted }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)

  const handleModeSelect = useCallback((mode: Mode) => {
    setSelectedMode(mode)
    logEvent('mode_selected', { mode })
    setTimeout(() => {
      onModeSelect(mode)
    }, 300)
  }, [onModeSelect])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Home Planner</h1>
        <p className={styles.subtitle}>Select a planning mode to begin</p>

        <div className={styles.modeGrid}>
          <button
            className={`${styles.modeButton} ${selectedMode === 'A' ? styles.selected : ''}`}
            onClick={() => handleModeSelect('A')}
            disabled={isExperimentStarted}
          >
            <div className={styles.modeLetter}>A</div>
            <div className={styles.modeLabel}>Mode A</div>
            <div className={styles.modeDescription}>Planning Interface</div>
          </button>

          <button
            className={`${styles.modeButton} ${selectedMode === 'B' ? styles.selected : ''}`}
            onClick={() => handleModeSelect('B')}
            disabled={isExperimentStarted}
          >
            <div className={styles.modeLetter}>B</div>
            <div className={styles.modeLabel}>Mode B</div>
            <div className={styles.modeDescription}>Guided Interface</div>
          </button>
        </div>

        {selectedMode && (
          <p className={styles.hint}>Entering {selectedMode}...</p>
        )}
      </div>
    </div>
  )
}

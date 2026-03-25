'use client'

import React from 'react'
import { Goal } from '@/types'
import styles from './GoalsPanel.module.css'

interface GoalsPanelProps {
  goals: Goal[]
  selectedGoalId: string | null
  onGoalSelect: (goalId: string | null) => void
  mode: 'A' | 'B'
}

export function GoalsPanel({ goals, selectedGoalId, onGoalSelect, mode }: GoalsPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Planning Goals</h3>
        <div className={styles.modeLabel}>Mode {mode}</div>
      </div>

      <div className={styles.goalsList}>
        {goals.map((goal) => (
          <button
            key={goal.id}
            className={`${styles.goalCard} ${selectedGoalId === goal.id ? styles.selected : ''}`}
            onClick={() => onGoalSelect(selectedGoalId === goal.id ? null : goal.id)}
          >
            <div className={styles.goalTitle}>{goal.title}</div>
            <div className={styles.goalDescription}>{goal.description}</div>
            {selectedGoalId === goal.id && <div className={styles.indicator}>✓</div>}
          </button>
        ))}
      </div>
    </div>
  )
}

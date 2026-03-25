'use client'

import React from 'react'
import { Tool } from '@/types'
import styles from './Sidebar.module.css'

interface SidebarProps {
  currentTool: Tool
  onToolChange: (tool: Tool) => void
  roomWidth: number
  roomDepth: number
  onRoomDimensionsChange: (width: number, depth: number) => void
  onReset: () => void
  children?: React.ReactNode
}

export function Sidebar({
  currentTool,
  onToolChange,
  roomWidth,
  roomDepth,
  onRoomDimensionsChange,
  onReset,
  children,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Home Planner</h2>
        <p className={styles.subtitle}>Explore movement patterns</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Tools</h3>
        <div className={styles.toolsGrid}>
          <button
            className={`${styles.toolButton} ${currentTool === 'select' ? styles.active : ''}`}
            onClick={() => onToolChange('select')}
            title="Select and move furniture"
          >
            <span className={styles.toolIcon}>→</span>
            <span className={styles.toolLabel}>Select</span>
          </button>
          <button
            className={`${styles.toolButton} ${currentTool === 'place' ? styles.active : ''}`}
            onClick={() => onToolChange('place')}
            title="Place new furniture"
          >
            <span className={styles.toolIcon}>+</span>
            <span className={styles.toolLabel}>Place</span>
          </button>
          <button
            className={`${styles.toolButton} ${currentTool === 'route' ? styles.active : ''}`}
            onClick={() => onToolChange('route')}
            title="View routes and paths"
          >
            <span className={styles.toolIcon}>~</span>
            <span className={styles.toolLabel}>Route</span>
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Room Dimensions</h3>
        <div className={styles.sliderGroup}>
          <label>Width: {roomWidth.toFixed(1)}m</label>
          <input
            type="range"
            min="3"
            max="8"
            step="0.1"
            value={roomWidth}
            onChange={(e) => onRoomDimensionsChange(parseFloat(e.target.value), roomDepth)}
            className={styles.slider}
          />
        </div>
        <div className={styles.sliderGroup}>
          <label>Depth: {roomDepth.toFixed(1)}m</label>
          <input
            type="range"
            min="4"
            max="10"
            step="0.1"
            value={roomDepth}
            onChange={(e) => onRoomDimensionsChange(roomWidth, parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      {children && <div className={styles.section}>{children}</div>}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Legend</h3>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.colorGreen}`}></div>
            <span>Clear path</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.colorYellow}`}></div>
            <span>Tight space</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.colorRed}`}></div>
            <span>Blocked</span>
          </div>
        </div>
      </div>

      <button className={styles.resetButton} onClick={onReset}>
        Reset Room
      </button>
    </aside>
  )
}

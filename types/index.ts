// Types for the spatial planner prototype

export type ViewMode = 'top' | 'pov'
export type Mode = 'A' | 'B'
export type Tool = 'select' | 'place' | 'route'

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Furniture {
  id: string
  type: 'bed' | 'sofa' | 'desk' | 'chair' | 'table' | 'shelf'
  position: Vector3
  rotation: number
  width: number
  depth: number
  height: number
  label: string
}

export interface Room {
  id: string
  width: number
  depth: number
  height: number
  furniture: Furniture[]
  hasBathroom: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
}

export interface PathSegment {
  from: Vector3
  to: Vector3
  status: 'clear' | 'tight' | 'blocked'
  warning?: string
}

export interface PlannningState {
  mode: Mode
  viewMode: ViewMode
  currentTool: Tool
  selectedFurnitureId: string | null
  selectedGoalId: string | null
  roomDimensions: {
    width: number
    depth: number
    height: number
  }
  path: PathSegment[]
  isPOVWalking: boolean
  walkProgress: number
}

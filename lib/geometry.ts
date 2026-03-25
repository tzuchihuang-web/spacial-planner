import { Furniture, PathSegment, Vector3 } from '@/types'

// Convert 3D position to 2D canvas coordinates (top-down view)
export function worldToCanvas(pos: Vector3, roomWidth: number, canvasWidth: number, canvasHeight: number, padding: number = 20): [number, number] {
  const scale = (canvasWidth - padding * 2) / roomWidth
  const x = padding + pos.x * scale
  const y = padding + pos.y * scale
  return [x, y]
}

// Convert 2D canvas coordinates to 3D world position
export function canvasToWorld(canvasX: number, canvasY: number, roomWidth: number, canvasWidth: number, canvasHeight: number, padding: number = 20): Vector3 {
  const scale = (canvasWidth - padding * 2) / roomWidth
  const x = (canvasX - padding) / scale
  const y = (canvasY - padding) / scale
  return { x: Math.max(0, Math.min(x, roomWidth)), y: Math.max(0, Math.min(y, 0)), z: 0 }
}

// Calculate distance between two points
export function distance(p1: Vector3, p2: Vector3): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Check if a furniture piece collides with another
export function checkCollision(furn1: Furniture, furn2: Furniture, buffer: number = 0.2): boolean {
  const x1Min = furn1.position.x - furn1.width / 2 - buffer
  const x1Max = furn1.position.x + furn1.width / 2 + buffer
  const y1Min = furn1.position.y - furn1.depth / 2 - buffer
  const y1Max = furn1.position.y + furn1.depth / 2 + buffer

  const x2Min = furn2.position.x - furn2.width / 2 - buffer
  const x2Max = furn2.position.x + furn2.width / 2 + buffer
  const y2Min = furn2.position.y - furn2.depth / 2 - buffer
  const y2Max = furn2.position.y + furn2.depth / 2 + buffer

  return !(x1Max < x2Min || x1Min > x2Max || y1Max < y2Min || y1Min > y2Max)
}

// Simple path generation for pathfinding (straight line with width tolerance)
export function generatePath(
  from: Vector3,
  to: Vector3,
  furniture: Furniture[],
  pathWidth: number = 0.6
): PathSegment[] {
  const segments: PathSegment[] = []

  // Create a simple linear path with more granularity
  const steps = 20
  let prevPos = from
  let prevStatus: 'clear' | 'tight' | 'blocked' = 'clear'

  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const currentPos: Vector3 = {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
      z: 0,
    }

    // Check for collisions at this point
    let status: 'clear' | 'tight' | 'blocked' = 'clear'
    let warning: string | undefined

    // Check proximity to furniture with more sophisticated logic
    let minDist = Infinity
    let nearestFurniture: Furniture | null = null
    
    for (const furn of furniture) {
      const dx = currentPos.x - furn.position.x
      const dy = currentPos.y - furn.position.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      // Consider furniture dimensions for more accurate collision
      const minSafeDistance = (furn.width + furn.depth) / 4 + pathWidth / 2
      
      if (dist < minDist) {
        minDist = dist
        nearestFurniture = furn
      }
    }

    // More nuanced status determination
    if (minDist < pathWidth * 0.5) {
      status = 'blocked'
      warning = nearestFurniture ? `Blocked by ${nearestFurniture.label}` : 'Blocked'
    } else if (minDist < pathWidth * 1.2) {
      status = 'tight'
      warning = nearestFurniture ? `Tight near ${nearestFurniture.label}` : 'Tight space'
    } else {
      status = 'clear'
    }

    segments.push({
      from: prevPos,
      to: currentPos,
      status,
      warning,
    })

    prevPos = currentPos
    prevStatus = status
  }

  return segments
}

// Get path warning based on Goal
export function getPathWarning(goalId: string, furnitureAtRisk: string[]): string {
  if (goalId === 'goal-b1') {
    if (furnitureAtRisk.length > 0) {
      return `You might bump into the ${furnitureAtRisk.join(' and ')}`
    }
    return 'Clear path to bathroom'
  } else if (goalId === 'goal-b2') {
    if (furnitureAtRisk.length > 0) {
      return 'Tight turn near furniture'
    }
    return 'Smooth circulation between desk and shelf'
  }
  return ''
}

// Log events for research data collection
export function logEvent(eventType: string, data: Record<string, unknown>): void {
  console.log(`[SPATIAL-PLANNER-EVENT] ${eventType}:`, data)
}

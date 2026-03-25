import { Furniture, Room, Goal } from '@/types'

// Mode A: Studio Cell A - Basic layout
export const STUDIO_A: Room = {
  id: 'studio-a',
  width: 5,
  depth: 7,
  height: 2.8,
  hasBathroom: true,
  furniture: [
    {
      id: 'bed-a',
      type: 'bed',
      label: 'Bed',
      position: { x: 0.5, y: 0.5, z: 0 },
      rotation: 0,
      width: 1.4,
      depth: 2,
      height: 0.4,
    },
    {
      id: 'sofa-a',
      type: 'sofa',
      label: 'Sofa',
      position: { x: 2.5, y: 1, z: 0 },
      rotation: 0,
      width: 1.8,
      depth: 0.9,
      height: 0.7,
    },
    {
      id: 'desk-a',
      type: 'desk',
      label: 'Desk',
      position: { x: 0.5, y: 4, z: 0 },
      rotation: 0,
      width: 1.2,
      depth: 0.6,
      height: 0.75,
    },
    {
      id: 'chair-a',
      type: 'chair',
      label: 'Chair',
      position: { x: 0.5, y: 3.2, z: 0 },
      rotation: 0,
      width: 0.6,
      depth: 0.6,
      height: 0.75,
    },
    {
      id: 'table-a',
      type: 'table',
      label: 'Table',
      position: { x: 3, y: 3, z: 0 },
      rotation: 0,
      width: 0.8,
      depth: 0.8,
      height: 0.45,
    },
    {
      id: 'shelf-a',
      type: 'shelf',
      label: 'Shelf',
      position: { x: 4.2, y: 5, z: 0 },
      rotation: 0,
      width: 0.4,
      depth: 0.4,
      height: 1.2,
    },
  ],
}

// Mode B: Studio Cell B - Different arrangement
export const STUDIO_B: Room = {
  id: 'studio-b',
  width: 5.2,
  depth: 6.8,
  height: 2.8,
  hasBathroom: true,
  furniture: [
    {
      id: 'bed-b',
      type: 'bed',
      label: 'Bed',
      position: { x: 3.8, y: 0.5, z: 0 },
      rotation: 0,
      width: 1.4,
      depth: 2,
      height: 0.4,
    },
    {
      id: 'sofa-b',
      type: 'sofa',
      label: 'Sofa',
      position: { x: 0.5, y: 2, z: 0 },
      rotation: 0,
      width: 1.8,
      depth: 0.9,
      height: 0.7,
    },
    {
      id: 'desk-b',
      type: 'desk',
      label: 'Desk',
      position: { x: 3.5, y: 3.5, z: 0 },
      rotation: 0,
      width: 1.2,
      depth: 0.6,
      height: 0.75,
    },
    {
      id: 'chair-b',
      type: 'chair',
      label: 'Chair',
      position: { x: 2.5, y: 3.5, z: 0 },
      rotation: 0,
      width: 0.6,
      depth: 0.6,
      height: 0.75,
    },
    {
      id: 'table-b',
      type: 'table',
      label: 'Table',
      position: { x: 1.5, y: 3.5, z: 0 },
      rotation: 0,
      width: 0.8,
      depth: 0.8,
      height: 0.45,
    },
    {
      id: 'shelf-b',
      type: 'shelf',
      label: 'Shelf',
      position: { x: 0.5, y: 5.5, z: 0 },
      rotation: 0,
      width: 0.4,
      depth: 0.4,
      height: 1.2,
    },
  ],
}

// Mode A Goals
export const GOALS_A: Goal[] = [
  {
    id: 'goal-a1',
    title: 'Comfortable Workspace',
    description: 'You work from home at a desk.\nYou need a comfortable workspace.',
  },
  {
    id: 'goal-a2',
    title: 'Group Circulation',
    description: 'You sometimes have a group of friends visit.\nSeveral people should be able to move around comfortably.',
  },
]

// Mode B Goals
export const GOALS_B: Goal[] = [
  {
    id: 'goal-b1',
    title: 'Nighttime Path',
    description: 'You often walk from bed to bathroom at night.\nThe path should be easy and unobstructed.',
  },
  {
    id: 'goal-b2',
    title: 'Desk to Shelf Circulation',
    description: 'You move between your desk and shelves multiple times during the day.\nThe circulation between these areas should feel smooth.',
  },
]

# Home Planner - Spatial Planning Research Prototype

A desktop-only research prototype for a within-subject spatial planning experiment comparing two interface conditions.

## Features

### Core Functionality
- **Mode A**: Basic planning interface with furniture drag-and-drop and goal visualization
- **Mode B**: Guided exploratory interface with path reveals, status indicators, and POV walkthrough
- **Two studio cells**: Different but similarly-sized spaces (Studio A: 5×7m, Studio B: 5.2×6.8m)
- **Multiple furniture pieces**: Bed, sofa, desk, chair, table, shelf (6 items per room)
- **Top-down and POV views**: Toggle between overhead planning view and first-person walkthrough

### Mode A - Baseline Planning
- Simple drag-and-drop furniture placement
- Goals displayed in task panel
- Free exploration without guidance
- Room dimension sliders

### Mode B - Guided Navigation
- Path reveal system with color-coded status:
  - **Green**: Clear path
  - **Yellow**: Tight space
  - **Red**: Blocked or collision risk
- Goal-based path generation:
  - Goal 1: Bed to bathroom (nighttime navigation)
  - Goal 2: Desk to shelf circulation (daytime workflow)
- POV walkthrough animation along revealed paths
- Contextual guidance messages

### Research Features
- Console event logging for behavioral tracking:
  - Mode entered
  - Furniture moved
  - Goal selected
  - Path revealed
  - POV walkthrough started/completed
- Local state management (no backend required)
- Reset room functionality
- Easy modification of room layouts, goals, and path logic

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main app component with state management
│   ├── globals.css         # Global styles
│   └── page.module.css     # Page-specific styles
├── components/
│   ├── ModeSelector.tsx    # Mode A/B selection interface
│   ├── Sidebar.tsx         # Left control panel
│   ├── RoomCanvas.tsx      # Top-down room visualization
│   ├── GoalsPanel.tsx      # Goals task display
│   ├── ModeBPanel.tsx      # Mode B specific controls
│   ├── POVView.tsx         # First-person walkthrough view
│   └── *.module.css        # Component-specific styles
├── lib/
│   ├── roomData.ts         # Room definitions and furniture layouts
│   └── geometry.ts         # Coordinate, path, and collision utilities
├── types/
│   └── index.ts            # TypeScript type definitions
└── package.json            # Dependencies
```

## Key Files for Modification

### Adjusting Room Layouts
Edit `/vercel/share/v0-project/lib/roomData.ts`:
- `STUDIO_A`: Modify furniture positions, dimensions, or add/remove items
- `STUDIO_B`: Similar modifications for the second condition

### Changing Goals
Edit `/vercel/share/v0-project/lib/roomData.ts`:
- `GOALS_A`: Update goal descriptions for Mode A
- `GOALS_B`: Update goal descriptions for Mode B

### Path Logic and Path Reveal Behavior
Edit `/vercel/share/v0-project/lib/geometry.ts`:
- `generatePath()`: Adjust pathfinding algorithm, step granularity, or collision detection
- `getPathWarning()`: Customize warning messages based on goal type

### Styling and Colors
- `/vercel/share/v0-project/app/globals.css`: Global color scheme
- `/vercel/share/v0-project/components/*.module.css`: Component-specific styling
- Sidebar: Dark navy (#1a1a1a) background
- Path colors: Green (#4ade80), Yellow (#facc15), Red (#ef4444)

### UI Text and Labels
- Sidebar title and subtitle: Edit `Sidebar.tsx`
- Mode selector text: Edit `ModeSelector.tsx`
- Button labels: Search component files for hardcoded text

## Event Logging for Data Collection

All research events are logged to the browser console with the `[SPATIAL-PLANNER-EVENT]` prefix:

```javascript
// Example logs
[SPATIAL-PLANNER-EVENT] mode_selected: { mode: 'A' }
[SPATIAL-PLANNER-EVENT] mode_entered: { mode: 'B' }
[SPATIAL-PLANNER-EVENT] furniture_dragged: { furnitureId: 'desk-a', position: {x, y, z} }
[SPATIAL-PLANNER-EVENT] path_revealed: { goalId: 'goal-b1', goalType: 'bed-to-bath', obstacleCount: 2 }
[SPATIAL-PLANNER-EVENT] pov_walkthrough_started: { goalId: 'goal-b1' }
[SPATIAL-PLANNER-EVENT] pov_walkthrough_completed: { goalId: 'goal-b1' }
```

Facilitators can capture these logs for analysis. Integration with a backend database can be added later if needed.

## Development & Testing

### Run locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Build for deployment
```bash
npm run build
npm start
```

## Design Principles

- **Research-ready**: Prioritizes clarity and stability over polish
- **Participant-facing labels only**: Modes shown as A and B (not "baseline" or "guided")
- **Lightweight interactions**: Stable, predictable behavior for moderated study sessions
- **Easy to modify**: Self-contained logic for room layouts, goals, and path rules

## Notes for Facilitators

1. **Mode Anonymity**: Do not reveal which mode is "baseline" or "guided" to participants
2. **Condition Switching**: Use the "Back to Mode Selection" button to switch conditions between participants
3. **Recording**: Use browser dev tools to capture console logs for behavioral data
4. **Room Reset**: Use the "Reset Room" button in the sidebar to restore initial furniture layout
5. **POV Walkthrough**: 4-second animation shows first-person perspective along revealed paths in Mode B

## Future Enhancements

- Video recording integration for eye-tracking or screen capture
- Database backend for storing experiment data
- Custom path algorithms (A*, Dijkstra) for more sophisticated routing
- Physics-based collision detection
- Multi-participant collaborative planning
- Quantitative path length/efficiency metrics

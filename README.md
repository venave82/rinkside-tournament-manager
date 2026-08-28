# Rinkside Tournament Manager

## Overview

Rinkside Tournament Manager is a comprehensive web-based management system for lawn bowls tournaments. It handles all aspects of tournament administration from team registration through to finals results and player statistics tracking.

## Features

### Core Tournament Management
- **Multi-day tournaments** with flexible date selection
- **Tournament types**: National and Sanctioned events
- **Event disciplines**: Singles, Pairs, Triples, Fours
- **Play formats**: Select, Standard Play, Pennants, Set Play
- **Set Play combinations**: Support for mixed disciplines (e.g., Singles/Fours, Pairs/Triples)
- **Sections**: Automatic division into 1-8 sections
- **Greens**: Support for 1-4 greens configuration

### Draw Generation & Management
- **Automatic team division** into balanced sections
- **Round-robin draw generation** with bye round handling for odd team numbers
- **Single/Double elimination brackets** for finals
- **Draw validation** for conflicts and consistency
- **Fixture scheduling** across multiple greens and dates

### Scoring & Points System
- **Pennants format**: Win (2 pts) / Draw (1 pt each) / Loss (0 pts)
- **Set Play bonus**: Clean sweep (4 pts) or standard win scoring
- **Shared bonus points** for tied matches
- **National event tracking**: Separate points for sectional vs finals rounds
- **Player statistics**: Match history, finals appearances, career records

### Team & Player Management
- **Flexible team entries** with player positions:
  - Lead, Second, Third, Skip (for Pairs/Triples/Fours)
  - Single position (for Singles)
- **Player database** with club affiliations
- **Selection eligibility** tracking for National events
- **Handicap management** and performance history
- **Career statistics** and tournament participation

### Fixtures & Results
- **Fixture scheduling** with green allocation
- **Result recording** with comprehensive match details
- **Bye round automation** for odd team counts
- **Fixture conflict detection**
- **Status tracking** (Scheduled, In Progress, Completed, Cancelled)

### Ladders & Rankings
- **Sectional ladders** with live points updates
- **Finals ladders** (if applicable)
- **Overall tournament standings**
- **Multiple sorting options**: Points, win percentage, point differential
- **Qualification tracking** for finals progression

### Reporting & Exports
- **Draw reports** (PDF, Excel, JSON)
- **Ladder reports** with full standings
- **Fixture/Results reports**
- **Player statistics reports**
- **Tournament summary reports**
- **Finals bracket visualization**
- **Print-friendly formats**

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data persistence
- **Mongoose** for ODM
- **PDFKit** for PDF generation
- **ExcelJS** for Excel exports
- **JWT** for authentication (extensible)

### Frontend (Ready for Implementation)
- React.js recommended
- Material-UI or Tailwind CSS for styling
- Redux for state management
- Chart libraries for visualizations

## Project Structure

```
rinkside-tournament-manager/
├── server/
│   ├── models/
│   │   ├── Tournament.js
│   │   ├── Team.js
│   │   ├── Player.js
│   │   ├── Fixture.js
│   │   ├── Ladder.js
│   │   ├── Draw.js
│   │   └── Report.js
│   ├── services/
│   │   ├── DrawGeneratorService.js
│   │   ├── ScoringService.js
│   │   ├── ExportService.js
│   │   └── TournamentService.js
│   ├── routes/
│   │   ├── tournaments.js
│   │   ├── teams.js
│   │   ├── players.js
│   │   └── reports.js
│   └── index.js
├── scripts/
│   └── seed.js
├── package.json
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/venave82/rinkside-tournament-manager.git
cd rinkside-tournament-manager
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update `.env` with your configuration
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rinkside-tournament
NODE_ENV=development
JWT_SECRET=your_secret_key
UPLOAD_PATH=./uploads
```

5. Seed sample data (optional)
```bash
npm run seed
```

6. Start the server
```bash
npm run dev
```

Server will run on http://localhost:5000

## API Endpoints

### Tournaments
- `POST /api/tournaments` - Create tournament
- `GET /api/tournaments` - List all tournaments
- `GET /api/tournaments/:id` - Get tournament details
- `PUT /api/tournaments/:id` - Update tournament
- `POST /api/tournaments/:id/initialize-draws` - Auto-generate draws
- `GET /api/tournaments/:id/fixtures` - Get fixtures
- `POST /api/tournaments/:id/fixtures/:fixtureId/result` - Record result
- `GET /api/tournaments/:id/ladder/:section` - Get section ladder

### Teams
- `POST /api/teams` - Register team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `GET /api/teams/tournament/:tournamentId` - List tournament teams
- `DELETE /api/teams/:id` - Remove team

### Players
- `POST /api/players` - Create player
- `GET /api/players/:id` - Get player details
- `GET /api/players/email/:email` - Find by email
- `PUT /api/players/:id` - Update player
- `GET /api/players/:id/stats` - Get player stats
- `GET /api/players/club/:club` - List by club
- `GET /api/players/eligible/national` - Get national eligible players

### Reports
- `POST /api/reports/draw/:tournamentId` - Generate draw report
- `POST /api/reports/ladder/:tournamentId/:section` - Generate ladder report
- `GET /api/reports/summary/:tournamentId` - Tournament summary
- `GET /api/reports/player-stats/:playerId/:tournamentId` - Player stats report
- `GET /api/reports/tournament/:tournamentId` - List tournament reports
- `DELETE /api/reports/:reportId` - Delete report

## Key Services

### DrawGeneratorService
- `divideSections()` - Distribute teams across sections
- `generateRoundRobinDraw()` - Create round-robin fixtures
- `generateFinalsBracket()` - Create finals brackets
- `validateDraw()` - Check draw consistency

### ScoringService
- `calculatePennants()` - Score pennants format
- `calculateSetPlay()` - Score set play with clean sweep bonus
- `calculateStandardPlay()` - Standard scoring
- `updateLadder()` - Update standings after match
- `calculatePlayerStats()` - Aggregate player performance

### ExportService
- `exportDrawToPDF()` - Generate PDF draw
- `exportLadderToExcel()` - Generate Excel ladder
- `exportToJSON()` - Export as JSON
- `exportPlayerStatsToPDF()` - Player stats PDF
- `generatePrintHTML()` - Print-friendly HTML

### TournamentService
- `initializeDraws()` - Set up tournament draws
- `generateFinalsBracket()` - Create finals structure
- `recordResult()` - Log match results
- `getQualifiedTeams()` - Get finalists
- `findFixtureConflicts()` - Validate scheduling
- `generateTournamentSummary()` - Overall report

## Data Models

### Tournament
- Core tournament information (name, location, dates)
- Format settings (discipline, play type, sections, greens)
- Scoring configuration
- Status and metadata

### Team
- Team name and club
- Flexible player roster (position-based)
- Section assignment
- Registration status
- Contact information

### Player
- Personal information (name, email, phone)
- Club affiliation and handicap
- Preferred positions
- National event eligibility
- Career and national event statistics
- Selection history

### Fixture
- Round and section
- Team assignments
- Date, time, green allocation
- Match result and scoring
- Status tracking

### Ladder
- Section or overall standings
- Team entries with statistics
- Games played, won, lost, drawn
- Points for/against and bonus points
- Win percentage

### Draw
- Draw structure and configuration
- Team positioning/seeding
- Bracket type (round-robin, elimination, etc.)
- Generation method and status

### Report
- Report type and scope
- Generated content
- Export formats and file paths
- Metadata (creator, date, section/round)

## Future Enhancements

- [ ] Frontend React application
- [ ] Real-time notifications for match updates
- [ ] Mobile-responsive design
- [ ] User authentication and roles (Admin, Tournament Manager, Player)
- [ ] Photo upload for player profiles
- [ ] Email notifications for fixtures and results
- [ ] Historical tournament archive
- [ ] Advanced analytics and trends
- [ ] Integration with official lawn bowls associations
- [ ] Multi-language support
- [ ] Venue/green management dashboard
- [ ] Umpire assignment and management
- [ ] Live scoring during matches
- [ ] Player availability/injury tracking
- [ ] Rule customization per tournament

## Contributing

Contributions are welcome! Please create a branch and submit a pull request.

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please open a GitHub issue.

# Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js v14+ 
- MongoDB v4.0+
- npm or yarn

### Step 1: Clone & Install
```bash
git clone https://github.com/venave82/rinkside-tournament-manager.git
cd rinkside-tournament-manager
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rinkside-tournament
NODE_ENV=development
JWT_SECRET=your_secret_key_here
UPLOAD_PATH=./uploads
```

### Step 3: Start MongoDB
```bash
# If MongoDB is installed locally
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 4: Seed Sample Data (Optional)
```bash
npm run seed
```

### Step 5: Start Server
```bash
# Development with hot reload
npm run dev

# Or production mode
node server/index.js
```

Server runs on `http://localhost:5000`

---

## API Usage Examples

### Create a Tournament
```bash
curl -X POST http://localhost:5000/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{
    "tournamentName": "Summer Fours",
    "location": {
      "club": "Riverside Bowling Club",
      "address": "123 Bowling Lane",
      "city": "Sydney",
      "state": "NSW",
      "postcode": "2000"
    },
    "eventType": "National",
    "discipline": "Fours",
    "playType": "Pennants",
    "numberOfSections": 2,
    "numberOfGreens": 4
  }'
```

### Register a Team
```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "tournament": "<tournament_id>",
    "teamName": "Riverside Rink A",
    "club": "Riverside Bowling Club",
    "players": [
      {"name": "John Smith", "position": "Skip"},
      {"name": "Sarah Johnson", "position": "Third"},
      {"name": "Mike Williams", "position": "Second"},
      {"name": "Emma Davis", "position": "Lead"}
    ]
  }'
```

### Initialize Draws
```bash
curl -X POST http://localhost:5000/api/tournaments/<tournament_id>/initialize-draws
```

### Get Fixtures
```bash
curl http://localhost:5000/api/tournaments/<tournament_id>/fixtures
```

### Record Match Result
```bash
curl -X POST http://localhost:5000/api/tournaments/<tournament_id>/fixtures/<fixture_id>/result \
  -H "Content-Type: application/json" \
  -d '{
    "team1Score": 18,
    "team2Score": 15
  }'
```

### Get Ladder
```bash
curl http://localhost:5000/api/tournaments/<tournament_id>/ladder/1
```

### Generate PDF Report
```bash
curl -X POST http://localhost:5000/api/reports/draw/<tournament_id> \
  -H "Content-Type: application/json" \
  -d '{"section": 1, "format": "pdf"}'
```

---

## Common Tasks

### Create a New Tournament
1. POST to `/api/tournaments` with tournament details
2. Copy the returned tournament ID
3. Register teams with POST to `/api/teams`
4. Call POST `/api/tournaments/:id/initialize-draws`
5. Start entering results with POST `/api/tournaments/:id/fixtures/:fixtureId/result`

### View Standings
- GET `/api/tournaments/:id/ladder/:section` - View section standings
- GET `/api/reports/summary/:id` - View tournament summary

### Export Results
- POST `/api/reports/draw/:id` - Export draw (PDF/Excel/JSON)
- POST `/api/reports/ladder/:id/:section` - Export ladder standings
- GET `/api/reports/player-stats/:playerId/:tournamentId` - Player statistics

### Manage Players
- POST `/api/players` - Add new player
- GET `/api/players/:id` - View player details
- GET `/api/players/:id/stats` - View player statistics
- PUT `/api/players/:id` - Update player info

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running:
```bash
mongod  # Local installation
# or
docker start mongodb  # Docker container
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in .env or kill process on port 5000:
```bash
lsof -i :5000
kill -9 <PID>
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies:
```bash
npm install
```

### Seed Script Fails
```
Error: Tournament not found
```
**Solution**: Ensure MongoDB is running and database is empty:
```bash
npm run seed
```

---

## Project Structure

```
rinkside-tournament-manager/
├── server/
│   ├── models/              # Database schemas
│   ├── services/            # Business logic
│   ├── routes/              # API endpoints
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration
│   └── index.js             # Entry point
├── scripts/
│   └── seed.js              # Database seeding
├── package.json             # Dependencies
├── .env.example             # Environment template
├── README.md                # Main documentation
├── API.md                   # API reference
├── ROADMAP.md               # Development roadmap
└── CONTRIBUTING.md          # Contribution guidelines
```

---

## Next Steps

1. **Explore the API** - Use the curl examples above or Postman
2. **Review Models** - Check `server/models/` for database structure
3. **Understand Services** - Study `server/services/` for business logic
4. **Build Frontend** - Create React app in `client/` directory
5. **Run Tests** - `npm test` (when tests are added)
6. **Deploy** - See deployment section in README.md

---

## Support

- 📖 [Full Documentation](README.md)
- 🔌 [API Reference](API.md)
- 🗺️ [Development Roadmap](ROADMAP.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)
- 📝 [Issues](https://github.com/venave82/rinkside-tournament-manager/issues)

---

## License

MIT License - Free to use and modify

/**
 * API Documentation
 * Complete reference for Rinkside Tournament Manager endpoints
 */

## Authentication
Currently uses no authentication. Future versions will implement JWT.

---

## Tournaments

### Create Tournament
**POST** `/api/tournaments`

**Request Body:**
```json
{
  "tournamentName": "State Fours Championship",
  "location": {
    "club": "Riverside Bowling Club",
    "address": "123 Bowling Lane",
    "city": "Sydney",
    "state": "NSW",
    "postcode": "2000"
  },
  "eventType": "National",
  "dates": [
    { "date": "2024-09-15T00:00:00Z", "greens": [1, 2, 3, 4] },
    { "date": "2024-09-16T00:00:00Z", "greens": [1, 2, 3, 4] }
  ],
  "discipline": "Fours",
  "playType": "Pennants",
  "numberOfSections": 2,
  "numberOfGreens": 4,
  "scoringRules": {
    "standardWin": 2,
    "sharedBonus": 1,
    "cleanSweepBonus": 4,
    "applyToNationalOnly": true
  }
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "tournamentName": "State Fours Championship",
  "status": "Planning",
  "createdAt": "2024-08-28T10:00:00Z"
}
```

### List Tournaments
**GET** `/api/tournaments`

**Response:** `200 OK`
```json
[
  { tournament details },
  { tournament details }
]
```

### Get Tournament
**GET** `/api/tournaments/:id`

**Response:** `200 OK`
```json
{ tournament details }
```

### Update Tournament
**PUT** `/api/tournaments/:id`

**Request Body:** Any tournament fields to update

**Response:** `200 OK` with updated tournament

### Initialize Draws
**POST** `/api/tournaments/:id/initialize-draws`

**Description:** Auto-divides teams into sections and generates round-robin draws

**Response:** `200 OK`
```json
{
  "message": "Draws initialized",
  "fixturesCreated": 24
}
```

### Get Fixtures
**GET** `/api/tournaments/:id/fixtures?round=Sectional&section=1&status=Scheduled`

**Query Parameters:**
- `round` (optional): Sectional, Quarter Final, Semi Final, Final
- `section` (optional): 1-8
- `status` (optional): Scheduled, In Progress, Completed, Cancelled

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "tournament": "507f1f77bcf86cd799439012",
    "round": "Sectional",
    "team1": { team details },
    "team2": { team details },
    "section": 1,
    "green": 1,
    "date": "2024-09-15T10:00:00Z",
    "status": "Scheduled"
  }
]
```

### Record Match Result
**POST** `/api/tournaments/:tournamentId/fixtures/:fixtureId/result`

**Request Body:**
```json
{
  "team1Score": 18,
  "team2Score": 15
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "Completed",
  "result": {
    "team1Score": 18,
    "team2Score": 15,
    "winner": "507f1f77bcf86cd799439020",
    "isDraw": false
  }
}
```

### Get Ladder
**GET** `/api/tournaments/:id/ladder/:section`

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "tournament": "507f1f77bcf86cd799439012",
  "section": 1,
  "type": "Sectional",
  "entries": [
    {
      "position": 1,
      "team": { team details },
      "gamesPlayed": 4,
      "gamesWon": 3,
      "gamesLost": 1,
      "gamesDrawn": 0,
      "pointsFor": 68,
      "pointsAgainst": 52,
      "bonusPoints": 0,
      "totalPoints": 6,
      "percentage": "75.00"
    }
  ]
}
```

---

## Teams

### Register Team
**POST** `/api/teams`

**Request Body:**
```json
{
  "tournament": "507f1f77bcf86cd799439011",
  "teamName": "Riverside Rink A",
  "club": "Riverside Bowling Club",
  "players": [
    { "name": "John Smith", "position": "Skip" },
    { "name": "Sarah Johnson", "position": "Third" },
    { "name": "Mike Williams", "position": "Second" },
    { "name": "Emma Davis", "position": "Lead" }
  ],
  "contact": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "0412345678"
  }
}
```

**Response:** `201 Created`

### Get Team
**GET** `/api/teams/:id`

### Update Team
**PUT** `/api/teams/:id`

### List Tournament Teams
**GET** `/api/teams/tournament/:tournamentId`

**Response:** `200 OK`
```json
[
  { team details },
  { team details }
]
```

### Delete Team
**DELETE** `/api/teams/:id`

---

## Players

### Create Player
**POST** `/api/players`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "0412345678",
  "club": "Riverside Bowling Club",
  "handicap": 2,
  "preferredPositions": ["Skip"],
  "status": "Active"
}
```

**Response:** `201 Created`

### Get Player
**GET** `/api/players/:id`

### Find by Email
**GET** `/api/players/email/:email`

### Update Player
**PUT** `/api/players/:id`

### Get Player Stats
**GET** `/api/players/:id/stats`

**Response:** `200 OK`
```json
{
  "player": "John Smith",
  "careerStats": {
    "totalTournaments": 5,
    "totalGames": 20,
    "totalWins": 15,
    "totalLosses": 5,
    "winPercentage": "75.00",
    "finalsAppearances": 2,
    "finalsWins": 1
  },
  "nationalEventStats": [
    {
      "tournament": "tournament_id",
      "gamesPlayed": 4,
      "gamesWon": 3,
      "roundPoints": 6,
      "finalsPoints": 4,
      "finalsAppearance": true,
      "finalsRound": "Semi Final"
    }
  ]
}
```

### List by Club
**GET** `/api/players/club/:club`

### Get National Eligible Players
**GET** `/api/players/eligible/national`

**Response:** `200 OK` - Players sorted by win percentage

---

## Reports

### Generate Draw Report
**POST** `/api/reports/draw/:tournamentId`

**Request Body:**
```json
{
  "section": 1,
  "format": "pdf"
}
```

**Query Parameters:**
- `format`: pdf, excel, json (default: json)

**Response:** `200 OK`
```json
{
  "message": "Report generated",
  "filepath": "/uploads/draw_607f1f77bcf86cd799439011_1_1234567890.pdf",
  "reportId": "507f1f77bcf86cd799439050"
}
```

### Generate Ladder Report
**POST** `/api/reports/ladder/:tournamentId/:section`

**Request Body:**
```json
{
  "format": "excel"
}
```

**Response:** `200 OK`

### Tournament Summary
**GET** `/api/reports/summary/:tournamentId`

**Response:** `200 OK`
```json
{
  "summary": {
    "tournament": {
      "name": "State Fours Championship",
      "status": "In Progress"
    },
    "progress": {
      "fixturesTotalCount": 24,
      "fixturesCompleted": 12,
      "fixtureProgressPercentage": "50.00"
    }
  },
  "reportId": "507f1f77bcf86cd799439051"
}
```

### Player Stats Report
**GET** `/api/reports/player-stats/:playerId/:tournamentId`

**Response:** `200 OK`

### List Tournament Reports
**GET** `/api/reports/tournament/:tournamentId`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439050",
    "reportName": "Draw - Section 1",
    "reportType": "Draw",
    "generatedAt": "2024-08-28T10:00:00Z"
  }
]
```

### Delete Report
**DELETE** `/api/reports/:reportId`

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    { "field": "email", "message": "Valid email required" }
  ]
}
```

### 404 Not Found
```json
{
  "error": "Tournament not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error details here"
}
```

---

## Status Codes
- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST creating resource
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

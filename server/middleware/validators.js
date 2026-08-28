/**
 * Validation Middleware
 * Input validation for API requests
 */

const validateTournament = (req, res, next) => {
  const { tournamentName, eventType, discipline, playType, numberOfSections, numberOfGreens } = req.body;
  const errors = [];

  if (!tournamentName || typeof tournamentName !== 'string') {
    errors.push('Tournament name is required and must be a string');
  }

  if (!['National', 'Sanctioned'].includes(eventType)) {
    errors.push('Event type must be National or Sanctioned');
  }

  if (!['Singles', 'Pairs', 'Triples', 'Fours'].includes(discipline)) {
    errors.push('Discipline must be Singles, Pairs, Triples, or Fours');
  }

  if (!['Select', 'Standard Play', 'Pennants', 'Set Play'].includes(playType)) {
    errors.push('Play type must be Select, Standard Play, Pennants, or Set Play');
  }

  if (!Number.isInteger(numberOfSections) || numberOfSections < 1 || numberOfSections > 8) {
    errors.push('Number of sections must be between 1 and 8');
  }

  if (!Number.isInteger(numberOfGreens) || numberOfGreens < 1 || numberOfGreens > 4) {
    errors.push('Number of greens must be between 1 and 4');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateTeam = (req, res, next) => {
  const { tournament, teamName, players } = req.body;
  const errors = [];

  if (!tournament) {
    errors.push('Tournament ID is required');
  }

  if (!teamName || typeof teamName !== 'string') {
    errors.push('Team name is required and must be a string');
  }

  if (!Array.isArray(players) || players.length === 0) {
    errors.push('At least one player is required');
  } else {
    players.forEach((player, idx) => {
      if (!player.name || !player.position) {
        errors.push(`Player ${idx + 1}: name and position are required`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validatePlayer = (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const errors = [];

  if (!firstName || typeof firstName !== 'string') {
    errors.push('First name is required and must be a string');
  }

  if (!lastName || typeof lastName !== 'string') {
    errors.push('Last name is required and must be a string');
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }

  if (req.body.handicap && (req.body.handicap < -4 || req.body.handicap > 10)) {
    errors.push('Handicap must be between -4 and 10');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateFixtureResult = (req, res, next) => {
  const { team1Score, team2Score } = req.body;
  const errors = [];

  if (team1Score === undefined || team1Score === null || !Number.isInteger(team1Score)) {
    errors.push('Team 1 score is required and must be an integer');
  }

  if (team2Score === undefined || team2Score === null || !Number.isInteger(team2Score)) {
    errors.push('Team 2 score is required and must be an integer');
  }

  if (team1Score < 0 || team2Score < 0) {
    errors.push('Scores cannot be negative');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateTournament,
  validateTeam,
  validatePlayer,
  validateFixtureResult
};

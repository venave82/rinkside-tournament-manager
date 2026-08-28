/**
 * Database Seed Script
 * Initializes database with sample tournaments, teams, and players
 */

const mongoose = require('mongoose');
const Tournament = require('../server/models/Tournament');
const Team = require('../server/models/Team');
const Player = require('../server/models/Player');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rinkside-tournament');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Tournament.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    console.log('Cleared existing data');

    // Create Sample Players
    const players = await Player.insertMany([
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '0412345678',
        club: 'Riverside Bowling Club',
        handicap: 2,
        preferredPositions: ['Skip'],
        status: 'Active'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '0412345679',
        club: 'Riverside Bowling Club',
        handicap: 3,
        preferredPositions: ['Third'],
        status: 'Active'
      },
      {
        firstName: 'Michael',
        lastName: 'Williams',
        email: 'michael.williams@example.com',
        phone: '0412345680',
        club: 'Riverside Bowling Club',
        handicap: 1,
        preferredPositions: ['Lead', 'Second'],
        status: 'Active'
      },
      {
        firstName: 'Emma',
        lastName: 'Davis',
        email: 'emma.davis@example.com',
        phone: '0412345681',
        club: 'Riverside Bowling Club',
        handicap: 2,
        preferredPositions: ['Second'],
        status: 'Active'
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@example.com',
        phone: '0412345682',
        club: 'Valley Lawn Bowls',
        handicap: 3,
        preferredPositions: ['Skip'],
        status: 'Active'
      },
      {
        firstName: 'Lisa',
        lastName: 'Taylor',
        email: 'lisa.taylor@example.com',
        phone: '0412345683',
        club: 'Valley Lawn Bowls',
        handicap: 2,
        preferredPositions: ['Third'],
        status: 'Active'
      },
      {
        firstName: 'James',
        lastName: 'Anderson',
        email: 'james.anderson@example.com',
        phone: '0412345684',
        club: 'Valley Lawn Bowls',
        handicap: 1,
        preferredPositions: ['Lead'],
        status: 'Active'
      },
      {
        firstName: 'Rachel',
        lastName: 'White',
        email: 'rachel.white@example.com',
        phone: '0412345685',
        club: 'Valley Lawn Bowls',
        handicap: 2,
        preferredPositions: ['Second'],
        status: 'Active'
      }
    ]);

    console.log(`Created ${players.length} sample players`);

    // Create Sample Tournament
    const tournament = await Tournament.create({
      tournamentName: 'State Fours Championship 2024',
      location: {
        club: 'Riverside Bowling Club',
        address: '123 Bowling Lane',
        city: 'Sydney',
        state: 'NSW',
        postcode: '2000'
      },
      eventType: 'National',
      dates: [
        { date: new Date('2024-09-15'), greens: [1, 2, 3, 4] },
        { date: new Date('2024-09-16'), greens: [1, 2, 3, 4] },
        { date: new Date('2024-09-17'), greens: [1, 2, 3, 4] }
      ],
      discipline: 'Fours',
      playType: 'Pennants',
      numberOfSections: 2,
      numberOfGreens: 4,
      scoringRules: {
        standardWin: 2,
        sharedBonus: 1,
        cleanSweepBonus: 4,
        applyToNationalOnly: true
      },
      status: 'Planning'
    });

    console.log(`Created tournament: ${tournament.tournamentName}`);

    // Create Sample Teams
    const team1 = await Team.create({
      tournament: tournament._id,
      teamName: 'Riverside Rink A',
      club: 'Riverside Bowling Club',
      players: [
        { name: players[0].firstName + ' ' + players[0].lastName, position: 'Skip', playerRef: players[0]._id },
        { name: players[1].firstName + ' ' + players[1].lastName, position: 'Third', playerRef: players[1]._id },
        { name: players[2].firstName + ' ' + players[2].lastName, position: 'Second', playerRef: players[2]._id },
        { name: players[3].firstName + ' ' + players[3].lastName, position: 'Lead', playerRef: players[3]._id }
      ],
      contact: { name: 'John Smith', email: 'john.smith@example.com', phone: '0412345678' },
      status: 'Confirmed'
    });

    const team2 = await Team.create({
      tournament: tournament._id,
      teamName: 'Valley Legends',
      club: 'Valley Lawn Bowls',
      players: [
        { name: players[4].firstName + ' ' + players[4].lastName, position: 'Skip', playerRef: players[4]._id },
        { name: players[5].firstName + ' ' + players[5].lastName, position: 'Third', playerRef: players[5]._id },
        { name: players[6].firstName + ' ' + players[6].lastName, position: 'Second', playerRef: players[6]._id },
        { name: players[7].firstName + ' ' + players[7].lastName, position: 'Lead', playerRef: players[7]._id }
      ],
      contact: { name: 'David Brown', email: 'david.brown@example.com', phone: '0412345682' },
      status: 'Confirmed'
    });

    console.log('Created sample teams');
    console.log('\nDatabase seeding completed successfully!');
    console.log(`Tournament ID: ${tournament._id}`);
    console.log(`Team 1 ID: ${team1._id}`);
    console.log(`Team 2 ID: ${team2._id}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();

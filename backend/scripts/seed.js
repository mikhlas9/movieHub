// scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Movie = require('../models/Movie');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

const seedData = async () => {
  try {
    // Build MongoDB URI with specific database name
    let mongoURI = process.env.MONGODB_URI;
    
    // If MONGODB_URI doesn't include database name, append it
    if (!mongoURI.includes('/moviehub')) {
      // Remove any existing database name and add moviehub
      const baseURI = mongoURI.split('?')[0]; // Remove query params
      const queryParams = mongoURI.includes('?') ? '?' + mongoURI.split('?')[1] : '';
      
      // Remove existing database name if present
      if (baseURI.includes('/', baseURI.indexOf('://') + 3)) {
        const parts = baseURI.split('/');
        parts[parts.length - 1] = 'moviehub'; // Replace database name
        mongoURI = parts.join('/') + queryParams;
      } else {
        // Add database name
        mongoURI = baseURI + '/moviehub' + queryParams;
      }
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB - MovieHub database');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Vote.deleteMany({}),
      Comment.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@moviehub.com',
        password_hash: adminPassword,
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'user@moviehub.com',
        password_hash: userPassword,
        role: 'user'
      },
      {
        name: 'Alice Smith',
        email: 'alice@example.com',
        password_hash: hashedPassword,
        role: 'user'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password_hash: hashedPassword,
        role: 'user'
      },
      {
        name: 'Carol Williams',
        email: 'carol@example.com',
        password_hash: hashedPassword,
        role: 'user'
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        password_hash: hashedPassword,
        role: 'user'
      },
      {
        name: 'Emma Davis',
        email: 'emma@example.com',
        password_hash: hashedPassword,
        role: 'user'
      }
    ]);

    console.log('👥 Created users');

    // Create movies with initial counts set to 0
    const moviesData = [
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. A masterpiece of storytelling that explores themes of hope, friendship, and the human spirit.',
        added_by: users[1]._id,
        created_at: new Date('2024-01-15')
      },
      {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption. Tarantino\'s non-linear narrative and iconic dialogue make this a cinematic classic.',
        added_by: users[2]._id,
        created_at: new Date('2024-01-16')
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as The Joker wreaks havoc on Gotham, Batman must face one of the greatest psychological tests of his ability to fight injustice. Heath Ledger\'s performance is unforgettable.',
        added_by: users[3]._id,
        created_at: new Date('2024-01-17')
      },
      {
        title: 'Forrest Gump',
        description: 'The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75. A heartwarming journey through American history.',
        added_by: users[4]._id,
        created_at: new Date('2024-01-18')
      },
      {
        title: 'Inception',
        description: 'A thief who enters the dreams of others to steal secrets from their subconscious gets the inverse task of planting an idea into the mind of a C.E.O. Mind-bending sci-fi at its finest.',
        added_by: users[1]._id,
        created_at: new Date('2024-01-19')
      },
      {
        title: 'The Godfather',
        description: 'An aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. A saga of family, power, and tradition that defined the crime genre.',
        added_by: users[2]._id,
        created_at: new Date('2024-01-20')
      },
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. Nolan combines hard science with emotional storytelling in this space epic.',
        added_by: users[3]._id,
        created_at: new Date('2024-01-21')
      },
      {
        title: 'Parasite',
        description: 'A poor family schemes to become employed by a wealthy family by infiltrating their household. A brilliant social thriller that won the Academy Award for Best Picture.',
        added_by: users[4]._id,
        created_at: new Date('2024-01-22')
      },
      {
        title: 'Avatar',
        description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
        added_by: users[5]._id,
        created_at: new Date('2024-01-23')
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
        added_by: users[6]._id,
        created_at: new Date('2024-01-24')
      }
    ];

    const movies = await Movie.create(moviesData);
    console.log('🎬 Created movies');

    // Create votes with the new system (1 for upvote, -1 for downvote)
    const votes = [];
    const userMovieVotes = new Set(); // To ensure one vote per user per movie

    for (const movie of movies) {
      // Generate random number of voters for this movie (between 3-6 users)
      const numVoters = Math.floor(Math.random() * 4) + 3;
      const availableUsers = [...users];
      
      // Shuffle users array
      for (let i = availableUsers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableUsers[i], availableUsers[j]] = [availableUsers[j], availableUsers[i]];
      }

      // Select random users to vote on this movie
      const votersForThisMovie = availableUsers.slice(0, numVoters);

      for (const user of votersForThisMovie) {
        const voteKey = `${user._id}_${movie._id}`;
        
        if (!userMovieVotes.has(voteKey)) {
          // 70% chance of upvote, 30% chance of downvote (to make movies generally positive)
          const voteType = Math.random() < 0.7 ? 1 : -1;
          
          votes.push({
            user_id: user._id,
            movie_id: movie._id,
            vote_type: voteType,
            created_at: new Date(movie.created_at.getTime() + Math.random() * 24 * 60 * 60 * 1000)
          });
          
          userMovieVotes.add(voteKey);
        }
      }
    }

    await Vote.insertMany(votes);
    console.log(`🗳️  Created ${votes.length} votes`);

    // Update movie counts based on votes
    for (const movie of movies) {
      const upvotes = await Vote.countDocuments({ movie_id: movie._id, vote_type: 1 });
      const downvotes = await Vote.countDocuments({ movie_id: movie._id, vote_type: -1 });
      const vote_score = upvotes - downvotes;

      await Movie.findByIdAndUpdate(movie._id, {
        upvotes,
        downvotes,
        vote_score
      });

      console.log(`📊 ${movie.title}: ${upvotes} upvotes, ${downvotes} downvotes, score: ${vote_score}`);
    }

    // Create comments
    const comments = [
      {
        user_id: users[1]._id,
        movie_id: movies[0]._id,
        body: 'This movie changed my perspective on life. The performances by Tim Robbins and Morgan Freeman are absolutely stellar.',
        created_at: new Date('2024-01-16T10:30:00')
      },
      {
        user_id: users[2]._id,
        movie_id: movies[0]._id,
        body: 'A timeless classic that gets better with each viewing. The cinematography and score are perfect.',
        created_at: new Date('2024-01-16T14:20:00')
      },
      {
        user_id: users[3]._id,
        movie_id: movies[1]._id,
        body: 'Tarantino at his best! The dialogue is incredibly sharp and the non-linear storytelling is brilliant.',
        created_at: new Date('2024-01-17T09:15:00')
      },
      {
        user_id: users[4]._id,
        movie_id: movies[1]._id,
        body: 'John Travolta and Samuel L. Jackson have amazing chemistry. This movie revitalized both their careers.',
        created_at: new Date('2024-01-17T16:45:00')
      },
      {
        user_id: users[1]._id,
        movie_id: movies[2]._id,
        body: 'Heath Ledger\'s Joker is one of the greatest villains in cinema history. RIP to a legendary actor.',
        created_at: new Date('2024-01-18T11:00:00')
      },
      {
        user_id: users[2]._id,
        movie_id: movies[2]._id,
        body: 'The Dark Knight trilogy redefined superhero movies. Christopher Nolan is a master filmmaker.',
        created_at: new Date('2024-01-18T13:30:00')
      },
      {
        user_id: users[3]._id,
        movie_id: movies[3]._id,
        body: 'Tom Hanks delivers an incredible performance. This movie makes you laugh and cry in equal measure.',
        created_at: new Date('2024-01-19T08:20:00')
      },
      {
        user_id: users[4]._id,
        movie_id: movies[4]._id,
        body: 'Mind = blown! The concept of dreams within dreams is executed perfectly. Hans Zimmer\'s score is epic.',
        created_at: new Date('2024-01-20T15:10:00')
      },
      {
        user_id: users[1]._id,
        movie_id: movies[5]._id,
        body: 'Marlon Brando\'s performance is legendary. This movie set the standard for all crime dramas that followed.',
        created_at: new Date('2024-01-21T12:40:00')
      },
      {
        user_id: users[2]._id,
        movie_id: movies[6]._id,
        body: 'Nolan combines hard science with emotional storytelling. The visuals are absolutely breathtaking.',
        created_at: new Date('2024-01-22T10:55:00')
      },
      {
        user_id: users[3]._id,
        movie_id: movies[7]._id,
        body: 'This movie brilliantly exposes social inequality. Deserved every award it won!',
        created_at: new Date('2024-01-23T14:15:00')
      },
      {
        user_id: users[5]._id,
        movie_id: movies[8]._id,
        body: 'James Cameron\'s world-building is incredible. The visual effects were revolutionary for their time.',
        created_at: new Date('2024-01-24T09:30:00')
      },
      {
        user_id: users[6]._id,
        movie_id: movies[9]._id,
        body: 'The perfect conclusion to the MCU\'s Infinity Saga. The emotional payoff was worth the 11-year journey.',
        created_at: new Date('2024-01-25T16:20:00')
      },
      {
        user_id: users[4]._id,
        movie_id: movies[8]._id,
        body: 'Avatar changed the game for 3D movies. The world of Pandora is breathtakingly beautiful.',
        created_at: new Date('2024-01-24T13:45:00')
      },
      {
        user_id: users[5]._id,
        movie_id: movies[9]._id,
        body: 'Endgame delivered on every level. The final battle sequence is pure cinema magic!',
        created_at: new Date('2024-01-25T18:10:00')
      }
    ];

    await Comment.create(comments);
    console.log('💬 Created comments');

    // Get final statistics
    const finalMovies = await Movie.find().sort({ vote_score: -1 });
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Seed Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🎬 Movies: ${movies.length}`);
    console.log(`🗳️  Votes: ${votes.length}`);
    console.log(`💬 Comments: ${comments.length}`);
    
    console.log('\n🏆 Top Movies by Score:');
    finalMovies.slice(0, 5).forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (Score: ${movie.vote_score}, ↑${movie.upvotes}, ↓${movie.downvotes})`);
    });
    
    console.log('\n🔐 Demo Accounts:');
    console.log('Admin: admin@moviehub.com / admin123');
    console.log('User: user@moviehub.com / user123');
    console.log('\nOther test accounts:');
    console.log('alice@example.com / password123');
    console.log('bob@example.com / password123');
    console.log('carol@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedData();

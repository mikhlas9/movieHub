const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all movies (sorted by vote score) with optional search
router.get('/', async (req, res) => {
  try {
    console.log('📽️ Fetching all movies...');
    
    const { search, sort = 'score', limit = 100 } = req.query;
    
    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { created_at: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      case 'score':
      default:
        sortOption = { vote_score: -1 };
        break;
    }
    
    const movies = await Movie.find(query)
      .populate('added_by', 'name')
      .sort(sortOption)
      .limit(parseInt(limit));
    
    console.log(`✅ Found ${movies.length} movies`);
    res.json(movies);
  } catch (error) {
    console.error('❌ Error fetching movies:', error);
    res.status(500).json({ 
      message: 'Error fetching movies', 
      error: error.message 
    });
  }
});

// Get single movie with comments
router.get('/:id', async (req, res) => {
  try {
    console.log(`📽️ Fetching movie with ID: ${req.params.id}`);
    
    const movie = await Movie.findById(req.params.id)
      .populate('added_by', 'name');
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const comments = await Comment.find({ movie_id: req.params.id })
      .populate('user_id', 'name')
      .sort({ created_at: -1 });

    console.log(`✅ Found movie: ${movie.title} with ${comments.length} comments`);
    res.json({ movie, comments });
  } catch (error) {
    console.error('❌ Error fetching movie details:', error);
    res.status(500).json({ 
      message: 'Error fetching movie details', 
      error: error.message 
    });
  }
});

// Add new movie
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    console.log('➕ Adding new movie...');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const movie = new Movie({
      title,
      description,
      added_by: req.user._id
    });

    await movie.save();
    await movie.populate('added_by', 'name');

    console.log(`✅ Movie created: ${movie.title}`);
    res.status(201).json(movie);
  } catch (error) {
    console.error('❌ Error adding movie:', error);
    res.status(500).json({ 
      message: 'Error adding movie', 
      error: error.message 
    });
  }
});

module.exports = router;

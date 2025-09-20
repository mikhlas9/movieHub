const express = require('express');
const Vote = require('../models/Vote');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Vote on a movie
router.post('/:movieId', auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 1 for upvote, -1 for downvote
    const movieId = req.params.movieId;
    const userId = req.user._id;

    if (![1, -1].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if user already voted
    let existingVote = await Vote.findOne({ user_id: userId, movie_id: movieId });
    
    if (existingVote) {
      // Update existing vote if different
      if (existingVote.vote_type !== voteType) {
        const oldVoteType = existingVote.vote_type;
        existingVote.vote_type = voteType;
        await existingVote.save();

        // Update movie counts
        if (oldVoteType === 1) {
          movie.upvotes -= 1;
        } else {
          movie.downvotes -= 1;
        }

        if (voteType === 1) {
          movie.upvotes += 1;
        } else {
          movie.downvotes += 1;
        }

        movie.vote_score = movie.upvotes - movie.downvotes;
        await movie.save();
      }
    } else {
      // Create new vote
      const vote = new Vote({
        user_id: userId,
        movie_id: movieId,
        vote_type: voteType
      });
      await vote.save();

      // Update movie counts
      if (voteType === 1) {
        movie.upvotes += 1;
      } else {
        movie.downvotes += 1;
      }

      movie.vote_score = movie.upvotes - movie.downvotes;
      await movie.save();
    }

    res.json({ 
      message: 'Vote recorded', 
      vote_score: movie.vote_score,
      upvotes: movie.upvotes,
      downvotes: movie.downvotes
    });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's vote for a movie
router.get('/:movieId/user-vote', auth, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      user_id: req.user._id,
      movie_id: req.params.movieId
    });

    res.json({ vote_type: vote ? vote.vote_type : null });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

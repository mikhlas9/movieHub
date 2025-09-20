const express = require('express');
const Movie = require('../models/Movie');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote'); // This import was missing!
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get top movies (admin leaderboard)
router.get('/top-movies', adminAuth, async (req, res) => {
  try {
    console.log('📊 Admin fetching top movies...');
    const movies = await Movie.find()
      .populate('added_by', 'name')
      .sort({ vote_score: -1 })
      .limit(20); // Increased limit for better admin view

    console.log(`✅ Found ${movies.length} movies for admin`);
    res.json(movies);
  } catch (error) {
    console.error('❌ Error fetching top movies:', error);
    res.status(500).json({ 
      message: 'Error fetching movies', 
      error: error.message 
    });
  }
});

// Delete movie (admin only)
router.delete('/movies/:movieId', adminAuth, async (req, res) => {
  try {
    const movieId = req.params.movieId;
    console.log(`🗑️ Admin deleting movie with ID: ${movieId}`);

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      console.log('❌ Movie not found for deletion');
      return res.status(404).json({ message: 'Movie not found' });
    }

    console.log(`🎬 Deleting movie: ${movie.title}`);

    // Delete associated comments first
    const deletedComments = await Comment.deleteMany({ movie_id: movieId });
    console.log(`💬 Deleted ${deletedComments.deletedCount} comments`);

    // Delete associated votes
    const deletedVotes = await Vote.deleteMany({ movie_id: movieId });
    console.log(`🗳️ Deleted ${deletedVotes.deletedCount} votes`);

    // Delete the movie itself
    await Movie.findByIdAndDelete(movieId);
    console.log(`✅ Movie "${movie.title}" deleted successfully`);

    res.json({ 
      message: 'Movie deleted successfully',
      deletedMovie: movie.title,
      deletedComments: deletedComments.deletedCount,
      deletedVotes: deletedVotes.deletedCount
    });
  } catch (error) {
    console.error('❌ Error deleting movie:', error);
    res.status(500).json({ 
      message: 'Error deleting movie', 
      error: error.message 
    });
  }
});

// Delete comment (admin only)
router.delete('/comments/:commentId', adminAuth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    console.log(`🗑️ Admin deleting comment with ID: ${commentId}`);

    const comment = await Comment.findByIdAndDelete(commentId);
    
    if (!comment) {
      console.log('❌ Comment not found for deletion');
      return res.status(404).json({ message: 'Comment not found' });
    }

    console.log(`✅ Comment deleted successfully`);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    res.status(500).json({ 
      message: 'Error deleting comment', 
      error: error.message 
    });
  }
});

// Get admin statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    console.log('📈 Fetching admin statistics...');

    const [movieCount, userCount, voteCount, commentCount] = await Promise.all([
      Movie.countDocuments(),
      require('../models/User').countDocuments(),
      Vote.countDocuments(),
      Comment.countDocuments()
    ]);

    const stats = {
      movies: movieCount,
      users: userCount,
      votes: voteCount,
      comments: commentCount
    };

    console.log('✅ Admin stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics', 
      error: error.message 
    });
  }
});

module.exports = router;

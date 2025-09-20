const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Add comment to movie
router.post('/:movieId', auth, [
  body('body').notEmpty().withMessage('Comment body is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { body: commentBody } = req.body;
    const movieId = req.params.movieId;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const comment = new Comment({
      user_id: req.user._id,
      movie_id: movieId,
      body: commentBody
    });

    await comment.save();
    await comment.populate('user_id', 'name');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment (user can delete their own comments)
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

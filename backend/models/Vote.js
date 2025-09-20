const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  vote_type: {
    type: Number,
    enum: [1, -1], // 1 for upvote, -1 for downvote
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure one vote per user per movie
voteSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);

// Poll routes — all protected by auth middleware
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getAllPolls,
  createPoll,
  getPollById,
  voteOnPoll,
  getPollResults,
  deletePoll,
} = require('../controllers/polls');

// All poll routes require authentication
router.use(authMiddleware);

router.get('/', getAllPolls);
router.post('/', createPoll);
router.get('/:id', getPollById);
router.post('/:id/vote', voteOnPoll);
router.get('/:id/results', getPollResults);
router.delete('/:id', deletePoll);

module.exports = router;

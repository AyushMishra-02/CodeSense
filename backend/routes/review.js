const express = require('express');
const router = express.Router();
const { submitReview, getHistory, getReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { reviewLimiter } = require('../middleware/rateLimit');

router.post('/', protect, reviewLimiter, submitReview);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getReview);

module.exports = router;

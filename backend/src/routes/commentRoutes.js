const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for accessing :incidentId from parent route
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/', commentController.getCommentsByIncident);
router.post('/', upload.single('file'), commentController.createComment);

module.exports = router;

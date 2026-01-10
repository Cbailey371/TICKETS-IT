const express = require('express');
const router = express.Router();
const notificationConfigController = require('../controllers/notificationConfigController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('superadmin')); // Only superadmin can manage server settings

router.get('/', notificationConfigController.getConfig);
router.put('/', notificationConfigController.updateConfig);
router.post('/test', notificationConfigController.sendTestEmail);

module.exports = router;

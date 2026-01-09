const express = require('express');
const router = express.Router();
const ticketTypeController = require('../controllers/ticketTypeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // Secure routes

// Only Superadmin (and maybe Company Admin for viewing?)
router.get('/', ticketTypeController.getAllTicketTypes);

router.post('/', authorize('superadmin'), ticketTypeController.createTicketType);
router.put('/:id', authorize('superadmin'), ticketTypeController.updateTicketType);
router.delete('/:id', authorize('superadmin'), ticketTypeController.deleteTicketType);

module.exports = router;

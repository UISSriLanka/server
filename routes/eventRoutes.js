const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/create', eventController.createEvent);
router.get('/get', eventController.getEvents);
router.delete('/delete/:id', eventController.deleteEvent);

module.exports = router;

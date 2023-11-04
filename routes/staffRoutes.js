const express = require('express');
const { getStaff, createStaff, getStaffById, updateStaff, deleteStaff } = require("../controllers/staffController");
const { protect } = require('../middlewares/authMiddleware')
const router = express.Router();

router.route('/').get(getStaff);
router.route('/create').post(createStaff);
router.route('/:id').get(getStaffById).put(updateStaff).delete(deleteStaff);

module.exports = router;
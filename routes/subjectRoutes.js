const express = require('express');
const {   getSubjects,
    createSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,} = require("../controllers/subjectContoller");
const router = express.Router();

router.route('/').get(getSubjects);
router.route('/create').post(createSubjects);
router.route('/:id').get(getSubjectById).put(updateSubject).delete(deleteSubject);

module.exports = router;
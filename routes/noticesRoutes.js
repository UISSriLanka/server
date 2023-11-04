const express = require("express");
const router = express.Router();
const noticesController = require("../controllers/noticesController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


router.post("/create", upload.single("file"), noticesController.createNotice);



// Route to get teacher notices
router.get("/get", noticesController.getTeacherNotices);
router.get("/sent", noticesController.getSentNotices);
router.get("/studentNotice", noticesController.getStudentNotices);
module.exports = router;

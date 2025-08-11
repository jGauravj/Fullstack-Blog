// routers/uploadRoute.js
const express = require("express");
const { uploadFile } = require("../controllers/uploadController");
const upload = require("../config/multerCloudinary");

const router = express.Router();

// 'file' must match frontend's form-data field name
router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;

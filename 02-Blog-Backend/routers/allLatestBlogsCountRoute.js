const express = require("express");
const allLatestBlogsCount = require("../controllers/allLatestBlogsController");

const router = express.Router();

router.post("/all-latest-blogs-count", allLatestBlogsCount);

module.exports = router;

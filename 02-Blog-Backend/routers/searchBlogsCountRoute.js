const express = require("express");
const searchBlogCount = require("../controllers/searchBlogsCountController");

const router = express.Router();

router.post("/search-blogs-count", searchBlogCount);

module.exports = router;

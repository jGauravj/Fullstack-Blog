const express = require("express");
const trendingBlog = require("../controllers/trendingBlogController");

const router = express.Router();

router.get("/trending-blogs", trendingBlog);

module.exports = router;

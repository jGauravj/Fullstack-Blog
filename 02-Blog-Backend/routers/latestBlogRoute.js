const express = require("express");
const latestBlog = require("../controllers/latestBlogController");

const router = express.Router();

router.get("/latest-blogs", latestBlog);

module.exports = router;

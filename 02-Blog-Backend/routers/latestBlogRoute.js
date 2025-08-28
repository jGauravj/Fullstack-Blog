const express = require("express");
const latestBlog = require("../controllers/latestBlogController");

const router = express.Router();

router.post("/latest-blogs", latestBlog);

module.exports = router;

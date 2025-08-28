const express = require("express");
const searchBlogController = require("../controllers/searchBlogController");

const router = express.Router();

router.post("/search-blogs", searchBlogController);

module.exports = router;

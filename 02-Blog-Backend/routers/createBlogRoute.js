const express = require("express");
const createBlog = require("../controllers/createBlogController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.post("/create-blog", verifyJWT, createBlog);

module.exports = router;

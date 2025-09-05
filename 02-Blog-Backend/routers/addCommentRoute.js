const express = require("express");
const {
  addComment,
  getBlogComments,
} = require("../controllers/addCommentController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.post("/add-comment", verifyJWT, addComment);
router.post("/get-blog-comments", getBlogComments);

module.exports = router;

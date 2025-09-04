const express = require("express");
const {
  likeBlog,
  isLikedByUser,
} = require("../controllers/likeBlogController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.post("/like-blog", verifyJWT, likeBlog);
router.post("/isliked-by-user", verifyJWT, isLikedByUser);

module.exports = router;

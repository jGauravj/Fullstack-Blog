const express = require("express");
const getBlogsController = require("../controllers/getBlogsController");

const router = express.Router();

router.post("/get-blogs", getBlogsController);

module.exports = router;

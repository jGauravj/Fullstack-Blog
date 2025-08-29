const express = require("express");
const searchUserController = require("../controllers/searchUserController");

const router = express.Router();

router.post("/search-users", searchUserController);

module.exports = router;

const express = require("express");
const getProfileController = require("../controllers/getProfileController");

const router = express.Router();

router.post("/get-profile", getProfileController);

module.exports = router;

const express = require("express");
const {
  signupUser,
  signinUser,
  signinWithGoogle,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/signinwithgoogle", signinWithGoogle);

module.exports = router;

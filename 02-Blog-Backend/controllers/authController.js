const bcrypt = require("bcrypt");
const User = require("../Schema/User");

const signupUser = async (req, res) => {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  try {
    const { fullname, email, password } = req.body;

    // validation the data from frontend

    // Check if all fields exist
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    if (fullname.length < 3) {
      return res.status(403).json({
        success: false,
        error: "Fullname must be at least 3 letters long",
      });
    }

    if (!email.length) {
      return res.status(403).json({
        success: false,
        error: "Enter Email",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(403).json({
        success: false,
        error: "Email is invaild",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(403).json({
        success: false,
        error:
          "Password shoud be 6 to 20 characters long with a numaric, 1 lowercase and 1 uppercase letter",
      });
    }

    // Hash password->
    const hashed_password = await bcrypt.hash(password, 10);
    const username = email.split("@")[0];

    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
        username,
      },
    });

    await user.save();

    // success response
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    // unique email check
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }
    console.log("Signup Error: ", error.message);
    res.status(401).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

module.exports = { signupUser };

const bcrypt = require("bcrypt");
const User = require("../Schema/User");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const serviceAccountKey = require("../fullstack-blog-ef4f4-firebase-adminsdk-fbsvc-dc0c32657f.json");
const { getAuth } = require("firebase-admin/auth");

// format the data to send -->
const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY,
    { expiresIn: "7d" }
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// genrate unique username -->
const generateUsername = async (email) => {
  let username = email.split("@")[0];

  const isUsernameExist = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameExist ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

const signupUser = async (req, res) => {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  try {
    const { fullname, email, password } = req.body;

    // validation the data from frontend-->

    // Check if all fields exist
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (fullname.length < 3) {
      return res.status(403).json({
        success: false,
        message: "Fullname must be at least 3 letters long",
      });
    }

    if (!email.length) {
      return res.status(403).json({
        success: false,
        message: "Enter Email",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(403).json({
        success: false,
        message: "Email is invaild",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(403).json({
        success: false,
        message:
          "Password shoud be 6 to 20 characters long with a numaric, 1 lowercase and 1 uppercase letter",
      });
    }

    // Hash password->
    const hashed_password = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

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
      user: formatDataToSend(user),
    });
  } catch (error) {
    // unique email check
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    console.log("Signup Error: ", error.message);
    res.status(401).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ "personal_info.email": email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.personal_info.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      user: formatDataToSend(user),
    });
  } catch (error) {
    console.error("Signin Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error! Please try again later.",
    });
  }
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const signinWithGoogle = async (req, res) => {
  try {
    const { access_token } = req.body;

    const decodedToken = await getAuth().verifyIdToken(access_token);

    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Sign-In with Google did not succeed!",
      });
    }

    const { email, name, picture: originalPicture } = decodedToken;
    const highQuilityPicture = originalPicture?.replace("s96-c", "s384-c");

    let user = await User.findOne({ "personal_info.email": email }).select(
      "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
    );

    if (user) {
      // login
      if (!user.google_auth) {
        return res.status(403).json({
          success: false,
          message:
            "This email signed up without google. Please log in with password to access the account",
        });
      }
      // Successful Google login
      return res.status(200).json({
        success: true,
        message: "Google Sign-In successful!",
        user,
      });
    } else {
      // New user – sign up
      let username = await generateUsername(email);

      user = new User({
        personal_info: {
          fullname: name,
          email,
          profile_img: highQuilityPicture,
          username,
        },
        google_auth: true,
      });

      await user.save();

      return res.status(201).json({
        success: true,
        message: "User signed up with Google successfully!",
        user: formatDataToSend(user),
      });
    }
  } catch (error) {
    console.error("Signin Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error! Please try again later.",
    });
  }
};

module.exports = { signupUser, signinUser, signinWithGoogle };

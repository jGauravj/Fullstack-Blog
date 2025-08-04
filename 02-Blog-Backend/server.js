require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const signupRoute = require("./routers/signupRoute");
const signinRoute = require("./routers/signupRoute");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

//middlewares -->
app.use(express.json());
app.use(cors());

// Mongodb connection
connectToDB();

//Routes
app.use("/auth/", signupRoute);
app.use("/auth/", signinRoute);

// server running
app.listen(PORT, () => {
  console.log(`Server is now running on Port: ${PORT}`);
});

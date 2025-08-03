require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const signupRoute = require("./routers/signupRoute");

const app = express();
const PORT = process.env.PORT;

//middlewares -->
app.use(express.json());

// Mongodb connection
connectToDB();

//Routes
app.use("/api/auth/", signupRoute);

app.listen(PORT, () => {
  console.log(`Server is now running on Port: ${PORT}`);
});

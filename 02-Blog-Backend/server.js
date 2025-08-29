require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const signupRoute = require("./routers/signupRoute");
const signinRoute = require("./routers/signupRoute");
const signinwithgoogle = require("./routers/signupRoute");
const uploadRoute = require("./routers/uploadRoute");
const createBlogRoute = require("./routers/createBlogRoute");
const latestBlogRoute = require("./routers/latestBlogRoute");
const trendingBlogRoute = require("./routers/trendingBlogRoute");
const searchBlogRoute = require("./routers/searchBlogRoute");
const allLatestBlogsCountRoute = require("./routers/allLatestBlogsCountRoute");
const searchBlogCountRoute = require("./routers/searchBlogsCountRoute");
const searchUsersRoute = require("./routers/searchUsersRoute");
const getProfileRoute = require("./routers/getProfileRoute");
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
app.use("/auth/", signinwithgoogle);
app.use("/api", uploadRoute);
app.use("/api", createBlogRoute);
app.use("/api", latestBlogRoute);
app.use("/api", trendingBlogRoute);
app.use("/api", searchBlogRoute);
app.use("/api", allLatestBlogsCountRoute);
app.use("/api", searchBlogCountRoute);
app.use("/api", searchUsersRoute);
app.use("/api", getProfileRoute);

// server running
app.listen(PORT, () => {
  console.log(`Server is now running on Port: ${PORT}`);
});

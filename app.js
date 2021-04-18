const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();

const clientAuthRoutes = require("./routes/client/authRoutes");
const providerAuthRoutes = require("./routes/provider/authRoutes");

const { checkUser } = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Database connection
const dbURI = process.env.DATABASE_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log(`App is listening on port 3000`);
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.get("/", checkUser, (req, res) => res.send("home"));
app.use("/api/client/auth", clientAuthRoutes);
app.use("/api/provider/auth", providerAuthRoutes);

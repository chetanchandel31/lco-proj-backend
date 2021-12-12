require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 8000;

// middlewares
app.use(express.json({ extended: true })); // these let us access req.body
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api", authRoutes);

// memories app method for connecting db seems better
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"));

app.listen(PORT, () => console.log(`app running on port ${PORT}`));

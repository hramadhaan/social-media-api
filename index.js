const express = require("express");
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
require("dotenv").config();

// Routes Configuration
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/auth", authRoutes);

// Error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error?.data?.[0]?.msg || "Server Failure";
  res.status(status).json({ message: message, success: false });
});

// Connect to mongodb
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_USERNAME}.zioaaun.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_CLUSTER_NAME}`
  )
  .then((response) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('ENV:', { password: process.env.MONGO_PASSWORD, username: process.env.MONGO_USERNAME })
    console.error("ERROR MONGO: ", err);
  });

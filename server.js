const express = require('express');
require("dotenv").config(); // prefer .env over config objects
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
connectDB();

// Init Middleware
app.use(express.json({extend: false}));

// app.get("/", (req, res) => res.send("API Running"));

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/users", require("./routes/api/users"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build")); // set static assets folder, the react front end build.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`🧰 Server started on port ${PORT}`));

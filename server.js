const express = require('express');
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.get("/", (req, res) => res.send("API Running"));

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/users", require("./routes/api/users"));
    
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

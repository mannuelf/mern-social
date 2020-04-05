const express = require('express');
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.get('/',
    (req, res) => res.send('API Running'));
    
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const mongoose = require("mongoose");
const config = require("./services");
const db = config.services.mongoURI;

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Mongo DB connected");
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;
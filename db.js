const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL;
        //  console.log(dbUrl)
        await mongoose.connect(dbUrl);


        console.log("MongoDB connected");



    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
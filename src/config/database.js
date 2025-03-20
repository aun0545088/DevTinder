const mongoose = require("mongoose")
require('dotenv').config()

const mongoUrl = process.env.mongoUrl

const connectDB = async () => {
    await mongoose.connect(
        mongoUrl
    )
}

module.exports = connectDB

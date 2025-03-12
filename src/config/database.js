const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://aun0545088:3XlICHulr6SVFGqc@nodelearning.ja6so.mongodb.net/DevTinder"
    )
}

module.exports = connectDB

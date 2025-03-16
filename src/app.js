const express = require("express")
const connectDB = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")


connectDB()
    .then(() => {
        console.log("Database connection established.")
        app.listen(7777, () => {
            console.log("server is successfully listening on port 7777....")
        })
    })
    .catch(() => {
        console.error("Database connection is not established")
    })


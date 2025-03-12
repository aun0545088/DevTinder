const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")

app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: "Aun",
        lastName: "Mohammad",
        age: 31,
        gender: "Male"
    })
    try {
        await user.save()
        res.send("User added successfully!")
    }
    catch (err) {
        res.status(400).send(`Error saving the user: ${err.message}`)
    }
})

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


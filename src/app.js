const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")
const { validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcrypt")

app.use(express.json())

app.post('/signup', async (req, res) => {
    console.log(req.body)
    //Validation of data

    try {
        validateSignUpData(req)

        const { firstName, lastName, emailId, password } = req.body

        //Encryption of password
        const passwordHash = bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })

        await user.save()
        res.send("User added successfully!")
    }
    catch (err) {
        res.status(400).send(`Error saving the user: ${err.message}`)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            throw new Error("Invalid credentials.")
        }
        const isPasswordValid = bcrypt.compare(password, user.password)

        if (isPasswordValid) {
            res.send("login successfully!")
        } else {
            throw new Error("Invalid credentials.")
        }
    } catch (err) {
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


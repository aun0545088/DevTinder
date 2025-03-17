const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const validateSignUpData = require("../utils/validation")
const User = require("../models/user")

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            throw new Error("Invalid credentials.")
        }
        const isPasswordValid = user.validatePassword(password)

        if (isPasswordValid) {

            // create a JWT token
            const token = await user.getJWT()

            // Add the token to cookie and send back the respond to the user
            res.cookie("token", token)
            res.send("login successfully!")
        } else {
            throw new Error("Invalid credentials.")
        }
    } catch (err) {
        res.status(400).send(`Error saving the user: ${err.message}`)
    }
})

authRouter.post('/logout', (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("logout successfull!")
})

module.exports = authRouter
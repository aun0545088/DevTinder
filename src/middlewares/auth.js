const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        //Read the token from the req cookies
        const { token } = req.cookies
        if (!token) {
            throw new Error("Token is not valid!")
        }
        //Validate the token
        const decodedObj = await jwt.verify(token, "secretKey")

        const { _id } = decodedObj
        //Find the username
        const user = await User.findById(_id)

        if (!user) {
            throw new Error("User not found.")
        }
        req.user = user
        next()
    } catch {
        res.status(400).send(`ERROR: ${res.message}`)
    }
}

module.exports = {
    userAuth,
}
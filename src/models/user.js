const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxLength: 50
        },
        lastName: {
            type: String,
            minLength: 4,
            maxLength: 50
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error(`Email is invalid ${value}`)
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error(`Please enter the stron password ${value}`)
                }
            },
        },
        age: {
            type: Number,
            min: 18
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender value is not valid.")
                }
            },
        },
        photoUrl: {
            type: String,
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error(`Invalid imge url ${value}`)
                }
            },
        },
        about: {
            type: String,
            default: "This is about some user."
        },
        skills: {
            type: [String],
        },
    },
    {
        timestamps: true
    }
)
userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id }, "secretKey", {
        expiresIn: "7d"
    })
    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
    const passwordHash = user.password

    const isValidPassword = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    )
    return isValidPassword
}
const User = mongoose.model("User", userSchema)
module.exports = User
const validator = require("validator")

const validateSignUpData = (req) => {
    console.log("req.body", req.body)
    const { firstName, lastName, emailId, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("Enter the valid name")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email address")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password")
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ]

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
    return isEditAllowed
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}
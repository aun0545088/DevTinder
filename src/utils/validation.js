const validator = require("validator")

const validateSignUpData = (req) => {
    const { firsrtName, lastName, emailId, password } = req.body

    if (!firsrtName || !lastName) {
        throw new Error("Enter the valid name")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email address")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password")
    }
}

module.exports = validateSignUpData
const express = require('express')
const ConnectionRequest = require('../models/connectionRequest')
const { userAuth } = require('../middlewares/auth')
const userRouter = express.Router()

const SAFE_USER_DATA = "firstName lastName age gender about skills"

//Get all the pending connection request for the loggedIn user

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate(
            "fromUserId",
            SAFE_USER_DATA
        )
        // .populate("fromUserId", ["firstName", "lastName"])

        res.json({
            message: "Data fetched successfully!",
            data: connectionRequests
        })
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUSer = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUSer._id, status: "accepted" },
                { fromUserId: loggedInUSer._id, status: "accepted" },
            ]
        })
            .populate("fromUserId", SAFE_USER_DATA)
            .populate("toUserId", SAFE_USER_DATA)

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUSer._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({ data })
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

module.exports = userRouter
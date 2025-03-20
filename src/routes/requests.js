const express = require("express")
const { userAuth } = require("../middlewares/auth")

const requestRouter = express.Router()

const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: `Invalid status type ${status}` })
        }

        // If there is an exisiting connectionRequest.

        const exisitingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        const toUser = User.findById(toUserId)

        //if user even exist in db for random user 
        if (!toUser) {
            return res.status(404).json({ message: "user not found" })
        }

        if (exisitingConnectionRequest) {
            return res
                .status(400)
                .json({
                    message: "Connection request already exists!"
                })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data
        })

    } catch (err) {
        res.status(400).send(`Error: ${err.message}`)
    }
})

module.exports = requestRouter
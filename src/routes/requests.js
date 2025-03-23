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

        const toUser = await User.findById(toUserId)

        //if user even exist in db for random user 
        if (!toUser) {
            return res.status(404).json({ message: "user not found" })
        }

        // If there is an exisiting connectionRequest.

        const exisitingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })


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

        // console.log(toUser)

        res.json({
            message: `${req.user.firstName} is ${status} in ${toUser?.firstName}`,
            data
        })

    } catch (err) {
        res.status(400).send(`Error: ${err.message}`)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUSer = req.user
        const { status, requestedId } = req.params
        //Validate the status
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "status not allowed." })
        }

        const connectionRequest = ConnectionRequest.findOne({
            _id: requestedId,
            toUserId: loggedInUSer._id,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found." })
        }

        connectionRequest.status = status//set the status

        const data = await connectionRequest.save()

        res.json({ message: `Connection request ${status}`, data })

    } catch (err) {

    }
})

module.exports = requestRouter
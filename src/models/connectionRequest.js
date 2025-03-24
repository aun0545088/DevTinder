const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",//reference to the user collections
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type.`
            }
        }
    },
    {
        timestamps: true
    }
)

//connectionRequest.find({fromUserId:1277888888,toUserId:1239999999})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

//calling this middleware to pre save
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this
    //check if fromUserId is same as to toUSerId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!")
    }
    next()
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel
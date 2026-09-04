const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profileImg: {
        type: String
    },

    email: {
        type: String,
        required: true
    },

    heading: {
        type: Number,
        default: 0
    },

    speed:{
        type:Number,default:0
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },

        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },

    lastUpdate: {
        type: Date,
        default: Date.now
    }
})

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
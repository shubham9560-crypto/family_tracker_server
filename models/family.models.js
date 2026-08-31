const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    familyCode: {
        type: String,
        required: true,
        unique: true
    }
    ,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

module.exports = mongoose.model("Family", familySchema);
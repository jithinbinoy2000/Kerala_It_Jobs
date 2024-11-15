const mongoose = require('mongoose');

// Define the user schema
const userModel = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true, 
        unique: true,
        trim: true,
        lowercase: true 
    },
    userPassword: {
        type: String,
        required: true 
    },
    category: {
        type: String,
        default: null
    },
    notificationStatus: {
        type: Boolean,
        default: true
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
}, {
    timestamps: true 
});

// Create the user model
const User = mongoose.model('Users', userModel); 
module.exports = User;

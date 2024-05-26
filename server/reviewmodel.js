const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    iduser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

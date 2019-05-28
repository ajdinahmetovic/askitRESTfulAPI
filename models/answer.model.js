const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema({

    questionId: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true,
    },

    answer: {
        type: String,
        required: true
    },

    rating: {
        likes: [],
        dislike:[],
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },


});

module.exports = mongoose.model('Answer', AnswerSchema);

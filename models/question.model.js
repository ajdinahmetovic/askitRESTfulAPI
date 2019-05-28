const mongoose = require('mongoose');
let validator = require('validator');


const QuestionSchema = mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },

    // Keep ID of answers
    answers: [
        {
            questionId: {
                type: String
            }
        }
    ],

    // Keep ID of users who liked/disliked questions
    rating: {
      likes: [String],
      dislike: [String],
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

});

module.exports = mongoose.model('Question', QuestionSchema);

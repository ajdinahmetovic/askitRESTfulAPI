const mongoose = require('mongoose');
let validator = require('validator');

const AnswerSchema = mongoose.Schema({

    author: {
        type: String,
        required: true,
    },

    answer: {
        type: String,
        required: true
    },

    rating: {
        likes: [
            {
                userId: {
                    type: String,
                }
            }
        ],

        dislike:[
            {
                userId: {
                    type: String,
                }
            }
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },


});

module.exports = mongoose.model('Answer', AnswerSchema);

const mongoose = require('mongoose');
let validator = require('validator');


const QuestionSchema = mongoose.Schema({


    author: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answers: [
        {
            answerId: {
                type: String,
            }

        }
    ],
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

module.exports = mongoose.model('Question', QuestionSchema);

const mongoose = require('mongoose');
let validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 13;


const UserSchema = mongoose.Schema({


    authData: {
        username: {
            type: String,
            unique: true,
            minlength: [5, 'Username is too short (min. 8 char.)']
        },
        password: {
            type: String,
            required: true,
            minlength: [8, 'Password has to be 8 characters long']
        },
    },

    userData: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate: [validator.isEmail, 'Email is not valid']
        },
        avatar: {
            type: String,
        },
    },

    myQuestions: [
        {
            questionId: {
                type: String,
            }
        }
    ],

    answeredQuestions: [
        {
            answerId: {
                type: String,
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now()
    },
});

UserSchema.pre('save', function(next){
    this.authData.password = bcrypt.hashSync(this.authData.password, saltRounds);
    next();
});

module.exports = mongoose.model('User', UserSchema);

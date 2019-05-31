let Question = require('../models/question.model');
let Answer = require('../models/answer.model');
let User = require('../models/user.model');

let express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

let router = express.Router();

router.post('/question', verifyToken, (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    let model = new Question(req.body);

    model.save()
        .then(doc => {
            if(!doc || doc.length === 0){
                return res.status(500).send(doc);
            }

            User.findByIdAndUpdate(req.body.userId, {'$push': {myQuestions: doc}}, {new: true})
                .then(usr => {
                    if(!usr){
                        res.status(500).json({message: 'Error'});
                    }
                });

            res.status(201).json(doc);
        })
        .catch(err => {
            res.status(500).json(err)
        })

});
/*
router.get('/question/:id', (req, res) => {

    Question.findOne({_id: req.params.id})
        .then( doc => {
            if(doc){
                res.status(201).json(doc);
            }
            res.status(500).json({message: 'Ding dong your opinion is wrong '})


        })
        .catch(err =>{
            res.status(500).json(err)
        })

});
*/
router.get('/question', verifyToken, (req, res) => {
    Question.find()
        .sort(req.query.sort === 'date' ? {createdAt: -1} : req.query.sort === 'hot' ? {'rating.likes': -1} : '')
        .skip((req.query.count * 20) - 20)
        .limit(req.query.count * 20)
        .then((doc, err) => {
            if(doc){
                res.status(201).json(doc)
            }
            res.status(500).json(err);
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

router.get('/question/my', verifyToken, (req, res) => {

    //console.log('Log ::' + req.query);

    Question.find({userId: req.query.userId})
        .skip((req.query.count * 20) - 20)
        .limit(req.query.count * 20)
        .then(doc => {
            if(doc){
                res.status(201).json(doc)
            }
            res.status(500).json('Error');
        })
        .catch(err => {

            res.status(500).send(err)
        })

});

router.post('/question/answer', verifyToken, (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }
    let questionId = req.body.answer.questionId;
    let answer = new Answer(req.body.answer);
    let responseObject;
    answer.save()
        .then(doc => {
            if(!doc){
                res.status(500).json({message: 'Error while saving answer'})
            } else {
                Question.findByIdAndUpdate(questionId, {'$push': {answers: answer}}, {new: true})
                    .then((doc, err) => {
                        if(doc){
                            User.findByIdAndUpdate(req.body.userId, {'$push': {answeredQuestions: doc}}, {new: true})
                                .then((doc, err) => {
                                    if(err){
                                        res.status(500).json({message: 'Error'});
                                    }
                                }).catch(err => {
                                res.status(500).send(err);
                            });
                        }

                        res.status(500).json(err)
                    })

                    .catch(err => {
                        res.status(500).send(err);
                    });

                res.status(201).json(doc);
            }
        })
        .catch(err => {
            res.status(500).json(err);
    });

});

router.put('/question/like', verifyToken, (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    Question.findById(req.body.questionId)
        .then(doc => {
            if(doc){
                // console.log(doc.rating.likes.includes(req.body.userId));
                if(!doc.rating.likes.includes(req.body.userId)) {
                    Question.findByIdAndUpdate(req.body.questionId, {'$push': {'rating.likes': req.body.userId}}, {new: true})
                        .then((doc, err) => {
                            if(doc){
                                res.status(201).json(doc.rating)
                            }
                            res.status(500).json(err);
                        }).catch(err =>{
                        res.status(500).send(err);
                    })

                } else {
                    res.send(doc.rating);
                }
            }
            if(doc === null){
                res.status(500).json(doc);
            }
        })
        .catch(err => {
            res.status(500).json('err');
        })



});

router.put('/question/dislike', verifyToken, (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }



    Question.findById(req.body.questionId)
        .then(doc => {
            if(doc){
                // console.log(doc.rating.likes.includes(req.body.userId));
                if(!doc.rating.dislike.includes(req.body.userId)) {
                    Question.findByIdAndUpdate(req.body.questionId, {'$push': {'rating.dislike': req.body.userId}}, {new: true})
                        .then((doc, err) => {
                            if(doc){
                                res.status(201).json(doc.rating)
                            }
                            res.status(500).json(err);
                        }).catch(err =>{
                        res.status(500).send(err);
                    })

                } else {
                    res.send(doc.rating);
                }
            }
            if(doc === null){
                res.status(500).json(doc);
            }
        })
        .catch(err => {
            res.status(500).json('err');
        });

    /*
    Question.findByIdAndUpdate(req.body.questionId, {'$push': {'rating.dislike': req.body.userId}}, {new: true})
        .then((doc, err) => {
            if(doc){
                res.status(201).json(doc.rating)
            }
            res.status(500).json(err);
        }).catch(err =>{
        res.status(500).send(err);
    })
    */

});


function verifyToken(req, res, next) {

    //auth: Bearer <jwt_token>

    const bearer = req.headers['authorization'];
    if(typeof bearer === 'undefined'){
        res.status(500).json({message: 'tokenFail'})
    }

    const headerToken = bearer.split(' ');
    const token = headerToken[1];

    jwt.verify(token, 'MoP', (err, authData) => {
        if(err){
            res.status(500).json({message: 'Token is invalid'})
        }
        next();
    });



}

module.exports = router;

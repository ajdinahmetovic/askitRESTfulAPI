let Answer = require('../models/answer.model');
let Question = require('../models/question.model');

let express = require('express');
const jwt = require('jsonwebtoken');



let router = express.Router();

router.get('/answer', (req, res) => {

    Answer.find({questionId: req.query.questionId})
        .sort(req.query.sort === 'date' ? {createdAt: -1} : req.query.sort === 'hot' ? {'rating.hot': -1} : '')
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
        });

});

router.put('/answer/like', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }


    Answer.findById(req.body.answerId)
        .then(doc => {
            if(doc){
                // console.log(doc.rating.likes.includes(req.body.userId));
                if(!doc.rating.likes.includes(req.body.userId)) {
                    Answer.findByIdAndUpdate(req.body.answerId, {'$push': {'rating.likes': req.body.userId}}, {new: true})
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


});

router.put('/answer/dislike', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }


    Answer.findById(req.body.answerId)
        .then(doc => {
            if(doc){
                // console.log(doc.rating.likes.includes(req.body.userId));
                if(!doc.rating.dislike.includes(req.body.userId)) {
                    Answer.findByIdAndUpdate(req.body.answerId, {'$push': {'rating.dislike': req.body.userId}}, {new: true})
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

});

module.exports = router;

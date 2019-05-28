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
                res.json(doc)
            }
            res.json(err);
        })
        .catch(err => {
            res.send(err)
        });

});

router.put('/answer/like', (req, res) => {

    if(!req.body){
        return res.status(400).send('Request body missing');
    }
    Answer.findByIdAndUpdate(req.body.answerId, {'$push': {'rating.likes': req.body.userId}}, {new: true})
        .then((doc, err) => {
            if(doc){
                res.json(doc)
            }
            res.json(err);
        }).catch(err =>{
        res.json(err);
    })

});

router.put('/answer/dislike', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    Answer.findByIdAndUpdate(req.body.answerId, {'$push': {'rating.dislike': req.body.userId}}, {new: true})
        .then((doc, err) => {
            if(doc){
                res.json(doc)
            }
            res.json(err);
        }).catch(err =>{
        res.json(err);
    })

});




module.exports = router;

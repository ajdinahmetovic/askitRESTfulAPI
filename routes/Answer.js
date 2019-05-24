let Answer = require('../models/answer.model');
let Question = require('../models/question.model');

let express = require('express');
const jwt = require('jsonwebtoken');


let router = express.Router();

router.get('/answer', (req, res) => {

    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    // res.json(req.body.ids);

    Answer.find({_id: {$in: req.body.ids}})
        .then(doc => {
            if(doc){
                res.json(doc);
            }

            res.json({message: 'Error happened'});

        })
        .catch(err => {
            res.send('err');
        })

});

router.get('/answer/top', (req, res) => {

    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    // res.json(req.body.ids);

    Answer.find({_id: {$in: req.body.ids}})
        .then(doc => {
            if(doc){
                res.json(doc);
            }

            res.json({message: 'Error happened'});

        })
        .catch(err => {
            res.send('err');
        })

});


module.exports = router;

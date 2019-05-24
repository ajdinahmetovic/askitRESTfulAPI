let Question = require('../models/question.model');
let Answer = require('../models/answer.model');
let express = require('express');
const jwt = require('jsonwebtoken');

let router = express.Router();

router.post('/question', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    let model = new Question(req.body);

    model.save()
        .then(doc => {
            if(!doc || doc.length === 0){
                return res.status(500).send(doc);
            }
            res.status(201).send(doc);
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

router.get('/question/:id', (req, res) => {

    Question.findOne({_id: req.params.id})
        .then( doc => {
            if(doc){
                res.json(doc);
            }
            res.json({message: 'Ding dong your opinion is wrong '})
        })
        .catch(err =>{

        })

});

router.post('/question/answer', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    let answer = new Answer(req.body.answer);

    answer.save()
        .then(doc => {
            if(doc){

            }

            res.json({message: 'Error while saving answer'})

        })
        .catch(err =>{

    });

    Question.findByIdAndUpdate(req.body._id, {'$push': {answers: answer}}, {new: true})
        .then(doc => {
            if(doc){
                res.json(doc);
            }

            res.json({message: 'Error'})
        })
        .catch(err => {
            res.send(err);
        })

});


module.exports = router;

let User = require('../models/user.model');
let express = require('express');
const jwt = require('jsonwebtoken');


let router = express.Router();

router.post('/user', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    let model = new User(req.body);

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

router.post('/user/login', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    User.findOne(req.body)
        .then(doc => {
            if(doc) {
                jwt.sign({doc}, 'MoP', {expiresIn: '1h'}, (err, token)=> {
                    if(err){
                        res.json(err);
                    }
                    res.send(token);
                });

            } else {
                res.json({message: 'User nt found'});
            }
        })
        .catch(err => {
            res.send(err);
        })
});

router.put('/user', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    let model = new User(req.body);


});


module.exports = router;

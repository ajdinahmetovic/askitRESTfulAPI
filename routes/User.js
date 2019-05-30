let User = require('../models/user.model');
let express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 13;

let router = express.Router();

router.post('/user', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    let model = new User(req.body);

    model.save()
        .then(doc => {
            if(!doc || doc.length === 0){
                return res.status(500).json(doc);
            }

            jwt.sign({doc}, 'MoP', (err, token)=> {
                if(err){
                    res.status(500).json(err);
                }
                res.status(201).json({token: token, user: doc});
            });

            //res.status(201).send(doc);
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

router.post('/user/login', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    User.findOne({'authData.username': req.body.authData.username})
        .then(user => {
            if(user && bcrypt.compareSync(req.body.authData.password, user.authData.password)) {
                jwt.sign({user}, 'MoP', (err, token)=> {
                    if(err){
                        res.status(500).json(err);
                    }
                    res.status(201).json({token: token, user: user});
                });

            } else {
                res.status(500).json({message: 'Wrong username or password'});
            }
        })
        .catch(err => {
            res.send(err);
        })
});


router.get('/user/top', (req, res) => {

    User.find()
        .sort({answeredQuestions: -1})
        .limit(20)
        .then((doc, err) => {

            if(doc){
                res.status(201).json(doc)
            }
            res.json(err);
        })
        .catch(err => {
            res.json(err);
        })
});

router.put('/user/change', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }

    User.findById(req.body.userId)
        .then(user => {

            if(user && bcrypt.compareSync(req.body.oldPassword, user.authData.password)) {
                User.findByIdAndUpdate(req.body.userId, { 'authData.password': bcrypt.hashSync(req.body.newPassword, saltRounds)}, {new: true})
                    .then(doc => {
                        jwt.sign({doc}, 'MoP', (err, token)=> {
                            if(err){
                                res.status(500).json(err);
                            }
                            res.status(201).json({token: token});
                        });
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    })
            } else {
                res.status(500).send({message: 'Error occurred'})
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })


});

// NOT USED
router.put('/user/renewToken', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body missing');
    }
    User.findOne(req.body)
        .then(doc => {
            if(doc) {
                jwt.sign({doc}, 'MoP', {expiresIn: '1h'}, (err, token)=> {
                    if(err){
                        res.status(500).json(err);
                    }
                    res.status(201).send(token);
                });

            } else {
                res.status(500).json({message: 'User nt found'});
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })
});


module.exports = router;

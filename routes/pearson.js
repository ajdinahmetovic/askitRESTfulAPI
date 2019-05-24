let express = require('express');

let router = express.Router();

router.get('/user/:name', (req, res) => {
    res.send('User name is: ' + req.params.name);

});

router.get('/pearson/:name', (req, res) => {
    res.send('You requested '+ req.params.name);
});



module.exports = router;

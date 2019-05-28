let express = require('express');
const mongoose = require('mongoose');
let app = express();
mongoose.connect("mongodb+srv://malatajna:malatajna@cluster0-qkh3b.mongodb.net/askit?retryWrites=true");

let userRoute = require('../routes/User');
let questionRoute = require('../routes/Question');
let answerRoute = require('../routes/Answer');
let bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(userRoute);
app.use(questionRoute);
app.use(answerRoute);
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started'));

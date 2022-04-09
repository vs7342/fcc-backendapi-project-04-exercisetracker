const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');

// Services
const userService = require('./services/userService');
const exerciseService = require('./services/exerciseService');

// Import config based on 'CURRENT' environment variable
let CURRENT = process.env.CURRENT || 'dev';
let configPath = '';
if(CURRENT === 'dev'){
  configPath = './config/dev.env';
}else{
  configPath = './config/prod.env';
}
require('dotenv').config({path: configPath});

// MongoDB Connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(express.static('public'))

// Static Home Page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// User related endpoints
app.post('/api/users', userService.insertUser);
app.get('/api/users', userService.getAllUsers);

// Exercise related endpoints
app.post('/api/users/:_id/exercises', exerciseService.logExercise);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

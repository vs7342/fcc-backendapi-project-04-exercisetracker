const express = require('express')
const app = express()
const cors = require('cors')

// Import config based on 'CURRENT' environment variable
let CURRENT = process.env.CURRENT || 'dev';
let configPath = '';
if(CURRENT === 'dev'){
  configPath = './config/dev.env';
}else{
  configPath = './config/prod.env';
}
require('dotenv').config({path: configPath});

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

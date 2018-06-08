
var express = require('express');
var app = express();
var morgan = require('morgan');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passports/passport')(app,passport);


//log nya
app.use(morgan('dev'));
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

//default route
/* app.get('/', function(req, res) {
  res.send('hello from home');
}); */

//koneksi database mongoosemongoose.connect('mongodb://arim:arimCicak117@localhost:27017/tutorial?authMechanism=SCRAM-SHA-1', function(err) {

//mongoose.connect('mongodb://arim:arimCicak117@localhost:27017/tutorial?authSource=admin', function(err) {
mongoose.connect('mongodb://arim:arimCicak117@ds031671.mlab.com:31671/dbarimdotnet', function(err) {
  if (err) {
    console.log('Not connected to the database : ' + err);
  } else {
    console.log('Connected to the database success');
  }
});


app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/apps/views/index.html'));
});


//server
app.listen(port, function() {
  console.log('App running the Server on Port : ' + port);
});

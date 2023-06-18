/* index.js 2023-06-17 */

// require and instantiate express
//    const app = require('express')()
// require and instantiate express
var express = require('express');
var app = express();
// initializes as a function handler for the HTTP server
var http = require('http').createServer(app);

// define the folder to serve with static content
app.use(express.static(__dirname + '/'));
// set the view engine to ejs
app.set('view engine', 'ejs')

// index page
app.get('/', function(req, res) {
  res.render('index', {
    name : "E.V.I. Games",
    navlink : "home"
  });
});

// games page
app.get('/games', function(req, res) {
  res.render('games', {
    name : "List of Games",
    navlink : "games"
  });
});

// recover page
app.get('/recover', function(req, res) {
  res.render('recover', {
    name : "Recover Cartridges",
    navlink : "recover"
  });
});


// -------------------------------------------------------------------
// server runs on port 3000 (this will be used by the reverse proxy)
http.listen(3000)
console.log('index.js running on port 3000')

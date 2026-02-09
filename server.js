// load environment variables from .env file
require('dotenv').config();
var Counter = require('counterapi').Counter;

// setup counter with our token
var counter = new Counter(process.env.counterapi);

var http = require('http');

// create server that handles requests
var server = http.createServer(function(req, res) {
  // allow requests from any website
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  // when someone wants to see the counter
  if (req.url === '/api/counter' && req.method === 'GET') {
    counter.get('compliments', 'total').then(function(result) {
      res.end(JSON.stringify({ count: result.data }));
    }).catch(function(error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    });
  } 
  // when someone clicks the button and increases counter
  else if (req.url === '/api/counter' && req.method === 'POST') {
    counter.up('compliments', 'total').then(function(result) {
      res.end(JSON.stringify({ count: result.data }));
    }).catch(function(error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    });
  } 
  // if they go to wrong url
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// start server on port 6767
server.listen(6767, function() {
  console.log('server running on http://localhost:6767');
});

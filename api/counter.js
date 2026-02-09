var https = require('https');

module.exports = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  var token = process.env.COUNTER_API_TOKEN;
  var options = {
    hostname: 'api.counterapi.dev',
    path: '/v1/compliments/total',
    method: req.method === 'POST' ? 'POST' : 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  };
  
  var apiReq = https.request(options, function(apiRes) {
    var data = '';
    apiRes.on('data', function(chunk) {
      data += chunk;
    });
    apiRes.on('end', function() {
      try {
        var result = JSON.parse(data);
        res.statusCode = 200;
        res.end(JSON.stringify({ count: result.count || result.value || 0 }));
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Parse error' }));
      }
    });
  });
  
  apiReq.on('error', function(e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  });
  
  if (req.method === 'POST') {
    apiReq.write(JSON.stringify({ action: 'increment' }));
  }
  
  apiReq.end();
};

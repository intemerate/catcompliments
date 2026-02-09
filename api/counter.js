var https = require('https');

module.exports = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  var token = process.env.COUNTER_API_TOKEN;
  var workspace = 'compliments';
  var key = 'total';
  
  var path = req.method === 'POST' 
    ? '/v2/' + workspace + '/' + key + '/up'
    : '/v2/' + workspace + '/' + key;
  
  var options = {
    hostname: 'api.counterapi.dev',
    path: path,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
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
        res.end(JSON.stringify({ count: result.count || result.value || result.data || 0 }));
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Parse error', raw: data }));
      }
    });
  });
  
  apiReq.on('error', function(e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  });
  
  apiReq.end();
};

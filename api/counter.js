var Counter = require('counterapi').Counter;

var counter = new Counter(process.env.COUNTER_API_TOKEN);

module.exports = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    counter.get('compliments', 'total').then(function(result) {
      res.json({ count: result.data });
    }).catch(function(error) {
      res.status(500).json({ error: error.message });
    });
  } else if (req.method === 'POST') {
    counter.up('compliments', 'total').then(function(result) {
      res.json({ count: result.data });
    }).catch(function(error) {
      res.status(500).json({ error: error.message });
    });
  }
};

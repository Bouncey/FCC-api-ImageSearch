const https = require("https");

module.exports = {

  getJSON: ((options, callback) => {
    https.request(options, res => {
      var data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        var obj = JSON.parse(data);
        callback(null, obj);
      });
      res.on('error', err => {
        callback(err, null);
      });
    }).end();
  })
};

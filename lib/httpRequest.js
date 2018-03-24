const http = require('https');
const config = require('../config/config.json')

module.exports = function (json, callback) {
    let postDataStr = JSON.stringify(json);
    let options = Object.assign({}, config);
    options.headers['Content-Length'] = postDataStr.length;

    let req = http.request(options, (res) => {
        res.setEncoding('utf8');
        if (callback) callback(res.statusCode);
    });
    req.write(postDataStr);
    req.end();
};

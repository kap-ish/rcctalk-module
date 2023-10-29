const net = require('./modules/net.js');
const xml = require("./modules/xml.js");
async function connect(ip, port) {
    return net.connect(ip, port)
}
module.exports = { connect }
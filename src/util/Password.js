const crypto = require('crypto')
const encrypt = crypto.createHash('sha1')


function sha1(data) {
    return crypto.createHash("sha1").update(data, "binary").digest("hex");
}

function hexToString(hex) {
  if (!hex.match(/^[0-9a-fA-F]+$/)) {
    throw new Error('is not a hex string.');
  }
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  var bytes = [];
  for (var n = 0; n < hex.length; n += 2) {
    var code = parseInt(hex.substr(n, 2), 16)
    bytes.push(code);
  }
  return bytes;
}

function Password(password) {
  let pass = sha1(password)
  return Buffer.from(hexToString(pass), 'binary').toString('base64');
}

module.exports = Password;

function genRandomNumber(length) {
  var lengthTotal = length,
      charset = "0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < lengthTotal; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function genRandomString(length) {
  var lengthTotal = length,
      charset = "ABCDEFGHIJKLMNOPQRSTUVXYZ",
      retVal = "";
  for (var i = 0, n = charset.length; i < lengthTotal; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

module.exports = { genRandomNumber, genRandomString }
const rateLimit = require("express-rate-limit");

const promoCodeLimit = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 10
});

module.exports = { promoCodeLimit }
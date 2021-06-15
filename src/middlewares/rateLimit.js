const rateLimit = require("express-rate-limit");

const promoCodeLimit = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 10
});

const transferItems = rateLimit({
  windowMs: 30 * 60 * 1000, // 20 minutes
  max: 1,
  message: { ok: false, message: 'limit of requests' }
})

module.exports = { promoCodeLimit, transferItems }
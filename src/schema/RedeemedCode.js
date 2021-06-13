const mongoose = require('mongoose')
const { Schema } = mongoose;

const redeemedCodeSchema = new Schema({
  account_id:  String,
  redeemcode:  String,

});

const RedeemedCode = mongoose.model('RedeemedCode', redeemedCodeSchema);


module.exports = RedeemedCode
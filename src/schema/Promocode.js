const mongoose = require('mongoose')
const { Schema } = mongoose;

const promocodeSchema = new Schema({
  account_id:  String,
  promocode:  String,
  type:  String,
  value:  String,
  status: String,
  promote: String,
  quantity: Number,
  valid_at: String,
  created_at:  String,

});

const Promocode = mongoose.model('Promocode', promocodeSchema);


module.exports = Promocode
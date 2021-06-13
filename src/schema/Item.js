const mongoose = require('mongoose')
const { Schema } = mongoose;

const itemsSchema = new Schema({
  item_id:  Number,
  name:  String,
  icon_name:  String,
  description:  String,

});

const Item = mongoose.model('Item', itemsSchema);


module.exports = Item
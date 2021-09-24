const mongoose = require('mongoose')
const { Schema } = mongoose;

const useSchema = new Schema({
  name:  String,
  username:  String,
  password: String,
  email:   String,
  number:   String,
  phone: String,
  is_admin: Boolean,
  is_active: Boolean,
  active_code: String,
  banned: Boolean,
  recruit_friend_id: String,
  balance: Number,
  created_at: String,
  token: String,
  ip: String,
});

const User = mongoose.model('User', useSchema);


module.exports = User
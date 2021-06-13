const mongoose = require('mongoose')
const { Schema } = mongoose;

const useSchema = new Schema({
  name:  String,
  username:  String,
  password: String,
  email:   String,
  phone: String,
  is_admin: Boolean,
  banned: Boolean,
  recruit_friend_id: String,
  balance: Number,
  created_at: String,
  token: String,
  ip: String,
});

const User = mongoose.model('User', useSchema);


module.exports = User
const mongoose = require('mongoose')
const { Schema } = mongoose;

const referredFriendsSchema = new Schema({
  account_id:  String,
  referred_id:  String,
  created_at:  String,

});

const ReferredFriend = mongoose.model('ReferredFriend', referredFriendsSchema);


module.exports = ReferredFriend
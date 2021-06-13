require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.eo5d4.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});


module.exports = mongoose
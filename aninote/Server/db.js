const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/AniNote');
mongoose.set('strictQuery', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const ConnectToMongo =  db.once('open', function() {
  console.log("we're connected!");
});
module.exports = ConnectToMongo;

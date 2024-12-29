const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Path `username` is required.'],
    trim: true,
    unique: true
  }
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const contactShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
});

const Contact = mongoose.model('contact', contactShema);

module.exports = {
  Contact,
};

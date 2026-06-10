const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  office: {
    type: String,
  },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
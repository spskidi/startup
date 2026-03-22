const mongoose = require('mongoose');

const specificationTemplateSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  specs: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['text', 'dropdown', 'number', 'boolean'],
        default: 'text',
      },
      options: [String], // For dropdown type
      required: {
        type: Boolean,
        default: false,
      },
      order: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SpecificationTemplate', specificationTemplateSchema);

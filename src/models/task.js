const mongoose = require('mongoose');
const validator = require('validator');
const Task = mongoose.model('Task',{
  description:{
    type: String,
    requied: true,
    trim: true
  },
  completed:{
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    requied: true,
    ref: 'User'
  }
})

module.exports = Task;
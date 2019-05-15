const mongoose = require('mongoose');
const validator = require('validator');
const taskSchema = new mongoose.Schema({
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
},{
  timestamps: true
})
const Task = mongoose.model('Task',taskSchema);

module.exports = Task;
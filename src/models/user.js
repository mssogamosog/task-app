const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    requied: true,
  },
  email:{
    type: String,
    requied: true,
    unique: true,
    validate(value){
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email');
      }
    }
  },
  age:{
    type: Number,
    validate(value){
      if (value < 0) {
        throw new Error('Invalid Age');
      }
    }
  },
  password: {
    type:String,
    requied: true,
    minLength:7,
    trim: true,
    validate(value){
      if (value.toLowerCase().includes('password')) {
        throw new Error('Invalid password');
      }
    }
  },
  avatar:{
    type: Buffer
  },
  tokens:[{
    token: {
      type: String,
      required: true
    }
  }]
},{
  timestamps: true
});

userSchema.virtual('tasks',{
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
}

userSchema.statics.findByCredentials = async (email,password) => {

  const user  = await User.findOne({email});
  if (!user) {
    throw new Error('user or pasword incorrect');
  }
  const isMatch = await bcrypt.compare(password,user.password);
  if (!isMatch) {
    throw new Error('user or pasword incorrect');
  }
  return user;
}

userSchema.methods.generateToken = async function(){
  const user = this;
  const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn: '8 d'});
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}
userSchema.pre('save', async function (next){
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password,8);
  }
  next();
})
userSchema.pre('remove', async function (next){
  const user = this;
  Task.deleteMany({ owner: user._id});
  next();
})
const User = mongoose.model('User',userSchema)

module.exports = User;
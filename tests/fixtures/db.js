const jwt =  require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const userOneId = new mongoose.Types.ObjectId();
const UserOne = {
  _id: userOneId,
  name: 'mssg',
  email: 'mssg@io.ioo',
  password: 'Mypass123',
  tokens: [{
    token: jwt.sign({_id: userOneId},process.env.JWT_SECRET)
  }]
}

const userTwoId = new mongoose.Types.ObjectId();
const UserTwo = {
  _id: userTwoId,
  name: 'mssg2',
  email: 'mssg@io.iooo',
  password: 'Mypass123',
  tokens: [{
    token: jwt.sign({_id: userTwoId},process.env.JWT_SECRET)
  }]
}

const taskOne = {
  _id : new mongoose.Types.ObjectId(),
  completed: false,
  description: 'T1',
  owner: UserOne._id
}

const taskTwo = {
  _id : new mongoose.Types.ObjectId(),
  completed: true,
  description: 'T2',
  owner: UserOne._id
}

const taskThree = {
  _id : new mongoose.Types.ObjectId(),
  completed: false,
  description: 'T3',
  owner: UserTwo._id
}


const populateDb = async()=>{
  await User.deleteMany({});
  await Task.deleteMany({});
  await new User(UserOne).save();
  await new User(UserTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
}

module.exports = {
  userOneId,
  UserOne,
  populateDb,
  userTwoId,
  UserTwo,
  taskOne,
  taskTwo,
  taskThree
}
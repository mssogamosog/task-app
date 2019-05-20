const request = require('supertest')
const app = require('../src/app')
const jwt =  require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')
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

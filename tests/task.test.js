const request = require('supertest')
const app = require('../src/app')
const jwt =  require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')
const { userOneId ,UserOne , populateDb  , taskOne ,taskTwo,taskThree} = require('./fixtures/db')

beforeEach(async()=>{
  await populateDb()
})

test('Should create a task', async ()=>{

  const response = await request(app)
  .post('/tasks/')
  .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
  .send({
    completed: false,
    name: 'test'
  })
  .expect(201);
  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
})


test('Should return tasks', async ()=>{

  const response = await request(app)
  .get('/tasks/')
  .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
  .send()
  .expect(200);
  expect(response.body.length).toBe(2)
})

test('Should not delete a task', async ()=>{

  const response = await request(app)
  .delete('/tasks/' + taskThree._id)
  .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
  .send()
  .expect(404);

  const task = Task.findById(taskThree._id);
  expect(task).not.toBeNull();
})









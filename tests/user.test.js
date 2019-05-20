const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId ,UserOne , populateDb } = require('./fixtures/db')

beforeEach(async()=>{
  await populateDb()
})


test('Should singup with a new user',async () =>{
  const response =await request(app).post('/users').send({
    name: 'mssg',
    email: 'mssg@io.io',
    password: 'Mypass123'
  }).expect(201);
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()
})

test('Should login with an existing user',async () =>{
  const response = await request(app).post('/users/login').send({
    email: 'mssg@io.ioo',
    password: 'Mypass123'
  }).expect(200);
  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login with invalid credentials',async () =>{
  await request(app).post('/users/login').send({
    email: 'mssg@io.ioo',
    password: 'Mypass12'
  }).expect(401);
})

test('Should get user ',async () =>{
  await request(app)
  .get('/users/' + userOneId)
  .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
  .send()
  .expect(200);
})

test('Should not get user ',async () =>{
  await request(app)
  .get('/users/' + userOneId)
  .set('Authorization', `Bearer x.x.x`)
  .send()
  .expect(401);
})

test('Should not delete ',async () =>{
  await request(app)
  .delete('/users/' + userOneId)
  .set('Authorization', `Bearer x.x.x`)
  .send()
  .expect(401);
})

test('Should delete user ',async () =>{
  const response = await request(app)
  .delete('/users/' + userOneId)
  .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
  .send()
  .expect(200);
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})


test('Should upload avatar user ',async () =>{
  const response = await request(app)
  .post('/users/me/avatar')
  .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
  .attach('avatar','tests/fixtures/profile-pic.jpg')
  .send()
  .expect(200);
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update user ',async () =>{
  const response = await request(app)
  .put('/users/' + userOneId)
  .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
  .send({
    name: 'Jess'
  })
  .expect(200);
  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Jess')
})

test('Should not update user ',async () =>{
  const response = await request(app)
  .put('/users/' + userOneId)
  .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
  .send({
    location: 'Jess'
  })
  .expect(400);
})
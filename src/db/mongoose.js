const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex:true,
  useNewUrlParser:true,
  validateOptions:true
});

// const me = new User(
//   {
//     name: 'mssg',
//     age: 032,
//     password: 'Password'
//   }
// )
// me.save().then(() =>{
//   console.log(me);
// }).catch((error)=>{
//   console.log(error);
// })

// const task = new Task({
//   description: "asdas",
// })

// task.save().then(() =>{
//   console.log(task);
// }).catch((error)=>{
//   console.log(error);
// });
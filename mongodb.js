// const mongodb = require('mongodb');
// const MongoClient =  mongodb.MongoClient;

const {MongoClient , ObjectID} = require('mongodb');

const id = new ObjectID();

const conectionURL = 'mongodb://localhost:27017';
const databaseName = 'task-manager';
MongoClient.connect(conectionURL, {useNewUrlParser:true},(error,client) => {
  if (error) {
    console.log('Unable to connect');
    return;
  }
  const db = client.db(databaseName);
  // db.collection('tasks').insertMany([{description:'Mssg', completed: false},{description:'Mssg', completed: false},{description:'Mssg', completed: false}],(error,item)=>{
  //   if (error) {
  //     return console.log('Unable to insert');
  //   }
  //   console.log(item.ops);
  // });
});
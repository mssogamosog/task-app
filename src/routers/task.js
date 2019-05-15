const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');
router.post('/tasks',auth,async(req,res)=>{
  const tasks = new Task({...req.body,owner:res.user._id});
  try {
    await tasks.save();
    res.status(201).send(tasks);
  } catch (error) {
    res.status(400).send({error});
  }
})

router.get('/tasks',auth,async (req,res)=>{
  const match = {};
  const sort = {};
  const completedParam = req.query.completed;
  const sortByParam = req.query.sortBy;
  if (sortByParam) {
    const parts = sortByParam.split('_');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;  
  }
  if (completedParam) {
    switch (completedParam) {
      case 'true':
        match.completed = true
        break;
      case 'false':
        match.completed = false
        break;
      default:
        break;
    }
  }
  try {
    const user = res.user;
    await user.populate({
      path: 'tasks',
      match,
      options:{
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    //const tasks = await Task.find();
    const tasks = user.tasks;
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({error});
  }
})
router.get('/tasks/:id',auth ,async (req,res)=>{
  try {
    const task = await Task.findOne({'_id': req.params.id , 'owner': res.user._id});
    if (task) {
      res.status(200).send(task);
      return;
    }
    res.status(404).send({error: 'not found'});
  } catch (error) {
    
  }
})

router.put('/tasks/:id', auth, async (req,res)=>{
  const updates = Object.keys(req.body);
  const allowedFields  = ['completed','description'];
  const isValidField = updates.every(update => allowedFields.indexOf(update) !== -1);
  if (!isValidField) {
    res.status(400).send({error: 'invalid fields'});
    return;
  }
  try {
    const task = await Task.findOne({'_id':req.params.id, 'owner': res.user._id});
    if (!task) {
      res.status(404).send(); 
      return;
    }
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.status(200).send(task);
    //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
  } catch (error) {
    res.status(400).send({error});
  }
})

router.delete('/tasks/:id',auth, async (req,res)=>{

  try {
    const task = await Task.findOneAndDelete({'_id':req.params.id, 'owner': res.user._id});
    if (task) {
      res.status(200).send(task);
      return;
    }
    res.status(404).send();
  } catch (error) {
    res.status(500).send({error});
  }
})

module.exports = router;
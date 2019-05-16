const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
router.post('/users',async (req,res)=>{
  const user = new User(req.body);
  console.log(req.body);
  try {
    await user.save();
    const token = await user.generateToken();
    res.status(201).send({user,token});
  } catch (error) {
    res.status(400).send({error});
  }
  
})
router.get('/users',auth, async (req,res)=>{
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({error});
  }
})

router.get('/users/:id',auth,async (req,res)=>{
  try {
    const user = await User.findOne({'_id': req.params.id});
    if (user) {
      res.status(200).send(user);
      return;
    }
    res.status(404).send('not found');
  } catch (error) {
    res.status(500).send({error});
  }
})

router.put('/users/:id', auth,async (req,res)=>{
  const updates = Object.keys(req.body);
  const allowedFields  = ['name','email','password', 'age'];
  const isValidField = updates.every(update => allowedFields.indexOf(update) !== -1);
  if (!isValidField) {
    res.status(400).send({error: 'invalid fields'});
    return;
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send(); 
      return;
    }
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.status(200).send(user);
    //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
  } catch (error) {
    res.status(400).send({error});
  }
})

router.delete('/users/:id',auth, async (req,res)=>{

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).send(user);
      return;
    }
    res.status(404).send();
  } catch (error) {
    res.status(500).send({error});
  }
})

router.post('/users/login',  async (req,res)=>{

  try {
    const user = await User.findByCredentials(req.body.email,req.body.password);
    const token = await user.generateToken();
    res.status(200).send({token});
  } catch (error) {
    res.status(500).send(error); 
  }
})


router.post('/users/logout',auth,  async (req,res)=>{
  try {
    res.user.tokens = res.user.tokens.filter((token)=>token.token !== res.token);
    await res.user.save();

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error); 
  }
})

router.post('/users/logoutall',auth,  async (req,res)=>{
  try {
    res.user.tokens = [];
    await res.user.save();

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error); 
  }
})

const upload = multer({
  limits:{
    fileSize: 1000000
  },
  fileFilter(req,file,cb){
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      cb(new Error('File must be an image'));
    }
    cb(undefined,true);
  }
})

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res)=>{
  res.user.avatar = req.file.buffer ;
  await res.user.save();
  res.send();
},(error,req,res,next)=>{
  res.status(400).send({error:error.message});
})

router.delete('/users/me/avatar',auth, async (req,res)=>{
  res.user.avatar =  undefined;
  await res.user.save();
  res.send();
},(error,req,res,next)=>{
  res.status(400).send({error:error.message});
})
module.exports = router;
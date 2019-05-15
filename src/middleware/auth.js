const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const payload = jwt.verify(token,'sdfadfad');
    const user = await User.findOne({_id: payload._id, 'tokens.token': token});
    
    if (!user) {
      res.status(401).send({error: 'unauthorized'});
      return;
    }
    res.user = user;
    res.token = token;
  } catch (error) {
    res.status(401).send({error: 'unauthorized'});
    return;
  }
  next();
}

module.exports = auth;
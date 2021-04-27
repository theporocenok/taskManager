import Associations from './../models/Associations.js';
import jwt from 'jsonwebtoken';

let User = Associations.User;

export default async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    let decoded = jwt.verify(token, process.env.SECRET_key);
    let authUser = await User.findUser(decoded);
    res.locals.user = authUser;
    next();
  }catch(e) {
    wrongToken(res, { message: 'Wrong token' });
    next(e);
  }
}

function wrongToken(res, err) {
  res
    .status(401)
    .json({
      message: err.message,
    })
    .end();
}
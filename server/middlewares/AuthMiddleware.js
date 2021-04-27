import Associations from './../models/Associations.js';
import jwt from 'jsonwebtoken';

let User = Associations.User;

export default (req, res, next) => {
  if (!!!req.cookies.jwt) {
    wrongToken(res, { message: 'Empty token' });
    return;
  }

  let token = req.cookies.jwt;
  jwt.verify(token, process.env.SECRET_key, async (err, decoded) => {
    if (err) {
      console.error('Verify jwt token error: ', err);
      wrongToken(res, err);
      return;
    }

    let authUser = await User.findOne({
      where: {
        login: decoded.login,
        createdAt: decoded.createdAt,
      }
    });
    if (!!!authUser) {
      wrongToken(res, { message: 'Пользователя с такими данными не существует' });
      return;
    }
    next();
  });
}

function wrongToken(res, err) {
  res
    .status(401)
    .json({
      message: err.message,
    })
    .end();
}
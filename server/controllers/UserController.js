import Associations from './../models/Associations.js';
import jwt from 'jsonwebtoken';

let User = Associations.User;

let errHandler = (e) => {
  console.error('Error', e);
}

export async function login(req, res, next) {
  let user = await User.findUser(req.body);

  if (!!!user) {
    res.status(403).json({
      message: 'Пользователя с таким логином не существует',
    });
    next();
    return;
  }

  if (!user.correctPassword(req.body.password)) {
    res.status(403).json({
      message: 'Пользователь ввел неверный пароль',
    });
    next();
    return;
  }

  let token = jwt.sign({
    login: user.login,
    createdAt: user.createdAt,
  }, process.env.SECRET_key);

  res
    .cookie('jwt', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
    .status(200)
    .json({
      token
    });

  next();
}

export async function register(req, res, next) {
  let user = await User.create({
    name: req.body.name,
    surname: req.body.surname,
    secondName: req.body.secondName,
    login: req.body.login,
    password: req.body.password,
    leaderId: req.body.leaderId,
  })
    .catch(errHandler);

  let token = jwt.sign({
    login: user.login,
    createdAt: user.createdAt,
  }, process.env.SECRET_key);
  res
    .cookie('jwt', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
    .status(200)
    .json({
      token,
    });
  next();
}

export async function logout(req, res, next) {
  res
    .cookie('jwt', '', { maxAge: 0 })
    .status(200)
    .send();
  next();
}

export async function getSubordinatesList(req, res, next) {
  let subordinatesList = await res.locals.user.getSubordinates(['id', 'name']);
  res.status(200).json({
    subordinates: subordinatesList
  });
  next();
}

export default {login, register, getSubordinatesList, logout};
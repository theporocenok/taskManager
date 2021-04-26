import Associations from './../models/Associations.js';

let Task = Associations.Task;

export function getAll(req, res, next) {
  res.status(200).json({
    message: '',
  });
  next();
}

export function create(req, res, next) {
  res.status(200).json({
    message: 'temp message for tasks post',
  });
  next();
}

export function update(req, res, next) {
  res.status(200).json({
    message: 'temp message for tasks update',
  });
  next();
}

export function remove(req, res, next) {
  res.status(200).json({
    message: 'temp message for tasks remove',
  });
  next();
}

export default {getAll, create, update, remove};
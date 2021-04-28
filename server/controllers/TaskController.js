import Associations from './../models/Associations.js';

let Task = Associations.Task;

let errHandler = (e) => {
  console.error('Error', e);
}

export async function getAll(req, res, next) {
  let user = res.locals.user;
  res.status(200).json({
    data: await user.getSubordinatesTasks(req.body.filters),
  });
  next();
}

export async function create(req, res, next) {
  try {
    let creator = res.locals.user;
    let task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      expirationDate: req.body.expirationDate,
      priority: req.body.priority,
      status: req.body.status,
      creatorId: creator.dataValues.id,
      responsibleId: req.body.responsibleId,
    })
      .catch(errHandler);
    if (!!task) {
      res.status(201).send();
    }
    next();
  }catch (e) {
    res.status(400);
    next(e);
  }
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
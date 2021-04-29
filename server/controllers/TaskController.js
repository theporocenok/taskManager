import Associations from './../models/Associations.js';

let Task = Associations.Task;

let errHandler = (e) => {
  console.error('Error', e);
}

export async function getAll(req, res, next) {
  let user = res.locals.user;
  res.status(200).json({
    data: await user.getSubordinatesTasks({
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      subordinate: req.query.subordinate
    }),
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

export async function update(req, res, next) {
  try {
    let creator = res.locals.user;
    let task = await Task.update({
      title: req.body.title,
      description: req.body.description,
      expirationDate: req.body.expirationDate,
      priority: req.body.priority,
      status: req.body.status,
      creatorId: creator.dataValues.id,
      responsibleId: req.body.responsibleId,
    }, {
      where: {
        id: req.params.id
      }
    })
      .catch(errHandler);
    if (!!task) {
      res.status(204).send();
    }
    next();
  }catch (e) {
    res.status(400);
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await Task.destroy( {
      where: {
        id: req.params.id
      }
    })
      .catch(errHandler);

    res.status(204).send();
    next();
  }catch (e) {
    res.status(400);
    next(e);
  }
}

export default {getAll, create, update, remove};
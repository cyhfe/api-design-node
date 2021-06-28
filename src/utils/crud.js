const removeOne = model => {
  return async(req, res) => {
    try {
      const doc = await model
      .findOne({ createdBy: req.user._id, _id: req.params.id })
      .lean()
      .exec()
      
    if (!doc) {
      return res.status(400).end()
    }
    res.status(200).json({ data: doc })
    } catch (e) {
      console.error(e)
      res.status(400).end()
    }
  }
}

const crudControllers = (model) => {
  return {
    removeOne: removeOne(model),
    updateOne: updateOne(model),
    getMany: getMany(model),
    getOne: getOne(model),
    createOne: createOne(model),
  };
};

module.exports = {
  crudControllers,
};

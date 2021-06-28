const {
  getOne,
  createOne,
  updateOne,
  removeOne,
} = require('./item.comtrollers');
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(getOne)
  .post(createOne);

router
  .route('/:id')
  .get(getOne)
  .put(updateOne)
  .delete(removeOne);

module.exports = router;

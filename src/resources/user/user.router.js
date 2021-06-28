const express = require('express')
const controllers = require('./user.controllers')
const { modelName } = require('./user.model')

const router = express.Router()

router.get('/', controllers.me)
router.put('/', controllers.updateMe)

module.exports = router
const express = require('express')
const route = express.Router()

const controller = require('./src/controlles/controller.js')

route.get('/users/:id', controller.getUser)
route.get('/users', controller.getUsers)
route.post('/users', controller.createUser)
route.put('/users/:id', controller.updateUser)
route.delete('/users/:id', controller.deletedUser)
route.delete('/users', controller.deletedUserAll)

module.exports = route
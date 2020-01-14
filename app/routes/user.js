const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const UserController            = require('../controllers/users.controller')

router
    .all('/*', authentication)
    .get('/detailUser', UserController.getUserDetail)
    .get('/', UserController.getUsersDataController)
    .get('/:ID', UserController.getUsersDataByIDController)
    .post('/crud', UserController.createUpdateUsersDataController)

module.exports = router

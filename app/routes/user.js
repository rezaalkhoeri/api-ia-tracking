const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const UserController            = require('../controllers/users.controller')

router
    .all('/*', authentication)
    .get('/detailUser', UserController.getUserDetail)
    .get('/', UserController.getUsersDataController)
    .post('/crud', UserController.insertUsersDataController)

module.exports = router

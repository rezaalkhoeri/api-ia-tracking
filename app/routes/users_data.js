const express                   = require('express')
const router                    = express.Router()
const { authentication }  = require('../middleware/auth.middleware')
const UsersDataController       = require('../controllers/users_data.controller')

router
    .all('/*', authentication )
    .get('/', UsersDataController.getUsersDataController)
    .post('/insert', UsersDataController.postUsersDataController)
    .post('/update', UsersDataController.updateUsersDataController)
    .post('/delete', UsersDataController.deleteUsersDataController)
    .post('/activate', UsersDataController.activateUsersDataController)

module.exports = router

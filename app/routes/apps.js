const express                   = require('express')
const router                    = express.Router()
const { authentication }  = require('../middleware/auth.middleware')
const AppDataController       = require('../controllers/apps.controller')

router
    .all('/*', authentication)
    .get('/', AppDataController.getAppDataController)

    // .post('/insert', UsersDataController.postUsersDataController)
    // .post('/update', UsersDataController.updateUsersDataController)
    // .post('/delete', UsersDataController.deleteUsersDataController)
    // .post('/activate', UsersDataController.activateUsersDataController)

module.exports = router

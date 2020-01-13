const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const UserController            = require('../controllers/users.controller')

router
    .all('/*', authentication)
    .get('/', UserController.getUserDetail)

module.exports = router

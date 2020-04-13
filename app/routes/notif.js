const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const EmailController           = require('../controllers/email.controller')

router
    .all('/*', authentication)
    .post('/email', EmailController.findRecipient, EmailController.sendData)

module.exports = router
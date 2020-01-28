const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const TLController              = require('../controllers/tindak_lanjut.controller')

router
    .all('/*', authentication)
    .post('/auditee', TLController.auditeeTLController)

module.exports = router
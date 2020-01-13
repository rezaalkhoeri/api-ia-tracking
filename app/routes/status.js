const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const StatusController           = require('../controllers/Status.controller')

router
    .all('/*', authentication)
    .get('/', StatusController.getStatusController)

module.exports = router
const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const PICController             = require('../controllers/PIC.controller')

router
    .all('/*', authentication)
    .get('/', PICController.getPICController)
    .get('/:ID', PICController.getPICByIDController)
    .post('/create-update', PICController.postPICController)

module.exports = router
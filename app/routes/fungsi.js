const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const FungsiController           = require('../controllers/Fungsi.controller')

router
    .all('/*', authentication)
    .get('/', FungsiController.getFungsiController)
    .get('/:ID', FungsiController.getFungsiByIDController)
    .post('/crud', FungsiController.postFungsiController)

module.exports = router
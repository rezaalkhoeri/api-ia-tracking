const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const FungsiController           = require('../controllers/Fungsi.controller')

router
    .all('/*', authentication)
    .get('/subfungsi', FungsiController.getSubFungsiController)
    .get('/subfungsi/:ID', FungsiController.getSubFungsiByIDController)
    .post('/subfungsi/crud', FungsiController.postSubFungsiController)

    .get('/', FungsiController.getFungsiController)
    .get('/:ID', FungsiController.getFungsiByIDController)
    .post('/crud', FungsiController.postFungsiController)

module.exports = router
const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const FungsiController           = require('../controllers/Fungsi.controller')

router
    .all('/*', authentication)
    .get('/', FungsiController.getFungsiController)

module.exports = router
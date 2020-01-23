const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const LHAController       = require('../controllers/LHA.controller')

router
    .all('/*', authentication)
    .post('/', LHAController.getLHAController)
    .post('/getByID', LHAController.getLHAbyIDController)
    .post('/temuanRekomendasi', LHAController.getTemuanController)
    // .post('/rekomendasi', LHAController.getRekomendasiController)
    .post('/search', LHAController.searchLHAController)

module.exports = router
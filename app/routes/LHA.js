const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const LHAController       = require('../controllers/LHA.controller')

router
    .all('/*', authentication)
    .post('/', LHAController.getLHAController)
    .post('/getLHAdata', LHAController.getLHAdataController)
    .post('/getByID', LHAController.getLHAbyIDController)
    .post('/temuanRekomendasi', LHAController.getTemuanController)
    .post('/getTemuanByID', LHAController.getTemuanbyIDController)
    .post('/getRekomendasiByID', LHAController.getRekomendasibyIDController)
    .post('/rekomendasi', LHAController.getRekomendasiController)
    .post('/search', LHAController.searchLHAController)
    .post('/editFungsiRekomendasi', LHAController.editPICfungsiController)

module.exports = router
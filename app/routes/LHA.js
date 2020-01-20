const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const LHAController       = require('../controllers/LHA.controller')

router
    .all('/*', authentication)
    .get('/', LHAController.getLHAController)
    .post('/temuan', LHAController.getTemuanController)
    // .post('/rekomendasi', LHAController.getRekomendasiController)
    .post('/search', LHAController.searchLHAController)

module.exports = router
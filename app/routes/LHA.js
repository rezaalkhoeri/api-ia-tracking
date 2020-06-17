const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const LHAController       = require('../controllers/LHA.controller')
const LogActivityController       = require('../controllers/log_activity.controller')

router
    .all('/*', authentication)
    .post('/', LHAController.getLHAController)
    .post('/getLHAdata', LHAController.getLHAdataController)
    .post('/getByID', LHAController.getLHAbyIDController)
    .post('/temuanRekomendasi', LHAController.getTemuanController)
    .post('/getTemuanByID', LHAController.getTemuanbyIDController)
    .post('/getRekomendasiByID', LHAController.getRekomendasibyIDController)
    .post('/getRekomendasiByIDLHA', LHAController.getRekomendasibyIDLHAController)
    .post('/rekomendasi', LHAController.getRekomendasiController)
    .post('/search', LHAController.searchLHAController)
    .post('/editRekomendasi', LHAController.editRekomendasiController)
    .post('/editDueDate', LHAController.editDueDateController)
    .post('/logActivity', LogActivityController.getLogActivity)
    .post('/deleteLHA', LHAController.deleteLHAController)

module.exports = router
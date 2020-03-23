const express = require('express')
const router = express.Router()
const { authentication } = require('../middleware/auth.middleware')
const DashboardController = require('../controllers/dashboard.controller')
const LogActivityController = require('../controllers/log_activity.controller')

router
    .all('/*', authentication)
    .post('/summaryByLHA', DashboardController.getSummaryByIdLHAController)
    .post('/getAll', DashboardController.getAllLHAController)
    .post('/getByUserFungsi', DashboardController.getByUserFungsiController)
    .post('/recentActivity', LogActivityController.recentActivityLHAController)

module.exports = router
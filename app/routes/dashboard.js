const express = require('express')
const router = express.Router()
const { authentication } = require('../middleware/auth.middleware')
const DashboardController = require('../controllers/dashboard.controller')

router
    .all('/*', authentication)
    .post('/summaryByLHA', DashboardController.getSummaryByIdLHAController)

module.exports = router
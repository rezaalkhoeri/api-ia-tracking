const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const CreateLHAController       = require('../controllers/createLHA.controller')

router
    .all('/*', authentication)
    .post('/', CreateLHAController.createLHAController)

module.exports = router
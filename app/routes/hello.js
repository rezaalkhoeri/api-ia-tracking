const express                   = require('express')
const router                    = express.Router()
const { helloWorldMiddleware }  = require('../middleware/hello.middleware')
const HelloController           = require('../controllers/hello.controller')

router
    .all('/*', helloWorldMiddleware)
    .get('/', HelloController.getHelloController)
    .post('/posthello', HelloController.postHelloController)

module.exports = router
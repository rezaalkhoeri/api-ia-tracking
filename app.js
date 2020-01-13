/**
 * --------------------------------
 * Author Name  : ICT Team 2019
 * Created Date : 10 July 2019
 * Version      : 1.0
 * --------------------------------
 */

 require('dotenv').config()

// declare library require
const express       = require('express')
const cors          = require('cors')
const yes           = require('yes-https')
const bodyParser    = require('body-parser')
const config        = process.env
const app           = express()
const swaggerUi     = require('swagger-ui-express')
const YAML          = require('yamljs')
const usersSwagger  = YAML.load(process.cwd() + '/app/apidocs-documents/users.yaml')

const expiredTime   = 7*24*60*60*1000; //7 hari

app.use(yes())

// variable global config, use and call from controller or lib or helper and etc
global.CONFIG  = {
    // general configuration
    API_VERSION: config.API_VERSION,
    BASE_URL: config.API_ENVIRONMENT === 'local_development' ? `http://${config.BASE_URL}:${config.PORT}` : `https://${config.BASE_URL}`,
    MAINTENANCE: config.API_MAINTENANCE == 'TRUE',
    ENVIRONMENT: config.API_ENVIRONMENT,
    TOKEN_SECRET: config.TOKEN_SECRET,
    TOKEN_EXPIRATION: expiredTime,
    SECRET_MILITARY_ZONE: config.MILITARY_ZONE,
    MANDRILL_API_KEY: config.API_MANDRILL,

    // port configuration
    PORT: config.PORT,

    // DB configuration
    DB_HOST: (config.API_ENVIRONMENT == 'production' ? config.DB_PROD_HOST : (config.API_ENVIRONMENT == 'staging' ? config.DB_STAG_HOST : config.DB_DEV_HOST)),
    DB_USER: (config.API_ENVIRONMENT == 'production' ? config.DB_PROD_USER : (config.API_ENVIRONMENT == 'staging' ? config.DB_STAG_USER : config.DB_DEV_USER)),
    DB_PASS: (config.API_ENVIRONMENT == 'production' ? config.DB_PROD_PASS : (config.API_ENVIRONMENT == 'staging' ? config.DB_STAG_PASS : config.DB_DEV_PASS)),
    DB_NAME: (config.API_ENVIRONMENT == 'production' ? config.DB_PROD_NAME : (config.API_ENVIRONMENT == 'staging' ? config.DB_STAG_NAME : config.DB_DEV_NAME)),
    CONNECTION_LIMIT: config.CONNECTION_LIMIT
}

// package for providing a Connect/Express middleware
app.options('*', cors())
app.use(cors())

// disable header for security issue
app.disable('X-Powered-By')
app.disable('x-powered-by')

//enable read body parser json and url encoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// set header and method allowed
app.options('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Authentication, Content-Length, X-Requested-With')
    
    // intercepts OPTIONS method
    if (req.method === 'OPTIONS') {
        // respond with 200
        res.send(200)
    } else {
        // move on
        next()
    }
})

// import all routes
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(usersSwagger))
require('./app/routes')(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Your request is not Found')
    err.status = 404
    next(err)
})

app.use(function (err, req, res, next) {
    res
        .status(err.status || 400)
        .send({
            error: config.API_ENVIRONMENT === 'development' ||  config.API_ENVIRONMENT === 'local_development' ? err.message : 'Something Wrong from your request'
        })
})

process.on('uncaughtException', (err) => {
    console.error(new Date() + ' uncaughtException: ', err.message)
    console.error(err.stack)
})

const server    = app.listen(config.PORT || 1929, config.BASE_URL, function () {
    console.log('======================================');
    console.log('       App listening on port %s', server.address().port);
    console.log('       Press Ctrl+C to quit.');
    console.log('======================================');
});

module.exports = app
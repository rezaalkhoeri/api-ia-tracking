const jwt       = {}
const nJwt      = require('njwt')
const crypto    = require('crypto')
const log       = 'Library JWT'

jwt.encryptPassword = function (password) {
    return new Promise(function(resolve, reject) {
        try {
            console.log(`|-- ${log} : Generate Token JWT`)
            var hash = crypto.createHmac('sha512', CONFIG.SECRET_MILITARY_ZONE) /** Hashing algorithm sha512 */
            hash.update(password)
            let passwordHash = hash.digest('hex')
            
            resolve(passwordHash)
        } catch(error) {
            console.log('|-- Error exception encrypt JWT :' + error)
            reject({
                'errorResp' : 500, 
                'errorCode' : '15',
                'errorMsg'  : 'Error generate encrypt password - ' + error.code
            })
        }
    });
}

jwt.generateToken = function(userObject) {
    return new Promise(async function(resolve, reject){
        try {
            console.log(`|-- ${log} : Generate Token JWT`)
            let jwt = nJwt.create(userObject, CONFIG.TOKEN_SECRET)
            jwt.setExpiration(new Date().getTime() + CONFIG.TOKEN_EXPIRATION)

            let token = jwt.compact()
            resolve(token)
        } catch(error) {
            console.log('|-- Error exception JWT :' + error)
            reject({
                'errorResp' : 500, 
                'errorCode' : '15',
                'errorMsg'  : 'Error generate new jwt token - ' + error.code
            })
        }
    })
}

module.exports = jwt
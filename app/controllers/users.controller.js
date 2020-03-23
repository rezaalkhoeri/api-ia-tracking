const UsersController                       = {}
const nJwt = require('njwt')
const rp                                    = require('request-promise')
const randomstring                          = require("randomstring")
const UsersModel                            = require('../models/users.model')
const parseResponse                         = require('../helpers/parse-response')
const { generateToken, encryptPassword }    = require('../lib/jwt')
const partnersApi                           = require('../helpers/partner-api')
const log                                   = 'User controller'

UsersController.login = async(req, res, next) => {
    console.log(`├── ${log} :: Login User and Generate Token`);

    try {
        let {
            email,
            password
        } = req.body

        let statusCode      = 200
        let responseCode    = 00
        let message         = 'Login Success'
        let acknowledge     = true
        let result          = null

        let pwdEncrypt      = await encryptPassword(password)


        // check table ms_it_personal_data
        // if ZTIPE eq L (LDAP) then check userexistLDAP ? generate token
        // else not user LDAP then cek database table ms_it_personal_data and check password encrypt

        let where       = [{ key: 'Email', value: email }]
        let users_tbl   = await UsersModel.getBy('*', where)

        let token       = ''

        if (users_tbl.Email !== undefined) {
            //check user via LDAP
            const emailParam    = users_tbl.Email.split('@')
            const options       = {
                method: 'POST',
                url: partnersApi.ldapService.login,
                body: {
                    username: emailParam[0],
                    password: password,
                    method: 'login'
                },
                json: true,
            }

            const ldap = await rp(options)

            if (ldap != null) {
                let validatorsRandom = randomstring.generate()
                let userData         = [{ key: 'Validator', value : validatorsRandom }]
                let condition        = [{ key: 'Email', value: users_tbl.Email }]

                if (ldap.Status == '00') {
                    //save validator random
                    await UsersModel.save(userData, condition)
                    let userObj = {
                        userid: users_tbl.UserID,
                        name: users_tbl.Name,
                        nopek: users_tbl.Nopek,
                        email: users_tbl.Email,
                        role: users_tbl.Role,
                        status: users_tbl.StatusUser,
                        idFungsi: users_tbl.ID_FUNGSI,
                        validator: validatorsRandom
                    }
                    token = await generateToken(userObj)

                    result = {
                        token: token,
                        userid: users_tbl.UserID,
                        name: users_tbl.Name,
                        nopek: users_tbl.Nopek,
                        email: users_tbl.Email,
                        role: users_tbl.Role,
                        status: users_tbl.StatusUser,
                        idFungsi: users_tbl.ID_FUNGSI
                    }
                } else {
                    //check user from manual lookup table on database
                    let options     = [
                                        { key: 'Email', value: email },
                                        { key: 'Password', value: pwdEncrypt }
                                    ]
                    let userCheck   = await UsersModel.getBy('*', options)

                    if (userCheck.Email !== undefined) {
                        if (userCheck.StatusUser !== '0') {
                            //save validator random
                            await UsersModel.save(userData, condition)
                            // login success
                            let userObj = {
                                userid: users_tbl.UserID,
                                name: users_tbl.Name,
                                nopek: users_tbl.Nopek,
                                email: users_tbl.Email,
                                role: users_tbl.Role,
                                status: users_tbl.StatusUser,    
                                idFungsi: users_tbl.ID_FUNGSI,
                                validator: validatorsRandom
                            }
                            token = await generateToken(userObj)

                            result = {
                                token: token,
                                userid: users_tbl.UserID,
                                name: users_tbl.Name,
                                nopek: users_tbl.Nopek,
                                email: users_tbl.Email,
                                role: users_tbl.Role,
                                status: users_tbl.StatusUser,    
                                idFungsi: users_tbl.ID_FUNGSI
                            }
                        } else {
                            // login not authorize
                            statusCode      = 200
                            responseCode    = '45'
                            message         = 'Login Not Authorized, Account Is Nonactive'
                            acknowledge     = false
                            result          = null                            
                        }
                    } else {
                        // login not authorize
                        statusCode      = 200
                        responseCode    = '05'
                        message         = 'Login Not Authorized, Password Incorrect'
                        acknowledge     = false
                        result          = null
                    }
                }
            } else {
                // return LDAP Service null
                statusCode      = 200
                responseCode    = '99'
                message         = 'Error return response LDAP Service'
                acknowledge     = false
                result          = null
            }
        } else {
            // login not authorize
            statusCode      = 200
            responseCode    = '05'
            message         = 'Login Not Authorized, User not exist'
            acknowledge     = false
            result          = null
        }

        // return response
        res.status(statusCode).send(
            parseResponse(acknowledge, result, responseCode, message)
        )
    } catch (error) {
        console.log('Error exception :' + error)

        res.status(200).send(
            parseResponse(false, null, '500', error)
        )

        // let resp = parseResponse(false, null, '500', error)
        // next({
        //     resp,
        //     status: 200
        // })
    }
}

UsersController.getUserDetail = async (req, res, next) => {
    try {
        const { currentUser : { body : { email : email } } } = req
        let options     = [
            { key: 'Email', value: email }
        ]
        let userCheck   = await UsersModel.getBy('*', options)

        // return response
        res.status(200).send(
            parseResponse(true, userCheck, '00', 'Get User Controller Success')
        )
    } catch(error) {

    }
}

UsersController.getUsersDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Users Data Controller`);

    try{
        let sql = `SELECT * FROM user JOIN tblm_fungsi ON tblm_fungsi.ID_FUNGSI = user.ID_FUNGSI`
        let getUsers = await UsersModel.QueryCustom(sql);

        // success
        res.status(200).send(
            parseResponse(true, getUsers.rows, '00', 'Get Users Data Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

UsersController.getUsersDataByIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Users Data By ID Controller`);

    try{
        let id = req.params.ID
        let where = [{ key: 'ID', value: id }]

        let sql = await UsersModel.getAll('*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Users By ID Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}


UsersController.createUpdateUsersDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Create Update Users Data Controller`);

    try {        
        let { action, user_id, password, name, nopek, jabatan, perusahaan, email, role, fungsi } = req.body

        if (action == 'create') {
            let condition = [{key:'UserID', value:user_id}]
            let cekUser = await UsersModel.getAll('*', condition)

            if (! cekUser.length > 0) {
                let where = [{ key: 'Email', value: email }]
                let cekEmail = await UsersModel.getAll('*', where)

                if (!cekEmail.length > 0) {
                    let pwdEncrypt = await encryptPassword(password);

                    let data = [
                        { key: 'UserID', value: user_id },
                        { key: 'Password', value: pwdEncrypt },
                        { key: 'Name', value: name },
                        { key: 'Nopek', value: nopek },
                        { key: 'Jabatan', value: jabatan },
                        { key: 'Perusahaan', value: perusahaan },
                        { key: 'Email', value: email },
                        { key: 'Role', value: role },
                        { key: 'ID_FUNGSI', value: fungsi },
                        { key: 'StatusUser', value: '1' },
                    ]

                    let insert = await UsersModel.save(data);
                    if (insert.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Insert Users Data Controller Success')
                        )
                    }        
                } else {
                    statusCode = 200
                    responseCode = '44'
                    message = 'Email Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }                
            } else {
                statusCode = 200
                responseCode = '44'
                message = 'User Already Exist'
                acknowledge = false
                result = null

                // return response
                res.status(statusCode).send(
                    parseResponse(acknowledge, result, responseCode, message)
                )
            }
        } else if (action == 'update') {
            let { id, status } = req.body
            let condition = [{key:'ID', value:id}]
            let oldEmail = await UsersModel.getAll('Email', condition)

            console.log(oldEmail[0].Email);
            
            if (email == oldEmail[0].Email) {
                let where = [{ key: 'ID', value: id }]
                let data = [
                    { key: 'Name', value: name },
                    { key: 'Nopek', value: nopek },
                    { key: 'Jabatan', value: jabatan },
                    { key: 'Perusahaan', value: perusahaan },
                    { key: 'Email', value: email },
                    { key: 'Role', value: role },
                    { key: 'ID_FUNGSI', value: fungsi },
                    { key: 'StatusUser', value: status },
                ]

                let update = await UsersModel.save(data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Users Data Controller Success')
                    )
                }
            } else {
                let where = [{ key: 'Email', value: email }]
                let cekEmail = await UsersModel.getAll('*', where)

                if (!cekEmail.length > 0) {
                    let where = [{ key: 'ID', value: id }]
                    let data = [
                        { key: 'Name', value: name },
                        { key: 'Nopek', value: nopek },
                        { key: 'Jabatan', value: jabatan },
                        { key: 'Perusahaan', value: perusahaan },
                        { key: 'Email', value: email },
                        { key: 'Role', value: role },
                        { key: 'ID_FUNGSI', value: fungsi },
                        { key: 'StatusUser', value: status },
                    ]

                    let update = await UsersModel.save(data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Users Data Controller Success')
                        )
                    }
                } else {
                    statusCode = 200
                    responseCode = '44'
                    message = 'Email Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }
        } else if (action == 'delete'){
            let { id } = req.body
            let condition = [{key:'ID', value:id}]
            let hapus = await UsersModel.delete(condition)

            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, null, '00', 'Delete Users Data Controller Success')
                )
            }
            
        } else {
            statusCode      = 200
            responseCode    = '404'
            message         = 'Request Not Found'
            acknowledge     = false
            result          = null
            
            // return response
            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )
        }

    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

UsersController.logoutUsersDataController = async (req, res, next) => {
    console.log(`├── ${log} :: User Logout`);
    try {
        let { key } = req.body

        let statusCode = 200
        let responseCode = '00'
        let message = 'Logout Success'
        let acknowledge = true
        let result = null

        if (key) {
            await nJwt.verify(key, CONFIG.TOKEN_SECRET, function (err, verifiedToken) {
                if (err) {
                    res.status(200).send(
                        parseResponse(false, [], '90', `Error Verify JWT : ${err}`)
                    )
                } else {
                    const jsonToken = JSON.stringify(verifiedToken)
                    req.currentUser = JSON.parse(jsonToken)
                    email = req.currentUser.body.email

                    let userData = [{ key: 'VALIDATOR', value: "RESET" }]
                    let condition = [{ key: 'EMAIL', value: email }]

                    UsersModel.save(userData, condition)

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            })            
        } else {
            res.status(200).send(
                parseResponse(false, [], '99', 'There is Authentication Token not given')
            )
        }

    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}


module.exports = UsersController

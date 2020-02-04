const UsersController                       = {}
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
        let sql = await UsersModel.getAll('*', []);

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Users Data Controller Success')
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
        let { action, password, name, nopek, jabatan, perusahaan, email, role } = req.body

        if (action == 'create') {
            let max = await UsersModel.QueryCustom('SELECT MAX(UserID) AS max_id FROM user');

            if (max.count > 1) {
                let value =  max.rows[0].max_id;
                let number = value.substr(1,7)
                let angka = parseInt(number)
                let n = angka + 1

                let output = [], padded;
                for (i=n; i<=n; i++) {
                    padded = ('00000'+i).slice(-10);
                    output.push(padded);
                }  

                let userId = 'U'+output
                let pwdEncrypt = await encryptPassword(password);

                let data = [
                    {key : 'UserID', value : userId},
                    {key : 'Password', value : pwdEncrypt},
                    {key : 'Name', value : name},
                    {key : 'Nopek', value : nopek},
                    {key : 'Jabatan', value : jabatan},
                    {key : 'Perusahaan', value : perusahaan},
                    {key : 'Email', value : email},
                    {key : 'Role', value : role},
                    {key : 'StatusUser', value : '1'},
                ]

                let insert =  await UsersModel.save(data);
                if (insert.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Insert Users Data Controller Success')
                    )
                }        
            } else {
                let userId = 'U000001'
                let pwdEncrypt = await encryptPassword(password);

                let data = [
                    {key : 'UserID', value : userId},
                    {key : 'Password', value : pwdEncrypt},
                    {key : 'Name', value : name},
                    {key : 'Nopek', value : nopek},
                    {key : 'Jabatan', value : jabatan},
                    {key : 'Perusahaan', value : perusahaan},
                    {key : 'Email', value : email},
                    {key : 'Role', value : role},
                    {key : 'StatusUser', value : '1'},
                ]

                let insert =  await UsersModel.save(data);
                if (insert.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Insert Users Data Controller Success')
                    )
                }
            }
        } else if (action == 'update') {
            let id = req.body.id
            let where = [{key:'ID',value:id}]
            let data = [
                {key : 'Name', value : name},
                {key : 'Nopek', value : nopek},
                {key : 'Jabatan', value : jabatan},
                {key : 'Perusahaan', value : perusahaan},
                {key : 'Email', value : email},
                {key : 'Role', value : role},
                {key : 'StatusUser', value : '1'},
            ]

            let update =  await UsersModel.save(data, where)
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Update Users Data Controller Success')
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


module.exports = UsersController

const UsersDataController       = {}
const UsersDataModel            = require('../models/users_data.model');
const parseResponse         = require('../helpers/parse-response');
const log                   = 'Users Data Controller';
const { generateToken, encryptPassword }    = require('../lib/jwt');

UsersDataController.getUsersDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Users Data Controller`);

    try{
        let sql = await UsersDataModel.getAll('*', []);

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

UsersDataController.postUsersDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Users Data Controller`);

    try {

        let { personal_number, name, ad_username, email, zpassword } = req.body

        let max = await UsersDataModel.QueryCustom('SELECT MAX(ASSIGNMENT_NUMBER) AS a FROM ms_it_personal_data');
        let value =  max.rows[0];
        let get = value.a;

        let assignment_number = get + 1;
        let cocode =  "2110";
        let is_active = "1";
        let ztipe = "B";
        let pwdEncrypt = await encryptPassword(zpassword);


        let data = [
            {key : 'PERNR', value : personal_number},
            {key : 'NAME', value : name},
            {key : 'AD_USERNAME', value : ad_username},
            {key : 'EMAIL', value : email},
            {key : 'ASSIGNMENT_NUMBER', value : assignment_number},
            {key : 'COCODE', value : cocode},
            {key : 'IS_ACTIVE', value : is_active},
            {key : 'ZTIPE', value : ztipe},
            {key : 'ZPASSWORD', value : pwdEncrypt},
            // {key : 'ZROLE', value : ""},
            // {key : 'ZUSER_EXPIRY', value : ""},
            // {key : 'VALIDATOR', value : ""}
        ]

        let insert =  await UsersDataModel.save(data);

        if (insert.success == true) {
            res.status(200).send(
                parseResponse(true, data, '00', 'Insert Users Data Controller Success')
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


UsersDataController.updateUsersDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Users Data Controller`);

    try {
        let { personal_number, name, ad_username, email, assignment_number } = req.body
        let where       = [{ key: 'PERNR', value: personal_number }, { key: 'ASSIGNMENT_NUMBER', value: assignment_number }]

        let data = [
            {key : 'NAME', value : name},
            {key : 'AD_USERNAME', value : ad_username},
            {key : 'EMAIL', value : email},
        ]

        let update =  await UsersDataModel.save(data, where);

        if (update.success == true) {
            res.status(200).send(
                parseResponse(true, data, '00', 'Update Users Data Controller Success')
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

UsersDataController.deleteUsersDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Users Data Controller`);

    try {
        let { personal_number, assignment_number } = req.body
        let where       = [{ key: 'PERNR', value: personal_number }, { key: 'ASSIGNMENT_NUMBER', value: assignment_number }]

        let data = [
            {key : 'IS_ACTIVE', value : 0},
        ]

        let soft_delete =  await UsersDataModel.save(data, where);

        if (soft_delete.success == true) {
            res.status(200).send(
                parseResponse(true, data, '00', 'Delete Users Data Controller Success')
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


UsersDataController.activateUsersDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Users Data Controller`);

    try {
        let { personal_number, assignment_number } = req.body
        let where       = [{ key: 'PERNR', value: personal_number }, { key: 'ASSIGNMENT_NUMBER', value: assignment_number }]

        let data = [
            {key : 'IS_ACTIVE', value : 1},
        ]

        let soft_delete =  await UsersDataModel.save(data, where);

        if (soft_delete.success == true) {
            res.status(200).send(
                parseResponse(true, data, '00', 'Delete Users Data Controller Success')
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



module.exports = UsersDataController

const LogController = {}
const TLModel = require('../models/TL.model');
const LHAModel = require('../models/lha.model');
const TemuanModel = require('../models/temuan.model');
const RekomendasiModel = require('../models/rekomendasi.model');
const FungsiRekomendasiModel = require('../models/fungsi_rekomendasi.model');
const LogActivityModel = require('../models/log_activity.model')
const date = require('date-and-time');
const now = new Date();
const _ = require('lodash');
const moment = require('moment');
const parseResponse = require('../helpers/parse-response')
const log = 'TL controller';

LogController.getLogActivity = async(req, res, next) => {
    console.log(`├── ${log} :: Get Log Activity Controller`);

    try {
        let { idLHA } = req.body
        let sql = `SELECT * FROM log_activity WHERE log_activity.ID_LHA = '` + idLHA + `' ORDER BY log_activity.Tanggal DESC`
        let getLog = await LogActivityModel.QueryCustom(sql)

        let result = _.map(getLog.rows, function(data) {
            return dataLHA = {
                ID: data.ID,
                ID_LHA: data.ID_LHA,
                UserId: data.UserId,
                Tanggal: moment(data.Tanggal).format('DD MMMM YYYY'),
                Time: moment(data.Tanggal).format('HH:mm:ss'),
                Distance: moment(data.Tanggal, "YYYYMMDD").fromNow(),
                Activity: data.Activity,
                AdditionalInfo: data.AdditionalInfo,
                Type: data.Type,
            }
        });


        res.status(200).send(
            parseResponse(true, result, '00', 'Get Log Activity Controller Success')
        )

    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

LogController.recentActivityLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Recent Log Activity Controller`);

    try {
        let sql = `SELECT * FROM log_activity ORDER BY log_activity.Tanggal DESC LIMIT 10`
        let getLog = await LogActivityModel.QueryCustom(sql)

        let result = _.map(getLog.rows, function(data) {
            return dataLHA = {
                ID: data.ID,
                ID_LHA: data.ID_LHA,
                UserId: data.UserId,
                Tanggal: moment(data.Tanggal).format('DD MMMM YYYY'),
                Time: moment(data.Tanggal).format('HH:mm:ss'),
                Distance: moment(data.Tanggal, "YYYYMMDD").fromNow(),
                Activity: data.Activity,
                AdditionalInfo: data.AdditionalInfo,
                Type: data.Type,
            }
        });


        res.status(200).send(
            parseResponse(true, result, '00', 'Get Log Activity Controller Success')
        )

    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}


module.exports = LogController
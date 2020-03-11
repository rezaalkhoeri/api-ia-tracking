const DashboardController = {}
const LHAModel = require('../models/lha.model');
const TemuanModel = require('../models/temuan.model');
const RekomendasiModel = require('../models/rekomendasi.model');
const _ = require('lodash');
const parseResponse = require('../helpers/parse-response')
const log = 'Dashboard controller';

DashboardController.getSummaryByIdLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Dashboard Data Controller`);

    try {
        let { idLHA } = req.body
        let where = [{ key: 'ID_LHA', value: idLHA }]
        let getLHA = await LHAModel.getAll('*', where)

        if (getLHA.length > 0) {
            let getTemuan = await TemuanModel.getAll('*', where)
            let sql = `SELECT * FROM tblt_temuan WHERE tblt_temuan.StatusTemuan = 'A1' 
                    OR tblt_temuan.StatusTemuan = 'A2'
                    OR tblt_temuan.StatusTemuan = 'A3'
                    OR tblt_temuan.StatusTemuan = 'A4'`
            let totalTemuan = await TemuanModel.QueryCustom(sql)
            let temuanPresentase = parseFloat(getTemuan.length) * parseFloat(100) / parseFloat(totalTemuan.rows.length)

            let sqlRek = `SELECT * FROM tblt_rekomendasi WHERE tblt_rekomendasi.StatusTL = 'A1' 
                    OR tblt_rekomendasi.StatusTL = 'A2'
                    OR tblt_rekomendasi.StatusTL = 'A3'
                    OR tblt_rekomendasi.StatusTL = 'A4'`
            let totalRek = await RekomendasiModel.QueryCustom(sqlRek)

            let rekomendasi = []
            for (let i = 0; i < getTemuan.length; i++) {
                let whereTemuan = [{ key: 'ID_TEMUAN', value: getTemuan[i].ID_TEMUAN }]
                let getRekomendasi = await RekomendasiModel.getAll('*', whereTemuan)
                rekomendasi.push(getRekomendasi)
            }

            let rekomendasiData = [].concat.apply([], rekomendasi);
            let rekomendasiPresentase = parseFloat(rekomendasiData.length) * parseFloat(100) / parseFloat(totalRek.rows.length)

            let rekOpen = []
            let rekClose = []
            for (let x = 0; x < rekomendasiData.length; x++) {
                if (rekomendasiData[x].StatusTL == 'A1') {
                    rekOpen.push(rekomendasiData[x])
                } else if (rekomendasiData[x].StatusTL == 'A2') {
                    rekOpen.push(rekomendasiData[x])
                } else if (rekomendasiData[x].StatusTL == 'A3') {
                    rekClose.push(rekomendasiData[x])
                } else if (rekomendasiData[x].StatusTL == 'A4') {
                    rekOpen.push(rekomendasiData[x])
                }
            }

            let rekOpenPre = parseFloat(rekOpen.length) * parseFloat(100) / parseFloat(rekomendasiData.length)
            let rekClosePre = parseFloat(rekClose.length) * parseFloat(100) / parseFloat(rekomendasiData.length)

            let total = [{
                nomorLHA: getLHA[0].NomorLHA,
                temuan: getTemuan.length,
                temuanBar: temuanPresentase,
                rekomendasi: rekomendasiData.length,
                rekomendasiBar: rekomendasiPresentase,
                rekomendasiOpen: rekOpen.length,
                rekomendasiOpenBar: rekOpenPre,
                rekomendasiClose: rekClose.length,
                rekomendasiCloseBar: rekClosePre,
            }]

            res.status(200).send(
                parseResponse(true, total, '00', 'Get Summary By ID LHA Data Controller Success')
            )
        } else {
            res.status(200).send(
                parseResponse(false, null, '05', 'Data Kosong!')
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

module.exports = DashboardController
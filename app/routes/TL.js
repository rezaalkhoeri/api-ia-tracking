const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const TLController              = require('../controllers/tindak_lanjut.controller')

router
    .all('/*', authentication)
    .post('/auditee', TLController.auditeeTLController)
    .post('/getTLbyRekomendasi', TLController.getTLByRekomendasiController)
    .post('/closeRekomendasi', TLController.closeRekomendasiController)
    .post('/rejectTLRekomendasi', TLController.rejectTLRekomendasiController)
    .post('/perpanjangDueDate', TLController.perpanjangDueDateController)
    .post('/uploadFile', TLController.auditorUploadFileController)

module.exports = router
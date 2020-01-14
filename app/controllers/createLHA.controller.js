const CreateLHAController         = {}
const LHAModel                    = require('../models/lha.model');
const TemuanModel                 = require('../models/temuan.model');
const RekomendasiModel            = require('../models/rekomendasi.model');
const parseResponse               = require('../helpers/parse-response')
const log                         = 'Create LHA controller';

CreateLHAController.createLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        let { nomorLHA, judulLHA, dokumenAudit, tglLHA, tipeLHA, statusLHA, createdByLHA, temuan, rekomendasi } = req.body

        let dataLHA = [
            { key:'NomorLHA', value:nomorLHA },
            { key:'JudulLHA', value:judulLHA },
            { key:'DokumenAudit', value:dokumenAudit },
            { key:'TanggalLHA', value:tglLHA },
            { key:'TipeLHA', value:tipeLHA },
            { key:'StatusLHA', value:statusLHA },
            { key:'CreatedBy', value:createdByLHA },
        ]

        let insertLHA =  await LHAModel.save(dataLHA);

        if (insertLHA.success == true) {
            let whereLHA = [{ key:'NomorLHA', value:nomorLHA }]
            let getLHA = await LHAModel.getBy('ID_LHA', whereLHA)
            let idLHA = getLHA.ID_LHA

            let getTemuan = JSON.parse(temuan)
            let dataTemuan = []
            for (let i = 0; i < getTemuan.length; i++) {
                dataTemuan.push([
                    { key: 'ID_LHA', value: idLHA},               
                    { key: 'JudulTemuan', value: getTemuan[i].judulTemuan},
                    { key: 'IndikasiBernilaiUang', value: getTemuan[i].indikasi},
                    { key: 'Nominal', value: getTemuan[i].nominal},
                    { key: 'CreatedBy', value: getTemuan[i].createdBy},
                ])
            }

            let temuanRes = []
            for (let x = 0; x < dataTemuan.length; x++) {
                let insertTemuan =  await TemuanModel.save(dataTemuan[x]);  
                temuanRes.push(insertTemuan.success)
            }

            var check = temuanRes.every(myFunction);
            function myFunction(value) {
                return value == true;
            }

            if (check == true) {
                let whereTemuan = [{ key:'ID_LHA', value: idLHA }]
                let getTemuan = await TemuanModel.getAll('*', whereTemuan)

                let getRekomendasi = JSON.parse(rekomendasi)
                let dataRekomendasi = []
                for (let y = 0; y < getTemuan.length; y++) {
                    for (let i = 0; i < getRekomendasi.length; i++) {
                        dataRekomendasi.push([
                            { key: 'ID_TEMUAN', value: getTemuan[y].ID_TEMUAN},               
                            { key: 'JudulRekomendasi', value: getRekomendasi[i].judulRekomendasi},
                            { key: 'BuktiTindakLanjut', value: getRekomendasi[i].buktiTL},
                            { key: 'DueDate', value: getRekomendasi[i].dueDate},
                            { key: 'CloseDate', value: getRekomendasi[i].closeDate},
                            { key: 'CreatedBy', value: getRekomendasi[i].createdBy},
                        ])
                    }
                }

                let rekomendasiRes = []                
                for (let z = 0; z < dataRekomendasi.length; z++) {
                    let insertRekomendasi =  await RekomendasiModel.save(dataRekomendasi[z]);  
                    rekomendasiRes.push(insertRekomendasi.success)
                }

                var rekomendasiSave = rekomendasiRes.every(myFunction);
                function myFunction(value) {
                    return value == true;
                }

                if (rekomendasiSave == true) {
                    let postData = [
                        { key: 'Data LHA', value:dataLHA }, 
                        { key: 'Data Temuan', value:dataTemuan }, 
                        { key: 'Data Rekomendasi', value:dataRekomendasi } 
                    ]
                    res.status(200).send(
                        parseResponse(true, postData, '00', 'Create LHA Controller Success')
                    )                                               
                }
            }
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


module.exports = CreateLHAController
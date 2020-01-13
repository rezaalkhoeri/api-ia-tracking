const HelloController       = {}
const HelloModel            = require('../models/hello.model');
const parseResponse         = require('../helpers/parse-response')
const log                   = 'Hello controller';

HelloController.getHelloController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Hello Controller`);

    try{
        let dbHello = await HelloModel.getAll('*', []);

        // success
        res.status(200).send(
            parseResponse(true, dbHello, '00', 'Get Hello Controller Success')
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

HelloController.postHelloController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Hello Controller`);
    
    try {
        let { nama, posisi } = req.body

        let helloData   = [
            { key: 'nama', value : nama },
            { key: 'posisi', value : posisi }
        ]
        
        let insertHello     = await HelloModel.save(helloData);
        
        if (insertHello.success == true) {
            res.status(200).send(
                parseResponse(true, insertHello, '00', 'Insert Hello Controller Success')
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

module.exports = HelloController
const CoreDB                   = require('../lib/Coredb');
const FungsiRekomendasiModel         = {}

FungsiRekomendasiModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblt_rekomendasi_fungsi');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

FungsiRekomendasiModel.delete = async (condition) => {
    CoreDB.setTable('tblt_rekomendasi_fungsi');

    return await CoreDB.delete(condition);
}

FungsiRekomendasiModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblt_rekomendasi_fungsi');

    return await CoreDB.getBy(fields, condition, join, group);
}

FungsiRekomendasiModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblt_rekomendasi_fungsi');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

FungsiRekomendasiModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblt_rekomendasi_fungsi');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

FungsiRekomendasiModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = FungsiRekomendasiModel;

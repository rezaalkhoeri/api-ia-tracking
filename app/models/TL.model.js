const CoreDB            = require('../lib/Coredb');
const TLModel         = {}

TLModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblt_rekomendasi_tindaklanjut');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

TLModel.delete = async (condition) => {
    CoreDB.setTable('tblt_rekomendasi_tindaklanjut');

    return await CoreDB.delete(condition);
}

TLModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblt_rekomendasi_tindaklanjut');

    return await CoreDB.getBy(fields, condition, join, group);
}

TLModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblt_rekomendasi_tindaklanjut');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

TLModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblt_rekomendasi_tindaklanjut');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

TLModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = TLModel;

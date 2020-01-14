const CoreDB                   = require('../lib/Coredb');
const RekomendasiModel         = {}

RekomendasiModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblt_rekomendasi');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

RekomendasiModel.delete = async (condition) => {
    CoreDB.setTable('tblt_rekomendasi');

    return await CoreDB.delete(condition);
}

RekomendasiModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblt_rekomendasi');

    return await CoreDB.getBy(fields, condition, join, group);
}

RekomendasiModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblt_rekomendasi');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

RekomendasiModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblt_rekomendasi');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

RekomendasiModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = RekomendasiModel;

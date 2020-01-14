const CoreDB            = require('../lib/Coredb');
const TemuanModel         = {}

TemuanModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblt_temuan');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

TemuanModel.delete = async (condition) => {
    CoreDB.setTable('tblt_temuan');

    return await CoreDB.delete(condition);
}

TemuanModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblt_temuan');

    return await CoreDB.getBy(fields, condition, join, group);
}

TemuanModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblt_temuan');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

TemuanModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblt_temuan');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

TemuanModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = TemuanModel;

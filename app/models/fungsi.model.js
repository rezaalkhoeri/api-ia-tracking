const CoreDB            = require('../lib/Coredb');
const FungsiModel         = {}

FungsiModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblm_fungsi');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

FungsiModel.delete = async (condition) => {
    CoreDB.setTable('tblm_fungsi');

    return await CoreDB.delete(condition);
}

FungsiModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblm_fungsi');

    return await CoreDB.getBy(fields, condition, join, group);
}

FungsiModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblm_fungsi');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

FungsiModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblm_fungsi');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

FungsiModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = FungsiModel;

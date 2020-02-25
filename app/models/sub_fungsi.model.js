const CoreDB            = require('../lib/Coredb');
const SubFungsiModel         = {}

SubFungsiModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblm_sub_fungsi');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

SubFungsiModel.delete = async (condition) => {
    CoreDB.setTable('tblm_sub_fungsi');

    return await CoreDB.delete(condition);
}

SubFungsiModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblm_sub_fungsi');

    return await CoreDB.getBy(fields, condition, join, group);
}

SubFungsiModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblm_sub_fungsi');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

SubFungsiModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblm_sub_fungsi');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

SubFungsiModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = SubFungsiModel;

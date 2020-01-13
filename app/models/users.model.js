const CoreDB            = require('../lib/Coredb');
const UsersModel         = {}

UsersModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('user');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

UsersModel.delete = async (condition) => {
    CoreDB.setTable('user');

    return await CoreDB.delete(condition);
}

UsersModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('user');

    return await CoreDB.getBy(fields, condition, join, group);
}

UsersModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('user');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

UsersModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('user');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

UsersModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = UsersModel;

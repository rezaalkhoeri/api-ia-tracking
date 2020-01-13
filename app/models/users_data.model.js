const CoreDB            = require('../lib/Coredb');
const UsersDataModel         = {}

UsersDataModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('ms_it_personal_data');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

UsersDataModel.delete = async (condition) => {
    CoreDB.setTable('ms_it_personal_data');

    return await CoreDB.delete(condition);
}

UsersDataModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('ms_it_personal_data');

    return await CoreDB.getBy(fields, condition, join, group);
}

UsersDataModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('ms_it_personal_data');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

UsersDataModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('ms_it_personal_data');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

UsersDataModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = UsersDataModel;

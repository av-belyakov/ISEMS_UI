/*
 * Описание модели хранилища специальных параметров группы
 * */

"use strict";

const globalObject = require("../../configure/globalObject");
const connection = globalObject.getData("descriptionDB", "MongoDB", "connection");

/**
 * list_objects_available_viewing - список доступных для просмотра объектов, где
 *   group_name - наименование группы
 *   object_id - ID объекта доступного для просмотра
 *   collection_name - наименование коллекции в которой находится данный объект
 *   user_name - имя пользователя, разрешившего просмотр объекта с заданным ID, данной группе
 *   date_time - дата и время добавления объекта
 */
let storageSpecialGroupParametersSchema = new connection.Schema({
    list_objects_available_viewing: [{
        group_name: { type: String, index: true, unique: true },
        object_id: String,
        collection_name: String,
        user_name: String,
        date_time: Number,
    }],
});

module.exports = connection.model("storage_special_group_parameters", storageSpecialGroupParametersSchema);
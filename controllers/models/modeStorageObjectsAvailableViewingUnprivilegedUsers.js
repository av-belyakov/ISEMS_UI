/**
 * Описание модели хранилища объектов доступных для просмотра непривилегированным пользователям
 */

"use strict";

const globalObject = require("../../configure/globalObject");
const connection = globalObject.getData("descriptionDB", "MongoDB", "connection");

/**
 *   group_name - наименование группы
 *   object_id - ID объекта доступного для просмотра
 *   collection_name - наименование коллекции в которой находится данный объект
 *   user_name - имя пользователя, разрешившего просмотр объекта с заданным ID, данной группе
 *   date_time - дата и время добавления объекта
 */
let storageObjectsAvailableViewingUnprivilegedUsers = new connection.Schema({
    group_name: { type: String, index: true },
    object_id: String,
    collection_name: String,
    user_name: String,
    date_time: Number,
});

module.exports = connection.model("storage_objects_available_for_viewing_by_unprivileged_users", storageObjectsAvailableViewingUnprivilegedUsers);

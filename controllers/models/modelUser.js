/*
 * Описание модели пользователя
 * */

"use strict";

const globalObject = require("../../configure/globalObject");
const connection = globalObject.getData("descriptionDB", "MongoDB", "connection");

let usersSchema = new connection.Schema({
    user_id: String,
    date_register: Number,
    date_change: Number,
    login: String,
    password: String,
    group: String,
    user_name: String,
    settings: {
        sourceMainPage: Array
    }
});

module.exports = connection.model("users", usersSchema);
/*
 * Описание модели (session.user.information)
 * хранятся данные о пользователе идентифицируемые по passport._id и sessionID
 * */

"use strict";

const globalObject = require("../../configure/globalObject");
const connection = globalObject.getData("descriptionDB", "MongoDB", "connection");

let sessionUserInformation = new connection.Schema({
    passport_id: String,
    session_id: { type: String, default: "" },
    login: String,
    user_name: String,
    user_settings: {
        sourceMainPage: Array
    },
    group_name: String,
    group_settings: {},
    dateCreate: Number
});

module.exports = connection.model("session.user.information", sessionUserInformation);
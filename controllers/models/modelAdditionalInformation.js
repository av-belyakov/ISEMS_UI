/*
 * Описание модели (ids.rules)
 * дополнительная информация по:
 * - правилам СОА (ids.rules)
 * - правилам поиска
 * - репутационным спискам
 * - GeoIP
 * */

"use strict";

const globalObject = require("../../configure/globalObject");
const connection = globalObject.getData("descriptionDB", "MongoDB", "connection");


let additionalInformation = new connection.Schema({
    ids_rules: {
        create_date: Number,
        create_login: String,
        create_username: String,
        count_rules: Number
    }
});

module.exports = connection.model("additional.information", additionalInformation);
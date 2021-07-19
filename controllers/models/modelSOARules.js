/*
 * Описание модели (ids.rules)
 * хранятся сигнатуры IDS
 * */

"use strict";

const globalObject = require("../../configure/globalObject");
const connection = globalObject.getData("descriptionDB", "MongoDB", "connection");

let rulesSOA = new connection.Schema({
    sid: { type: Number, index: true, unique: true },
    classType: { type: String, index: true },
    msg: String,
    body: String
}, { autoIndex: true });

module.exports = connection.model("rules_soa", rulesSOA);
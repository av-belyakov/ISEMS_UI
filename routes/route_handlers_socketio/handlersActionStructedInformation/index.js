"use strict";

const handlerAny = require("./handlerAny");
const handlerGetter = require("./handlerGetter");
const handlerSender = require("./handlerSender");

/**
 * Модуль обработчик действий над документами содержащими структурированную информацию
 *
 * @param {*} socketIo 
 */
module.exports.addHandlers = function(socketIo) {
    const handlers = {
        "isems-mrsi ui request: get count doc type 'reports' status 'open'": handlerGetter.getCountOpenReports,
        "isems-mrsi ui request: get count doc type 'reports' status 'published'": handlerGetter.getCountPublishedReports,
        "isems-mrsi ui request: get count doc statuses decisions made computer threats": handlerGetter.getCountStatusesDecisionsMadeComputerThreats,
        "isems-mrsi ui request: get a list of groups to which the report is available": handlerGetter.getListGroupsWhichReportAvailable,
        "isems-mrsi ui request: send search request, table page report": handlerSender.sendSearchRequestPageReport,
        "isems-mrsi ui request: send search request, cound found elem, table page report": handlerSender.sendSearchRequestCountFoundElemPageReport,
        "isems-mrsi ui request: send search request, get report for id": handlerSender.sendSearchRequestGetReportForId,
        "isems-mrsi ui request: allow the group to access the report": handlerAny.allowGroupAccessReport,
        "isems-mrsi ui request: forbid the group to access the report": handlerAny.forbidGroupAccessReport,
        "isems-mrsi ui request: get list types decisions made computer threat": handlerGetter.getListTypesDecisionsMadeComputerThreat,
        "isems-mrsi ui request: get list types computer threat": handlerGetter.getListTypesComputerThreat,
    };

    for (let e in handlers) {
        socketIo.on(e, handlers[e].bind(null, socketIo));
    }
};
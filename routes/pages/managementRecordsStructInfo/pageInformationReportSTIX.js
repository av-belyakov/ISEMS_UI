"use strict";

const globalObject = require("../../../configure/globalObject");
const writeLogFile = require("../../../libs/writeLogFile");
const checkAccessRightsPage = require("../../../libs/check/checkAccessRightsPage");

/**
 * Модуль формирующий страницу содержащую информацию об STIX объекте типа Report
 * доступ к которому осуществляется через ОБРАТНЫЕ ссылки других объектов STIX
 * 
 * @param {*} req
 * @param {*} res
 * @param {*} objHeader
 */
module.exports = function (req, res, objHeader) {
    checkAccessRightsPage(req, (err, result) => {
        if (err) {
            writeLogFile("error", err.toString());
            res.render("menu/man_records_struct_info", {
                header: objHeader,
                userPermissions: {},
                mainInformation: {
                    reportId: "",
                },
            });

            return;
        }

        let readStatus = result.group_settings.management_security_event_management.status;

        if (readStatus === false) return res.render("403");

        res.render("menu/man_records_struct_info/information_report_stix", {
            header: objHeader,
            listItems: {
                connectionModules: {
                    moduleMRSICT: globalObject.getData(
                        "descriptionAPI",
                        "managingRecordsStructuredInformationAboutComputerThreats",
                        "connectionEstablished")
                },
                userPermissions: result.group_settings.management_security_event_management.element_settings,
                mainInformation: {
                    reportId: req.id,
                },
            },
        });
    });
};
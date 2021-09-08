"use strict";

const async = require("async");

const globalObject = require("../../../configure/globalObject");
const writeLogFile = require("../../../libs/writeLogFile");
const checkAccessRightsPage = require("../../../libs/check/checkAccessRightsPage");
const informationForPageManagementGroups = require("../../../libs/management_settings/informationForPageManagementGroups");

/**
 * Модуль формирующий основную страницу для модуля управления структурированной информацией
 * 
 * @param {*} req
 * @param {*} res
 * @param {*} objHeader
 */
module.exports = function (req, res, objHeader) {
    async.parallel({
        permissions: (callback) => {
            checkAccessRightsPage(req, (err, result) => {
                if (err) callback(err);
                else callback(null, result);
            });
        },
        groupList: (callback) => {
            informationForPageManagementGroups((err, result) => {
                if (err) callback(err);
                else callback(null, result);
            });
        }
    }, (err, result) => {
        if (err) {
            writeLogFile("error", err.toString());
            res.render("menu/man_records_struct_info", {
                header: objHeader,
                userPermissions: {},
                mainInformation: {},
            });

            return;
        }

        try{
            let userPermissions = result.permissions.group_settings;
            let readStatus = userPermissions.management_security_event_management.status;

            if (readStatus === false) return res.render("403");

            res.render("menu/man_records_struct_info/index", {
                header: objHeader,
                listItems: {
                    connectionModules: {
                        moduleMRSICT: globalObject.getData(
                            "descriptionAPI",
                            "managingRecordsStructuredInformationAboutComputerThreats",
                            "connectionEstablished")
                    },
                    userPermissions: userPermissions.management_security_event_management.element_settings,
                    groupList: Object.keys(result.groupList).sort((a, b) => a < b).map((gn) => {
                        return {
                            groupName: gn,
                            dateRegister: result.groupList[gn].date_register,
                            create: result.groupList[gn].elements.management_security_event_management.element_settings.create.status,
                            editingInformation: result.groupList[gn].elements.management_security_event_management.element_settings.editing_information.status,
                            privilegedGroup: result.groupList[gn].elements.management_security_event_management.element_settings.privileged_group.status,
                        };
                    }),
                },
            });
        } catch(err) {
            writeLogFile("error", err.toString());
            res.render("menu/man_records_struct_info", {
                header: objHeader,
                userPermissions: {},
                mainInformation: {},
            });
        }
    });
};
"use strict";

const debug = require("debug")("hadcsihsha");

const models = require("../../../controllers/models");
const MyError = require("../../../libs/helpers/myError");
const showNotify = require("../../../libs/showNotify");
//const helpersFunc = require("../../../libs/helpers/helpersFunc");
const getSessionId = require("../../../libs/helpers/getSessionId");
//const createUniqID = require("../../../libs/helpers/createUniqID");
//const globalObject = require("../../../configure/globalObject");
const writeLogFile = require("../../../libs/writeLogFile");
//const localHelpersFunc = require("./helpersFunc");
const mongodbQueryProcessor = require("../../../middleware/mongodbQueryProcessor");
const checkUserAuthentication = require("../../../libs/check/checkUserAuthentication");

/**
 * Обработчик запроса для добавления разрешения на просмотр доклада непривилегированной группе
 * 
 * @param {*} socketIo 
 * @param {*} data 
 */
module.exports.allowGroupAccessReport = function(socketIo, data){
    let funcName = " (func 'allowGroupAccessReport')";

    debug(`${funcName}, START...`);
    debug(data);

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return { 
                userLogin: authData.document.userLogin, 
                userName: authData.document.userName,
                userGroup: authData.document.userGroup,
                isPrivilegedGroup: authData.document.groupSettings.management_security_event_management.element_settings.privileged_group.status,
            };
        }).then((result) => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sid) => {
                    if(err){
                        return reject(err);
                    }

                    result.sessionId = sid;

                    resolve(result);
                });
            });
        }).then((result) => {
            if(!result.isPrivilegedGroup){
                return;
            }
            
            return new Promise((resolve, reject) => {

                debug(`${funcName}, send request to data bases`);

                mongodbQueryProcessor.queryCustomUpdateOne(models.modelStorageSpecialGroupParameters, {
                    "$addToSet": { "list_objects_available_viewing": {
                        group_name: data.arguments.unprivilegedGroup,
                        object_id: data.arguments.reportId,
                        collection_name: "stix_objects",
                        user_name: result.userName,
                        date_time: +new Date,
                    }}},(err/*, queryResult*/) => {
                    if(err) reject(err);
                    else resolve();

                    /*
                    debug(`${funcName}, DB UPDATE ARRAY RESULT`);
                    debug(queryResult);  
                    
                    mongodbQueryProcessor.querySelect(models.modelStorageSpecialGroupParameters, {}, (err, queryResult) => {
                        if(err) {
                            reject(err);
                        }
    
                        debug(`${funcName}, DB found RESULT`);
                        debug(queryResult);

                        resolve();
                    });
                    */
                });
            });
        }).catch((err) => {

            debug(`${funcName}, ERROR:`);
            debug(err);

            if ((err.name === "management auth") || (err.name === "management MRSICT")) {
                showNotify({
                    socketIo: socketIo,
                    type: "danger",
                    message: err.message.toString()
                });
            } else {
                showNotify({
                    socketIo: socketIo,
                    type: "danger",
                    message: "Внутренняя ошибка приложения. Пожалуйста обратитесь к администратору.",
                });
            }

            writeLogFile("error", err.toString() + funcName);
        });
};

/**
 * Обработчик запроса для отзыва разрешения на просмотр доклада непривилегированной группе
 * 
 * @param {*} socketIo 
 * @param {*} data 
 */
module.exports.forbidGroupAccessReport = function(socketIo, data){
    let funcName = " (func 'forbidGroupAccessReport')";

    debug(`${funcName}, START...`);
    debug(data);

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return { 
                userLogin: authData.document.userLogin, 
                userName: authData.document.userName,
                userGroup: authData.document.userGroup,
                isPrivilegedGroup: authData.document.groupSettings.management_security_event_management.element_settings.privileged_group.status,
            };
        }).then((result) => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sid) => {
                    if(err){
                        return reject(err);
                    }

                    result.sessionId = sid;

                    resolve(result);
                });
            });
        }).then((result) => {
            if(!result.isPrivilegedGroup){
                return;
            }
            
            return new Promise((resolve, reject) => {

                debug(`${funcName}, send request to data bases`);

                mongodbQueryProcessor.queryCustomUpdateOne(models.modelStorageSpecialGroupParameters, {
                    "$pull": { "list_objects_available_viewing": {
                        group_name: data.arguments.unprivilegedGroup,
                        object_id: data.arguments.reportId,
                    }}},(err) => {
                    if(err) reject(err);
                    else resolve();
                });
            });
        }).catch((err) => {

            debug(`${funcName}, ERROR:`);
            debug(err);

            if ((err.name === "management auth") || (err.name === "management MRSICT")) {
                showNotify({
                    socketIo: socketIo,
                    type: "danger",
                    message: err.message.toString()
                });
            } else {
                showNotify({
                    socketIo: socketIo,
                    type: "danger",
                    message: "Внутренняя ошибка приложения. Пожалуйста обратитесь к администратору.",
                });
            }

            writeLogFile("error", err.toString() + funcName);
        });
};
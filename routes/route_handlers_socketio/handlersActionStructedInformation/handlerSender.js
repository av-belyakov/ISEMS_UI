"use strict";

const debug = require("debug")("hadcsihs");

const async = require("async");

const models = require("../../../controllers/models");
const MyError = require("../../../libs/helpers/myError");
const showNotify = require("../../../libs/showNotify");
const helpersFunc = require("../../../libs/helpers/helpersFunc");
const getSessionId = require("../../../libs/helpers/getSessionId");
const createUniqID = require("../../../libs/helpers/createUniqID");
const globalObject = require("../../../configure/globalObject");
const writeLogFile = require("../../../libs/writeLogFile");
const localHelpersFunc = require("./helpersFunc");
const mongodbQueryProcessor = require("../../../middleware/mongodbQueryProcessor");
const checkUserAuthentication = require("../../../libs/check/checkUserAuthentication");
const { isNull } = require("lodash");

/**
 * Обработчик запроса для поиска информации на странице 'доклады' (STIX тип 'reports')
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.sendSearchRequestPageReport = function(socketIo, data){
    let funcName = " (func 'sendSearchRequestPageReport')";

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return authData.document.userName;
        }).then((un) => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sid) => {
                    if (err) reject(err);
                    else resolve({ userName: un, sessionId: sid });
                });
            });
        }).then((result) => {            
            if(!result.isPrivilegedGroup){
                /*return new Promise((resolve, reject) => {
                    let countElements = 0;

                    mongodbQueryProcessor.querySelect(models.modelStorageSpecialGroupParameters, {
                        query: { group_name: result.userGroup },
                        select: { _id: 0, __v: 0 }
                    }, (err, queryResult) => {
                        if(err) {
                            reject(err);
                        }

                        if(!isNull(queryResult)){
                            countElements = queryResult.length;
                        }

                        let msg = {
                            task_id: createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`),
                            section: "handling search requests",
                            additional_parameters: { number_documents_found: countElements },
                        };

                        helpersFunc.sendMessageByUserSocketIo(socketIo.id, "isems-mrsi response ui", { 
                            section: section,
                            eventForWidgets: false,
                            information: msg,
                        });

                        resolve();
                    });
                });*/
            }

            return new Promise((resolve, reject) => {

                /**
                 *          !!!!!!!!!!!!!!!!
                 * Основываясь на статусе пользователя, разрешается ли ему поиск и просмотр всех существующих в БД
                 * STIX объектов или только тех, просмотр которых ему разрешили более привелегерованные пользователи,
                 * здесь должен быть выбор, отправлять типовой запрос на поиск информации или запрос который содержит
                 * только перечень разрешенных для просмотра ID.
                 *          !!!!!!!!!!!!!!!!
                 */

                process.nextTick(() => {
                    try {
                        let dataReq = localHelpersFunc.getRequestPattern(data);

                        debug("------- sendSearchRequestPageReport -----");
                        debug(dataReq);

                        if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                            return reject(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                        }
    
                        let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                        if (conn !== null) {
                            let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);
    
                            globalObject.setData("tasks", taskID, {
                                eventName: "send search request, table page report",
                                eventForWidgets: false,
                                userSessionID: result.sessionId,
                                generationTime: +new Date(),
                                socketId: socketIo.id,
                            });
    
                            conn.sendMessage({
                                task_id: taskID,
                                section: "handling search requests",
                                user_name_generated_task: result.userName,
                                request_details: dataReq,
                            });
                        }
    
                        resolve();
                    } catch(err){
                        reject(err);
                    }
                });
            });
        }).catch((err) => {
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
 * Обработчик запроса для получения количества найденной информации на странице 'доклады' (STIX тип 'reports')
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.sendSearchRequestCountFoundElemPageReport = function(socketIo, data){
    let funcName = " (func 'sendSearchRequestCountFoundElemPageReport')",
        section = "send search request, count found elem, table page report";

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
                return new Promise((resolve, reject) => {
                    let countElements = 0;

                    mongodbQueryProcessor.querySelect(models.modelStorageSpecialGroupParameters, {
                        query: { group_name: result.userGroup },
                        select: { _id: 0, __v: 0 }
                    }, (err, queryResult) => {
                        if(err) {
                            reject(err);
                        }

                        if(!isNull(queryResult)){
                            countElements = queryResult.length;
                        }

                        helpersFunc.sendMessageByUserSocketIo(socketIo.id, "isems-mrsi response ui", { 
                            section: section,
                            eventForWidgets: false,
                            information: {
                                task_id: createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`),
                                section: "handling search requests",
                                additional_parameters: { number_documents_found: countElements },
                            },
                        });

                        resolve();
                    });
                });
            }

            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    try {
                        let dataReq = localHelpersFunc.getRequestPattern(data);
                        dataReq.paginate_parameters = { max_part_size: 0, current_part_number: 0 };
    
                        debug("------- sendSearchRequestCountFoundElemPageReport -----");
                        debug(dataReq);

                        if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                            return reject(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                        }
    
                        let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                        if (conn !== null) {
                            let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);
    
                            globalObject.setData("tasks", taskID, {
                                eventName: section,
                                eventForWidgets: false,
                                userSessionID: result.sessionId,
                                generationTime: +new Date(),
                                socketId: socketIo.id,
                            });
    
                            conn.sendMessage({
                                task_id: taskID,
                                section: "handling search requests",
                                user_name_generated_task: result.userName,
                                request_details: dataReq,
                            });
                        }
    
                        resolve();
                    } catch(err){
                        reject(err);
                    }
                });
            });
        }).catch((err) => {
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
 * Обработчик запроса для получения количества найденной информации на странице 'доклады' (STIX тип 'reports')
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.sendSearchRequestGetReportForId = function(socketIo, data){
    let funcName = " (func 'sendSearchRequestGetReportForId')",
        section = "send search request, get report for id",
        elemId = data.arguments,
        searchRequestTmp = {
            collection_name: "stix object",
            paginate_parameters: {
                max_part_size: 15,
                current_part_number: 1,
            },
            sortable_field: "data_created",
            search_parameters: {
                documents_id: [elemId],
                documents_type: ["report"],
                created: {
                    start: "0001-01-01T00:00:00.000+00:00",
                    end: "0001-01-01T00:00:00.000+00:00",
                },
                modified: {
                    start: "0001-01-01T00:00:00.000+00:00",
                    end: "0001-01-01T00:00:00.000+00:00",
                },
                created_by_ref: "",
                specific_search_fields: [],
                outside_specification_search_fields: {
                    // принятые решения по компьютерной угрозе
                    decisions_made_computer_threat: "",
                    // тип компьютерной угрозы
                    computer_threat_type: "",
                },
            },
        };

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
                //не привилегированная группа
                return new Promise((resolve, reject) => {
                    //проверяем разрешен ли доступ группы к данному докладу
                    mongodbQueryProcessor.querySelect(models.modelStorageSpecialGroupParameters, {
                        query: { group_name: result.userGroup, object_id: elemId },
                        select: { _id: 0, __v: 0 }
                    }, (err, queryResult) => {
                        if(err) {
                            reject(err);
                        }

                        if(isNull(queryResult)){
                            //доступ к докладу данной группе запрещен
                            return resolve();
                        }

                        try {        
                            if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                                return reject(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                            }
        
                            let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                            if (conn !== null) {
                                let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);
        
                                globalObject.setData("tasks", taskID, {
                                    eventName: section,
                                    eventForWidgets: false,
                                    userSessionID: result.sessionId,
                                    generationTime: +new Date(),
                                    socketId: socketIo.id,
                                });
        
                                conn.sendMessage({
                                    task_id: taskID,
                                    section: "handling search requests",
                                    user_name_generated_task: result.userName,
                                    request_details: searchRequestTmp,
                                });
                            }
                        } catch(err){
                            reject(err);
                        }

                        resolve();
                    });
                });
            }

            //привилегированная группа
            async.parallel([
                //запрос списка групп которым доступен доступ к данному докладу
                (callback) => {
                    mongodbQueryProcessor.querySelect(models.modelStorageSpecialGroupParameters, {
                        query: { object_id: elemId },
                        select: { _id: 0, __v: 0 }
                    }, (err, listGroup) => {
                        if(err) {
                            return callback(err);
                        }
                    
                        helpersFunc.sendMessageByUserSocketIo(socketIo.id, "isems-mrsi response ui", { 
                            section: "list of groups that are allowed access",
                            eventForWidgets: false,
                            information: {
                                task_id: createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`),
                                section: "handling search requests",
                                additional_parameters: listGroup,
                            },
                        });    
                    });
                },
                //запрос всей информации по докладу (тип Report STIX)
                (callback) => {
                    if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                        return callback(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                    }
    
                    let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                    if (conn !== null) {
                        let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);
    
                        globalObject.setData("tasks", taskID, {
                            eventName: section,
                            eventForWidgets: false,
                            userSessionID: result.sessionId,
                            generationTime: +new Date(),
                            socketId: socketIo.id,
                        });
    
                        conn.sendMessage({
                            task_id: taskID,
                            section: "handling search requests",
                            user_name_generated_task: result.userName,
                            request_details: searchRequestTmp,
                        });
                    }

                    callback();
                },
            ], (err) => {
                if (err) throw(err);
            });
        }).catch((err) => {
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
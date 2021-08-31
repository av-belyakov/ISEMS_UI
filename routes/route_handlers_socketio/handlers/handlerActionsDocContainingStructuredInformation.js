"use strict";

const debug = require("debug")("hadcsi");

const async = require("async");

const models = require("../../../controllers/models");
const MyError = require("../../../libs/helpers/myError");
const showNotify = require("../../../libs/showNotify");
const helpersFunc = require("../../../libs/helpers/helpersFunc");
const getSessionId = require("../../../libs/helpers/getSessionId");
const createUniqID = require("../../../libs/helpers/createUniqID");
const globalObject = require("../../../configure/globalObject");
const writeLogFile = require("../../../libs/writeLogFile");
const mongodbQueryProcessor = require("../../../middleware/mongodbQueryProcessor");
const checkUserAuthentication = require("../../../libs/check/checkUserAuthentication");
const { isNull } = require("lodash");

/**
 * Модуль обработчик действий над документами содержащими структурированную информацию
 *
 * @param {*} socketIo 
 */
module.exports.addHandlers = function(socketIo) {
    const handlers = {
        "isems-mrsi ui request: get count doc type 'reports' status 'open'": getCountOpenReports,
        "isems-mrsi ui request: get count doc type 'reports' status 'published'": getCountPublishedReports,
        "isems-mrsi ui request: get count doc statuses decisions made computer threats": getCountStatusesDecisionsMadeComputerThreats,
        "isems-mrsi ui request: send search request, table page report": sendSearchRequestPageReport,
        "isems-mrsi ui request: send search request, cound found elem, table page report": sendSearchRequestCountFoundElemPageReport,
        "isems-mrsi ui request: send search request, get report for id": sendSearchRequestGetReportForId,
        "isems-mrsi ui request: get list computer threat": getListComputerThreat,
    };
    //network interaction:
    for (let e in handlers) {
        socketIo.on(e, handlers[e].bind(null, socketIo));
    }
};

/**
 * Обработчик запроса на получение общего количества открытых документов типа 'reports'
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function getCountOpenReports(socketIo, data){
    //debug("func 'getCountOpenReports', START...");
    //debug(data);

    let funcName = " (func 'getCountOpenReports')";

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
            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                        return reject(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                    }

                    let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                    if (conn !== null) {
                        let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "doc type 'reports' status 'open'",
                            eventForWidgets: true,
                            userSessionID: result.sessionId,
                            generationTime: +new Date(),
                            socketId: socketIo.id,
                        });


                        conn.sendMessage({
                            task_id: taskID,
                            section: "handling search requests",
                            user_name_generated_task: result.userName,
                            request_details: {
                                collection_name: "stix object",
                                paginate_parameters: {
                                    max_part_size: 0,
                                    current_part_number: 0,
                                },
                                sortable_field: "data_created",
                                search_parameters: {
                                    documents_id: [],
                                    documents_type: ["report"],
                                    created: {},
                                    modified: {},
                                    created_by_ref: "",
                                    specific_search_fields: [{
                                        published: "0001-01-01T00:00:00.000+00:00",
                                    }],
                                },
                            },
                        });
                    }

                    resolve();
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
}

/**
 * Обработчик запроса на получение общего количества опубликованных документов типа 'reports'
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function getCountPublishedReports(socketIo, data){
    //debug("func 'getCountPublishedReports', START...");
    //debug(data);

    let funcName = " (func 'getCountPublishedReports')";

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
            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                        return reject(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                    }

                    let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                    if (conn !== null) {
                        let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "get count doc type 'reports' status 'published'",
                            eventForWidgets: true,
                            userSessionID: result.sessionId,
                            generationTime: +new Date(),
                            socketId: socketIo.id,
                        });


                        conn.sendMessage({
                            task_id: taskID,
                            section: "handling search requests",
                            user_name_generated_task: result.userName,
                            request_details: {
                                collection_name: "stix object",
                                paginate_parameters: {
                                    max_part_size: 0,
                                    current_part_number: 0,
                                },
                                sortable_field: "data_created",
                                search_parameters: {
                                    documents_id: [],
                                    documents_type: ["report"],
                                    created: {},
                                    modified: {},
                                    created_by_ref: "",
                                    specific_search_fields: [{
                                        published: "2000-01-01T00:00:00.000+00:00",
                                    }],
                                },
                            },
                        });
                    }

                    resolve();
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
}

/**
 * Обработчик запроса на получение общего количества опубликованных документов типа 'reports'
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function getCountStatusesDecisionsMadeComputerThreats(socketIo, data){
    //debug("func 'getCountStatusesDecisionsMadeComputerThreats', START...");
    //debug(data);

    let funcName = " (func 'getCountStatusesDecisionsMadeComputerThreats')";

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
            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                        return reject(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                    }

                    let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                    if (conn !== null) {
                        let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "get count doc statuses decisions made computer threats",
                            eventForWidgets: true,
                            userSessionID: result.sessionId,
                            generationTime: +new Date(),
                            socketId: socketIo.id,
                        });

                        conn.sendMessage({
                            task_id: taskID,
                            section: "handling statistical requests",
                            user_name_generated_task: result.userName,
                            request_details: {
                                collection_name: "stix object",
                                paginate_parameters: {
                                    max_part_size: 0,
                                    current_part_number: 0,
                                },
                                sortable_field: "",
                                type_statistical_information: "types decisions made computer threat",
                            },
                        });
                    }

                    resolve();
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
}

/**
 * Обработчик запроса для поиска информации на странице 'доклады' (STIX тип 'reports')
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function sendSearchRequestPageReport(socketIo, data){
    debug("func 'sendSearchRequestPageReport', START...");
    debug(data);
    debug(data.arguments.searchParameters.specificSearchFields);

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
                        let dataReq = getRequestPattern(data);

                        debug("------- new data request -----");
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
}

/**
 * Обработчик запроса для получения количества найденной информации на странице 'доклады' (STIX тип 'reports')
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function sendSearchRequestCountFoundElemPageReport(socketIo, data){
    let funcName = " (func 'sendSearchRequestCountFoundElemPageReport')",
        section = "send search request, count found elem, table page report";

    //    debug(`${funcName}, START...`);
    //    debug(data);
    //    debug(data.arguments.searchParameters.specificSearchFields);

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
                        let dataReq = getRequestPattern(data);
                        dataReq.paginate_parameters = { max_part_size: 0, current_part_number: 0 };
    
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
}

/**
 * Обработчик запроса для получения количества найденной информации на странице 'доклады' (STIX тип 'reports')
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function sendSearchRequestGetReportForId(socketIo, data){
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

    debug(`${funcName}, START...`);
    debug(data);
    debug(`Get Report ID: ${elemId}`);

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
}

/**
 * Обработчик запроса для получения количества найденной информации на странице 'доклады' (STIX тип 'reports')
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function getListComputerThreat(socketIo, data){
    let funcName = " (func 'getListComputerThreat')";

    debug(`${funcName}, START...`);
    debug(data);
/**
        7.1.  Структура и формат JSON документа, получаемого от графического пользовательского интерфейса ISEMS-UI и содержащего ЗАПРОС, для получения СПИСКА 
id и названий относящихся, к заранее определенному в приложении, списку, 'типы принимаемых решений по компьютерным угрозам' (types decisions made 
computer threat) или 'типы компьютерных угроз' (types computer threat).
{
    task_id: STRING // уникальный ID задачи (обязательное значение)
    section: "handling search requests",
    user_name_generated_task: "",
    request_details: {
        collection_name: "get list computer threat",
        paginate_parameters: { // в данном запросе не обязательно
            max_part_size: 0,
            current_part_number: 0
        }
        sortable_field: "", // в данном запросе не обязательно

        // параметры для поиска списка 
        search_parameters: {
            type_list: "" //"types decisions made computer threat" для 'типы принимаемых решений по компьютерным угрозам' или
                // "types computer threat" для 'типы компьютерных угроз'
        }
    } 
}

    7.2. Структура и формат JSON документа, отправляемого в графический пользовательский интерфейс ISEMS-UI и содержащего ОТВЕТ на запрос СПИСКА 
id и названий, относящихся, к заранее определенному в приложении списку 'типы принимаемых решений по компьютерным угрозам' (types decisions made 
computer threat) или 'типы компьютерных угроз' (types computer threat).
{
    task_id: STRING // уникальный ID задачи (обязательное значение)
    section: "handling search requests" // секция обработки данных (обязательное значение, для данного типа действия ТОЛЬКО "handling search requests")
	is_successful: BOOL // был ли запрос успешно обработан (в данном случае TRUE)
	description: STRING // дополнительное описание (В ДАННОМ СЛУЧАЕ НЕ ЗАПОЛНЯЕТСЯ)
	information_message: { // информационное сообщение (НЕ ОБЯЗАТЕЛЬНО К ЗАПОЛНЕНИЮ)
        msg_type: STRING // тип информационного сообщения
        msg: STRING // информационное сообщение
    }
    additional_parameters: {
        type_list: "" //"types decisions made computer threat" для 'типы принимаемых решений по компьютерным угрозам' или
            // "types computer threat" для 'типы компьютерных угроз'
        list: [
            {
                id: STRING // id типа 'grouping' относящийся к определенному списку
                description: "" // name типа 'grouping'
            }
        ]
    }
}
         */
}

function getRequestPattern(reqData){
    let timeSeen = {
            start: "0001-01-01T00:00:00.000+00:00",
            end: "0001-01-01T00:00:00.000+00:00",
        },
        listSortableField = ["document_type", "data_created", "data_modified", "data_first_seen", "data_last_seen", "ipv4", "ipv6", "country"],
        listDocumentsType = [
            "attack-pattern", 
            "campaign", 
            "course-of-action",  
            "grouping",
            "identity",
            "indicator",
            "infrastructure",
            "intrusion-set",
            "location",
            "malware",
            "malware-analysis",
            "note",
            "observed-data",
            "opinion",
            "report",
            "threat-actor",
            "tool",
            "vulnerability"],
        msg = {
            collection_name: "stix object",
            paginate_parameters: {
                max_part_size: 15,
                current_part_number: 1,
            },
            sortable_field: "data_created",
            search_parameters: {
                documents_id: [],
                documents_type: [],
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

    if((typeof reqData.arguments === "undefined") || (typeof reqData.arguments.searchParameters === "undefined")){
        throw new Error("Получены невалидные параметры запроса.");
    }

    if(typeof reqData.arguments.paginateParameters !== "undefined"){
        if((typeof reqData.arguments.paginateParameters.maxPartSize !== "undefined") && (typeof reqData.arguments.paginateParameters.currentPartNumber !== "undefined")){
            msg.paginate_parameters.max_part_size = reqData.arguments.paginateParameters.maxPartSize;
            msg.paginate_parameters.current_part_number = reqData.arguments.paginateParameters.currentPartNumber;
        }
    }
        
    for(let field of listSortableField){
        if(field === reqData.arguments.sortableField){
            msg.sortable_field = reqData.arguments.sortableField;
        }
    }
    
    // --- поисковые параметры запроса ---
    if((typeof reqData.arguments.searchParameters.documentId !== "undefined") && (reqData.arguments.searchParameters.documentId.length > 0)){
        msg.search_parameters.document_id = reqData.arguments.searchParameters.documentId;
    }

    if((typeof reqData.arguments.searchParameters.documentsType !== "undefined") && (reqData.arguments.searchParameters.documentsType.length > 0)){
        for(let docType of reqData.arguments.searchParameters.documentsType){
            if(listDocumentsType.includes(docType)){
                msg.search_parameters.documents_type.push(docType);
            }
        }   
    }
    
    if(!isNaN(Date.parse(reqData.arguments.searchParameters.created.start)) && !isNaN(Date.parse(reqData.arguments.searchParameters.created.end))){
        msg.search_parameters.created = { start: reqData.arguments.searchParameters.created.start, end: reqData.arguments.searchParameters.created.end };
    }
        
    if(!isNaN(Date.parse(reqData.arguments.searchParameters.modified.start)) && !isNaN(Date.parse(reqData.arguments.searchParameters.modified.end))){
        msg.search_parameters.modified = { start: reqData.arguments.searchParameters.modified.start, end: reqData.arguments.searchParameters.modified.end };
    }

    if(typeof reqData.arguments.searchParameters.createdByRef !== "undefined"){
        msg.search_parameters.created_by_ref = reqData.arguments.searchParameters.createdByRef;
    }

    if(typeof reqData.arguments.searchParameters.outsideSpecificationSearchFields !== "undefined"){
        if(typeof reqData.arguments.searchParameters.outsideSpecificationSearchFields.decisionsMadeComputerThreat !== "undefined"){
            msg.search_parameters.outside_specification_search_fields.decisions_made_computer_threat = reqData.arguments.searchParameters.outsideSpecificationSearchFields.decisionsMadeComputerThreat;
        }

        if(typeof reqData.arguments.searchParameters.outsideSpecificationSearchFields.computerThreatType !== "undefined"){
            msg.search_parameters.outside_specification_search_fields.computer_threat_type = reqData.arguments.searchParameters.outsideSpecificationSearchFields.computerThreatType;
        }
    }

    let countSpecificSearchFields = reqData.arguments.searchParameters.specificSearchFields.length;
    if(countSpecificSearchFields === 0){
        return msg;
    }

    for(let i = 0; i < countSpecificSearchFields; i++){
        let item = reqData.arguments.searchParameters.specificSearchFields[i];
        if((typeof item.firstSeen === "undefined") || (isNaN(Date.parse(item.firstSeen.start))) || (isNaN(Date.parse(item.firstSeen.end)))){
            reqData.arguments.searchParameters.specificSearchFields[i].firstSeen = timeSeen;
        }

        if((typeof item.lastSeen === "undefined") || (isNaN(Date.parse(item.lastSeen.start))) || (isNaN(Date.parse(item.lastSeen.end)))){
            reqData.arguments.searchParameters.specificSearchFields[i].lastSeen = timeSeen;
        }

        if((typeof item.published === "undefined") || (isNaN(Date.parse(item.published)))){
            reqData.arguments.searchParameters.specificSearchFields[i].published = timeSeen.start;
        }
    }

    return msg;
}
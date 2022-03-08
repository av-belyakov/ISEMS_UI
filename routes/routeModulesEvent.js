"use strict";

const debug = require("debug")("routeModulesEvent");

const showNotify = require("../libs/showNotify");
const helpersFunc = require("../libs/helpers/helpersFunc");
const globalObject = require("../configure/globalObject");
const writeLogFile = require("../libs/writeLogFile");

/**
 * Маршруты для обработки информации передаваемой через протокол socket.io
 * Генератор событий (обрабатывает события от внешних источников, например API)
 *
 * @param {*} socketIo 
 */
module.exports.modulesEventGenerator = function(socketIo) {
    //модуль ISEMS-NIH
    eventsModuleNetworkInteraction(socketIo);

    //модуль ISEMS-MRSICT
    eventsModuleManagingRecordsStructuredInfo(socketIo);
};

function eventsModuleNetworkInteraction(socketIo) {
    if (!globalObject.hasData("descriptionAPI", "networkInteraction", "connection")) {
        return;
    }

    let connection = globalObject.getData("descriptionAPI", "networkInteraction", "connection");
    connection
        .on("connect", () => {
            helpersFunc.sendBroadcastSocketIo("module NI API", {
                "type": "connectModuleNI",
                "options": {
                    "connectionStatus": true
                },
            });

            setTimeout(() => {
                connection.sendMessage({
                    msgType: "command",
                    msgSection: "source control",
                    msgInstruction: "get an updated list of sources",
                    taskID: helpersFunc.getRandomHex(),
                    options: {}
                });
            }, 3000);
        }).on("message", ( /*msg*/ ) => {
            //debug("--- MESSAGE ---");
            //debug(msg);
        }).on("close", ( /*msg*/ ) => {
            //debug("--- CONNECTION CLOSE ---");
            //debug(msg);

            if (!globalObject.getData("descriptionAPI", "networkInteraction", "previousConnectionStatus")) {
                return;
            }

            helpersFunc.sendBroadcastSocketIo("module NI API", {
                "type": "connectModuleNI",
                "options": {
                    "connectionStatus": false
                },
            });

            globalObject.setData("descriptionAPI", "networkInteraction", "previousConnectionStatus", false);
        }).on("information source control", (msg) => {
            require("./handlers_msg_module_network_interaction/handlerMsgSources")(msg, socketIo);
        }).on("command source control", ( /*msg*/ ) => {
            //обрабатываем запрос ISEMS-NIH на получение актуального списка источников
            require("./handlers_msg_module_network_interaction/handlerMsgGetNewSourceList")();
        }).on("information filtration control", (msg) => {
            if (msg.options.s === "complete" || msg.options.s === "stop") {
                debug("----- information filtration control -----");
                debug(msg);
                debug("---------------------------------------");
            }

            let sourceInfo = globalObject.getData("sources", msg.options.id);

            //формируем сообщение о выполнении процесса фильтрации
            helpersFunc.sendBroadcastSocketIo("module NI API", {
                "type": "filtrationProcessing",
                "options": {
                    sourceID: msg.options.id,
                    name: sourceInfo.shortName,
                    taskID: msg.taskID,
                    taskIDModuleNI: msg.options.tidapp,
                    status: msg.options.s,
                    parameters: {
                        numDirectoryFiltration: msg.options.ndf,
                        numAllFiles: msg.options.nfmfp,
                        numProcessedFiles: msg.options.npf,
                        numProcessedFilesError: msg.options.nepf,
                        numFindFiles: msg.options.nffrf,
                        sizeAllFiles: msg.options.sfmfp,
                        sizeFindFiles: msg.options.sffrf,
                    },
                },
            });
        }).on("command filtration control", ( /* msg */ ) => {
            /*debug("----- command filtration control -----");
                debug(msg);
                debug("---------------------------------------");*/

        }).on("information download control", (msg) => {
            let sourceInfo = globalObject.getData("sources", msg.options.id);
            if (sourceInfo === null) {
                return;
            }

            //формируем сообщение о выполнении процесса скачивания файлов
            helpersFunc.sendBroadcastSocketIo("module NI API", {
                "type": "downloadProcessing",
                "options": {
                    sourceID: msg.options.id,
                    name: sourceInfo.shortName,
                    taskID: msg.taskID,
                    taskIDModuleNI: msg.options.tidapp,
                    status: msg.options.s,
                    parameters: {
                        numberFilesTotal: msg.options.nft, //общее количество скачиваемых файлов
                        numberFilesDownloaded: msg.options.nfd, //количество успешно скаченных файлов
                        numberFilesDownloadedError: msg.options.nfde, //количество файлов скаченных с ошибкой
                        dfi: { //DetailedFileInformation — подробная информация о скачиваемом файле
                            fileName: msg.options.dfi.n, //название файла
                            fullSizeByte: msg.options.dfi.fsb, //полный размер файла в байтах
                            acceptedSizeByte: msg.options.dfi.asb, //скаченный размер файла в байтах
                            acceptedSizePercent: msg.options.dfi.asp, //скаченный размер файла в процентах
                        }
                    },
                }
            });
        }).on("command download control", ( /*msg*/ ) => {
            //debug("----- command download control -----");
            //debug(msg);
            //debug("----------------------------------------");
        }).on("information search control", (msg) => {
            //получили всю информацию о задаче по ее ID
            if (msg.instruction === "processing get all information by task ID") {
                let data = {
                    "type": "processingGetAllInformationByTaskID",
                    "options": {
                        status: msg.options.s,
                        taskParameter: msg.options.tp,
                    }
                };

                if (globalObject.hasData("tasks", msg.taskID)) {
                    let taskInfo = globalObject.getData("tasks", msg.taskID);
                    if (!helpersFunc.sendMessageByUserSocketIo(taskInfo.socketId, "module NI API", data)) {
                        helpersFunc.sendBroadcastSocketIo("module NI API", data);
                    }
                } else {
                    helpersFunc.sendBroadcastSocketIo("module NI API", data);
                }
            }

            //получили краткую информацию о всех задачах подходящих под 
            // заданные условия поиска
            if (msg.instruction === "processing information search task") {
                //ищем тип задачи в globalObject.tasks
                if (globalObject.hasData("tasks", msg.taskID)) {
                    let taskInfo = globalObject.getData("tasks", msg.taskID);

                    debug(`received message 'processing information search task', TYPE: '${taskInfo.eventName}' TO WIDGET '${taskInfo.eventForWidgets}'`);

                    if (taskInfo.eventName === "list all tasks") {
                        require("./route_handlers_socketio/handlers/handlerActionsProcessedReceivedListTasks").receivedListAllTasks(socketIo, msg, taskInfo);
                    }

                    //только для вкладки "загрузка файлов" и для виджетов 
                    if (taskInfo.eventName === "list tasks which need to download files") {
                        require("./route_handlers_socketio/handlers/handlerActionsProcessedReceivedListTasks").receivedListTasksDownloadFiles(socketIo, msg, taskInfo);
                    }

                    //только для виджета "выгруженные файлы не рассмотрены" и
                    // для вкладки поиск, значение "по умолчанию", выводить список
                    // не закрытых пользователем задач
                    if (taskInfo.eventName === "list unresolved tasks") {
                        require("./route_handlers_socketio/handlers/handlerActionsProcessedReceivedListTasks").receivedListUnresolvedTask(socketIo, msg, taskInfo);
                    }
                } else {
                    helpersFunc.sendBroadcastSocketIo("module NI API", {
                        "type": msg.instruction,
                        "options": msg.options,
                    });
                }
            }

            if (msg.instruction === "processing list files by task ID") {
                let data = {
                    "type": "listFilesByTaskID",
                    "options": msg.options,
                };

                if (globalObject.hasData("tasks", msg.taskID)) {
                    let taskInfo = globalObject.getData("tasks", msg.taskID);
                    if (!helpersFunc.sendMessageByUserSocketIo(taskInfo.socketId, "module NI API", data)) {
                        helpersFunc.sendBroadcastSocketIo("module NI API", data);
                    }
                } else {
                    helpersFunc.sendBroadcastSocketIo("module NI API", data);
                }
            }

            if (msg.instruction === "processing get common analytics information about task ID") {
                let data = {
                    "type": "commonAnalyticsInformationAboutTaskID",
                    "options": msg.options,
                };

                if (globalObject.hasData("tasks", msg.taskID)) {
                    let taskInfo = globalObject.getData("tasks", msg.taskID);
                    if (!helpersFunc.sendMessageByUserSocketIo(taskInfo.socketId, "module NI API", data)) {
                        helpersFunc.sendBroadcastSocketIo("module NI API", data);
                    }
                } else {
                    helpersFunc.sendBroadcastSocketIo("module NI API", data);
                }
            }
        }).on("command information search control", (msg) => {
            if (msg.instruction === "delete all information about a task") {
                if (msg.options.ss) {
                    helpersFunc.sendBroadcastSocketIo("module NI API", {
                        "type": "deleteAllInformationAboutTask",
                        "options": {},
                    });
                }
            }

            if (msg.instruction === "mark an task as completed") {
                if (msg.options.ss) {
                    helpersFunc.sendBroadcastSocketIo("module NI API", {
                        "type": "successMarkTaskAsCompleted",
                        "options": { "taskID": msg.options.tid },
                    });
                }
            }
        }).on("user notification", (notify) => {
            showNotify({
                socketIo: socketIo,
                type: notify.options.n.t,
                message: `МОДУЛЬ СЕТЕВОГО ВЗАИМОДЕЙСТВИЯ (${notify.options.n.d})`,
            });

            //записываем сообщение в БД
            require("./handlers_msg_module_network_interaction/handlerMsgNotification")(notify);
        }).on("error", (err) => {
            if (!globalObject.getData("descriptionAPI", "networkInteraction", "previousConnectionStatus")) {
                return;
            }

            helpersFunc.sendBroadcastSocketIo("module NI API", {
                "type": "connectModuleNI",
                "options": {
                    "connectionStatus": false
                },
            });

            globalObject.setData("descriptionAPI", "networkInteraction", "previousConnectionStatus", false);
            writeLogFile("error", `${err.toString()} (module 'network interaction')`);
        });
}

function eventsModuleManagingRecordsStructuredInfo(socketIo) {
    if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection")) {
        return;
    }

    let connection = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
    connection
        .on("connect", () => {
            debug("--- CONNECTION with module ISEMS-MRSICT ---");
        }).on("message", (msg) => {
            debug("--- MESSAGE from module ISEMS-MRSICT ---");
            debug(msg);
        }).on("document message", (msg) => {
            //debug("--- DOCUMENT MESSAGE from module ISEMS-MRSICT ---");
            //debug(msg);

            //вывод информационного сообщения
            if(!msg.is_successful){
                
                //debug("Received NOTIFY Message");
                //debug(msg.information_message);
            
                showNotify({
                    socketIo: socketIo,
                    type: msg.information_message.msg_type,
                    message: `МОДУЛЬ УПРАВЛЕНИЯ СТРУКТУРИРОВАННОЙ ИНФОРМАЦИЕЙ (${msg.information_message.msg})`,
                });

                return;
            }            

            if (globalObject.hasData("tasks", msg.task_id)) {
                let taskInfo = globalObject.getData("tasks", msg.task_id);

                //debug("---- taskInfo ----");
                //debug(taskInfo);

                /*
                console.log("-----====== func 'routeModulesEvent', task info ======-----");
                console.log(taskInfo);
                console.log("________ 1 ________");
                for(let sid in globalObject.getData("descriptionSocketIo", "userConnections")){
                    console.log(`sid; ${sid}`);
                }
                console.log("________ 2 ________");
                console.log(globalObject.getData("descriptionSocketIo", "userConnections", taskInfo.socketId));
                console.log("======================");
                */
                const eventsList = new Set([
                    "list types decisions made computer threat",
                    "list types computer threat",
                    "short information about groups which report available",
                    "send search request, table page report",
                    "send search request, get report for id",
                    "send search request, get STIX object for id",
                    "send search request, count found elem, table page report",
                    "send search request, list different objects STIX object for id",
                    "send search request, count list different objects STIX object for id",
                ]);
                let eventStr = "isems-mrsi response ui";

                if(eventsList.has(taskInfo.eventName)){
                    eventStr += `: ${taskInfo.eventName}`;
                }

                if (!helpersFunc.sendMessageByUserSocketIo(taskInfo.socketId, eventStr, { 
                    section: taskInfo.eventName,
                    eventForWidgets: taskInfo.eventForWidgets,
                    information: msg,
                })) {
                    helpersFunc.sendBroadcastSocketIo("isems-mrsi response ui", msg);
                }
            } else {
                helpersFunc.sendBroadcastSocketIo("isems-mrsi response ui", msg);
            }
        }).on("binary message", (msg) => {
            debug("--- BINARY MESSAGE from module ISEMS-MRSICT ---");
            debug(msg);
        }).on("close", (msg) => {
            debug("--- CONNECTION CLOSE, module ISEMS-MRSICT ---");
            debug(msg);

            if (!globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "previousConnectionStatus")) {
                return;
            }

            globalObject.setData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "previousConnectionStatus", false);
        }).on("error", (err) => {
            debug("--- ERROR, module ISEMS-MRSICT ---");
            debug(err);

            if (!globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "previousConnectionStatus")) {
                return;
            }

            globalObject.setData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "previousConnectionStatus", false);
        });
}
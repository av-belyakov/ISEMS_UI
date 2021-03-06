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

    /*setInterval(() => {
        helpersFunc.sendBroadcastSocketIo("module NI API", {
            "type": "filtrationProcessing",
            "options": {
                sourceID: 1000,
                name: "Test Source 1",
                taskID: "fc88a37bd7044b3ed817e5c3b0b8aeb2375ca502",
                taskIDModuleNI: "6418bd7715cf12b5e47c849a1caf6a03",
                status: "stop",
                parameters: {
                    numDirectoryFiltration: 5,
                    numAllFiles: 234,
                    numProcessedFiles: 132,
                    numProcessedFilesError: 0,
                    numFindFiles: 120,
                    sizeAllFiles: 14837872,
                    sizeFindFiles: 544232,
                },
            },
        });
    }, 15000);

    setInterval(() => {
        helpersFunc.sendBroadcastSocketIo("module NI API", {
            "type": "downloadProcessing",
            "options": {
                sourceID: 1000,
                name: "Test Source 1",
                taskID: "fc88a37bd7044b3ed817e5c3b0b8aeb2375ca502",
                taskIDModuleNI: "6418bd7715cf12b5e47c849a1caf6a03",
                status: "refused",
                parameters: {
                    numberFilesTotal: 235, //общее количество скачиваемых файлов
                    numberFilesDownloaded: 22, //количество успешно скаченных файлов
                    numberFilesDownloadedError: 45, //количество файлов скаченных с ошибкой
                    dfi: { //DetailedFileInformation — подробная информация о скачиваемом файле
                        fileName: "", //название файла
                        fullSizeByte: 55553332, //полный размер файла в байтах
                        acceptedSizeByte: 3244, //скаченный размер файла в байтах
                        acceptedSizePercent: 5454, //скаченный размер файла в процентах
                    }
                },
            },
        });
    }, 16000);
    */
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

            /*
            Запрашиваем ВЕСЬ список источников которые есть в базе
            данных модуля сетевого взаимодействия, что бы получить 
            актуальный список и в том числе статусы сетевых 
            соединений источников
            */
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
            /*debug("----- information source control -----");
            debug(msg);
            debug("--------------------------------------");*/

            require("./handlers_msg_module_network_interaction/handlerMsgSources")(msg, socketIo);
        }).on("command source control", ( /*msg*/ ) => {
            //debug("----- command source control ------");
            //debug(msg);
            //debug("------------------------------------------");

            //обрабатываем запрос ISEMS-NIH на получение актуального списка источников
            require("./handlers_msg_module_network_interaction/handlerMsgGetNewSourceList")();
        }).on("information filtration control", (msg) => {
            //debug("----- information filtration control -----");
            //debug(msg);
            //debug("------------------------------------------");

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
            /*debug("----- information download control -----");
            debug(msg);
            debug("----------------------------------------");*/

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
            //debug("====== information search control =====");
            //debug(JSON.stringify(msg));

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
                        require("./route_handlers_socketio/handlerActionsProcessedReceivedListTasks").receivedListAllTasks(socketIo, msg, taskInfo);
                    }

                    //только для вкладки "загрузка файлов" и для виджетов 
                    if (taskInfo.eventName === "list tasks which need to download files") {
                        require("./route_handlers_socketio/handlerActionsProcessedReceivedListTasks").receivedListTasksDownloadFiles(socketIo, msg, taskInfo);
                    }

                    //только для виджета "выгруженные файлы не рассмотрены" и
                    // для вкладки поиск, значение "по умолчанию", выводить список
                    // не закрытых пользователем задач
                    if (taskInfo.eventName === "list unresolved tasks") {
                        require("./route_handlers_socketio/handlerActionsProcessedReceivedListTasks").receivedListUnresolvedTask(socketIo, msg, taskInfo);
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
                //debug("RECEIVED processing get common analytics information about task ID");
                //debug("-----------------");
                //debug(msg.options);
                //debug("-----------------");

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
                    //                    debug("received message SUCCESS mark task complete");
                    //                    debug(msg);

                    helpersFunc.sendBroadcastSocketIo("module NI API", {
                        "type": "successMarkTaskAsCompleted",
                        "options": { "taskID": msg.options.tid },
                    });
                }
            }

            debug("=======================================");
        }).on("user notification", (notify) => {
            //            debug("---- RECEIVED user notification ----");
            //            debug(notify);

            showNotify({
                socketIo: socketIo,
                type: notify.options.n.t,
                message: `МОДУЛЬ СЕТЕВОГО ВЗАИМОДЕЙСТВИЯ (${notify.options.n.d})`,
            });

            //записываем сообщение в БД
            require("./handlers_msg_module_network_interaction/handlerMsgNotification")(notify);
        }).on("error", (err) => {
            //            debug("ERROR MESSAGE");
            //            debug(err);


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
        }).on("close", (msg) => {
            debug("--- CONNECTION CLOSE, module ISEMS-MRSICT ---");
            debug(msg);

            if (!globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "previousConnectionStatus")) {
                return;
            }

            globalObject.setData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "previousConnectionStatus", false);
        }).on("user notification", (notify) => {
            debug("--- USER NOTIFICATION, module ISEMS-MRSICT ---");
            debug(notify);

        }).on("error", (err) => {
            debug("--- ERROR, module ISEMS-MRSICT ---");
            debug(err);

            if (!globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "previousConnectionStatus")) {
                return;
            }

            globalObject.setData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "previousConnectionStatus", false);
        });
}
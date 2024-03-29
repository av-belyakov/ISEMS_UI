"use strict";

const helpersFunc = require("../../../libs/helpers/helpersFunc");
const writeLogFile = require("../../../libs/writeLogFile");
const globalObject = require("../../../configure/globalObject");

const MAX_CHUNK_SIZE = 10;

/**
 * Обработчик модуля сетевого взаимодействия осуществляющий обработку
 * принятого списка всех задач (при этом поиск по каким либо критериям не осуществлялся)
 * 
 * @param {*} socketIo - дескриптор socketIo соединения
 * @param {*} data - полученные, от модуля сетевого взаимодействия, данные
 * @param {*} sessionId - ID сессии
 */
module.exports.receivedListAllTasks = function(socketIo, data, taskInfo) {
    let sessionId = taskInfo.userSessionID;

    try {
        let resultFoundTasks = globalObject.getData("tmpModuleNetworkInteraction", sessionId, "resultFoundTasks");
        if ((resultFoundTasks === null) || (typeof resultFoundTasks.taskID === "undefined") || (resultFoundTasks.taskID !== data.taskID)) {
            if (!globalObject.hasData("tmpModuleNetworkInteraction", sessionId)) {
                globalObject.setData("tmpModuleNetworkInteraction", sessionId, {
                    tasksDownloadFiles: {},
                    unresolvedTask: {},
                    resultFoundTasks: {},
                });
            }

            //если ID задачи не совпадают создаем новую запись
            globalObject.setData("tmpModuleNetworkInteraction", sessionId, "resultFoundTasks", {
                taskID: data.taskID,
                status: data.options.s,
                numFound: data.options.tntf,
                paginationOptions: {
                    chunkSize: data.options.p.cs,
                    chunkNumber: data.options.p.cn,
                    chunkCurrentNumber: data.options.p.ccn
                },
                listTasksDownloadFiles: data.options.slft,
            });
        } else {
            resultFoundTasks.listTasksDownloadFiles.push(data.options.slft);
        }

        let numFullChunks = 1;
        if (data.options.tntf > MAX_CHUNK_SIZE) {
            numFullChunks = Math.ceil(data.options.tntf / MAX_CHUNK_SIZE);
        }

        //отправляем в UI если это первый сегмент
        if (data.options.p.ccn === 1) {
            let msg = {
                "type": "send a list of found tasks",
                "taskID": data.taskID,
                "options": {
                    p: {
                        cs: MAX_CHUNK_SIZE, //размер части
                        cn: numFullChunks, //всего частей
                        ccn: 1, //номер текущей части
                    },
                    tntf: data.options.tntf,
                    slft: require("../../../libs/helpers/helpersFunc").modifyListFoundTasks(data.options.slft.slice(0, MAX_CHUNK_SIZE)),
                }
            };

            if (!helpersFunc.sendMessageByUserSocketIo(taskInfo.socketId, "module NI API", msg)) {
                helpersFunc.sendBroadcastSocketIo("module NI API", msg);
            }
        }
    } catch (err) {
        writeLogFile("error", `${err.toString()} (func 'receivedListAllTasks')`);
    }

};

/**
 * Обработчик модуля сетевого взаимодействия осуществляющий обработку
 * принятого списка задач файлы по которым не выгружались
 * 
 * @param {*} socketIo - дескриптор socketIo соединения
 * @param {*} data - полученные, от модуля сетевого взаимодействия, данные
 * @param {*} taskInfo - краткая информация о задаче
 * 
 * Так как список задач файлы по которым не выгружались может
 * быть СЕГМЕНТИРОВАН и приходить в несколько частей нужно его 
 * временно сложить в память, а потом вытаскивать по мере запроса.
 * 
 * Исключение составляет первая или единственная часть которая
 * автоматически отправляется в UI
 */
module.exports.receivedListTasksDownloadFiles = function(socketIo, data, taskInfo) {
    let sessionId = taskInfo.userSessionID;

    try {
        let tasksDownloadFiles = globalObject.getData("tmpModuleNetworkInteraction", sessionId, "tasksDownloadFiles");
        if ((tasksDownloadFiles === null) || (typeof tasksDownloadFiles.taskID === "undefined") || (tasksDownloadFiles.taskID !== data.taskID)) {
            if (!globalObject.hasData("tmpModuleNetworkInteraction", sessionId)) {
                globalObject.setData("tmpModuleNetworkInteraction", sessionId, {
                    tasksDownloadFiles: {},
                    unresolvedTask: {},
                    resultFoundTasks: {},
                });
            }

            //если ID задачи не совпадают создаем новую запись
            globalObject.setData("tmpModuleNetworkInteraction", sessionId, "tasksDownloadFiles", {
                taskID: data.taskID,
                status: data.options.s,
                numFound: data.options.tntf,
                paginationOptions: {
                    chunkSize: data.options.p.cs,
                    chunkNumber: data.options.p.cn,
                    chunkCurrentNumber: data.options.p.ccn
                },
                listTasksDownloadFiles: data.options.slft,
            });
        } else {
            tasksDownloadFiles.listTasksDownloadFiles.push(data.options.slft);
        }

        let numFullChunks = 1;
        if (data.options.tntf > MAX_CHUNK_SIZE) {
            numFullChunks = Math.ceil(data.options.tntf / MAX_CHUNK_SIZE);
        }

        //если только для виджета
        if (taskInfo.eventForWidgets) {
            helpersFunc.sendBroadcastSocketIo("module NI API", {
                "type": "get list tasks files not downloaded for widget",
                "taskID": data.taskID,
                "options": {
                    p: {
                        cs: MAX_CHUNK_SIZE, //размер части
                        cn: numFullChunks, //всего частей
                        ccn: 1, //номер текущей части
                    },
                    tntf: data.options.tntf,
                }
            });

            return;
        }

        //отправляем в UI если это первый сегмент
        if (data.options.p.ccn === 1) {
            let msg = {
                "type": "get list tasks files not downloaded",
                "taskID": data.taskID,
                "options": {
                    p: {
                        cs: MAX_CHUNK_SIZE, //размер части
                        cn: numFullChunks, //всего частей
                        ccn: 1, //номер текущей части
                    },
                    tntf: data.options.tntf,
                    slft: require("../../../libs/helpers/helpersFunc").modifyListFoundTasks(data.options.slft.slice(0, MAX_CHUNK_SIZE)),
                }
            };

            if (!helpersFunc.sendMessageByUserSocketIo(taskInfo.socketId, "module NI API", msg)) {
                helpersFunc.sendBroadcastSocketIo("module NI API", msg);
            }
        }
    } catch (err) {
        writeLogFile("error", `${err.toString()} (func 'receivedListTasksDownloadFiles')`);
    }
};

/**
 * Обработчик модуля сетевого взаимодействия осуществляющий обработку
 * принятого списка задач, не отмеченых пользователем как завершенные
 * 
 * @param {*} socketIo - дескриптор socketIo соединения
 * @param {*} data - полученные, от модуля сетевого взаимодействия, данные
 * @param {*} taskInfo - краткая информация о задаче
 * 
 * Так как список задач, не отмеченых пользователем как завершенные, может
 * быть СЕГМЕНТИРОВАН и приходить в несколько частей нужно его 
 * временно сложить в память, а потом вытаскивать по мере запроса.
 * 
 * Исключение составляет первая или единственная часть которая
 * автоматически отправляется в UI
 */
module.exports.receivedListUnresolvedTask = function(socketIo, data, taskInfo) {
    let sessionId = taskInfo.userSessionID;

    try {
        let unresolvedTask = globalObject.getData("tmpModuleNetworkInteraction", sessionId, "unresolvedTask");
        if ((unresolvedTask === null) || (typeof unresolvedTask.taskID === "undefined") || (unresolvedTask.taskID !== data.taskID)) {
            if (!globalObject.hasData("tmpModuleNetworkInteraction", sessionId)) {
                globalObject.setData("tmpModuleNetworkInteraction", sessionId, {
                    tasksDownloadFiles: {},
                    unresolvedTask: {},
                    resultFoundTasks: {},
                });
            }

            //если ID задачи не совпадают создаем новую запись
            globalObject.setData("tmpModuleNetworkInteraction", sessionId, "unresolvedTask", {
                taskID: data.taskID,
                status: data.options.s,
                numFound: data.options.tntf,
                paginationOptions: {
                    chunkSize: data.options.p.cs,
                    chunkNumber: data.options.p.cn,
                    chunkCurrentNumber: data.options.p.ccn
                },
                listUnresolvedTask: data.options.slft,
            });
        } else {
            unresolvedTask.listUnresolvedTask.push(data.options.slft);
        }

        let numFullChunks = 1;
        if (data.options.tntf > MAX_CHUNK_SIZE) {
            numFullChunks = Math.ceil(data.options.tntf / MAX_CHUNK_SIZE);
        }

        //если только для виджета
        if (taskInfo.eventForWidgets) {
            helpersFunc.sendBroadcastSocketIo("module NI API", {
                "type": "get list unresolved task for widget",
                "taskID": data.taskID,
                "options": {
                    p: {
                        cs: MAX_CHUNK_SIZE, //размер части
                        cn: numFullChunks, //всего частей
                        ccn: 1, //номер текущей части
                    },
                    tntf: data.options.tntf,
                }
            });

            return;
        }

        //отправляем в UI если это первый сегмент
        if (data.options.p.ccn === 1) {
            let msg = {
                "type": "get list unresolved task",
                "taskID": data.taskID,
                "options": {
                    p: {
                        cs: MAX_CHUNK_SIZE, //размер части
                        cn: numFullChunks, //всего частей
                        ccn: 1, //номер текущей части
                    },
                    tntf: data.options.tntf,
                    slft: require("../../../libs/helpers/helpersFunc").modifyListFoundTasks(data.options.slft.slice(0, MAX_CHUNK_SIZE)),
                }
            };

            if (!helpersFunc.sendMessageByUserSocketIo(taskInfo.socketId, "module NI API", msg)) {
                helpersFunc.sendBroadcastSocketIo("module NI API", msg);
            }
        }
    } catch (err) {
        writeLogFile("error", `${err.toString()} (func 'receivedListUnresolvedTask')`);
    }
};
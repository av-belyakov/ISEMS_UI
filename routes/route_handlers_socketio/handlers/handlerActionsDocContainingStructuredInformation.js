"use strict";

const debug = require("debug")("hadcsi");

const MyError = require("../../../libs/helpers/myError");
const showNotify = require("../../../libs/showNotify");
const getSessionId = require("../../../libs/helpers/getSessionId");
const createUniqID = require("../../../libs/helpers/createUniqID");
const globalObject = require("../../../configure/globalObject");
const writeLogFile = require("../../../libs/writeLogFile");
const checkUserAuthentication = require("../../../libs/check/checkUserAuthentication");

/**
 * Модуль обработчик действий над документами содержащими структурированную информацию
 *
 * @param {*} socketIo 
 */
module.exports.addHandlers = function(socketIo) {
    const handlers = {
        "managing records structured information: get all count doc type 'reports'": getAllCountDocTypeReport,
    };
    //network interaction:
    for (let e in handlers) {
        socketIo.on(e, handlers[e].bind(null, socketIo));
    }
};

/**
 * Обработчик запроса на получение общего количества всех документов типа 'reports'
 * 
 * @param {*} socketIo 
 * @param {*} data 
 */
function getAllCountDocTypeReport(socketIo, data){
    debug("func 'getAllCountDocTypeReport', START...");
    debug(data);

    let funcName = " (func 'getAllCountDocTypeReport')";

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            //может ли пользователь создавать задачи на скачивание файлов
            /*if (!authData.document.groupSettings.management_network_interaction.element_settings.management_tasks_import.element_settings.resume.status) {
                throw new MyError("management auth", "Невозможно отправить запрос на скачивание файлов. Недостаточно прав на выполнение данного действия.");
            }*/

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
                        return reject(new MyError("management RSIACT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                    }

                    let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                    if (conn !== null) {
                        let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);

                        debug(`send request message /'get all count doc type 'reports'/' taskID: ${taskID} --->`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "get all count doc type 'reports'",
                            eventForWidgets: false,
                            userSessionID: result.sessionId,
                            generationTime: +new Date(),
                            socketId: socketIo.id,
                        });

                        /**
 * нужно учитывать id задачи что бы отправить ответ только тому пользователю который
 * ставил задачу. где то в NIH разделе я уже это делал. Отправка конкретному пользователю
 * осуществляется через функцию sendMessageByUserSocketIo что в helpersFunc, а широковещательное
 * сообщение через sendBroadcastSocketIo, что там же
 */

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
                                    specific_search_fields: [],
                                },
                            },
                        });
                    }

                    resolve();
                });
            });
        }).catch((err) => {
            debug(err);

            if ((err.name === "management auth") || (err.name === "management RSIACT")) {
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
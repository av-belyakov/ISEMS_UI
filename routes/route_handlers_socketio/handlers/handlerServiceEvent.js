"use strict";

/**
 * Модуль обработчик сервисных запросов
 *
 * @param {*} socketIo 
 */
module.exports.addHandlers = function(socketIo) {
    const handlers = {
        "service request: what time is it": handlerWhatTimeIsIt,
    };

    for (let e in handlers) {
        socketIo.on(e, handlers[e].bind(null, socketIo));
    }
};

function handlerWhatTimeIsIt(socketIo, data){
    if(data.arguments.dateType === "integer"){
        socketIo.emit("service event: what time is it", { id: data.arguments.id, date: ((Date.now())/* - 10800*/) });
    }
}
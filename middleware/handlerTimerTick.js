"use strick";

const EventEmitter = require("events");

const writeLogFile = require("../libs/writeLogFile");

class MyEmitter extends EventEmitter {}

class TempTaskStorage {
    constructor() {
        /**
         * {
         *     "listDateTimeTrigger": {}
         *         taskID: {
         *             userName: <имя пользователя добавившего шаблон>
         *             timeCreation: <время создания шаблона>  
         *             dateTimeTrigger: {
         *                 weekday: {} //дни недели, key = сокращенное название на английском, value = полное название на русском
         *                 hour: <час>,
         *                 minutes: <минута>,           
         *             },
         *             taskType: "telemetry", //тип задачи ("telemetry", "filtration")
         *             listSourceID: [], //список источников для которых применима задача, если пусто то для всех            
         *             taskParameters: {} //параметры задачи, пока только для фильтрации
         *         },
         *     },
         * }
         */
        this.obj = {
            "listDateTimeTrigger": {},
        };
    }

    /**
     * Добавляет новый шаблон
     * 
     * @param {*} myEmitter 
     * @param {*} data 
     */
    setTempTask(myEmitter, data) {
        //console.log("class 'TempTaskStorage', func 'setTempTask'");
        //console.log(data);

        if (typeof this.obj.listDateTimeTrigger[data.taskID] !== "undefined") {
            return;
        }

        this.obj.listDateTimeTrigger[data.taskID] = {
            dateTimeTrigger: {
                weekday: data.parameters.timeSettings.listSelectedDays,
                hour: data.parameters.timeSettings.timeTrigger.hour,
                minutes: data.parameters.timeSettings.timeTrigger.minutes,
            },
            taskType: "telemetry",
            listSourceID: data.parameters.listSources,
            timeCreation: data.parameters.timeCreation,
            userName: data.parameters.userName,
            taskParameters: {},
        };

        myEmitter.emit("response set new temp task", {});
    }

    /**
     * Возвращает шаблон по его ID
     * 
     * @param {*} myEmitter 
     * @param {*} data 
     */
    getTempTask(myEmitter, data) {
        //console.log("class 'TempTaskStorage', func 'getTempTask'");
        //console.log(data);
        //console.log(`class 'TempTaskStorage', func 'getTempTask', task: '${this.obj.listDateTimeTrigger[data.taskID]}'`);

        let result = null;
        if (typeof this.obj.listDateTimeTrigger[data.taskID] !== "undefined") {
            result = this.obj.listDateTimeTrigger[data.taskID];
        }

        myEmitter.emit("response get new temp task", result);
    }

    /**
     * Возвращает список всех шаблонов
     * 
     * @param {*} myEmitter 
     * @param {*} data 
     */
    getAllTempTask(myEmitter, data) {
        //console.log("class 'TempTaskStorage', func 'getAllTempTask'");
        //console.log(data);

        myEmitter.emit("response get all new temp task", this.obj.listDateTimeTrigger);
    }

    /**
     * Удаляет выбранный шаблон по его ID
     * 
     * @param {*} myEmitter 
     * @param {*} data 
     */
    delTempTask(myEmitter, data) {
        //console.log("class 'TempTaskStorage', func 'delTempTask'");
        //console.log(data);

        delete this.obj.listDateTimeTrigger[data.taskID];

        myEmitter.emit("response del new temp task", data.taskID);
    }

    readingListTempTaskForTimer({ hour, minutes, dayOfWeek }) {
        console.log("func 'readingListTempTaskForTimer', START");
        console.log(`func 'readingListTempTaskForTimer', hour: ${hour}, minutes: ${minutes}`);

        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        for (let id in this.obj.listDateTimeTrigger) {
            let h = this.obj.listDateTimeTrigger[id].dateTimeTrigger.hour;
            let m = this.obj.listDateTimeTrigger[id].dateTimeTrigger.minutes;

            //console.log(`template id: ${id}, template hour: ${h} === hour: ${hour} and template minutes: ${m} === minutes: ${minutes}, day of week: ${days[dayOfWeek]}`);
            //console.log(this.obj.listDateTimeTrigger[id]);

            require("../libs/handlerAutomaticGenerationQueries")(this.obj.listDateTimeTrigger[id])
                .catch((err) => {
                    writeLogFile("error", err.toString() + " (func 'readingListTempTaskForTimer')");
                });

            if (h === hour && m === minutes) {
                //dayOfWeek
                for (let day in this.obj.listDateTimeTrigger[id].dateTimeTrigger.weekday) {
                    if (day === days[dayOfWeek]) {
                        console.log("func 'readingListTempTaskForTimer', Begining processing");

                        require("../libs/handlerAutomaticGenerationQueries")(this.obj.listDateTimeTrigger[id])
                            .catch((err) => {
                                writeLogFile("error", err.toString() + " (func 'readingListTempTaskForTimer')");
                            });
                    }
                }
            }
        }
    }
}

/**
 * Обработчик таймера 
 */
module.exports = function(sec) {
    const myEmitter = new MyEmitter();
    let tempTaskStorage = new TempTaskStorage();

    /** ЭТО ТОЛЬКО ДЛЯ ТЕСТОВ */
    setTimeout(() => {
        const newDate = new Date;
        let hour = newDate.getHours();
        let minutes = newDate.getMinutes();
        let dayOfWeek = newDate.getDay();

        tempTaskStorage.readingListTempTaskForTimer({ hour: hour, minutes: minutes, dayOfWeek: dayOfWeek });

    }, 15000);

    /*
    ---- ЭТО ДЛЯ БОЕВОГО ИСПОЛЬЗОВАНИЯ ----
    setInterval(() => {
        const newDate = new Date;
        let hour = newDate.getHours();
        let minutes = newDate.getMinutes();
        let dayOfWeek = newDate.getDay();

        console.log(`func 'handlerTimerTick', Get timer: ${new Date}, Hour: ${hour}, Minutes: ${minutes}`);
        console.log("func 'handlerTimerTick', send get list tempTaskStorage");

        tempTaskStorage.readingListTempTaskForTimer({ hour: hour, minutes: minutes, dayOfWeek: dayOfWeek });
    }, sec);
    */

    myEmitter.on("set new temp task", (data) => {
        //console.log("func 'handlerTimerTick', received event 'set new temp task'");
        //console.log(data);

        tempTaskStorage.setTempTask(myEmitter, data);
    });

    myEmitter.on("get new temp task", (data) => {
        //console.log("func 'handlerTimerTick', received event 'get new temp task'");
        //console.log(data);

        tempTaskStorage.getTempTask(myEmitter, data);
    });

    myEmitter.on("get all new temp task", (data) => {
        //console.log("func 'handlerTimerTick', received event 'get all new temp task'");
        //console.log(data);

        tempTaskStorage.getAllTempTask(myEmitter, data);
    });

    myEmitter.on("del new temp task", (data) => {
        //console.log("func 'handlerTimerTick', received event 'del new temp task'");
        //console.log(data);

        tempTaskStorage.delTempTask(myEmitter, data);
    });

    return myEmitter;
};
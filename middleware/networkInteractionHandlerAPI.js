"use strict";

const https = require("https");
const EventEmitter = require("events").EventEmitter;
const webSocketClient = require("websocket").client;

class MyEventEmitter extends EventEmitter {
    constructor(cs) {
        super();

        this.msgType = {
            "information": {
                "source control": "information source control",
                "filtration control": "information filtration control",
                "download control": "information download control",
                "information search control": "information search control",
                "user notification": "user notification"
            },
            "command": {
                "source control": "command source control",
                "filtration control": "command filtration control",
                "download control": "command download control",
                "information search control": "command information search control"
            }
        };

        this.configSettings = cs;
        this.connection;
    }

    createAPIConnection(isDebug = false) {
        console.log("Create API connection to module ISEMS-NIH...");

        let websocketTmp = new webSocketClient({
            closeTimeout: 3000,
            tlsOptions: {
                host: this.configSettings.ip,
                port: this.configSettings.port,
                method: "GET",
                path: "/api_wss",
                rejectUnauthorized: false,
                headers: {
                    "Token": this.configSettings.token,
                }
            },
        });

        websocketTmp.on("connectFailed", (err) => {
            this.emit("error", err);
        });

        websocketTmp.on("connect", (connection) => {
            this.emit("connect", `The connection to the API server with the address ${this.configSettings.ip} successfully installed`);

            this.connection = connection;

            connection.on("error", (err) => {
                this.emit("error", err);
            });

            connection.on("close", () => {
                this.emit("close", "Connection to API server was terminated");
            });

            connection.on("message", (msg) => {
                if (msg.type !== "utf8") {
                    this.emit("error message", new Error("Incorrect message format is accepted, binary data may be accepted"));

                    return;
                }

                try {
                    let json = JSON.parse(msg.utf8Data);

                    if (typeof this.msgType[json.t] === "undefined") {
                        throw new Error("Invalid JSON message type accepted");
                    }

                    let mt = this.msgType[json.t];

                    if (typeof mt[json.s] === "undefined") {
                        throw new Error("Invalid value in \"section\" field of JSON message");
                    }

                    this.emit(mt[json.s], {
                        instruction: json.i,
                        taskID: (typeof json.tid !== "undefined") ? json.tid : "",
                        options: json.o
                    });
                } catch (err) {
                    this.emit("error message", err);
                }
            });
        });

        websocketTmp.on("error", (err) => {
            this.emit("error", err);
        });

        let options = {
            host: this.configSettings.ip,
            port: this.configSettings.port,
            servername: "",
            method: "GET",
            path: "/api",
            rejectUnauthorized: false,
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
                "Accept-Language": "en",
                "User-Agent": "Mozilla/5.0 (isems-ui)",
                "Token": this.configSettings.token
            }
        };

        //предварительный HTTP запрос
        let req = https.request(options, (res) => {
            if (res.statusCode !== 301) {
                this.emit("error", new Error(`Connection error to remote host ${this.configSettings.ip}:${this.configSettings.port}`));

                return;
            }

            websocketTmp.connect(`wss://${this.configSettings.ip}:${this.configSettings.port}/api_wss`);

            res.on("data", () => {});
            res.on("end", () => {});
        });

        req.on("error", (err) => {
            this.emit("error", err);
        });

        req.end();

        return this;
    }

    closeAPIConnection() {
        this.connection.close();
    }

    dropAPIConnection() {
        this.connection.drop();
    }

    /**
     * @param {*} settings {
     *   msgType: 'information'/'command',
     *   msgSection:
     *     - 'source control',
           - 'filtration control',
           - 'download control',
           - 'information search control'
        taskID: '',
        options: {}
     * }
     */
    sendMessage({
        msgType: t,
        msgSection: s,
        msgInstruction: i = null,
        taskID: tid = null,
        options: o
    }) {
        if (typeof this.msgType[t] === "undefined") {
            this.emit("error", new Error("An error occurred while sending message, field \"msgType\" has incorrect value or is not set"));

            return;
        }

        if (typeof this.msgType[t][s] === "undefined") {
            this.emit("error", new Error("An error occurred while sending message, field \"msgSection\" has incorrect value or is not set"));

            return;
        }

        if (i === null) {
            this.emit("error", new Error("An error occurred while sending message, field \"msgInstruction\" has incorrect value or is not set"));

            return;
        }

        if (tid === null) {
            this.emit("user notification", "Attention, the task ID is not set, when receiving the message it will not be possible to identify the task");
        }

        if (typeof o === "undefined") {
            this.emit("error", new Error("An error occurred while sending message, field \"options\" has incorrect value or is not set"));

            return;
        }

        let jsonMsg = JSON.stringify({
            t,
            s,
            i,
            tid,
            o
        });

        this.connection.sendUTF(jsonMsg);
    }
}

/**
 * @param {*} configSettings { ip:"", port:"", tokent:"" } 
 */
module.exports = (configSettings) => {
    return new MyEventEmitter(configSettings);
};
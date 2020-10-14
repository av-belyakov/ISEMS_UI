/**
 * Модуль формирующий информационные сообщения на странице
 * 
 * Версия 1.2, дата релиза 30.12.2019
 */

"use strict";

import React from "react";
import ReactDOM from "react-dom";
import NotificationSystem from "react-notification-system";

import PropTypes from "prop-types";

class CreateAlert extends React.Component {
    constructor(props){
        super(props);
     
        this.notificationSystem = React.createRef();
        this.eventsListener();
    }

    eventsListener(){
        this.props.socketIo.on("notify information", data => {
            let msg = JSON.parse(data.notify);

            const titleObj = {
                "success": "Выполненное действие.",
                "info": "Информация.",
                "warning": "Внимание!",
                "error": "Ошибка!!!",
            };

            const level = (msg.type === "danger")? "error": msg.type;
            const notification = this.notificationSystem.current;
            notification.addNotification({
                title: titleObj[level],
                message: msg.message,
                level: level,
                autoDismiss: 12,
            });
        });       
    }

    render(){
        let style = {
            NotificationItem: {
                DefaultStyle: {
                    lineHeight: "16px",
                },
            }
        };

        return <NotificationSystem ref={this.notificationSystem} style={style}/>;
    }
}

CreateAlert.propTypes = {
    socketIo: PropTypes.object.isRequired,
};

ReactDOM.render(<CreateAlert socketIo={socket} />, document.getElementById("location-alerts"));
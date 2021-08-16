import React from "react";
import { Col, Row } from "react-bootstrap";
//import {  } from "@material-ui/core";
import PropTypes from "prop-types";

export default class CreateMainTableForReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {};

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("", (data) => {
            console.log(data);
        });
    }

    requestEmitter(){
        this.props.socketIo.emit("", { arguments: {}});

        /*
        Теперь можно занятся формирвание  запроса на получение данных связанных с типом Report STIX объекта.
        Сформировать таблицу. Запрос данных, по умолчанию, должен быть как получить все объекты типа Report с
        сортировкой по дате создания, сначала самые новые и с лимитом, например, 10 или 15 объектов. В таблице
        обязательно должна быть колонка с иконками типов объектов DO STIX, ссылки на которых есть в свойстве
        object_ref.
        */

    }

    render(){
        return (
            <React.Fragment>
                <hr/>
                <Row><Col md={12} className="pt-4 text-center"><h3>Область основной таблицы страницы Report</h3></Col></Row>
            </React.Fragment>
        );
    }
}

CreateMainTableForReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
};
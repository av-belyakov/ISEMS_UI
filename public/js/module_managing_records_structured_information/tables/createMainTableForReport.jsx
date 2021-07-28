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
import React from "react";
import { Col, Row } from "react-bootstrap";
//import {  } from "@material-ui/core";
import PropTypes from "prop-types";

export default class CreateSearchElementReport extends React.Component {
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
                <Row><Col md={12} className="pt-4 text-center"><h3>Область основного набор элементов поиска страницы Report</h3></Col></Row>
                <Row><Col md={12} className="text-center">{(this.props.userPermissions.privileged_group.status)? 
                    <span className="text-success">привилегированная группа</span>: 
                    <span className="text-danger">непривилегированная группа</span>}</Col></Row>
            </React.Fragment>
        );
    }
}

CreateSearchElementReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
};
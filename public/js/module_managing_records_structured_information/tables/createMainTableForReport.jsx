import React from "react";
import { Col, Row } from "react-bootstrap";
//import {  } from "@material-ui/core";
import PropTypes from "prop-types";

export default class CreateMainTableForReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            listReports: [],
        };

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("isems-mrsi response ui", (data) => {

            //            console.log("class 'CreateMainTableForReport'");
            //            console.log(data);

            if(data.section === "send search request, table page report"){
                console.log("___ data for table START");
                console.log(data);
                console.log("___ data for table END");

                if((typeof data.information === "undefined") || (data.information === null)){

                    console.log("ERROR: 1");

                    return;
                }

                if((typeof data.information.additional_parameters === "undefined") || (data.information.additional_parameters === null)){
                    
                    console.log("ERROR: 2");
                    
                    return;
                }

                if((typeof data.information.additional_parameters.transmitted_data === "undefined") || (data.information.additional_parameters.transmitted_data === null)){
                    
                    console.log("ERROR: 3");
                    
                    return;
                }

                this.setState({ listReports: data.information.additional_parameters.transmitted_data });
            }
        });
    }

    requestEmitter(){}

    createTable(){


        /**
         * Теперь надо сделать таблицу
         */


        return this.state.listReports.forEach((item) => {

            console.log(item);

            return <Row>
                <Col md={2}>{item.type}</Col>
                <Col md={6} className="text-center">{item.id}</Col>
                <Col md={6} className="text-center">{item.created}</Col>
            </Row>;
        });
    }

    render(){
        return (
            <React.Fragment>
                <hr/>
                <Row><Col md={12} className="pt-4 text-center"><h3>Область основной таблицы страницы Report!</h3></Col></Row>
                {this.createTable.call(this)}
            </React.Fragment>
        );
    }
}

CreateMainTableForReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
};
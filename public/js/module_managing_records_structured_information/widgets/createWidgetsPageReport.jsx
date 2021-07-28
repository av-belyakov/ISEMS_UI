import React from "react";
//import { Button, Col, Container, Spinner, Row, Navbar } from "react-bootstrap";
//import {  } from "@material-ui/core";
import PropTypes from "prop-types";

import { SkeletonTypography } from "../helpersFunction.jsx";

export default class CreateWidgetsPageReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            numOpenReports: 0, //колличество открытых (не опубликованных) докладов
            numPublishedReports: 0, //колличество закрытых докладов
            numTotalReports: 0, //общее колличество объектов, это сумма numOpenReports + numPublishedReports
            numSuccessfullyImplementedComputerThreat: 0, //успешно реализованная компьютерная угроза
            numComputerThreatNotSuccessful: 0, //компьютерная угроза не являющаяся успешной
            numUnconfirmedComputerThreat: 0, //не подтвердившаяся компьютерная угроза
        };

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("isems-mrsi response ui", (data) => {
            console.log("class 'CreatePageReport', receive event:");
            console.log(data);
        
            switch(data.section){
            case "handling search requests":
                if(typeof data.additional_parameters.number_documents_found !== "undefined"){
                    console.log("результат ввиде колличества найденных документов");

                    this.setState({ totalReports: data.additional_parameters.number_documents_found });
                } else if(typeof data.additional_parameters.transmitted_data !== "undefined"){
                    console.log("результат ввиде полного списка найденной информации");
                } else {
                    console.log("наверное информационное сообщение что данные не определены");
                }

                return;
        
            case "":
        
                return;
            }
        });
    }

    requestEmitter(){
        this.props.socketIo.emit("managing records structured information: get all count doc type 'reports'", { arguments: {}});
    }

    render(){
        return (
            <React.Fragment>
                <ul>Перечень виджетов:
                    <li>колличество открытых (не опубликованных) докладов</li>
                    <li>колличество закрытых докладов</li>
                    <li>общее колличество докладов (сумма первых двух)</li>
                    <li>успешно реализованная компьютерная угроза</li>
                    <li>компьютерная угроза не являющаяся успешной</li>
                    <li>не подтвердившаяся компьютерная угроза</li>
                </ul>
                <SkeletonTypography />
            </React.Fragment>
        );
    }
}

CreateWidgetsPageReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
};
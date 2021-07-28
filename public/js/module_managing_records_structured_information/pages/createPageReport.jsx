import React from "react";
import { Button, Col, Container, Spinner, Row, Navbar } from "react-bootstrap";
//import {  } from "@material-ui/core";
import PropTypes from "prop-types";

import CreateMainTableReport from "../tables/createMainTableForReport.jsx";
import CreateWidgetsPageReport from "../widgets/createWidgetsPageReport.jsx";
import CreateSearchElementReport from "../any_elements/createSearchElementForReport.jsx";
import ModalWindowAddReportSTIX from "../../modal_windows/modalWindowAddReportSTIX.jsx";

export default class CreatePageReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showSpinner: true,
            showModalWindowAddReport: false,

            reportsOnPage: [],
            paginate: {
                currentNumPage: 0,
                totalNumPage:0, 
            },
        };

        console.log("------ данные с сервера полученные при загрузки страницы ------");
        console.log(this.props.receivedData);
        console.log("---------------------------------------------------------------");

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);

        this.handlerShowModalWindowAddReport = this.handlerShowModalWindowAddReport.bind(this);
        this.handlerCloseModalWindowAddReport = this.handlerCloseModalWindowAddReport.bind(this);
    }

    handlerEvents(){
    }

    handlerShowModalWindowAddReport(){
        this.setState({ showModalWindowAddReport: true });
    }

    handlerCloseModalWindowAddReport(){
        this.setState({ showModalWindowAddReport: false });
    }

    requestEmitter(){
    }

    isDisabledNewReport(){
        return (this.props.receivedData.userPermissions.create.status)? "": "disabled";
    }

    render(){
        return (
            <React.Fragment>
                <Row>
                    <Col md={6} className="text-left">
                        <CreateWidgetsPageReport socketIo={this.props.socketIo}/>
                    </Col>
                    <Col md={6} className="text-right">
                        <Button
                            size="sm"
                            variant="outline-primary"
                            disabled={this.isDisabledNewReport.call(this)}
                            onClick={this.handlerShowModalWindowAddReport} >
                            добавить
                        </Button>
                    </Col>
                </Row>

                {/** элементы поиска информации */}
                <CreateSearchElementReport socketIo={this.props.socketIo} userPermissions={this.props.receivedData.userPermissions}/>

                {/** основная таблица страницы */}
                <CreateMainTableReport socketIo={this.props.socketIo}/>

                <ModalWindowAddReportSTIX
                    show={this.state.showModalWindowAddReport}
                    onHide={this.handlerCloseModalWindowAddReport}
                    socketIo={this.props.socketIo} />
            </React.Fragment>
        );
    }
}

CreatePageReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};

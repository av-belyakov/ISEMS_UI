import React from "react";
import { Col, Row } from "react-bootstrap";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

import CreateMainTableReport from "../tables/createMainTableForReport.jsx";
import CreateWidgetsPageReport from "../widgets/createWidgetsPageReport.jsx";
import CreateSearchElementReport from "../any_elements/createSearchElementForReport.jsx";
import ModalWindowAddReportSTIX from "../../modal_windows/modalWindowAddReportSTIX.jsx";

import { CreateButtonNewReport } from "../buttons/createButtonNewReport.jsx";

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
        return !this.props.receivedData.userPermissions.create.status;
    }

    render(){
        return (
            <React.Fragment>
                <CreateWidgetsPageReport socketIo={this.props.socketIo}/>

                <Row>
                    <Col md={12} className="text-right pt-2">
                        <CreateButtonNewReport 
                            buttonIsDisabled={this.isDisabledNewReport.call(this)}
                            handlerShowModalWindow={this.handlerShowModalWindowAddReport}/>
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

import React from "react";
import ReactDOM from "react-dom";
import { Button, Col, Container, Spinner, Row, Navbar } from "react-bootstrap";
//import {  } from "@material-ui/core";
import PropTypes from "prop-types";

import ModalWindowAddReportSTIX from "../../modal_windows/modalWindowAddReportSTIX.jsx";

export default class CreatePageReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showSpinner: true,
            showModalWindowAddReport: false,
            totalReports: 0,
            totalReportsFound: 0,
            reportsOnPage: [],
            paginate: {
                currentNumPage: 0,
                totalNumPage:0, 
            },
        };

        console.log(this.props);

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);

        this.handlerShowModalWindowAddReport = this.handlerShowModalWindowAddReport.bind(this);
        this.handlerCloseModalWindowAddReport = this.handlerCloseModalWindowAddReport.bind(this);
    }

    handlerEvents(){
        this.props.socketIo.on("isems-mrsi response ui", (data) => {
            console.log("class 'CreatePageReport', receive event:");
            console.log(data);
        });
    }

    handlerShowModalWindowAddReport(){
        this.setState({ showModalWindowAddReport: true });
    }

    handlerCloseModalWindowAddReport(){
        this.setState({ showModalWindowAddReport: false });
    }

    requestEmitter(){
        this.props.socketIo.emit("managing records structured information: get all count doc type 'reports'", { arguments: {}});

        /*
        this.props.socketIo.emit("isems-mrsi request ui", { arguments: {
            command: "get", // команда или действие
            docType: "report", // наименование документа stix или 'all' для всех
            count: true, // вернуть только количество
            entireContentsDocument: false, // вернуть все содержимое документа
            options: {}, // дополнительные параметры запроса, например, параметры поиска
        }});   
*/
    }

    createTable(){
    /**
     * let showSpinner = (
            <Row className="pt-3">
                <Col md={12}>
                    <CreateBodyDownloadFiles
                        socketIo={this.props.socketIo}
                        currentTaskID={this.state.currentTaskID}
                        listFileDownloadOptions={this.state.listFileDownloadOptions}
                        handlerModalWindowShowTaskTnformation={this.handlerModalWindowShowTaskTnformation} 
                        handlerShowModalWindowListFileDownload={this.handlerShowModalWindowListDownload} />
                </Col>
            </Row>
        );
        if(this.state.showSpinner){
            showSpinner = (
                <Row className="pt-4">
                    <Col md={12}>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="sr-only text-muted">Загрузка...</span>
                        </Spinner>
                    </Col>
                </Row>
            );
        }
     */
        if(this.state.showSpinner){
            return (
                <Row className="pt-4 text-center">
                    <Col md={12}>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="sr-only text-muted">Загрузка...</span>
                        </Spinner>
                    </Col>
                </Row>
            );
        }

        return <Row>Table</Row>;
    }

    render(){
        return (
            <React.Fragment>
                <Row>
                    <Col md={6} className="text-left">
                        <span className="text-muted">всего / найдено / на странице:</span> {` ${this.state.totalReports} / ${this.state.totalReportsFound} / ${this.state.reportsOnPage.length}`}
                    </Col>
                    <Col md={6} className="text-right">
                        <Button
                            //className="mx-1"
                            size="sm"
                            variant="outline-primary"
                            //disabled={this.isDisabledFiltering.call(this)}
                            onClick={this.handlerShowModalWindowAddReport} >
                            добавить
                        </Button>
                    </Col>
                </Row>
                <Row className="pt-4">
                    <Col md={12}>
                        <p>Report Page</p>
                        <p>
                            Здесь мы видим только объекты типа Reports. Поиск любых других типов объектов здесь не возможен. 
                            Если пользователь не является привилегированным, то поиск докладов и вывод всех докладов, без учета
                            фильтров, осуществляется через список объектов типа Reports, которые разрешены для просмотра данному
                            пользователю.
                        </p>

  1. Наладить взаимодействие с ядром UI через websocket
  2. Получать общее количество документов типа Report (эти данные будут видны не зависимо от статуса пользователя)
  3. Сделать набросок набора полей по которым будет осуществлятся поиск документов типа Report (с оглядкой на статус пользователя)
  4. Предусмотреть элемент, скорее всего это будет кнопка, через который будет вызыватся модальное окно применяемое для формирования
 *      нового документа типа Report, с дополнительными элементами, позволяющими сразу привязать к данному документу, документы 
 *      других типов
 * 5. Сформировать таблицу, с пагинатором, выводящую информацию о найденных документах типа Report (при этом нужно учитывать статус пользователя)
 
                    </Col>
                </Row>
                {this.createTable.call(this)}

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
};

/**
 * 1. Наладить взаимодействие с ядром UI через websocket
 * 2. Получать общее количество документов типа Report (эти данные будут видны не зависимо от статуса пользователя)
 * 3. Сделать набросок набора полей по которым будет осуществлятся поиск документов типа Report (с оглядкой на статус пользователя)
 * 4. Предусмотреть элемент, скорее всего это будет кнопка, через который будет вызыватся модальное окно применяемое для формирования
 *      нового документа типа Report, с дополнительными элементами, позволяющими сразу привязать к данному документу, документы 
 *      других типов
 * 5. Сформировать таблицу, с пагинатором, выводящую информацию о найденных документах типа Report (при этом нужно учитывать статус пользователя)
 */
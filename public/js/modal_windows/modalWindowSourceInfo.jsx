"use strict";

import React from "react";
import { Accordion, Badge, Button, Card, Modal, Spinner, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

export default class ModalWindowSourceInfo extends React.Component {
    constructor(props){
        super(props);

        this.state = { "receivedInformation": false };

        this.fullInformationAboutSource = {};

        this.windowClose = this.windowClose.bind(this);
        this.getListDirectory = this.getListDirectory.bind(this);
        this.createMajorBobyElemet = this.createMajorBobyElemet.bind(this);
        
        this.listenerSocketIoConnect.call(this);
    }

    windowClose(){
        this.props.onHide();
        this.setState({ "receivedInformation": false });
        this.fullInformationAboutSource = {};
    }

    listenerSocketIoConnect(){
        this.props.socketIo.on("entity: set info about source", (data) => {
            this.fullInformationAboutSource = data.arguments;
            this.setState({ receivedInformation: true });
        });
    }

    getListDirectory(s){
        return (
            <ul>
                {s.source_settings.list_directories_with_file_network_traffic.map((item) => {
                    return <li type="1" key={`lf_${item}`}>{item}</li>;
                })}
            </ul>
        );
    }

    createMajorBobyElemet(){
        if(!this.state.receivedInformation){
            return (
                <div className="row">
                    <div className="col-md-12 text-center">
                    Источник №{this.props.settings.sourceID}, загрузка информации...
                    </div>
                    <div className="col-md-12 text-center">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="sr-only">Загрузка...</span>
                        </Spinner>
                    </div>
                </div>
            );
        }

        let formatter = Intl.DateTimeFormat("ru-Ru", {
            timeZone: "Europe/Moscow",
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
        let { source: s, division: d, organization: o } = this.fullInformationAboutSource;

        return (
            <React.Fragment>
                <div className="col-md-12 text-center"><strong>Источник № {s.source_id} ({s.short_name})</strong></div>
                <Accordion defaultActiveKey="2">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header as="h5">
                            Информация об организации
                        </Accordion.Header>
                        <Accordion.Body>
                            <Card>
                                <Card.Body>
                                    <div className="col-md-12 text-center"><strong>{o.name}</strong></div>
                                    <div className="row">
                                        <div className="col-md-12 text-left">
                                        Добавлена: <em>{formatter.format(o.date_register)}</em>,&nbsp;
                                        последнее изменение: <em>{formatter.format(o.date_change)}</em>
                                        </div>
                                        <div className="col-md-4 text-right"><small>Подразделений:</small></div>
                                        <div className="col-md-8 text-left">
                                            {o.division_or_branch_list_id.length}
                                        </div>
                                        <div className="col-md-4 text-right"><small>Вид деятельности:</small></div>
                                        <div className="col-md-8 text-left">
                                            {o.field_activity}
                                        </div>        
                                        <div className="col-md-4 text-right"><small>Юридический адрес:</small></div>
                                        <div className="col-md-8 text-left">
                                            {o.legal_address}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header as="h5">
                            Информация о подразделении или филиале организации
                        </Accordion.Header>
                        <Accordion.Body>
                            <Card>
                                <Card.Body>
                                    <div className="col-md-12 text-center"><strong>{d.name}</strong></div>
                                    <div className="row">
                                        <div className="col-md-12 text-left">
                                        Добавлена: <em>{formatter.format(d.date_register)}</em>,&nbsp;
                                        последнее изменение: <em>{formatter.format(d.date_change)}</em>
                                        </div>
                                        <div className="col-md-4 text-right"><small>Установленных источников:</small></div>
                                        <div className="col-md-8 text-left">
                                            {d.source_list.length}
                                        </div>
                                        <div className="col-md-4 text-right"><small>Физический адрес:</small></div>
                                        <div className="col-md-8 text-left">
                                            {d.physical_address}
                                        </div>
                                        <div className="col-md-4 text-right"><small>Примечание:</small></div>
                                        <div className="col-md-8 text-left">
                                            {d.description}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header as="h5">
                            Информация по источнику № {s.source_id}
                        </Accordion.Header>
                        <Accordion.Body>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md={12} className="text-left">
                                            Добавлена: <em>{formatter.format(s.date_register)}</em>,&nbsp;
                                            последнее изменение: <em>{formatter.format(s.date_change)}</em>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="text-left">
                                        Статус сетевого соединения: {(this.props.settings.connectionStatus) ? <Badge bg="success">подключен</Badge>: <Badge bg="danger">соединение отсутствует</Badge>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="text-left">
                                        Время последнего сетевого соединения: <em>{(this.props.settings.connectTime === 0) ? "не определено": formatter.format(this.props.settings.connectTime * 1000)}</em>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="text-left">Сетевые настройки:</Col>
                                    </Row>
                                    <Row>
                                        <Col md={3} className="text-right"><small>ip адрес</small></Col>
                                        <Col md={3} className="text-right"><small>сетевой порт</small></Col>
                                        <Col md={6} className="text-right"><small>токен</small></Col>
                                    </Row>
                                    <Row>
                                        <Col md={3} className="text-center">{s.network_settings.ipaddress}</Col>
                                        <Col md={3} className="text-center">{s.network_settings.port}</Col>
                                        <Col md={6} className="text-center">{s.network_settings.token_id}</Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="text-left">Общие настройки:</Col>
                                    </Row>
                                    <Row>
                                        <Col md={3} className="text-right"><small>архитектура:</small></Col>
                                        <Col md={9} className="text-left">
                                            {(s.source_settings.type_architecture_client_server === "client") ? <Badge bg="success">{s.source_settings.type_architecture_client_server}</Badge> : <Badge bg="primary">{s.source_settings.type_architecture_client_server}</Badge>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3} className="text-right"><small>телеметрия:</small></Col>
                                        <Col md={9} className="text-left">
                                            {(s.source_settings.transmission_telemetry) ? <Badge bg="primary">включена</Badge> : <Badge bg="danger">выключена</Badge>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3} className="text-right"><small>количество задач:</small></Col>
                                        <Col md={9} className="text-left">
                                            {s.source_settings.maximum_number_simultaneous_filtering_processes}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3} className="text-right"><small>тип сетевого канала:</small></Col>
                                        <Col md={9} className="text-left">
                                            {s.source_settings.type_channel_layer_protocol}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3} className="text-right"><small>список директорий:</small></Col>
                                        <Col md={9} className="text-left">{this.getListDirectory(s)}</Col>
                                    </Row>
                                    <Row>
                                        <Col md={3} className="text-right"><small>Примечание:</small></Col>
                                        <Col md={9} className="text-left">{s.description}</Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br />
                <div className="col-md-12 text-right">
                    <Button variant="outline-primary" onClick={this.windowClose}>Закрыть</Button>
                </div>
            </React.Fragment>
        );
    }

    render(){       
        return (
            <Modal
                size="lg"
                show={this.props.show} 
                onHide={this.windowClose}
                aria-labelledby="example-modal-sizes-title-lg" >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <h5>Информация</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.createMajorBobyElemet()}</Modal.Body>
            </Modal>
        );
    }
}

ModalWindowSourceInfo.propTypes = {
    settings: PropTypes.object,
    show: PropTypes.bool,
    onHide: PropTypes.func,
    socketIo: PropTypes.object,
};
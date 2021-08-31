"use strict";

import React from "react";
import { Col, Button, Modal, Row } from "react-bootstrap";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";

export default class ModalWindowShowInformationReportSTIX extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            reportInfo: {},
            availableForGroups: [],
        };

        this.handleSave = this.handleSave.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handlerEvents = this.handlerEvents.call(this);
    }

    handlerEvents(){
        //обработка события связанного с приемом списка групп которым разрешен доступ к данному докладу
        this.props.socketIo.on("isems-mrsi response ui", (data) => {

            console.log("class 'ModalWindowShowInformationReportSTIX', func 'handlerEvents'");
            console.log(`sections: ${data.section}`);
            console.log(data.information.additional_parameters);

            if(data.section === "list of groups that are allowed access"){
                this.setState({ availableForGroups: data.information.additional_parameters });
            }

            if(data.section === "send search request, get report for id"){
                this.setState({ reportInfo: data.information.additional_parameters.transmitted_data });
            }
        }); 
    }

    handleClose(){
        this.modalClose();
    }

    handleSave(){}

    modalClose(){
        this.props.onHide();

        this.setState({
            reportInfo: {},
            availableForGroups: [],
        });
    }

    render() {
        if(this.state.reportInfo.length !== 1){
            return (
                <Modal
                    show={this.props.show}
                    onHide={this.modalClose}
                    dialogClassName="modal-90w"
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter" >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Доклад</Modal.Title>
                    </Modal.Header>
                    <Modal.Body />
                    <Modal.Footer>
                        <Button variant="outline-secondary" size="sm" onClick={this.handleClose}>закрыть</Button>
                    </Modal.Footer>
                </Modal>
            );
        }

        let reportInfo = this.state.reportInfo[0];
        let published = () => {
            if(Date.parse(reportInfo.published) <= 0){
                return <span className="text-secondary">доклад не опубликован</span>;
            }

            return <i>{helpers.convertDateFromString(reportInfo.published, { monthDescription: "long", dayDescription: "numeric" })}</i>;
        };
        let additionalName = () => {
            if(reportInfo.outside_specification.additional_name.length === 0){
                return <span className="text-secondary">не определено</span>;
            }

            return <i>{reportInfo.outside_specification.additional_name}</i>;
        };
        let decisionsMadeComputerThreat = () => {
            /**
             * 
             * 
             * Здесь надо транслировать наименование типа принимаемых решений на русский язык
             * для этого нужно сделать обработку запроса списков на backend
             * запрос нужно сделать при формировании страницы  REPORT
            */

            if(reportInfo.outside_specification.decisions_made_computer_threat.length === 0){
                return <span className="text-secondary">решение не принималось</span>;
            }
    
            return <i>{reportInfo.outside_specification.decisions_made_computer_threat}</i>;
        };
        let computerThreatType = () => {
            /**
             * 
             * 
             * 
             * Здесь надо транслировать наименование компьютерной атаки на русский язык
             * для этого нужно сделать обработку запроса списков на backend 
             * запрос нужно сделать при формировании страницы  REPORT
             * */

            if(reportInfo.outside_specification.computer_threat_type.length === 0){
                return <span className="text-secondary">не определен</span>;
            }
    
            return <i>{reportInfo.outside_specification.computer_threat_type}</i>;
        };

        return (
            <Modal
                show={this.props.show}
                onHide={this.modalClose}
                dialogClassName="modal-70w"
                size="lg"
                aria-labelledby="contained-modal-title-vcenter" >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Доклад</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12} className="pl-3 pr-3">
                            <Row>
                                <Col md={12} className="text-center">Доклад "<strong>{reportInfo.name}</strong>".</Col>
                            </Row>
                            <Row>
                                <Col md={12} className="text-center">(ID:"<i>{reportInfo.id}</i>")</Col>
                            </Row>
                            <Row>
                                <Col md={12} className="ml-4 mt-2">Дата и время:</Col>
                            </Row>                    
                            <Row>
                                <Col md={12}>создания - <i>{helpers.convertDateFromString(reportInfo.created, { monthDescription: "long", dayDescription: "numeric" })}</i>,</Col>
                            </Row>
                            <Row>
                                <Col md={12}>последнего обновления - <i>{helpers.convertDateFromString(reportInfo.modified, { monthDescription: "long", dayDescription: "numeric" })}</i>,</Col>
                            </Row>
                            <Row>
                                <Col md={12}>публикации - {published()}.</Col>
                            </Row>
                            <Row>
                                <Col md={12} className="ml-4 mt-2">Подробное описание:</Col>
                            </Row>
                            <Row>
                                <Col md={12}><p><i>{reportInfo.description}</i></p></Col>
                            </Row>
                            <Row>
                                <Col md={12} className="ml-4 mt-2 text-center">
                                    <ins>Дополнительная информация не входящая в основную спецификацию объекта SDO STIX 2.1</ins>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4} className="text-left">дополнительное наименование:</Col>
                                <Col md={4} className="text-left">принятое решение по компьютерной угрозе:</Col>
                                <Col md={4} className="text-left">тип компьютерной угрозы:</Col>
                            </Row>
                            <Row>
                                <Col md={4} className="text-center">{additionalName()}</Col>
                                <Col md={4} className="text-center">{decisionsMadeComputerThreat()}</Col>
                                <Col md={4} className="text-center">{computerThreatType()}</Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    {/** 
                                     * Перенести отрисовку аккордиона в отдельную функцию createAdditionalTechnicalInformation
                                     * и дополнить дополнительной информацией!!!
                                      */}
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="accordion-additional-technical-information">
                                            <Row>
                                                <Col className="text-center">Дополнительная техническая информация</Col>
                                            </Row>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Row>
                                                <Col md={6}>
                                                    версия спецификации STIX: {(reportInfo.spec_version.length === 0) ? <span className="text-secondary">версия не определена</span> : reportInfo.spec_version}
                                                </Col>
                                                <Col md={6}>
                                                    текстовый код языка: {(reportInfo.lang.length === 0) ?  <span className="text-secondary">код не определен</span> : reportInfo.lang.toUpperCase()}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12}>уверенность создателя в правильности своих данных 0-100 (чем больше тем увереннее): {reportInfo.confidence}</Col>
                                            </Row>
                                        </AccordionDetails>
                                    </Accordion>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>Идентификатор источника создавшего доклад:</Col>
                            </Row>
                        </Col>
                    </Row>

                    <hr/>
                    <Row>
                        <Col md={8}>{JSON.stringify(this.state.reportInfo)}</Col>
                        <Col md={4}>{JSON.stringify(this.state.availableForGroups)}</Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" size="sm" onClick={this.handleClose}>закрыть</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

/**
// Name - имя используемое для идентификации "Report" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// ReportTypes [] - заранее определенный (предложенный) перечень возможных типов контента содержащихся в этом отчете
// Published - время, в формате "2016-05-12T08:17:27.000Z", когда данный отчет был официально опубликован (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ObjectRefs [] - список идентификаторов STIX объектов, которые ссылаются на этот отчет (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// OutsideSpecification - свойства не входящие в основную спецификацию STIX 2.0
    //AdditionalName - дополнительное наименование
    // DecisionsMadeComputerThreat - принятые решения по компьютерной угрозе
    // ComputerThreatType - тип компьютерной угрозы

// +SpecVersion - версия спецификации STIX используемая для представления текущего объекта (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Created - время создания объекта, в формате "2016-05-12T08:17:27.000Z" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Modified - время модификации объекта, в формате "2016-05-12T08:17:27.000Z" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// +CreatedByRef - содержит идентификатор источника создавшего данный объект
// Revoked - вернуть к текущему состоянию
// +Labels [] - определяет набор терминов, используемых для описания данного объекта
// +Сonfidence - определяет уверенность создателя в правильности своих данных. Доверительное значение ДОЛЖНО быть числом
//  в диапазоне 0-100. Если 0 - значение не определено.
// +Lang - содержит текстовый код языка, на котором написан контент объекта. Для английского это "en" для русского "ru"
// +ExternalReferences - список внешних ссылок не относящихся к STIX информации
// ObjectMarkingRefs [] - определяет список ID ссылающиеся на объект "marking-definition", по терминалогии STIX, в котором содержатся значения применяющиеся к этому объекту
// GranularMarkings - определяет список "гранулярных меток" (granular_markings) относящихся к этому объекту
// Defanged - определяет были ли определены данные содержащиеся в объекте
// Extensions {} - может содержать дополнительную информацию, относящуюся к объекту
 */

function createAdditionalTechnicalInformation(){

}

ModalWindowShowInformationReportSTIX.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    showReportId: PropTypes.string.isRequired,
};
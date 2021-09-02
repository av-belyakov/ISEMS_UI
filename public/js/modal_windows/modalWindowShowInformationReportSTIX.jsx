"use strict";

import React from "react";
import { Col, Button, Modal, Row } from "react-bootstrap";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import ShowCommonPropertiesDomainObjectSTIX from "../module_managing_records_structured_information/any_elements/showCommonPropertiesDomainObjectSTIX.jsx";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

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

            //console.log("class 'ModalWindowShowInformationReportSTIX', func 'handlerEvents'");
            //console.log(`sections: ${data.section}`);
            //console.log(data.information.additional_parameters);

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
                return <span className="text-dark">доклад не опубликован</span>;
            }

            return <i>{helpers.convertDateFromString(reportInfo.published, { monthDescription: "long", dayDescription: "numeric" })}</i>;
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
                                <Col md={12} className="text-center"><strong>{reportInfo.name}</strong></Col>
                            </Row>
                            <Row>
                                <Col md={12} className="text-center">ID:"<i>{reportInfo.id}</i>"</Col>
                            </Row>
                            <Row>
                                <Col md={12} className="ml-4 mt-2">Дата и время:</Col>
                            </Row>                    
                            <Row>
                                <Col md={12}><span className="text-muted">создания</span> - <i>{helpers.convertDateFromString(reportInfo.created, { monthDescription: "long", dayDescription: "numeric" })}</i>,</Col>
                            </Row>
                            <Row>
                                <Col md={12}><span className="text-muted">последнего обновления</span> - <i>{helpers.convertDateFromString(reportInfo.modified, { monthDescription: "long", dayDescription: "numeric" })}</i>,</Col>
                            </Row>
                            <Row>
                                <Col md={12}><span className="text-muted">публикации</span> - {published()}.</Col>
                            </Row>
                            <Row>
                                <Col md={12} className="ml-4 mt-2">Подробное описание:</Col>
                            </Row>
                            <Row>
                                <Col md={12}><p><i>{reportInfo.description}</i></p></Col>
                            </Row>
                            <CreateAccordion reportInfo={reportInfo} />
                            {/*<ShowCommonPropertiesDomainObjectSTIX commonData={reportInfo} />*/}
                            {/**
                             * 
                             * НЕ ЗАБЫТь прочитать и обработать поле object_refs!!! 
                             * 
                             */}
                            <Row>
                                <Col md={12}>
                                    
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <hr/>
                    <Row>
                        <Col md={8}>{JSON.stringify(this.state.reportInfo)}</Col>
                        <Col md={4}>{JSON.stringify(this.state.availableForGroups)}</Col>
                    </Row>
                    <Row>
                        <Col className="pt-4 text-right"><small>1 - чем больше тем увереннее</small></Col>
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
 */

ModalWindowShowInformationReportSTIX.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    showReportId: PropTypes.string.isRequired,
};

function CreateAccordion(props){
    const classes = useStyles();
    let { reportInfo } = props,
        outsideSpecification = reportInfo.outside_specification;

    let additionalName = () => {
        if(outsideSpecification.additional_name.length === 0){
            return <span className="text-dark">не определено</span>;
        }

        return <i>{outsideSpecification.additional_name}</i>;
    };
    let decisionsMadeComputerThreat = () => {
    /**
     * 
     * 
     * Здесь надо транслировать наименование типа принимаемых решений на русский язык
     * для этого нужно сделать обработку запроса списков на backend
     * запрос нужно сделать при формировании страницы  REPORT
    */

        if(outsideSpecification.decisions_made_computer_threat.length === 0){
            return <span className="text-secondary">решение не принималось</span>;
        }

        return <i>{outsideSpecification.decisions_made_computer_threat}</i>;
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

        if(outsideSpecification.computer_threat_type.length === 0){
            return <span className="text-secondary">не определен</span>;
        }

        return <i>{outsideSpecification.computer_threat_type}</i>;
    };

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-add-info-not-stix"
                id="panel-add-info-not-stix-header">
                <Typography className={classes.heading}>Дополнительная информация не входящая в основную спецификацию объекта SDO STIX 2.1</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container>
                    <Grid container direction="row">
                        <Grid item md={6}>дополнительное наименование</Grid>
                        <Grid item md={6}>{additionalName()}</Grid>
                    </Grid>
                    <Grid container direction="row">
                        <Grid item md={6}>принятое решение по компьютерной угрозе</Grid>
                        <Grid item md={6}>{decisionsMadeComputerThreat()}</Grid>
                    </Grid>
                    <Grid container direction="row">
                        <Grid item md={6}>тип компьютерной угрозы</Grid>
                        <Grid item md={6}>{computerThreatType()}</Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-add-technic-info"
                id="panel-add-technic-info-header">
                <Typography className={classes.heading}>Дополнительная техническая информация</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ShowCommonPropertiesDomainObjectSTIX commonData={reportInfo} />
            </AccordionDetails>
        </Accordion>
    );
}

CreateAccordion.propTypes = {
    reportInfo: PropTypes.object.isRequired,
};
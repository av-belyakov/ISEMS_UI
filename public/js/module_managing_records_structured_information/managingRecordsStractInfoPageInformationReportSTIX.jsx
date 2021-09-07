import React from "react";
import ReactDOM from "react-dom";
import { Col, Row } from "react-bootstrap";
//import { CssBaseline, Drawer, Tab, Tabs, Tooltip, LinearProgress } from "@material-ui/core";
import { 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Typography, 
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Alert } from "material-ui-lab";
import { makeStyles } from "@material-ui/core/styles";
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

class CreatePageInformationReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reportInfo: {},
            availableForGroups: [],
            "connectModuleMRSICT": this.connectModuleMRSICT.call(this),
        };

        this.handlerEvents = this.handlerEvents.call(this);
    }

    connectModuleMRSICT() {
        return (typeof this.props.receivedData !== "undefined") ? this.props.receivedData.connectionModules.moduleMRSICT : false;
    }

    requestEmitter() {
        if (!this.state.connectModuleMRSICT) {
            return;
        }
    }

    handlerEvents() {
        this.props.socketIo.on("module_MRSICT-API", (data) => {
            if (data.type === "connectModuleMRSICT") {
                if (data.options.connectionStatus) {
                    this.setState({ "connectModuleMRSICT": true });

                    location.reload();
                } else {
                    if (!this.state.connectModuleMRSICT) {
                        return;
                    }

                    this.setState({ "connectModuleMRSICT": false });
                }
            }
        });
    }

    showModuleConnectionError() {
        return (
            <React.Fragment>
                <Row className="mt-2">
                    <Col md={12}>
                        <Alert variant="filled" severity="error">
                            <strong>Ошибка!</strong> Отсутствует доступ к модулю управления структурированной информации. Пытаемся установить соединение...
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {
                        /*
                        <LinearProgress color="secondary" />
                        
                        <Row>
                        <Col md={12} className="pl-3 pr-3">
                            <Row>
                                <Col md={12} className="text-center"><strong>{reportInfo.name}</strong></Col>
                            </Row>
                            <Row>
                                <Col md={12} className="text-center">{`ID:"<i>${reportInfo.id}</i>"`}</Col>
                            </Row>
                            <Row className="mt-2">
                                <Col md={5}>
                                    <Row>
                                        <Col md={12} className="ml-4">Дата и время:</Col>
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
                                </Col>
                                <Col md={7} className="text-center">
                                    здесь будем выводить группы для которых открыт доступ к этому Докладу и
                                    элементы упрвления доступом групп к данному Докладу
                                    <br/>
                                    {JSON.stringify(this.state.availableForGroups)}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="ml-4 mt-2">Подробное описание:</Col>
                            </Row>
                            <Row>
                                <Col md={12}><p><i>{reportInfo.description}</i></p></Col>
                            </Row>
                            <CreateAccordion reportInfo={reportInfo} />
                            <GetListObjectRefs listObjectRef={reportInfo.object_refs} />
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col className="pt-4 text-right"><small>1 - чем больше тем увереннее</small></Col>
                    </Row>
                        */
                        }
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    render() {
        return (
            <Row>
                <Col md={12}>
                    <h2>Page Information Report STIX object</h2>
                    <p>{this.props.receivedData}</p>
                </Col>
            </Row>
        );
    }
}

CreatePageInformationReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};

ReactDOM.render(<CreatePageInformationReport
    socketIo={socket}
    receivedData={receivedFromServer} />, document.getElementById("main-page-content"));

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
    
    return (<Grid container>
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
                        <Grid item md={4}>дополнительное наименование</Grid>
                        <Grid item md={8}>{additionalName()}</Grid>
                    </Grid>
                    <Grid container direction="row">
                        <Grid item md={4}>принятое решение по компьютерной угрозе</Grid>
                        <Grid item md={8}>{decisionsMadeComputerThreat()}</Grid>
                    </Grid>
                    <Grid container direction="row">
                        <Grid item md={4}>тип компьютерной угрозы</Grid>
                        <Grid item md={8}>{computerThreatType()}</Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-add-technic-info"
                id="panel-add-technic-info-header">
                <Typography className={classes.heading}>Дополнительная техническая информация</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ShowCommonPropertiesDomainObjectSTIX reportInfo={reportInfo} />
            </AccordionDetails>
        </Accordion>
    </Grid>);
}
    
CreateAccordion.propTypes = {
    reportInfo: PropTypes.object.isRequired,
};
    
function GetListObjectRefs(props){
    let { listObjectRef } = props;
    
    return <Row>
        <Col md={12}>
            <List component="nav"
                dense
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                            список идентификаторов объектов связанных с этим Докладом
                    </ListSubheader>
                }>
                {listObjectRef.map((item, key) => {
                    let itemText = <i>{item}</i>;
                    let type = item.split("--");
                    let objectElem = helpers.getLinkImageSTIXObject(type[0]);
                        
                    if(typeof objectElem !== "undefined"){
                        itemText = objectElem.description;
                    }
    
                    return (<ListItem button key={`key_list_item_${key}`}>
                        {(typeof objectElem === "undefined" ) ? 
                            "" : 
                            <ListItemAvatar>
                                <ListItemIcon>
                                    <img src={`/images/stix_object/${objectElem.link}`} width="32" height="32" />
                                </ListItemIcon>
                            </ListItemAvatar>}
                        <ListItemText primary={itemText} />
                    </ListItem>);
                })}
            </List>
        </Col>
    </Row>;
}
    
/**
     * window.open("/security_event_management_page_information_report?id="+elemId, "_blank").focus();
     * Это нужно добавить для обратных ссылок на REport со стороны объектов STIX связанных с основным обектом Report
     */
    
GetListObjectRefs.propTypes = {
    listObjectRef: PropTypes.array.isRequired,
};
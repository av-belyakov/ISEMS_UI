"use strict";

import React from "react";
import { Col, Button, Modal, Row } from "react-bootstrap";
import { 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Typography, 
    Grid,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import { MainTextField } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";
import CreateChipList from "../module_managing_records_structured_information/any_elements/createChipList.jsx";
import CreateComputerThreat from "../module_managing_records_structured_information/any_elements/createComputerThreat.jsx";
import CreateListUnprivilegedGroups from "../module_managing_records_structured_information/any_elements/createListUnprivilegedGroups.jsx";
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
            listGroupAccessToReport: [],
            currentGroupAccessToReport: "select_group",
        };

        console.log(this.props.listTypesComputerThreat);
        console.log(this.props.listTypesDecisionsMadeComputerThreat);

        this.handleSave = this.handleSave.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handlePublished = this.handlePublished.bind(this);
        this.handlerOnChangeDescription = this.handlerOnChangeDescription.bind(this);
        this.handlerManagingAccessToReport = this.handlerManagingAccessToReport.bind(this);
        this.handlerOnChangeAccessGroupToReport = this.handlerOnChangeAccessGroupToReport.bind(this);
        this.handlerOutsideSpecificationAdditionalName = this.handlerOutsideSpecificationAdditionalName.bind(this);
        this.handlerDeleteChipFromListGroupAccessToReport = this.handlerDeleteChipFromListGroupAccessToReport.bind(this);
        this.handlerChosenComputerThreatType = this.handlerChosenComputerThreatType.bind(this);
        this.handlerChosenDecisionsMadeComputerThreat = this.handlerChosenDecisionsMadeComputerThreat.bind(this);

        this.handlerEvents = this.handlerEvents.call(this);
        this.requestEmitter = this.requestEmitter.call(this);
    }

    handlerEvents(){
        //обработка события связанного с приемом списка групп которым разрешен доступ к данному докладу
        this.props.socketIo.on("isems-mrsi response ui", (data) => {

            //console.log("class 'ModalWindowShowInformationReportSTIX', func 'handlerEvents'");
            //console.log(`sections: ${data.section}`);
            //console.log(data.information.additional_parameters);

            if((data.information === null) || (typeof data.information === "undefined")){
                return;
            }

            if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                return;
            }

            switch(data.section){
            case "list of groups that are allowed access":
                this.setState({ availableForGroups: data.information.additional_parameters });
                break;

            case "send search request, get report for id":
                if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
                    break;
                }

                this.setState({ reportInfo: data.information.additional_parameters.transmitted_data });
                break;

            case "list of groups to which the report is available":

                console.log(`func 'handlerEvents', section:${data.section}`);
                console.log(data.information.additional_parameters.list_groups_which_report_available);

                if(!Array.isArray(data.information.additional_parameters.list_groups_which_report_available)){
                    break;
                }

                this.setState({ listGroupAccessToReport: data.information.additional_parameters.list_groups_which_report_available.map((item) => {
                    return { data: item.group_name, title: `Пользователь: ${item.user_name}, Время: ${helpers.getDate(item.date_time)}` };
                })});
                break;
            }
        }); 
    }

    requestEmitter(){}

    handleClose(){
        this.modalClose();
    }

    handleSave(){

        console.log("func 'handleSave', START...");

    }

    handlePublished(){

        console.log("func 'handlePublished', START...");

    }

    handlerOnChangeDescription(data){

        console.log("func 'handlerOnChangeDescription', START...");
        console.log(data.target.value);

    }

    //обработчик выбора группы из списка непривилегированных групп 
    handlerOnChangeAccessGroupToReport(data){
        let listGroupAccessToReport = this.state.listGroupAccessToReport,
            groupName = data.target.value;
        for(let item of listGroupAccessToReport){
            if((groupName === item.data) || (groupName === "select_group")){
                return;
            }
        }

        listGroupAccessToReport.push({ data: groupName, title: `Пользователь: текущий, Время: ${helpers.getDate(+new Date)}` });
        this.setState({ listGroupAccessToReport: listGroupAccessToReport });

        if(this.state.reportInfo.length !== 1){
            return;
        }

        this.props.socketIo.emit("isems-mrsi ui request: allow the group to access the report", { arguments: {
            reportId: this.state.reportInfo[0].id,
            unprivilegedGroup: groupName,
        }});
    }

    handlerDeleteChipFromListGroupAccessToReport(groupName){
        let newListGroup = this.state.listGroupAccessToReport.filter((item) => {
            return groupName !== item.data;
        });

        this.setState({ listGroupAccessToReport: newListGroup });
        
        this.props.socketIo.emit("isems-mrsi ui request: forbid the group to access the report", { arguments: {
            reportId: this.state.reportInfo[0].id,
            unprivilegedGroup: groupName,
        }});
    }

    handlerOutsideSpecificationAdditionalName(data){
        let reportInfo = _.cloneDeep(this.state.reportInfo);
        reportInfo.outside_specification.additional_name = data.target.value;

        this.setState({ reportInfo: reportInfo });
    }

    handlerManagingAccessToReport(){
        if(!this.props.userPermissions.privileged_group.status){
            return;
        }

        return (<React.Fragment>
            <Row className="mt-4">
                <Col md={12} className="text-muted text-left">Доступность для непривилегированных групп:</Col>
            </Row>
            <Row className="mt-2">
                <Col md={6}>
                    <CreateChipList
                        variant="outlined"
                        chipData={this.state.listGroupAccessToReport}
                        handleDelete={this.handlerDeleteChipFromListGroupAccessToReport} />
                </Col>
                <Col md={6} className="pt-1">
                    <CreateListUnprivilegedGroups 
                        groupList={this.props.groupList}
                        currentGroup={this.state.currentGroupAccessToReport}
                        handlerChosen={this.handlerOnChangeAccessGroupToReport} />
                </Col>
            </Row>
        </React.Fragment>);
    }

    handlerChosenComputerThreatType(){

    }

    handlerChosenDecisionsMadeComputerThreat(){

    }

    modalClose(){
        this.props.onHide();

        this.setState({
            reportInfo: {},
            availableForGroups: [],
            listGroupAccessToReport: [],
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
                        <Button variant="outline-primary" size="sm" onClick={this.handleSave}>сохранить</Button>
                    </Modal.Footer>
                </Modal>
            );
        }

        let reportInfo = this.state.reportInfo[0];
        let published = () => {
            if(Date.parse(reportInfo.published) <= 0){
                return (<Col md={6} className="text-right">
                    <Link href="#" onClick={this.handlePublished} color="inherit">
                        <Typography variant="overline" display="block" gutterBottom>опубликовать</Typography>
                    </Link>
                </Col>);
            }

            return (<Col md={6} className="text-right">
                {helpers.convertDateFromString(reportInfo.published, { monthDescription: "long", dayDescription: "numeric" })}
            </Col>);
        };

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
                <Modal.Body>
                    <Row>
                        <Col md={12} className="pl-3 pr-3">
                            <Row>
                                <Col md={12} className="text-center"><h4><strong>{reportInfo.name}</strong></h4></Col>
                            </Row>
                            <Row>
                                <Col md={12} className="text-center">ID:<i>{`"${reportInfo.id}`}</i></Col>
                            </Row>
                            <Row>
                                <Col md={7}>
                                    <Row className="mt-4">
                                        <Col md={12} className="text-muted">Дата и время:</Col>
                                    </Row>              
                                    <Row>
                                        <Col md={6}><span className="text-muted">создания</span></Col>
                                        <Col md={6} className="text-right">
                                            {helpers.convertDateFromString(reportInfo.created, { monthDescription: "long", dayDescription: "numeric" })}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <span className="text-muted">последнего обновления</span>
                                        </Col>
                                        <Col md={6} className="text-right">
                                            {helpers.convertDateFromString(reportInfo.modified, { monthDescription: "long", dayDescription: "numeric" })}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}><span className="text-muted">публикации</span></Col>
                                        {published()}
                                    </Row>
                                    {this.handlerManagingAccessToReport()}
                                    {/**
                                     * 
                                     * отправить запрос на поиск в БД UI какой группе разрешен доступ к данному Докладу!!!!
                                     * 
                                     */}
                                    <Row>
                                        <Col md={12} className="mt-3">
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Подробное описание"
                                                multiline
                                                rows={4}
                                                fullWidth
                                                onChange={this.handlerOnChangeDescription}
                                                defaultValue={reportInfo.description}
                                                variant="outlined"/>
                                        </Col>  
                                    </Row>
                                    <Row className="mt-4">
                                        <Col md={12}>
                                            <span className="text-muted">Дополнительная информация не входящая в основную спецификацию объекта SDO STIX 2.1:</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <span className="pl-4">
                                                <MainTextField
                                                    uniqName={"additional_name_not_stix_specifications"}
                                                    variant={"standard"}
                                                    label={"дополнительное наименование"}
                                                    value={(()=>{
                                                        if((reportInfo.outside_specification === null) || (typeof reportInfo.outside_specification === "undefined")){
                                                            return "";
                                                        }

                                                        if((reportInfo.outside_specification.additional_name === null) || (typeof reportInfo.outside_specification.additional_name === "undefined")){
                                                            return "";
                                                        }

                                                        return reportInfo.outside_specification.additional_name;
                                                    })()}
                                                    fullWidth={true}
                                                    onChange={this.handlerOutsideSpecificationAdditionalName}
                                                />
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col md={12}>
                                            <span className="pl-4">
                                                <CreateComputerThreat
                                                    list={this.props.listTypesDecisionsMadeComputerThreat}
                                                    label="принятое решение по компьютерной угрозе"
                                                    uniqId="decisions_made_computer_threat"
                                                    currentItem={reportInfo.outside_specification.decisions_made_computer_threat}
                                                    handlerChosen={this.handlerChosenDecisionsMadeComputerThreat} />
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col md={12}>
                                            <span className="pl-4">
                                                <CreateComputerThreat
                                                    list={this.props.listTypesComputerThreat}
                                                    label="тип компьютерной угрозы"
                                                    uniqId="computer_threat_type"
                                                    currentItem={reportInfo.outside_specification.computer_threat_type}
                                                    handlerChosen={this.handlerChosenComputerThreatType} />
                                            </span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={5}>
                                    <Row>
                                        <Col md={12} className="text-center"><strong>История изменений</strong></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={12}>
                                    <CreateAccordion reportInfo={reportInfo} />
                                </Col>
                            </Row>
                            <GetListObjectRefs listObjectRef={reportInfo.object_refs} />
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col className="pt-4 text-right"><small>1 - чем больше тем увереннее</small></Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" size="sm" onClick={this.handleClose}>закрыть</Button>
                    <Button variant="outline-primary" size="sm" onClick={this.handleSave}>сохранить</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalWindowShowInformationReportSTIX.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    showReportId: PropTypes.string.isRequired,
    groupList: PropTypes.array.isRequired,
    userPermissions: PropTypes.object.isRequired,
    listTypesComputerThreat: PropTypes.object.isRequired,
    listTypesDecisionsMadeComputerThreat: PropTypes.object.isRequired,
};

function CreateAccordion(props){
    const classes = useStyles();
    let { reportInfo } = props;
        
    return (<Grid container>
        {/*<Accordion>
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
        </Accordion>*/}
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
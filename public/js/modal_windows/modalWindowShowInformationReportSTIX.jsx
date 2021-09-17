"use strict";

import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { 
    AppBar,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Toolbar,
    IconButton,
    Typography, 
    Grid,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { indigo, lightGreen, lightBlue, teal, purple, blue, grey, lime, red } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import { MainTextField } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";
import CreateChipList from "../module_managing_records_structured_information/any_elements/createChipList.jsx";
import CreateListSelect from "../module_managing_records_structured_information/any_elements/createListSelect.jsx";
import CreateListUnprivilegedGroups from "../module_managing_records_structured_information/any_elements/createListUnprivilegedGroups.jsx";
import CreateElementAdditionalTechnicalInformation from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformation.jsx";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "fixed",
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    buttonSave: {
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
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
            listObjectInfo: {},
            availableForGroups: [],
            listGroupAccessToReport: [],
            currentGroupAccessToReport: "select_group",
            showModalCreateNewElementAdditionalThechnicalInfo: false,
            objectModalCreateNewElementAdditionalThechnicalInfo: {},
        };

        console.log(this.props.listTypesComputerThreat);
        console.log(this.props.listTypesDecisionsMadeComputerThreat);
        console.log("class 'ModalWindowShowInformationReportSTIX', userPermissions");
        console.log(this.props.userPermissions);

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

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
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

            let reportInfo = {},
                listObjectInfoTmp= {};

            switch(data.section){
            case "list of groups that are allowed access":
                this.setState({ availableForGroups: data.information.additional_parameters });
                break;

            case "send search request, get report for id":
                if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
                    break;
                }

                if(data.information.additional_parameters.transmitted_data.length !== 1){
                    return;
                }

                reportInfo = data.information.additional_parameters.transmitted_data[0];
                listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);
                listObjectInfoTmp[reportInfo.id] = reportInfo;

                this.setState({ 
                    reportInfo: data.information.additional_parameters.transmitted_data,
                    listObjectInfo: listObjectInfoTmp,
                });
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
                <Col md={12} className="text-muted text-left">Доступность для непривилегированных групп</Col>
            </Row>
            <Row className="mt-2">
                <Col md={6}>
                    <CreateChipList
                        variant="outlined"
                        style={{ color: purple[400], margin: "2px" }}
                        chipData={this.state.listGroupAccessToReport}
                        handleDelete={this.handlerDeleteChipFromListGroupAccessToReport} />
                </Col>
                <Col md={6} className="pt-1">
                    <CreateListUnprivilegedGroups 
                        groupList={this.props.groupList}
                        currentGroup={this.state.currentGroupAccessToReport}
                        handlerChosen={this.handlerOnChangeAccessGroupToReport}
                        isNotDisabled={this.props.userPermissions.editing_information.status} />
                </Col>
            </Row>
        </React.Fragment>);
    }

    showModalCreateNewElementAdditionalThechnicalInfo(obj){

        console.log("func 'showModalCreateNewElementAdditionalThechnicalInfo', START...");
        console.log(obj);

        //"new_elem_ati"
        this.setState({
            showModalCreateNewElementAdditionalThechnicalInfo: true,
            objectModalCreateNewElementAdditionalThechnicalInfo: { 
                section: "element_additional_thechnical_info", 
                type: obj.modalType,
                id: obj.objectId,
            },
        });
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

    handlerChosenComputerThreatType(data){

        console.log("func 'handlerChosenComputerThreatType', START...");
        console.log(data.target.value);

    }

    handlerChosenDecisionsMadeComputerThreat(data){
        
        console.log("func 'handlerChosenDecisionsMadeComputerThreat', START...");
        console.log(data.target.value);

    }

    handlerElementConfidence(obj){

        console.log("func 'handlerElementConfidence', START...");
        console.log(obj.data);
        console.log(`ID: ${obj.objectId}`);

    }

    handlerElementDefanged(obj){

        console.log("func 'handlerElementDefanged', START...");
        console.log(obj.data);
        console.log(`ID: ${obj.objectId}`);

    }

    handlerElementLabels(obj){

        console.log("func 'handlerElementLabels', START...");
        console.log(obj.listTokenValue);
        console.log(`ID: ${obj.objectId}`);

    }

    handlerDeleteItemExternalReferences(obj){

        console.log("func 'handlerDeleteItemExternalReferences', START...");
        console.log(obj.item);
        console.log(`ID: ${obj.objectId}`);

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
        if((this.state.listObjectInfo[this.props.showReportId] === null) || (typeof this.state.listObjectInfo[this.props.showReportId] === "undefined")){
            return (<Dialog 
                fullScreen 
                open={this.props.show} 
                onClose={this.modalClose} >
                <CreateAppBar handlerDialogSave={this.handleSave} handelrDialogClose={this.modalClose} />
            </Dialog>);
        }

        let reportInfo = this.state.listObjectInfo[this.props.showReportId];
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

        // *** для теста "Дополнительных внешних ссылок" START ***
        reportInfo.external_references = [
            {
                source_name: "external references 1",
                description: "common description external references 1 to read people",
                url: "html://external-references-example-1.net/watch?v=BSoHDCWze7E",
                hashes: {"md5": "dvyw7f37fggug8fg88g84fg8877e7fe", "sha256": "bcu48gc7g7848f48g88g85g8rfgh8rh84h8h8r8rh8rh8r"},
                external_id: "ex-ref--vueueuf8egfurggrg7gd7fe",
            },
            {
                source_name: "external references 2",
                description: "common description external references 2 to read people",
                url: "html://external-references-example-2222.net/watch?v=BSoHDCWze7E",
                hashes: {"md5": "dvyw7f37fggug8fg88g84fg8877e7fe", "sha128": "nbeiuu37fg7g4f7g84g8gd8fg8eg8egf8e", "sha256": "bcu48gc7g7848f48g88g85g8rfgh8rh84h8h8r8rh8rh8r"},
                external_id: "ex-ref--beg77e7fd3f377gr7eg7efg7",
            },
            {
                source_name: "external references 3",
                url: "html://external-references-example-2222.net/watch?v=BSoHDCWze7E",
                external_id: "ex-ref--cbscvsvcvdvucvduvduvcduvbduv",
            },
        ];
        // *** для теста "Дополнительных внешних ссылок" END ***

        // *** для теста "Дополниельные 'гранулярные метки'" START ***
        reportInfo.granular_markings = [
            {
                lang: "CH",
                marking_ref: "marking--bubdu8eeugfuegfe8fefhefe",
                selectors: ["selectors_suvnid_1", "selectors_cvbi_2"],
            },
            {
                lang: "US",
                marking_ref: "marking-- cscusuudbsfubdufbudbfueubue",
            },
            {
                lang: "RU",
                selectors: ["selectors-bdufbdubudfud", "selectors-sufuwu3fueuef", "selectors-dufveufueufuefu"],
            },
        ];
        // *** для теста "Дополниельные 'гранулярные метки'" END ***

        // *** для теста "Любая дополнительная информация" START ***
        reportInfo.extensions = { "test element": "budbuufbduf fndufbud ufbdgufgur", "test element 1": "bvbibevi484negfgrgiurg" };
        // *** для теста "Любая дополнительная информация" END ***

        return (<React.Fragment>
            <Dialog 
                fullScreen 
                open={this.props.show} 
                onClose={this.modalClose} 
            //TransitionComponent={Transition}
            >
                <CreateAppBar handlerDialogSave={this.handleSave} handelrDialogClose={this.modalClose} />
               
                <Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "60px" }}>
                    <Col md={12} className="pl-3 pr-3">
                        <Row className="pt-3">
                            <Col md={12} className="text-center"><h4><strong>{reportInfo.name}</strong></h4></Col>
                        </Row>

                        <Row>
                            <Col md={12} className="text-center">ID:<i>{reportInfo.id}</i></Col>
                        </Row>
                            
                        <Row>
                            <Col md={7}>
                                <Row className="mt-4">
                                    <Col md={12}><span className="text-muted">Дата и время</span>:</Col>
                                </Row>      

                                <Row>
                                    <Col md={6}><span className="text-muted pl-4">создания</span></Col>
                                    <Col md={6} className="text-right">
                                        {helpers.convertDateFromString(reportInfo.created, { monthDescription: "long", dayDescription: "numeric" })}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <span className="text-muted pl-4">последнего обновления</span>
                                    </Col>
                                    <Col md={6} className="text-right">
                                        {helpers.convertDateFromString(reportInfo.modified, { monthDescription: "long", dayDescription: "numeric" })}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}><span className="text-muted pl-4">публикации</span></Col>
                                    {published()}
                                </Row>

                                {this.handlerManagingAccessToReport()}
                                    
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
                                        <span className="text-muted">Дополнительная информация не входящая в основную спецификацию объекта SDO STIX 2.1</span>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
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
                                            <CreateListSelect
                                                list={this.props.listTypesDecisionsMadeComputerThreat}
                                                label="принятое решение по компьютерной угрозе"
                                                uniqId="decisions_made_computer_threat"
                                                currentItem={reportInfo.outside_specification.decisions_made_computer_threat}
                                                handlerChosen={this.handlerChosenDecisionsMadeComputerThreat}
                                                isNotDisabled={this.props.userPermissions.editing_information.status} />
                                        </span>
                                    </Col>
                                </Row>

                                <Row className="mt-3 mb-4">
                                    <Col md={12}>
                                        <span className="pl-4">
                                            <CreateListSelect
                                                list={this.props.listTypesComputerThreat}
                                                label="тип компьютерной угрозы"
                                                uniqId="computer_threat_type"
                                                currentItem={reportInfo.outside_specification.computer_threat_type}
                                                handlerChosen={this.handlerChosenComputerThreatType}
                                                isNotDisabled={this.props.userPermissions.editing_information.status} />
                                        </span>
                                    </Col>
                                </Row>

                                <CreateElementAdditionalTechnicalInformation 
                                    reportInfo={reportInfo}
                                    objectId={this.props.showReportId}
                                    handlerElementConfidence={this.handlerElementConfidence.bind(this)}
                                    handlerElementDefanged={this.handlerElementDefanged.bind(this)}
                                    handlerElementLabels={this.handlerElementLabels.bind(this)}
                                    handlerDeleteItemExternalReferences={this.handlerDeleteItemExternalReferences.bind(this)}
                                    showModalCreateNewElementAdditionalThechnicalInfo={this.showModalCreateNewElementAdditionalThechnicalInfo.bind(this)}
                                    isNotDisabled={this.props.userPermissions.editing_information.status} />
                                    
                                <GetListObjectRefs listObjectRef={reportInfo.object_refs} />
                            </Col>
                            <Col md={5}>
                                <Row>
                                    <Col md={12} className="text-center"><strong>История изменений</strong></Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Container>
            </Dialog>

            <Dialog
                aria-labelledby="form-dialog-element-additional-thechnical-info" 
                open={this.state.showModalCreateNewElementAdditionalThechnicalInfo} 
                onClose={()=> { this.setState({ showModalCreateNewElementAdditionalThechnicalInfo: false }); }}>
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {JSON.stringify(this.state.objectModalCreateNewElementAdditionalThechnicalInfo)}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { console.log("handler button cancel"); }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { console.log("handler button Subscribe"); }} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>);
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

function CreateAppBar(props){
    const classes = useStyles();
    const { handlerDialogSave, handelrDialogClose } = props;
    
    return (<AppBar className={classes.appBar}>
        <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handelrDialogClose} aria-label="close">
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                Доклад
            </Typography>
            <Button size="small" className={classes.buttonSave} onClick={handlerDialogSave}>сохранить</Button>
        </Toolbar>
    </AppBar>);
}

CreateAppBar.propTypes = {
    handlerDialogSave: PropTypes.func.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
};

function GetListObjectRefs(props){
    let { listObjectRef } = props;

    return (<React.Fragment>
        <Grid container direction="row">
            <Grid item md={12}><span className="text-muted">Идентификаторы объектов связанных с Докладом</span></Grid>
        </Grid>

        <Grid container direction="row">
            <Grid item md={12}>
                <List component="nav" dense >
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
            </Grid>
        </Grid>
    </React.Fragment>);
}

GetListObjectRefs.propTypes = {
    listObjectRef: PropTypes.array.isRequired,
};
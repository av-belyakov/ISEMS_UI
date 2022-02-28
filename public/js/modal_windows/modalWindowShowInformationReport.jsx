"use strict";

import React, { useState, useEffect, useReducer } from "react";
import { Col, Row } from "react-bootstrap";
import { 
    AppBar,
    Box,
    Button,
    Container,
    Dialog,
    DialogTitle,
    Toolbar,
    IconButton,
    Typography,
    Tooltip,
    Grid,
    Link,
    TextField,
    Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { teal, purple, grey, green, orange, red } from "@material-ui/core/colors";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import { MainTextField } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";
import CreateChipList from "../module_managing_records_structured_information/any_elements/createChipList.jsx";
import CreateListSelect from "../module_managing_records_structured_information/any_elements/createListSelect.jsx";
import patternSearchParameters from "../module_managing_records_structured_information/patterns/patternSearchParameters.js";
import ContentCreateNewSTIXObject from "../module_managing_records_structured_information/any_elements/dialog_contents/contentCreateNewSTIXObject.jsx";
import CreateListUnprivilegedGroups from "../module_managing_records_structured_information/any_elements/createListUnprivilegedGroups.jsx";
import CreateAnyModalWindowSTIXObject from "../module_managing_records_structured_information/any_elements/createAnyModalWindowSTIXObject.jsx";
import CreateListPreviousStateSTIX from "../module_managing_records_structured_information/any_elements/createListPreviousStateSTIX.jsx";
import CreateListPreviousStateSTIXObject from "../module_managing_records_structured_information/any_elements/createListPreviousStateSTIXObject.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformationDO.jsx";
import CreateElementAdditionalTechnicalInformationReportObject from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformationReportObject.jsx";
import ModalWindowDialogElementAdditionalThechnicalInformation from "./modalWindowDialogElementAdditionalThechnicalInformation.jsx";
import { CreateListTypesDecisionsMadeComputerThreat, CreateListTypesComputerThreat } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "fixed",
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    appBreadcrumbs: {
        position: "fixed",
        top: "60px",
        color: theme.palette.getContrastText(grey[50]),
        backgroundColor: grey[50],
        paddingLeft: theme.spacing(4),
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

export default function ModalWindowShowInformationReport(props) {
    let { 
        show,
        onHide,
        showReportId,
        groupList,
        userPermissions,
        socketIo,
    } = props;

    const [ buttonSaveIsDisabled, setButtonSaveIsDisabled ] = useState(false);
    const [ buttonSaveChangeTrigger, setButtonSaveChangeTrigger ] = useState(false);

    console.log("func 'ModalWindowShowInformationReact', MOUNT (((( WINDOW SHOW INFO REPORT ))))");
    console.log("showReportId = ", showReportId);

    let handlerChangeButtonSaveIsDisabled = () => {
        setButtonSaveIsDisabled((prevState) => !prevState);
    };

    return (<Dialog 
        fullScreen 
        open={show} 
        onClose={() => onHide()}>
        <CreateAppBar 
            title={showReportId}
            nameDialogButton="сохранить"
            buttonSaveIsDisabled={buttonSaveIsDisabled}
            handelrDialogClose={() => { 
                onHide();
            }}
            handlerDialogButton={() => setButtonSaveChangeTrigger(true)} />            
        <CreateAppBody
            socketIo={socketIo} 
            groupList={groupList}
            showReportId={showReportId}
            userPermissions={userPermissions.editing_information.status}
            buttonSaveChangeTrigger={buttonSaveChangeTrigger}
            handlerChangeButtonSaveIsDisabled={handlerChangeButtonSaveIsDisabled}
        />
    </Dialog>); 
}

ModalWindowShowInformationReport.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    showReportId: PropTypes.string.isRequired,
    groupList: PropTypes.array.isRequired,
    userPermissions: PropTypes.object.isRequired,
};

function CreateAppBar(props){
    const classes = useStyles();
    const { 
        title, 
        nameDialogButton,
        buttonSaveIsDisabled, 
        handelrDialogClose, 
        handlerDialogButton 
    } = props;
    
    return (<AppBar className={classes.appBar}>
        <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handelrDialogClose} aria-label="close">
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>{title}</Typography>
            <Button 
                size="small"
                disabled={buttonSaveIsDisabled}
                className={classes.buttonSave} 
                onClick={handlerDialogButton}>
                {nameDialogButton}
            </Button>
        </Toolbar>
    </AppBar>);
}

CreateAppBar.propTypes = {
    title: PropTypes.string.isRequired,
    nameDialogButton: PropTypes.string.isRequired,
    buttonSaveIsDisabled: PropTypes.bool.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    handlerDialogButton: PropTypes.func.isRequired,
};

function CreateAppBody(props){
    let {
        socketIo,
        groupList,
        showReportId,
        userPermissions,
        buttonSaveChangeTrigger,
        handlerChangeButtonSaveIsDisabled,
    } = props;

    console.log("func 'CreateAppBody', START");

    return (<Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>
        <Row>
            <Col md={7}>
                <CreateReportInformation 
                    socketIo={socketIo}
                    groupList={groupList}
                    showReportId={showReportId}
                    userPermissions={userPermissions}
                    buttonSaveChangeTrigger={buttonSaveChangeTrigger}
                    handlerChangeButtonSaveIsDisabled={handlerChangeButtonSaveIsDisabled}
                />
            </Col>
            <Col md={5}>
                <GroupsViewingAvailable 
                    socketIo={socketIo}
                    groupList={groupList} 
                    showReportId={showReportId}
                    userPermissions={userPermissions}
                />
                <br/>
                <CreateListPreviousStateSTIX 
                    socketIo={socketIo} 
                    searchObjectId={showReportId} 
                />
            </Col>
        </Row>
    </Container>);
}

CreateAppBody.propTypes = {
    socketIo: PropTypes.object.isRequired,
    groupList: PropTypes.array.isRequired,
    showReportId: PropTypes.string.isRequired,
    userPermissions: PropTypes.bool.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    handlerChangeButtonSaveIsDisabled: PropTypes.func.isRequired,
};

function CreateReportInformation(props){
    let {
        socketIo,
        groupList,
        showReportId,
        userPermissions,
        buttonSaveChangeTrigger,
        handlerChangeButtonSaveIsDisabled,
    } = props;

    console.log("func 'CreateReportInformation', START...");

    const reducer = (state, action) => {

        console.log("____ reducer _____");
        console.log("action.type: ", action.type);

        switch(action.type){
        case "newAll":
            return action.data;
        case "cleanAll":
            return {};
        case "madePublised":
            state.published = action.data;
            handlerChangeButtonSaveIsDisabled(false);

            return {...state};
        case "updateDescription":
            console.log("---=== updateDescription ===---");

            return {...state, description: action.data};
        case "updateAdditionalName":
            if((state.outside_specification === null) || (typeof state.outside_specification === "undefined")){
                state.outside_specification = {};
            }
            state.outside_specification.additional_name = action.data;

            return {...state};
        case "updateDecisionsMadeComputerThreat":
            if((state.outside_specification === null) || (typeof state.outside_specification === "undefined")){
                state.outside_specification = {};
            }
            state.outside_specification.decisions_made_computer_threat = action.data;

            return {...state};

        case "updateComputerThreatType":
            if((state.outside_specification === null) || (typeof state.outside_specification === "undefined")){
                state.outside_specification = {};
            }
            state.outside_specification.computer_threat_type = action.data;

            return {...state};
        case "updateConfidence":
            console.log("BEFORE updateConfidence: ", state.confidence);
            console.log("state.confidence: ", state.confidence, " === ", action.data.data, " :action.data");

            if(state.confidence === action.data.data){
                console.log("00000000000");

                return {...state};
            }

            console.log("AFTER updateConfidence: ", state.confidence);

            return {...state, confidence: action.data.data};
        case "updateDefanged":
            console.log("updateDefanged: ", action.data);

            return {...state, defanged: (action.data === "true")};
        case "updateLabels":
            console.log("updateLabels: ", action.data);

            return {...state, labels :action.data.listTokenValue};
        case "updateExternalReferences":
            console.log("func 'CreateReportInformation', updateExternalReferences");
            console.log("------", action.data, "-------");

            for(let key of state.external_references){
                if(key.source_name === action.data.source_name){
                    return {...state};
                }
            }

            state.external_references.push(action.data);

            console.log("COUNT state.external_references: ",state.external_references.length);

            return {...state};
        case "updateExternalReferencesHashesUpdate":
            console.log("funct 'updateExternalReferencesHashesUpdate'");
            console.log(action.data);
            /*if((valueAPTmp.external_references[obj.orderNumber].hashes === null) || (typeof valueAPTmp.external_references[obj.orderNumber].hashes === "undefined")){
                    valueAPTmp.external_references[obj.orderNumber].hashes = {};
                }

                valueAPTmp.external_references[obj.orderNumber].hashes[obj.data.type] = obj.data.hash;
                setAttackPatterElement(valueAPTmp);*/      


            return {...state};
        case "updateExternalReferencesHashesDelete":
            console.log("funct 'updateExternalReferencesHashesDelete'");
            console.log(action.data);

            /*delete valueAPTmp.external_references[obj.orderNumber].hashes[obj.hashName];
                setAttackPatterElement(valueAPTmp);  */

            return {...state};
        case "updateGranularMarkings":
            console.log("func 'CreateReportInformation', updateGranularMarkings");

            state.granular_markings.push(action.data);

            return {...state};
        case "updateExtensions":
            console.log("updateExtensions: ", action.data);

            state.extensions[action.data.name] = action.data.description;

            return {...state};
        case "deleteElementAdditionalTechnicalInformation":
            /**
let externalReferences = [];
        let listObjectTmp = _.cloneDeep(this.state.listObjectInfo);

        if(obj.itemType === "external_references"){
            externalReferences = listObjectTmp[obj.objectId].external_references.filter((item) => item.source_name !== obj.item);
            listObjectTmp[obj.objectId].external_references = externalReferences;

            this.setState({ listObjectInfo: listObjectTmp });
        }

        if(obj.itemType === "granular_markings"){
            if(obj.orderNumber < 0){
                return;
            }

            listObjectTmp[obj.objectId].granular_markings.splice(obj.orderNumber, 1);

            this.setState({ listObjectInfo: listObjectTmp });
        }

        if(obj.itemType === "extensions"){
            delete listObjectTmp[obj.objectId].extensions[obj.item];

            this.setState({ listObjectInfo: listObjectTmp });
        }
 */
            return {...state};
        }
    };
    const [state, dispatch] = useReducer(reducer, {});

    const listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
            return;
        }

        if(data.information.additional_parameters.transmitted_data.length === 0){
            return;
        }

        for(let obj of data.information.additional_parameters.transmitted_data){
            if(obj.type === "report"){
                dispatch({ type: "newAll", data: obj });                  
                //setReportAcceptedInformation(obj);

                break;
            }
        }


        /*let objectId = "", 
            reportInfo = {},
            listObjectInfoTmp = {},
            listPreviousStateTmp = [],
            optionsPreviousStateTmp = {};
        case "list of groups that are allowed access":
            this.setState({ availableForGroups: data.information.additional_parameters });
        
            break;
        case "isems-mrsi ui request: send search request, get STIX object for id":
            if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
                break;
            }

            if(data.information.additional_parameters.transmitted_data.length === 0){
                break;
            }

            listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);
            for(let obj of data.information.additional_parameters.transmitted_data){
                listObjectInfoTmp[obj.id] = obj;
            }

            this.setState({ listObjectInfo: listObjectInfoTmp });

            break;
        }*/
    };
    React.useEffect(() => {
        socketIo.on("isems-mrsi response ui: send search request, get report for id", listener);
    
        return () => {
            socketIo.off("isems-mrsi response ui: send search request, get report for id", listener);
        };
    }, []);
    React.useEffect(() => {
        if(showReportId !== ""){
            console.log("func 'ModalWindowShowInformationReact', socketIo.emit");

            //запрос информации об STIX объекте типа 'report' (Отчёт) по его ID
            socketIo.emit("isems-mrsi ui request: send search request, get report for id", { arguments: showReportId });
            socketIo.emit("isems-mrsi ui request: get a list of groups to which the report is available", { arguments: showReportId });
        }
    }, [ socketIo, showReportId ]);

    const handlerPublished = () => {
        let requestId = uuidv4();

        if(!state.id){
            return;
        }

        socketIo.once("service event: what time is it", (obj) => {
            if(obj.id !== requestId){
                return;
            }

            let dateNow = obj.date,
                currentTimeZoneOffsetInHours = new Date(obj.date).getTimezoneOffset() / 60;

            if(currentTimeZoneOffsetInHours < 0){
                dateNow = +obj.date - ((currentTimeZoneOffsetInHours * -1) * 360000);
            } else if(currentTimeZoneOffsetInHours > 0) {
                dateNow = +obj.date + (currentTimeZoneOffsetInHours * 360000);
            }

            dispatch({ type: "madePublised", data: new Date(dateNow).toISOString() });
        });

        socketIo.emit("service request: what time is it", { arguments: { id: requestId, dateType: "integer" }});
    };

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        console.log("func 'handlerDialogElementAdditionalThechnicalInfo', state:");
        console.log(state);
        console.log("func 'handlerDialogElementAdditionalThechnicalInfo', obj:");
        console.log(obj);

        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                console.log("external_references - hashes_update");

                dispatch({ type: "updateExternalReferencesHashesUpdate", data: obj.data });

                break;
            case "hashes_delete":
                console.log("external_references - hashes_delete");

                dispatch({ type: "updateExternalReferencesHashesDelete", data: obj.data });

                break;
            default:
                console.log("external_references - default");
                console.log("obj.modalType - ", obj.modalType);

                dispatch({ type: "updateExternalReferences", data: obj.data });
            }
        }
        
        if(obj.modalType === "granular_markings") {
            console.log("updateGranularMarkings......");

            dispatch({ type: "updateGranularMarkings", data: obj.data });
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
        }
    };
    
    console.log("----=====-----");
    console.log(state);
    console.log("----=====-----");

    let outsideSpecificationIsNotExist = ((state.outside_specification === null) || (typeof state.outside_specification === "undefined"));

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={6}><span className="text-muted">Наименование</span>:</Col>
            <Col md={6} className="text-right">{state.name && state.name}</Col>
        </Row>
        <Row>
            <Col md={12}><span className="text-muted">Дата и время</span>:</Col>
        </Row>      
        <Row>
            <Col md={6}>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">создания</span>
            </Col>
            <Col md={6} className="text-end">
                {state.created && 
                    helpers.convertDateFromString(state.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Col>
        </Row>
        <Row>
            <Col md={6} className="pl-4">
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">последнего обновления</span>
            </Col>
            <Col md={6} className="text-end">
                {state.modified && 
                    helpers.convertDateFromString(state.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Col>
        </Row>
        <Row>
            <Col md={6} className="pl-4">
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">публикации</span>
            </Col>
            {<MadePublished
                reportInformation={state} 
                handlerPublished={handlerPublished} 
            />}
        </Row>
        <Row>
            <Col md={12} className="mt-3">
                <TextField
                    id="outlined-multiline-static"
                    label={"подробное описание"}
                    multiline
                    minRows={3}
                    maxRows={8}
                    fullWidth
                    onChange={(e) => dispatch({ type: "updateDescription", data: e.target.value })}
                    defaultValue={state.description}
                    variant="outlined"/>
            </Col>  
        </Row>

        {/*<GetListObjectRefs
            listObjectRef={state.object_refs} 
            handlerDeleteObjectRef={this.handlerDeleteObjectRef}
            handlerShowDialogNewSTIXObject={this.handlerShowDialogNewSTIXObject}
        handlerChangeCurrentSTIXObject={this.handlerChangeCurrentAdditionalIdSTIXObject} />*/}

        <Row className="mt-3">
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
                        value={(() => {
                            if(outsideSpecificationIsNotExist){
                                return "";
                            }

                            if((state.outside_specification.additional_name === null) || (typeof state.outside_specification.additional_name === "undefined")){
                                return "";
                            }

                            return state.outside_specification.additional_name;
                        })()}
                        fullWidth={true}
                        onChange={(e) => dispatch({ type: "updateAdditionalName", data: e.target.value })}
                    />
                </span>
            </Col>
        </Row>
        <Row className="mt-3">
            <Col md={12}>
                <span className="pl-4">
                    <CreateListTypesDecisionsMadeComputerThreat
                        socketIo={socketIo}
                        defaultValue={() => {
                            if(outsideSpecificationIsNotExist){
                                return "";
                            }
    
                            if((state.outside_specification.decisions_made_computer_threat === null) || (typeof state.outside_specification.decisions_made_computer_threat === "undefined")){
                                return "";
                            }
    
                            return state.outside_specification.decisions_made_computer_threat;
                        }}
                        handlerDecisionsMadeComputerThreat={(e) => dispatch({ type: "updateDecisionsMadeComputerThreat", data: e })}
                    />
                </span>
            </Col>
        </Row>
        <Row className="mt-3">
            <Col md={12}>
                <span className="pl-4">
                    <CreateListTypesComputerThreat
                        socketIo={socketIo}
                        defaultValue={() => {
                            if(outsideSpecificationIsNotExist){
                                return "";
                            }
    
                            if((state.outside_specification.computer_threat_type === null) || (typeof state.outside_specification.computer_threat_type === "undefined")){
                                return "";
                            }

                            return state.outside_specification.computer_threat_type;
                        }}
                        handlerTypesComputerThreat={(e) => dispatch({ type: "updateComputerThreatType", data: e })}
                    />
                </span>
            </Col>
        </Row>
        <CreateElementAdditionalTechnicalInformationDO
            objectId={showReportId}
            reportInfo={state}
            handlerElementConfidence={(e) => dispatch({ type: "updateConfidence", data: e })}
            handlerElementDefanged={(e) => dispatch({ type: "updateDefanged", data: e })}
            handlerElementLabels={(e) => dispatch({ type: "updateLabels", data: e })}
            handlerElementDelete={(e) => { console.log(e); }}
            handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}
            //handlerDialogElementAdditionalThechnicalInfo={(e) => { console.log(e)}}
            isNotDisabled={userPermissions} 
        />
        {/*<CreateElementAdditionalTechnicalInformationReportObject 
            socketIo={socketIo}
            objectId={showReportId}
            reportInfo={state}
            handlerElementConfidence={(e) => dispatch({ type: "updateConfidence", data: e })}
            handlerElementDefanged={(e) => dispatch({ type: "updateDefanged", data: e })}
            handlerElementLabels={(e) => dispatch({ type: "updateLabels", data: e })}
            handlerElementDelete={(e) => { console.log(e); }}
            showDialogElementAdditionalThechnicalInfo={(e) => { console.log(e); }}
            isNotDisabled={userPermissions} 
        />*/}

        {/*
        Недоделал CreateElementAdditionalTechnicalInformationReportObject 
                    updateConfidence
            updateDefanged
            updateLabels
*/}
    </React.Fragment>);
}

CreateReportInformation.propTypes = {
    socketIo: PropTypes.object.isRequired,
    groupList: PropTypes.array.isRequired,
    showReportId: PropTypes.string.isRequired,
    userPermissions: PropTypes.bool.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    handlerChangeButtonSaveIsDisabled: PropTypes.func.isRequired,
};

function MadePublished(props){
    let { reportInformation, handlerPublished } = props;

    if(Date.parse(reportInformation.published) <= 0){
        return (<Col md={6} className="text-end">
            <Link href="#" onClick={handlerPublished} color="error">
                <Typography variant="overline" display="block" gutterBottom>опубликовать</Typography>
            </Link>
        </Col>);
    }

    return (<Col md={6} className="text-end">
        {new Date(Date.parse(reportInformation.published)).toLocaleString("ru", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timezone: "Europe/Moscow",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        })}
    </Col>);
}

MadePublished.propTypes = {
    reportInformation: PropTypes.object.isRequired,
    handlerPublished: PropTypes.func.isRequired,
};

function GroupsViewingAvailable(props){
    let { 
        socketIo,
        groupList,
        showReportId,
        userPermissions,
    } = props;

    const [ listGroupAccessToReport, setListGroupAccessToReport ] = useState([]);

    const listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        if(!Array.isArray(data.information.additional_parameters.list_groups_which_report_available)){
            return;
        }

        setListGroupAccessToReport(data.information.additional_parameters.list_groups_which_report_available.map((item) => { 
            return { group: item.group_name,
                time: helpers.getDate(item.date_time),
                userName: item.user_name,
                title: `Пользователь: ${item.user_name}, Время: ${helpers.getDate(item.date_time)}`};
        }));
    };
    React.useEffect(() => {
        socketIo.on("isems-mrsi response ui: list of groups to which the report is available", listener);
    
        return () => {
            socketIo.off("isems-mrsi response ui: list of groups to which the report is available", listener);
        };
    }, []);

    const handlerOnChangeAccessGroupToReport = (data) => {
        let list = listGroupAccessToReport.slice(),
            groupName = data.target.value;

        for(let item of list){
            if((groupName === item.group) || (groupName === "select_group")){
                return;
            }
        }

        list.push({ 
            time: helpers.getDate(+new Date),
            userName: "текущий пользователь",
            group: groupName, 
            title: `Пользователь: текущий, Время: ${helpers.getDate(+new Date)}` 
        });

        setListGroupAccessToReport(list);
        
        socketIo.emit("isems-mrsi ui request: allow the group to access the report", { arguments: {
            reportId: showReportId,
            unprivilegedGroup: groupName,
        }});
    };

    const handlerDeleteChipFromListGroupAccessToReport = (groupName) => {
        let newListGroup = listGroupAccessToReport.filter((item) => {
            return groupName !== item.group;
        });
        setListGroupAccessToReport(newListGroup);

        socketIo.emit("isems-mrsi ui request: forbid the group to access the report", { arguments: {
            reportId: showReportId,
            unprivilegedGroup: groupName,
        }});
    };

    return (<Paper elevation={3}>
        <Box m={2} pb={2}>
            <Grid container direction="row" className="pt-3">
                <Grid item container md={12} justifyContent="center">
                    <strong>Отчет доступен для просмотра следующих групп</strong>
                </Grid>
            </Grid>

            <br/>
            {listGroupAccessToReport.map((item, num) => {
                return (<Grid container direction="row" className="pb-3" key={`key_list_group_access_report_${num}`}>
                    <Grid item container md={12} justifyContent="flex-end">
                        <Grid container direction="row" className="pl-3 pr-3" spacing={3}>
                            <Grid item container md={6} justifyContent="flex-end" className="text-end text-muted">
                                <Typography variant="caption">группа:</Typography>
                            </Grid>
                            <Grid item container md={6} justifyContent="flex-start" className="text-end text-muted">
                                <Typography variant="caption">{item.group}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container direction="row" className="pl-3 pr-3" spacing={3}>
                            <Grid item container md={6} justifyContent="flex-end" className="text-end text-muted">
                                <Typography variant="caption">добавлена:</Typography>
                            </Grid>
                            <Grid item container md={6} justifyContent="flex-start" className="text-end text-muted">
                                <Typography variant="caption">
                                    <span style={{ color: orange[800] }}>
                                        {helpers.convertDateFromString(item.time, { monthDescription: "long", dayDescription: "numeric" })}
                                    </span>
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container direction="row" className="pl-3 pr-3" spacing={3}>
                            <Grid item container md={6} justifyContent="flex-end" className="text-end text-muted">
                                <Typography variant="caption">пользователем:</Typography> 
                            </Grid>
                            <Grid item container md={6} justifyContent="flex-start" className="text-end text-muted">
                                <Typography variant="caption">{item.userName}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>);
            })}

            <Grid container direction="row" spacing={1}>
                <Grid item container md={9} justifyContent="flex-start">
                    <CreateChipList
                        variant="outlined"
                        style={{ color: purple[400], margin: "2px" }}
                        chipData={listGroupAccessToReport}
                        handleDelete={handlerDeleteChipFromListGroupAccessToReport}
                    />
                </Grid>
                <Grid item container md={3} justifyContent="flex-end">
                    <CreateListUnprivilegedGroups 
                        groupList={groupList}
                        handlerChosen={handlerOnChangeAccessGroupToReport}
                        isNotDisabled={userPermissions}
                    />
                </Grid>
            </Grid>
        </Box>
    </Paper>);
}

GroupsViewingAvailable.propTypes = {
    socketIo: PropTypes.object.isRequired,
    groupList: PropTypes.array.isRequired,
    showReportId: PropTypes.string.isRequired,
    userPermissions: PropTypes.bool.isRequired,
};
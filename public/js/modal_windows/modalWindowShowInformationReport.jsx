"use strict";

import React, { useState, useEffect, useReducer } from "react";
import { Col, Row } from "react-bootstrap";
import { 
    AppBar,
    Box,
    Button,
    Container,
    Dialog,
    Toolbar,
    IconButton,
    Typography,
    Grid,
    Link,
    TextField,
    Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { teal, purple, grey, orange } from "@material-ui/core/colors";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import { MainTextField } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";
import CreateChipList from "../module_managing_records_structured_information/any_elements/createChipList.jsx";
import CreateListObjectRefsReport from "../module_managing_records_structured_information/any_elements/createListObjectRefsReport.jsx";
import CreateListPreviousStateSTIX from "../module_managing_records_structured_information/any_elements/createListPreviousStateSTIX.jsx";
import CreateListUnprivilegedGroups from "../module_managing_records_structured_information/any_elements/createListUnprivilegedGroups.jsx";
import CreateListTypesComputerThreat from "../module_managing_records_structured_information/any_elements/createListTypesComputerThreat.jsx";
import CreateListTypesDecisionsMadeComputerThreat from "../module_managing_records_structured_information/any_elements/createListTypesDecisionsMadeComputerThreat.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformationDO.jsx";

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

const reducer = (state, action) => {
    let elemTmp = "";

    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "madePublised":
        state.published = action.data;

        return {...state};
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }

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
    case "updateObjectRefs":
        state.object_refs = action.data;

        return {...state};
    case "deleteObjectRefs":
        if(state.object_refs.length === 0){
            return {...state};
        }

        elemTmp = state.object_refs.splice(action.data, 1)[0].split("--");    
        state.report_types = state.report_types.filter((item) => item !== elemTmp[0]);

        return {...state};
    case "updateConfidence":
        if(state.confidence === action.data.data){
            return {...state};
        }

        return {...state, confidence: action.data.data};
    case "updateDefanged":
        return {...state, defanged: (action.data === "true")};
    case "updateLabels":
        return {...state, labels :action.data.listTokenValue};
    case "updateExternalReferences":
        for(let key of state.external_references){
            if(key.source_name === action.data.source_name){
                return {...state};
            }
        }

        state.external_references.push(action.data);

        return {...state};
    case "updateExternalReferencesHashesUpdate":
        if((state.external_references[action.data.orderNumber].hashes === null) || (typeof state.external_references[action.data.orderNumber].hashes === "undefined")){
            state.external_references[action.data.orderNumber].hashes = {};
        }

        state.external_references[action.data.orderNumber].hashes[action.data.newHash.hash] = action.data.newHash.type;

        return {...state};
    case "updateExternalReferencesHashesDelete":
        delete state.external_references[action.data.orderNumber].hashes[action.data.hashName];

        return {...state};
    case "updateGranularMarkings":
        for(let keyGM of state.granular_markings){
            if(!keyGM.selectors){
                return {...state};
            }

            for(let keyS of keyGM.selectors){
                for(let key of action.data.selectors){
                    if(key === keyS){
                        return {...state};
                    }
                }
            }
        }

        state.granular_markings.push(action.data);

        return {...state};
    case "updateExtensions":
        state.extensions[action.data.name] = action.data.description;

        return {...state};
    case "deleteElementAdditionalTechnicalInformation":
        switch(action.data.itemType){
        case "extensions":
            delete state.extensions[action.data.item];

            return {...state};

        case "granular_markings":
            state.granular_markings.splice(action.data.orderNumber, 1);
    
            return {...state};
        case "external_references":
            state.external_references.splice(action.data.orderNumber, 1);
    
            return {...state};
        }
    }
};

export default function ModalWindowShowInformationReport(props) {
    let {
        show,
        onHide,
        socketIo,
        groupList,
        showReportId,
        userPermissions,
        parentSTIXObject,
        confirmDeleteLink,
        fieldNameForChange,
        listNewOrModifySTIXObject,
        handlerButtonSave,
        handlerDialogConfirm, 
        handlerShowObjectRefSTIXObject,
        handlerShowModalWindowCreateNewSTIXObject,
        handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs,
    } = props;

    const [ buttonSaveIsDisabled, setButtonSaveIsDisabled ] = useState(true);
    const [ buttonSaveChangeTrigger, setButtonSaveChangeTrigger ] = useState(false);

    console.log("func 'ModalWindowShowInformationReact', MOUNT (((( WINDOW SHOW INFO REPORT ))))");
    console.log("showReportId = ", showReportId);

    let handlerButtonSaveIsNotDisabled = () => {
            if(buttonSaveIsDisabled){
                setButtonSaveIsDisabled(false);
            }
        },
        handlerPressButtonSave = (state) => {
            setButtonSaveChangeTrigger((prevState) => !prevState);
            if(!buttonSaveIsDisabled){
                setButtonSaveIsDisabled(true);
            }
            handlerButtonSave(state);
        };

    return (<Dialog 
        fullScreen 
        open={show} 
        onClose={() => onHide()}>
        <CreateAppBar 
            title={showReportId}
            nameDialogButton="сохранить"
            buttonSaveIsDisabled={buttonSaveIsDisabled}
            handlerDialogClose={() => { 
                onHide();
            }}
            handlerDialogButton={() => setButtonSaveChangeTrigger(true)} />            
        <CreateAppBody
            socketIo={socketIo} 
            groupList={groupList}
            showReportId={showReportId}
            userPermissions={userPermissions.editing_information.status}
            parentSTIXObject={parentSTIXObject}
            confirmDeleteLink={confirmDeleteLink}
            fieldNameForChange={fieldNameForChange}
            buttonSaveChangeTrigger={buttonSaveChangeTrigger}
            listNewOrModifySTIXObject={listNewOrModifySTIXObject}
            handlerDialogConfirm={handlerDialogConfirm}
            handlerPressButtonSave={handlerPressButtonSave}
            handlerShowObjectRefSTIXObject={handlerShowObjectRefSTIXObject}
            handlerButtonSaveIsNotDisabled={handlerButtonSaveIsNotDisabled}
            handlerShowModalWindowCreateNewSTIXObject={handlerShowModalWindowCreateNewSTIXObject}
            handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs={handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs}
        />
    </Dialog>); 
}

ModalWindowShowInformationReport.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    groupList: PropTypes.array.isRequired,
    showReportId: PropTypes.string.isRequired,
    userPermissions: PropTypes.object.isRequired,
    parentSTIXObject: PropTypes.object.isRequired,
    confirmDeleteLink: PropTypes.bool.isRequired,
    fieldNameForChange: PropTypes.array.isRequired,
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    handlerButtonSave: PropTypes.func.isRequired,
    handlerDialogConfirm: PropTypes.func.isRequired,
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
    handlerShowModalWindowCreateNewSTIXObject: PropTypes.func.isRequired,
    handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs: PropTypes.func.isRequired,
};

function CreateAppBar(props){
    const classes = useStyles();
    const { 
        title, 
        nameDialogButton,
        buttonSaveIsDisabled, 
        handlerDialogClose, 
        handlerDialogButton 
    } = props;
    
    return (<AppBar className={classes.appBar}>
        <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handlerDialogClose} aria-label="close">
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
    handlerDialogClose: PropTypes.func.isRequired,
    handlerDialogButton: PropTypes.func.isRequired,
};

function CreateAppBody(props){
    let {
        socketIo,
        groupList,
        showReportId,
        userPermissions,
        parentSTIXObject,
        confirmDeleteLink,
        fieldNameForChange,
        buttonSaveChangeTrigger,
        listNewOrModifySTIXObject,
        handlerDialogConfirm,
        handlerPressButtonSave,
        handlerShowObjectRefSTIXObject,
        handlerButtonSaveIsNotDisabled,
        handlerShowModalWindowCreateNewSTIXObject,
        handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs,
    } = props;

    return (<Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>
        <Row>
            <Col md={7}>
                <CreateReportInformation 
                    socketIo={socketIo}
                    showReportId={showReportId}
                    userPermissions={userPermissions}
                    parentSTIXObject={parentSTIXObject}
                    confirmDeleteLink={confirmDeleteLink}
                    handlerDialogConfirm={handlerDialogConfirm}
                    fieldNameForChange={fieldNameForChange}
                    buttonSaveChangeTrigger={buttonSaveChangeTrigger}
                    listNewOrModifySTIXObject={listNewOrModifySTIXObject}
                    handlerPressButtonSave={handlerPressButtonSave}
                    handlerShowObjectRefSTIXObject={handlerShowObjectRefSTIXObject}
                    handlerButtonSaveIsNotDisabled={handlerButtonSaveIsNotDisabled}
                    handlerShowModalWindowCreateNewSTIXObject={handlerShowModalWindowCreateNewSTIXObject}
                    handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs={handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs}
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
    parentSTIXObject: PropTypes.object.isRequired,
    confirmDeleteLink: PropTypes.bool.isRequired,
    fieldNameForChange: PropTypes.array.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    handlerDialogConfirm: PropTypes.func.isRequired,
    handlerPressButtonSave: PropTypes.func.isRequired,
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
    handlerButtonSaveIsNotDisabled: PropTypes.func.isRequired,
    handlerShowModalWindowCreateNewSTIXObject: PropTypes.func.isRequired,
    handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs: PropTypes.func.isRequired,
};

function CreateReportInformation(props){
    let {
        socketIo,
        showReportId,
        userPermissions,
        parentSTIXObject,
        confirmDeleteLink,
        fieldNameForChange,
        buttonSaveChangeTrigger,
        listNewOrModifySTIXObject,
        handlerDialogConfirm,
        handlerPressButtonSave,
        handlerShowObjectRefSTIXObject,
        handlerButtonSaveIsNotDisabled,
        handlerShowModalWindowCreateNewSTIXObject,
        handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs,
    } = props;

    console.log("func 'CreateReportInformation', START...");

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

                break;
            }
        }
    };
    useEffect(() => {
        socketIo.on("isems-mrsi response ui: send search request, get report for id", listener);
    
        return () => {
            socketIo.off("isems-mrsi response ui: send search request, get report for id", listener);
        };
    }, []);
    useEffect(() => {
        if(showReportId !== ""){

            console.log("SEND REQUEST: isems-mrsi ui request: send search request, get report for id");

            //запрос информации об STIX объекте типа 'report' (Отчёт) по его ID
            socketIo.emit("isems-mrsi ui request: send search request, get report for id", { arguments: showReportId });
            socketIo.emit("isems-mrsi ui request: get a list of groups to which the report is available", { arguments: showReportId });
        }
    }, [ socketIo, showReportId ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){
            console.log("func 'CreateReportInformation' ----> SEND REPORT:", state);
            handlerPressButtonSave(state);
        }
    }, [ buttonSaveChangeTrigger, state, handlerPressButtonSave ]),
    useEffect(() => {
        console.log("func 'CreateReportInformation', useEffect, 1111111111111 update 'state' ", state, ", parentSTIXObject:", parentSTIXObject);

        //здесь обновляется только объект Report

        /**
 * 
 * надо найти способ обновлять другие объекты
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

        if(parentSTIXObject.type !== "report"){
            return;
        }

        let objectRefs = state.object_refs.slice();        
        for(let stixObject of listNewOrModifySTIXObject){
            if(!objectRefs.find((item) => item === stixObject.id)){
                objectRefs.push(stixObject.id);
            }
        }

        console.log("func 'CreateReportInformation', useEffect, 222222222222 update 'state' (objectRefs)", objectRefs);

        dispatch({ type: "updateObjectRefs", data: objectRefs });
    }, [ parentSTIXObject, fieldNameForChange, listNewOrModifySTIXObject ]);

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
            handlerButtonSaveIsNotDisabled();
        });

        socketIo.emit("service request: what time is it", { arguments: { id: requestId, dateType: "integer" }});
    };

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});

                break;
            case "hashes_delete":
                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});

                break;
            default:
                dispatch({ type: "updateExternalReferences", data: obj.data });
            }

            handlerButtonSaveIsNotDisabled();
        }
        
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerButtonSaveIsNotDisabled();
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerButtonSaveIsNotDisabled();
        }
    };

    let outsideSpecificationIsNotExist = ((state.outside_specification === null) || (typeof state.outside_specification === "undefined"));

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={6}><span className="text-muted">Наименование:</span></Col>
            <Col md={6} className="text-right">{state.name && state.name}</Col>
        </Row>
        <Row>
            <Col md={12}><span className="text-muted">Дата и время</span>:</Col>
        </Row>      
        <Row>
            <Col md={6}>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">создания:</span>
            </Col>
            <Col md={6} className="text-end">
                {state.created && 
                    helpers.convertDateFromString(state.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Col>
        </Row>
        <Row>
            <Col md={6} className="pl-4">
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">последнего обновления:</span>
            </Col>
            <Col md={6} className="text-end">
                {state.modified && 
                    helpers.convertDateFromString(state.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Col>
        </Row>
        <Row>
            <Col md={6} className="pl-4">
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">публикации:</span>
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
                    onChange={(e) => {
                        dispatch({ type: "updateDescription", data: e.target.value });
                        handlerButtonSaveIsNotDisabled();
                    }}
                    defaultValue={state.description}
                    variant="outlined"/>
            </Col>  
        </Row>
        {state.object_refs && <CreateListObjectRefsReport
            socketIo={socketIo}
            stateReport={state}
            majorParentId={showReportId}
            parentSTIXObject={parentSTIXObject}
            confirmDeleteLink={confirmDeleteLink}
            listNewOrModifySTIXObject={listNewOrModifySTIXObject}
            handlerDialogConfirm={handlerDialogConfirm}
            handlerDeleteObjectRef={(parentId, deleteId) => handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs.call(null, parentId, deleteId)} 
            handlerReportUpdateObjectRefs={(newObjectRefs) => dispatch({ type: "updateObjectRefs", data: newObjectRefs })}
            handlerShowObjectRefSTIXObject={handlerShowObjectRefSTIXObject}
            handlerShowModalWindowCreateNewSTIXObject={handlerShowModalWindowCreateNewSTIXObject}
        />}
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
                        onChange={(e) => {
                            dispatch({ type: "updateAdditionalName", data: e.target.value });
                            handlerButtonSaveIsNotDisabled();
                        }}
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
                        handlerDecisionsMadeComputerThreat={(e) => {
                            dispatch({ type: "updateDecisionsMadeComputerThreat", data: e });
                            handlerButtonSaveIsNotDisabled();
                        }}
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
                        handlerTypesComputerThreat={(e) => {
                            dispatch({ type: "updateComputerThreatType", data: e });
                            handlerButtonSaveIsNotDisabled();
                        }}
                    />
                </span>
            </Col>
        </Row>
        
        <CreateElementAdditionalTechnicalInformationDO
            objectId={showReportId}
            reportInfo={state}
            isNotDisabled={userPermissions}
            handlerElementConfidence={(e) => { dispatch({ type: "updateConfidence", data: e }); handlerButtonSaveIsNotDisabled(); }}
            handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerButtonSaveIsNotDisabled(); }}
            handlerElementLabels={(e) => { dispatch({ type: "updateLabels", data: e }); handlerButtonSaveIsNotDisabled(); }}
            handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerButtonSaveIsNotDisabled(); }}
            handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo} 
        />
    </React.Fragment>);
}

CreateReportInformation.propTypes = {
    socketIo: PropTypes.object.isRequired,
    showReportId: PropTypes.string.isRequired,
    userPermissions: PropTypes.bool.isRequired,
    parentSTIXObject: PropTypes.object.isRequired,
    confirmDeleteLink: PropTypes.bool.isRequired,
    fieldNameForChange: PropTypes.array.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    handlerDialogConfirm: PropTypes.func.isRequired,
    handlerPressButtonSave: PropTypes.func.isRequired,
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
    handlerButtonSaveIsNotDisabled: PropTypes.func.isRequired,
    handlerShowModalWindowCreateNewSTIXObject: PropTypes.func.isRequired,
    handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs: PropTypes.func.isRequired,
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
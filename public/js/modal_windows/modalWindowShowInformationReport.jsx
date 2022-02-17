"use strict";

import React, { useState, useEffect, useReducer } from "react";
import { Col, Row } from "react-bootstrap";
import { 
    AppBar,
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
import CreateElementAdditionalTechnicalInformationReportObject from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformationReportObject.jsx";
import ModalWindowDialogElementAdditionalThechnicalInformation from "./modalWindowDialogElementAdditionalThechnicalInformation.jsx";


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

export default function ModalWindowShowInformationReact(props) {
    let { 
        show,
        onHide,
        showReportId,
        groupList,
        userPermissions,
        listTypesComputerThreat,
        listTypesDecisionsMadeComputerThreat,
        socketIo,
    } = props;

    const [ buttonSaveIsDisabled, setButtonSaveIsDisabled ] = useState(true);
    const reducer = (state, action) => {
        switch(action.type){
        case "newAll":
            return action.data;
        case "cleanAll":
            return {};
        case "madePublised":
            state.published = action.data;
            setButtonSaveIsDisabled(false);

            return {...state};
        }
    };
    const [state, dispatch] = useReducer(reducer, {});
    //const [ reportAcceptedInformation, setReportAcceptedInformation ] = useState({});

    console.log("func 'ModalWindowShowInformationReact', Start...");
    console.log("showReportId = ", showReportId);

    const listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        let objectId = "", 
            reportInfo = {},
            listObjectInfoTmp = {},
            listPreviousStateTmp = [],
            optionsPreviousStateTmp = {};

        switch(data.section){
        /*case "list of groups that are allowed access":
            this.setState({ availableForGroups: data.information.additional_parameters });
        
            break;*/
        
        // прием информации об Отчете по его ID
        case "send search request, get report for id":
            if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
                break;
            }

            if(data.information.additional_parameters.transmitted_data.length === 0){
                break;
            }

            console.log("data.information.additional_parameters.transmitted_data");
            console.log(data.information.additional_parameters.transmitted_data);

            for(let obj of data.information.additional_parameters.transmitted_data){

                console.log("func 'listener', obj");
                console.log(obj);        
                console.log("obj.id: ", obj.id, " = ", showReportId, " :showReportId");

                if(obj.type === "report"){
                    dispatch({ type: "newAll", data: obj });                  
                    //setReportAcceptedInformation(obj);

                    break;
                }
            }

            break;


        /*
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

            break;*/
        }
    };

    React.useEffect(() => {
        socketIo.on("isems-mrsi response ui", listener);
    
        return () => {
            socketIo.off("isems-mrsi response ui", listener);
        };
    }, []);
    React.useEffect(() => {
        if(showReportId !== ""){
            let searchReguest = {
                paginateParameters: {
                    maxPartSize: 30,
                    currentPartNumber: 1,
                },
                sortableField: "data_created",
                // между параметрами "id_documents", "type_documents", "created", "modified", "created_by_ref", "specific_search_fields" и 
                // "outside_specification_search_fields" используется логика "И"
                searchParameters: patternSearchParameters
            };
            searchReguest.searchParameters.documentsId = [ showReportId ];
    
            console.log("func 'ModalWindowShowInformationReact', socketIo.emit");
            console.log(searchReguest);
    
            //запрос информации об STIX объекте типа 'report' (Отчёт) по его ID
            socketIo.emit("isems-mrsi ui request: send search request, get report for id", { arguments: searchReguest });
            socketIo.emit("isems-mrsi ui request: get a list of groups to which the report is available", { arguments: searchReguest });
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

    const modalClose = () => {
        onHide();

        //setReportAcceptedInformation({});
        dispatch({ type: "cleanAll" });                  
        
        //setReportInformation({});

        /*this.setState({
            reportInfo: {},
            availableForGroups: [],
            listPreviousStateReport: [],
            listGroupAccessToReport: [],
            showListPreviousStateReport: false,
        });*/
    };
    const handlerReportSave = () => {

    };

    return (<Dialog 
        fullScreen 
        open={show} 
        onClose={() => { 
            //this.setState({ showListPreviousStateReport: false });
            modalClose();
        }} >

        <CreateAppBar 
            title={showReportId}
            nameDialogButton="сохранить"
            buttonSaveIsDisabled={buttonSaveIsDisabled}
            handelrDialogClose={() => { 
                //this.setState({ showListPreviousStateReport: false });
                modalClose();
            }}
            handlerDialogButton={() => { 
                //this.setState({ showListPreviousStateReport: false });
                handlerReportSave();
            }} />
            
        {state.id && <CreateAppBody
            socketIo={socketIo} 
            groupList={groupList}
            showReportId={showReportId}
            userPermissions={userPermissions.editing_information.status}
            reportInformation={state}
            handlerPublished={handlerPublished}
        />}
    </Dialog>); 
}

ModalWindowShowInformationReact.propTypes = {
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
        reportInformation,
        handlerPublished,
    } = props;

    console.log("func 'CreateAppBody', START");
    console.log(reportInformation);

    const [ listGroupAccessToReport, setListGroupAccessToReport ] = useState([]);
    const [ currentGroupAccessToReport, setCurrentGroupAccessToReport ] = useState("select_group");

    const listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        switch(data.section){
        case "list of groups to which the report is available":
            if(!Array.isArray(data.information.additional_parameters.list_groups_which_report_available)){
                return;
            }

            setListGroupAccessToReport(data.information.additional_parameters.list_groups_which_report_available.map((item) => { 
                return { group: item.group_name,
                    time: helpers.getDate(item.date_time),
                    userName: item.user_name,
                    title: `Пользователь: ${item.user_name}, Время: ${helpers.getDate(item.date_time)}`};
            }));

            break;
        }
    };
    React.useEffect(() => {
        socketIo.on("isems-mrsi response ui", listener);
    
        return () => {
            socketIo.off("isems-mrsi response ui", listener);
        };
    }, []);

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
        setCurrentGroupAccessToReport("select_group");
        
        socketIo.emit("isems-mrsi ui request: allow the group to access the report", { arguments: {
            reportId: showReportId,
            unprivilegedGroup: groupName,
        }});
    };

    return (<Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>
        <Row>
            <Col md={7}>
                <Row className="mt-4">
                    <Col md={6}><span className="text-muted">Наименование</span>:</Col>
                    <Col md={6} className="text-right">{reportInformation.name && reportInformation.name}</Col>
                </Row>

                <Row>
                    <Col md={12}><span className="text-muted">Дата и время</span>:</Col>
                </Row>      

                <Row>
                    <Col md={6}>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="text-muted">создания</span>
                    </Col>
                    <Col md={6} className="text-end">
                        {reportInformation.created && 
                        helpers.convertDateFromString(reportInformation.created, { monthDescription: "long", dayDescription: "numeric" })}
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="pl-4">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="text-muted">последнего обновления</span>
                    </Col>
                    <Col md={6} className="text-end">
                        {reportInformation.modified && 
                        helpers.convertDateFromString(reportInformation.modified, { monthDescription: "long", dayDescription: "numeric" })}
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="pl-4">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="text-muted">публикации</span>
                    </Col>
                    {< MadePublished
                        reportInformation={reportInformation} 
                        handlerPublished={handlerPublished} />}
                </Row>

                <Row className="mt-3">
                    <Col md={12} className="text-muted text-left">Доступность для непривилегированных групп</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={6}>
                        <CreateChipList
                            variant="outlined"
                            style={{ color: purple[400], margin: "2px" }}
                            chipData={listGroupAccessToReport}
                            handleDelete={handlerDeleteChipFromListGroupAccessToReport} />
                    </Col>
                    <Col md={6} className="pt-1">
                        <CreateListUnprivilegedGroups 
                            groupList={groupList}
                            currentGroup={currentGroupAccessToReport}
                            handlerChosen={handlerOnChangeAccessGroupToReport}
                            isNotDisabled={userPermissions} />
                    </Col>
                </Row>
                    
                {/*<Row>
                    <Col md={12} className="mt-3">
                        <TextField
                            id="outlined-multiline-static"
                            label={"подробное описание"}
                            multiline
                            minRows={3}
                            maxRows={8}
                            fullWidth
                            onChange={this.handlerOnChangeDescription}
                            defaultValue={reportInfo.description}
                            variant="outlined"/>
                    </Col>  
                </Row>*/}

                {/*<GetListObjectRefs
                            listObjectRef={reportInfo.object_refs} 
                            handlerDeleteObjectRef={this.handlerDeleteObjectRef}
                            handlerShowDialogNewSTIXObject={this.handlerShowDialogNewSTIXObject}
                        handlerChangeCurrentSTIXObject={this.handlerChangeCurrentAdditionalIdSTIXObject} />*/}

                <Row className="mt-1">
                    <Col md={12}>
                        <span className="text-muted">Дополнительная информация не входящая в основную спецификацию объекта SDO STIX 2.1</span>
                    </Col>
                </Row>

                {/*<Row className="mt-3">
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
                                    </Row>*/}

                {/*((outsideSpecificationIsNotExist) || (reportInfo.outside_specification.decisions_made_computer_threat === null) || (typeof reportInfo.outside_specification.decisions_made_computer_threat === "undefined"))? 
                            "":
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
                                    */}
                
                {/*((outsideSpecificationIsNotExist) || (reportInfo.outside_specification.computer_threat_type === null) || (typeof reportInfo.outside_specification.computer_threat_type === "undefined"))? 
                            "":
                            <Row className="mt-3">
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
                        */}

                {/*<CreateElementAdditionalTechnicalInformationReportObject 
                            reportInfo={reportInfo}
                            objectId={this.props.showReportId}
                            handlerElementConfidence={this.handlerElementConfidence.bind(this)}
                            handlerElementDefanged={this.handlerElementDefanged.bind(this)}
                            handlerElementLabels={this.handlerElementLabels.bind(this)}
                            handlerElementDelete={this.handlerDeleteElementAdditionalTechnicalInformation.bind(this)}
                            showDialogElementAdditionalThechnicalInfo={this.showDialogElementAdditionalThechnicalInfo.bind(this)}
                        isNotDisabled={this.props.userPermissions.editing_information.status} />*/}
  
            </Col>
            <Col md={5}>
                <GroupsViewingAvailable listGroupAccessToReport={listGroupAccessToReport} />

                <br/>
                <CreateListPreviousStateSTIX 
                    socketIo={socketIo} 
                    searchObjectId={showReportId} />
            </Col>
        </Row>
    </Container>);
}

CreateAppBody.propTypes = {
    socketIo: PropTypes.object.isRequired,
    groupList: PropTypes.array.isRequired,
    showReportId: PropTypes.string.isRequired,
    userPermissions: PropTypes.bool.isRequired,
    reportInformation: PropTypes.object.isRequired,
    handlerPublished: PropTypes.func.isRequired,
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
    let { listGroupAccessToReport } = props;

    return (<Paper elevation={3}>
        <Row className="pt-3">
            <Col md={12} className="text-center">
                <strong>Отчет доступен для просмотра следующих групп</strong>
            </Col>
        </Row>

        <br/>
        {listGroupAccessToReport.map((item, num) => {
            return (<Row className="pb-3" key={`key_list_group_access_report_${num}`}>
                <Col md={1}></Col>
                <Col md={10}>
                    <Row className="pl-3 pr-3">
                        <Col md={6} className="text-end text-muted">
                            <Typography variant="caption">группа:</Typography>
                        </Col>
                        <Col md={6} className="text-start">
                            <Typography variant="caption">{item.group}</Typography>
                        </Col>
                    </Row>
                    <Row className="pl-3 pr-3">
                        <Col md={6} className="text-end text-muted">
                            <Typography variant="caption">добавлена:</Typography>
                        </Col>
                        <Col md={6} className="text-start">
                            <Typography variant="caption">
                                <span style={{ color: orange[800] }}>
                                    {helpers.convertDateFromString(item.time, { monthDescription: "long", dayDescription: "numeric" })}
                                </span>
                            </Typography>
                        </Col>
                    </Row>
                    <Row className="pl-3 pr-3">
                        <Col md={6} className="text-end text-muted">
                            <Typography variant="caption">пользователем:</Typography>
                        </Col>
                        <Col md={6} className="text-start">
                            <Typography variant="caption">{item.userName}</Typography>
                        </Col>
                    </Row>
                </Col>
                <Col md={1}></Col>
            </Row>);
        })}
    </Paper>);
}

GroupsViewingAvailable.propTypes = {
    listGroupAccessToReport: PropTypes.array.isRequired,
};
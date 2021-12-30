"use strict";

import React, { Suspense } from "react";
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
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { teal, purple, grey, orange } from "@material-ui/core/colors";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import { MainTextField } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";
import CreateChipList from "../module_managing_records_structured_information/any_elements/createChipList.jsx";
import CreateListSelect from "../module_managing_records_structured_information/any_elements/createListSelect.jsx";
import CreateListUnprivilegedGroups from "../module_managing_records_structured_information/any_elements/createListUnprivilegedGroups.jsx";
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

const SizePart = 15;
const sortDateFunc = (a, b) => {
    let timeA = +new Date(a.modified_time);
    let timeB = +new Date(b.modified_time);

    if(timeA > timeB) return -1;
    if(timeA === timeB) return 0;
    if(timeA < timeB) return 1;
};

export default class ModalWindowShowInformationReportSTIX extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            uuidValue: "",
            listObjectInfo: {},
            optionsPreviousState: {
                sizePart: SizePart,
                countFoundDocuments: 0,
                objectId: "",
                currentPartNumber: 1,
            },
            optionsPreviousStateReport: {
                sizePart: SizePart,
                countFoundDocuments: 0,
                objectId: "",
                currentPartNumber: 1,
            },
            listPreviousState: [],
            listPreviousStateReport: [],
            availableForGroups: [],
            listGroupAccessToReport: [],
            secondBreadcrumbsObjectId: "",
            currentGroupAccessToReport: "select_group",
            reportAcceptedInformation: {},
            currentAdditionalIdSTIXObject: "",
            showDialogElementAdditionalSTIXObject: false,
            showDialogElementAdditionalThechnicalInfo: false,
            objectDialogElementAdditionalThechnicalInfo: {},
        };

        this.modalClose = this.modalClose.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handlePublished = this.handlePublished.bind(this);
        this.handlerReportSave = this.handlerReportSave.bind(this);
        this.handelrDialogClose = this.handelrDialogClose.bind(this);
        this.handlerDialogButton = this.handlerDialogButton.bind(this);
        this.handlerOnChangeDescription = this.handlerOnChangeDescription.bind(this);
        this.handlerManagingAccessToReport = this.handlerManagingAccessToReport.bind(this);
        this.handlerNewAdditionalSTIXObject = this.handlerNewAdditionalSTIXObject.bind(this);
        this.handlerOnChangeAccessGroupToReport = this.handlerOnChangeAccessGroupToReport.bind(this);
        this.handlerOutsideSpecificationAdditionalName = this.handlerOutsideSpecificationAdditionalName.bind(this);
        this.handlerChangeCurrentAdditionalIdSTIXObject = this.handlerChangeCurrentAdditionalIdSTIXObject.bind(this);
        this.handlerDeleteChipFromListGroupAccessToReport = this.handlerDeleteChipFromListGroupAccessToReport.bind(this);
        this.handlerChosenComputerThreatType = this.handlerChosenComputerThreatType.bind(this);
        this.handlerChosenDecisionsMadeComputerThreat = this.handlerChosenDecisionsMadeComputerThreat.bind(this);
        this.handlerExternalReferencesButtonSave = this.handlerExternalReferencesButtonSave.bind(this);

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    /** TEST ONLY */
    testWriteAdditionalInfoForListObjectInfo(){
        let listObjectTmp = _.cloneDeep(this.state.listObjectInfo);

        console.log("func 'testWriteAdditionalInfoForListObjectInfo', START...");
        console.log(listObjectTmp);

        // *** для теста "Дополнительных внешних ссылок" START ***
        listObjectTmp[this.props.showReportId].external_references = [
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
        listObjectTmp[this.props.showReportId].granular_markings = [
            {
                lang: "CH",
                marking_ref: "marking--bubdu8eeugfuegfe8fefhefe",
                selectors: ["selectors_suvnid_1", "selectors_cvbi_2"],
            },
            {
                lang: "US",
                marking_ref: "marking-- cscusuudbsfubdufbudbfueubue",
                selectors: ["selectors-11", "selectors-22", "selectors-33"],
            },
            {
                lang: "RU",
                selectors: ["selectors-bdufbdubudfud", "selectors-sufuwu3fueuef", "selectors-dufveufueufuefu"],
            },
        ];
        // *** для теста "Дополниельные 'гранулярные метки'" END ***

        // *** для теста "Любая дополнительная информация" START ***
        listObjectTmp[this.props.showReportId].extensions = { "test element": "budbuufbduf fndufbud ufbdgufgur", "test element 1": "bvbibevi484negfgrgiurg" };
        // *** для теста "Любая дополнительная информация" END ***

        this.setState({ listObjectInfo: listObjectTmp });
    }

    handlerEvents(){
        //обработка события связанного с приемом списка групп которым разрешен доступ к данному докладу
        this.props.socketIo.on("isems-mrsi response ui", (data) => {
            if((data.information === null) || (typeof data.information === "undefined")){
                return;
            }

            if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                return;
            }

            let objectId = "", 
                reportInfo = {},
                listObjectInfoTmp = {},
                listPreviousState = [],
                optionsPreviousStateTmp = {};

            switch(data.section){
            case "list of groups that are allowed access":
                this.setState({ availableForGroups: data.information.additional_parameters });
                
                break;
            case "send search request, get report for id":
                if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
                    break;
                }

                if(data.information.additional_parameters.transmitted_data.length === 0){
                    break;
                }

                for(let obj of data.information.additional_parameters.transmitted_data){
                    if(obj.type !== "report"){
                        continue;
                    }

                    reportInfo = obj;
                }

                if(Object.keys(reportInfo).length === 0){
                    break;
                }

                listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);
                listObjectInfoTmp[reportInfo.id] = reportInfo;

                this.setState({ 
                    listObjectInfo: listObjectInfoTmp,
                    reportAcceptedInformation: reportInfo,
                });

                /*
                *              ВНИМАНИЕ только для тестов!!!
                * Функция testWriteAdditionalInfoForListObjectInfo осуществляет ДОПОЛНИТЕЛЬНОЕ наполнение ТЕСТОВОЙ информацией объекта
                * listObjectInfo
                **/
                //this.testWriteAdditionalInfoForListObjectInfo.call(this);
        
                break;
            case "list of groups to which the report is available":
                if(!Array.isArray(data.information.additional_parameters.list_groups_which_report_available)){
                    break;
                }

                this.setState({ listGroupAccessToReport: data.information.additional_parameters.list_groups_which_report_available.map((item) => {
                    return { 
                        group: item.group_name,
                        time: helpers.getDate(item.date_time),
                        userName: item.user_name,
                        title: `Пользователь: ${item.user_name}, Время: ${helpers.getDate(item.date_time)}` };
                })});

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

            case "isems-mrsi ui request: send search request, list different objects STIX object for id":
                if(data.information.additional_parameters.transmitted_data.length === 0){
                    return;
                }

                objectId = (data.information.additional_parameters.transmitted_data.length > 1)? data.information.additional_parameters.transmitted_data[0].document_id: "";

                if(objectId.startsWith("report")){
                    if(this.state.listPreviousStateReport.length === 0){
                        listPreviousState = (data.information.additional_parameters.transmitted_data.length === 0)? 
                            [{}]: 
                            data.information.additional_parameters.transmitted_data;
                    } else {
                        listPreviousState = this.state.listPreviousStateReport.slice();
    
                        for(let item of data.information.additional_parameters.transmitted_data){
                            if(!listPreviousState.find((elem) => elem.modified_time === item.modified_time)){
                                listPreviousState.push(item);
                            }
                        }
    
                        listPreviousState.sort(sortDateFunc);                
                    }
    
                    optionsPreviousStateTmp = _.cloneDeep(this.state.optionsPreviousState);
                    optionsPreviousStateTmp.objectId = objectId;
                    optionsPreviousStateTmp.currentPartNumber = data.information.additional_parameters.number_transmitted_part;
    
                    this.setState({ listPreviousStateReport: listPreviousState });
                } else {
                    if((this.state.listPreviousState.length === 0) || (this.state.optionsPreviousState.objectId !== objectId)){
                        listPreviousState = (data.information.additional_parameters.transmitted_data.length === 0)? 
                            [{}]: 
                            data.information.additional_parameters.transmitted_data;
                    } else {
                        listPreviousState = this.state.listPreviousState.slice();
    
                        for(let item of data.information.additional_parameters.transmitted_data){
                            if(!listPreviousState.find((elem) => elem.modified_time === item.modified_time)){
                                listPreviousState.push(item);
                            }
                        }
    
                        listPreviousState.sort(sortDateFunc);                
                    }
    
                    optionsPreviousStateTmp = _.cloneDeep(this.state.optionsPreviousState);
                    optionsPreviousStateTmp.objectId = objectId;
                    optionsPreviousStateTmp.currentPartNumber = data.information.additional_parameters.number_transmitted_part;
    
                    this.setState({ 
                        listPreviousState: listPreviousState,
                        optionsPreviousState: optionsPreviousStateTmp 
                    });
                }

                break;

            case "isems-mrsi ui request: send search request, count list different objects STIX object for id":
                if(this.props.showReportId === data.information.additional_parameters.document_id){
                    optionsPreviousStateTmp = _.cloneDeep(this.state.optionsPreviousStateReport);
                    optionsPreviousStateTmp.objectId = data.information.additional_parameters.document_id;
                    optionsPreviousStateTmp.countFoundDocuments = data.information.additional_parameters.number_documents_found;
    
                    this.setState({ optionsPreviousStateReport: optionsPreviousStateTmp });
                } else {
                    optionsPreviousStateTmp = _.cloneDeep(this.state.optionsPreviousState);
                    optionsPreviousStateTmp.objectId = data.information.additional_parameters.document_id;
                    optionsPreviousStateTmp.countFoundDocuments = data.information.additional_parameters.number_documents_found;
    
                    this.setState({ optionsPreviousState: optionsPreviousStateTmp });    
                } 

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
        let listGroupAccessToReport = this.state.listGroupAccessToReport.slice(),
            groupName = data.target.value;

        for(let item of listGroupAccessToReport){
            if((groupName === item.group) || (groupName === "select_group")){
                return;
            }
        }

        listGroupAccessToReport.push({ 
            time: helpers.getDate(+new Date),
            userName: "текущий пользователь",
            group: groupName, 
            title: `Пользователь: текущий, Время: ${helpers.getDate(+new Date)}` 
        });

        this.setState({ 
            listGroupAccessToReport: listGroupAccessToReport,
            currentGroupAccessToReport: "select_group",
        });

        this.props.socketIo.emit("isems-mrsi ui request: allow the group to access the report", { arguments: {
            reportId: this.props.showReportId,
            unprivilegedGroup: groupName,
        }});
    }

    handlerDeleteChipFromListGroupAccessToReport(groupName){
        let newListGroup = this.state.listGroupAccessToReport.filter((item) => {
            return groupName !== item.group;
        });
        this.setState({ listGroupAccessToReport: newListGroup });
        
        this.props.socketIo.emit("isems-mrsi ui request: forbid the group to access the report", { arguments: {
            reportId: this.props.showReportId,
            unprivilegedGroup: groupName,
        }});
    }

    handlerManagingAccessToReport(){
        if(!this.props.userPermissions.privileged_group.status){
            return;
        }

        return (<React.Fragment>
            <Row className="mt-3">
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

    handlerExternalReferencesButtonSave(obj){
        let listObjectTmp = _.cloneDeep(this.state.listObjectInfo);

        if(obj.modalType === "external_references"){
            let objHashesTmp = {};
            if(Array.isArray(obj.value.hashes)){
                obj.value.hashes.forEach((item) => {
                    objHashesTmp[item.type] = item.description;
                });
            } else {
                objHashesTmp = obj.value.hashes;
            }
            
            let newExternalReferences = {
                source_name: obj.value.source_name,
                description: obj.value.description,
                url: obj.value.url,
                hashes: objHashesTmp,
                external_id: obj.value.external_id,
            };

            if(obj.actionType === "new"){
                if(!Array.isArray(listObjectTmp[obj.objectId].external_references)){
                    listObjectTmp[obj.objectId].external_references = [];
                }

                newExternalReferences.external_id = this.state.uuidValue;
                listObjectTmp[obj.objectId].external_references.push(newExternalReferences);
            }

            if(obj.actionType === "edit"){
                for(let i = 0; i < listObjectTmp[obj.objectId].external_references.length; i++){
                    if(listObjectTmp[obj.objectId].external_references[i].source_name === obj.value.source_name){                        
                        listObjectTmp[obj.objectId].external_references[i] = newExternalReferences;
                    
                        break;
                    }
                }
            }
        }

        if(obj.modalType === "granular_markings"){
            if(obj.actionType === "new"){
                if(!Array.isArray(listObjectTmp[obj.objectId].granular_markings)){
                    listObjectTmp[obj.objectId].granular_markings = [];
                }

                listObjectTmp[obj.objectId].granular_markings.push({
                    lang: obj.value.lang,
                    marking_ref: obj.value.marking_ref,
                    selectors: obj.value.selectors, 
                });
            }

            if(obj.actionType === "edit"){
                listObjectTmp[obj.objectId].granular_markings[obj.value.orderNumber] = {
                    lang: obj.value.lang,
                    marking_ref: obj.value.marking_ref,
                    selectors: obj.value.selectors, 
                };
            }
        }

        if(obj.modalType === "extensions"){
            if((listObjectTmp[obj.objectId].extensions === null) || (typeof listObjectTmp[obj.objectId].extensions === "undefined")){
                listObjectTmp[obj.objectId].extensions = {};
            }

            listObjectTmp[obj.objectId].extensions[obj.value.name] = obj.value.description;
        }

        this.setState({ 
            listObjectInfo: listObjectTmp,
            showDialogElementAdditionalThechnicalInfo: false,
        });
    }

    handlerDeleteElementAdditionalTechnicalInformation(obj){
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
    }

    //пункт "дата и время публикации"
    handlePublished(){
        let requestId = uuidv4();

        if((this.state.listObjectInfo[this.props.showReportId] === null) || (typeof this.state.listObjectInfo[this.props.showReportId] === "undefined")){
            return;
        }

        this.props.socketIo.once("service event: what time is it", (obj) => {
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

            let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);
            listObjectInfoTmp[this.props.showReportId].published = new Date(dateNow).toISOString();

            this.setState({ listObjectInfo: listObjectInfoTmp });
        });

        this.props.socketIo.emit("service request: what time is it", { arguments: { id: requestId, dateType: "integer" }});
    }

    //пункт "подробное описание"
    handlerOnChangeDescription(data){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);
        listObjectInfoTmp[this.props.showReportId].description = data.target.value;

        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //пункт "дополнительное наименование"
    handlerOutsideSpecificationAdditionalName(data){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        if((listObjectInfoTmp[this.props.showReportId].outside_specification === null) || (typeof listObjectInfoTmp[this.props.showReportId].outside_specification === "undefined")){
            listObjectInfoTmp[this.props.showReportId].outside_specification = {};
        }

        listObjectInfoTmp[this.props.showReportId].outside_specification.additional_name = data.target.value;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //пункт "принятое решение по компьютерной угрозе"
    handlerChosenDecisionsMadeComputerThreat(data){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        if((listObjectInfoTmp[this.props.showReportId].outside_specification === null) || (typeof listObjectInfoTmp[this.props.showReportId].outside_specification === "undefined")){
            listObjectInfoTmp[this.props.showReportId].outside_specification = {};
        }

        listObjectInfoTmp[this.props.showReportId].outside_specification.decisions_made_computer_threat = data.target.value;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //пункт "тип компьютерной угрозы"
    handlerChosenComputerThreatType(data){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        if((listObjectInfoTmp[this.props.showReportId].outside_specification === null) || (typeof listObjectInfoTmp[this.props.showReportId].outside_specification === "undefined")){
            listObjectInfoTmp[this.props.showReportId].outside_specification = {};
        }

        listObjectInfoTmp[this.props.showReportId].outside_specification.computer_threat_type = data.target.value;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //пункт "уверенность создателя в правильности своих данных от 0 до 100"
    handlerElementConfidence(obj){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        listObjectInfoTmp[obj.objectId].confidence = obj.data;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //пункт "набор терминов, используемых для описания данного объекта"
    handlerElementLabels(obj){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        if(!Array.isArray(listObjectInfoTmp[obj.objectId].labels)){
            listObjectInfoTmp[obj.objectId].labels = [];
        }

        listObjectInfoTmp[obj.objectId].labels = obj.listTokenValue;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //пункт "определены ли данные содержащиеся в объекте"
    handlerElementDefanged(obj){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        listObjectInfoTmp[obj.objectId].defanged = obj.data;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //изменяет выбранный, текущий, дополнительный STIX объект
    handlerChangeCurrentAdditionalIdSTIXObject(currentObjectId){
        this.setState({ 
            currentAdditionalIdSTIXObject: currentObjectId,
            showDialogElementAdditionalSTIXObject: true 
        });

        let optionsPreviousStateTmp = _.cloneDeep(this.state.optionsPreviousState);
        optionsPreviousStateTmp.objectId = currentObjectId;

        this.setState({ optionsPreviousState: optionsPreviousStateTmp });

        //запрос на получение количества документов о предыдущем состоянии STIX объектов
        this.props.socketIo.emit("isems-mrsi ui request: send search request, get count different objects STIX object for id", {
            arguments: { "documentId": currentObjectId },
        });

        //запрос на получение дополнительной информации о предыдущем состоянии STIX объектов
        this.props.socketIo.emit("isems-mrsi ui request: send search request, get different objects STIX object for id", { 
            arguments: { 
                "documentId": currentObjectId,
                "paginateParameters": {
                    "max_part_size": this.state.optionsPreviousState.sizePart,
                    "current_part_number": this.state.optionsPreviousState.currentPartNumber,
                } 
            }});

        //проверяем наличие информации об запрашиваемом STIX объекте
        if((this.state.listObjectInfo[currentObjectId] !== null) && (typeof this.state.listObjectInfo[currentObjectId] !== "undefined")){
            return;
        }

        this.props.socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
            searchObjectId: currentObjectId,
            parentObjectId: this.props.showReportId,
        }});
    }

    //обрабатывает добавление новых объектов STIX или изменение информации о старых (при этом все равно происходит добавление объекта)
    handlerNewAdditionalSTIXObject(newSTIXObject){
        console.log("func 'handlerNewAdditionalSTIXObject', START...");
        console.log("----- ______ NEW STIX OBJECT ______-----");
        console.log(newSTIXObject);

        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        listObjectInfoTmp[newSTIXObject.id] = newSTIXObject;
        this.setState({ listObjectInfo: listObjectInfoTmp });

    }

    handelrDialogClose(){
        this.setState({ 
            listPreviousState: [],
            optionsPreviousState: {
                sizePart: SizePart,
                countFoundDocuments: 0,
                objectId: "",
                currentPartNumber: 1,
            },
            currentAdditionalIdSTIXObject: "",
            showDialogElementAdditionalSTIXObject: false 
        });
    }

    handlerDialogButton(){
        console.log("func 'handlerDialogButton', START...\n'BUTTON DIALOG BUTTON'");

    }

    handlerReportSave(){
        console.log("func 'handlerReportSave', START... BUTTON SAVE");

        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);
        let currentReport = listObjectInfoTmp[this.props.showReportId];

        currentReport.lang = "RU";

        if(currentReport.labels === null){
            delete currentReport.labels;
        }

        if(currentReport.external_references === null){
            delete currentReport.external_references;
        }

        if(currentReport.object_marking_refs === null){
            delete currentReport.object_marking_refs;
        }

        if(currentReport.granular_markings === null){
            delete currentReport.granular_markings;
        }

        if(currentReport.extensions === null){
            delete currentReport.extensions;
        }

        if(currentReport.aliases === null){
            delete currentReport.aliases;
        }

        if(currentReport.kill_chain_phases === null){
            delete currentReport.kill_chain_phases;
        }

        console.log(currentReport);

        this.props.socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [currentReport] });

        this.modalClose();
    }

    showDialogElementAdditionalThechnicalInfo(obj){
        this.setState({
            uuidValue: uuidv4(),
            showDialogElementAdditionalThechnicalInfo: true,
            objectDialogElementAdditionalThechnicalInfo: { 
                actionType: obj.actionType,
                modalType: obj.modalType, 
                objectId: obj.objectId,
                sourceName: obj.sourceName,
                orderNumber: obj.orderNumber,
            },
        });
    }

    closeDialogElementAdditionalThechnicalInfo(){
        this.setState({ showDialogElementAdditionalThechnicalInfo: false });
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

                <CreateAppBar 
                    title=""
                    nameDialogButton="сохранить"
                    reportAcceptedInformation={this.state.reportAcceptedInformation}
                    reportChangeableInformation={{}}
                    handelrDialogClose={this.modalClose}
                    handlerDialogButton={this.handlerReportSave} />
            </Dialog>);
        }

        let reportInfo = this.state.listObjectInfo[this.props.showReportId];
        let outsideSpecificationIsNotExist = ((reportInfo.outside_specification === null) || (typeof reportInfo.outside_specification === "undefined"));

        let published = () => {
            if(Date.parse(reportInfo.published) <= 0){
                return (<Col md={6} className="text-end">
                    <Link href="#" onClick={this.handlePublished} color="error">
                        <Typography variant="overline" display="block" gutterBottom>опубликовать</Typography>
                    </Link>
                </Col>);
            }

            return (<Col md={6} className="text-end">
                {new Date(Date.parse(reportInfo.published)).toLocaleString("ru", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timezone: "Europe/Moscow",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                })}
            </Col>);
        };

        //формирование модального окна для STIX объекта типа 'Report'
        return (<React.Fragment>
            <Dialog 
                fullScreen 
                open={this.props.show} 
                onClose={this.modalClose} >

                <CreateAppBar 
                    title={reportInfo.id}
                    nameDialogButton="сохранить"
                    reportAcceptedInformation={this.state.reportAcceptedInformation}
                    reportChangeableInformation={reportInfo}
                    handelrDialogClose={this.modalClose}
                    handlerDialogButton={this.handlerReportSave} />

                <Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>
                    <Row>
                        <Col md={7}>
                            <Row className="mt-4">
                                <Col md={6}><span className="text-muted">Наименование</span>:</Col>
                                <Col md={6} className="text-right">{reportInfo.name}</Col>
                            </Row>

                            <Row>
                                <Col md={12}><span className="text-muted">Дата и время</span>:</Col>
                            </Row>      

                            <Row>
                                <Col md={6}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">создания</span>
                                </Col>
                                <Col md={6} className="text-end">
                                    {helpers.convertDateFromString(reportInfo.created, { monthDescription: "long", dayDescription: "numeric" })}
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} className="pl-4">
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">последнего обновления</span>
                                </Col>
                                <Col md={6} className="text-end">
                                    {helpers.convertDateFromString(reportInfo.modified, { monthDescription: "long", dayDescription: "numeric" })}
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} className="pl-4">
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted">публикации</span>
                                </Col>
                                {published()}
                            </Row>

                            {this.handlerManagingAccessToReport()}
                                    
                            <Row>
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
                            </Row>

                            {/**
                             *              !!!!!!
                             * Наверное надо сделать вывод списка ссылок на объекты STIX из object_refs подобные выводу в 
                             * модальном окне создания нового Доклада, так как нужно иметь возможность не только редактировать и
                             * создавать новые объекты, но и УДАЛЯТЬ ссылки на STIX объекты из object_refs
                             *              !!!!!!
                             */}
                            <GetListObjectRefs
                                listObjectRef={reportInfo.object_refs} 
                                handlerChangeCurrentSTIXObject={this.handlerChangeCurrentAdditionalIdSTIXObject} />

                            <Row className="mt-1">
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

                            {((outsideSpecificationIsNotExist) || (reportInfo.outside_specification.decisions_made_computer_threat === null) || (typeof reportInfo.outside_specification.decisions_made_computer_threat === "undefined"))? 
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
                            }
                                
                            {((outsideSpecificationIsNotExist) || (reportInfo.outside_specification.computer_threat_type === null) || (typeof reportInfo.outside_specification.computer_threat_type === "undefined"))? 
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
                            }

                            <CreateElementAdditionalTechnicalInformationReportObject 
                                reportInfo={reportInfo}
                                objectId={this.props.showReportId}
                                handlerElementConfidence={this.handlerElementConfidence.bind(this)}
                                handlerElementDefanged={this.handlerElementDefanged.bind(this)}
                                handlerElementLabels={this.handlerElementLabels.bind(this)}
                                handlerElementDelete={this.handlerDeleteElementAdditionalTechnicalInformation.bind(this)}
                                showDialogElementAdditionalThechnicalInfo={this.showDialogElementAdditionalThechnicalInfo.bind(this)}
                                isNotDisabled={this.props.userPermissions.editing_information.status} />  
                        </Col>
                        <Col md={5}>
                            <Paper elevation={3}>
                                <Row className="pt-3">
                                    <Col md={12} className="text-center">
                                        <strong>Отчет доступен для просмотра следующих групп</strong>
                                    </Col>
                                </Row>

                                <br/>
                                {this.state.listGroupAccessToReport.map((item, num) => {
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
                            </Paper>

                            <br/>
                            <CreateListPreviousStateSTIXObject 
                                socketIo={this.props.socketIo} 
                                searchObjectId={this.props.showReportId}
                                optionsPreviousState={this.state.optionsPreviousStateReport}
                                listPreviousState={this.state.listPreviousStateReport} /> 
                        </Col>
                    </Row>
                </Container>
            </Dialog>

            <CreateAnyModalWindowSTIXObject
                socketIo={this.props.socketIo}
                listObjectInfo={this.state.listObjectInfo}
                listPreviousState={this.state.listPreviousState}
                optionsPreviousState={this.state.optionsPreviousState}
                showDialogElement={this.state.showDialogElementAdditionalSTIXObject}
                currentAdditionalIdSTIXObject={this.state.currentAdditionalIdSTIXObject}
                handelrDialogClose={this.handelrDialogClose}
                handlerNewAdditionalSTIXObject={this.handlerNewAdditionalSTIXObject}
                isNotDisabled={this.props.userPermissions.editing_information.status} />

            <ModalWindowDialogElementAdditionalThechnicalInformation 
                show={this.state.showDialogElementAdditionalThechnicalInfo}
                onHide={this.closeDialogElementAdditionalThechnicalInfo.bind(this)}
                objInfo={this.state.objectDialogElementAdditionalThechnicalInfo}
                uuidValue={this.state.uuidValue}
                listObjectInfo={this.state.listObjectInfo}
                handlerExternalReferencesButtonSave={this.handlerExternalReferencesButtonSave} />
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
    const { 
        title, 
        nameDialogButton, 
        reportAcceptedInformation,
        reportChangeableInformation,
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
                disabled={_.isEqual(reportAcceptedInformation, reportChangeableInformation)} 
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
    reportAcceptedInformation: PropTypes.object.isRequired,
    reportChangeableInformation: PropTypes.object.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    handlerDialogButton: PropTypes.func.isRequired,
};

function GetListObjectRefs(props){
    let { listObjectRef, handlerChangeCurrentSTIXObject } = props;

    return (<React.Fragment>
        <Grid container direction="row" className="mt-4">
            <Grid item md={12}><span className="text-muted">Идентификаторы объектов связанных с Докладом</span></Grid>
        </Grid>

        <Grid container direction="row" className="pb-2">
            <Grid item md={12} className="text-right">
                {listObjectRef.map((item, key) => {
                    let type = item.split("--");
                    let objectElem = helpers.getLinkImageSTIXObject(type[0]);
                    
                    if(typeof objectElem === "undefined" ){
                        return "";
                    }

                    return (<Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                        <IconButton onClick={handlerChangeCurrentSTIXObject.bind(null, item)}>
                            <img 
                                key={`key_object_ref_type_${key}`} 
                                src={`/images/stix_object/${objectElem.link}`} 
                                width="35" 
                                height="35" />
                        </IconButton>
                    </Tooltip>);
                })}
                <IconButton edge="start" color="inherit" onClick={handlerChangeCurrentSTIXObject.bind(null, "create-new-stix-object")} aria-label="add">
                    <Tooltip title="прикрепить дополнительный объект">
                        <AddCircleOutlineOutlinedIcon/>
                    </Tooltip>
                </IconButton>
            </Grid>
        </Grid>
    </React.Fragment>);
}

GetListObjectRefs.propTypes = {
    listObjectRef: PropTypes.array.isRequired,
    handlerChangeCurrentSTIXObject: PropTypes.func.isRequired,
};

function CreateAnyModalWindowSTIXObject(props){    
    let { 
        socketIo,
        listObjectInfo,
        listPreviousState,
        optionsPreviousState,
        showDialogElement,
        currentAdditionalIdSTIXObject, 
        handelrDialogClose,
        handlerNewAdditionalSTIXObject,
        isNotDisabled, 
    } = props;

    let idSTIXObject = currentAdditionalIdSTIXObject;
    let type = currentAdditionalIdSTIXObject.split("--");
    let objectElem = helpers.getLinkImageSTIXObject(type[0]);

    if(typeof objectElem !== "undefined" ){
        idSTIXObject = type[0];
        img = <img 
            src={`/images/stix_object/${objectElem.link}`} 
            width="35" 
            height="35" />;
    }
    
    let titleName = (currentAdditionalIdSTIXObject === "create-new-stix-object")? 
            "Создание нового объекта или добавление существующего": 
            `${(typeof objectElem === "undefined")? "": objectElem.description} id: ${currentAdditionalIdSTIXObject}`,
        img = (typeof objectElem === "undefined")? "": <img src={`/images/stix_object/${objectElem.link}`} width="35" height="35" />;

    let getMyModule = (name) => {
        switch(name){
        case "create-new-stix-object": 
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentCreateNewSTIXObject.jsx")); 

        case "artifact":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentArtifactSTIXObject.jsx")); 
        
        case "directory":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentDirectorySTIXObject.jsx")); 
        
        case "file":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentFileSTIXObject.jsx")); 
        
        case "mutex":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentMutexSTIXObject.jsx")); 
        
        case "process":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentProcessSTIXObject.jsx")); 
        
        case "software":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentSoftwareSTIXObject.jsx")); 
        
        case "url":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentURLSTIXObject.jsx")); 
        
        case "windows-registry-key":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentWindowsRegistryKeySTIXObject.jsx")); 
        
        case "x509-certificate":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentX509CertificateSTIXObject.jsx")); 
        
        case "attack-pattern":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentAttackPatternSTIXObject.jsx")); 

        case "autonomous-system":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentAutonomousSystemSTIXObject.jsx")); 

        case "campaign":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentCampaignSTIXObject.jsx")); 
            
        case "course-of-action":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentCourseOfActionSTIXObject.jsx")); 

        case "domain-name":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentDomainNameSTIXObject.jsx")); 

        case "email-addr":
            //"email-message"
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentEmailAddrSTIXObject.jsx")); 

        case "grouping":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentGroupingSTIXObject.jsx")); 

        case "identity":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentIdentitySTIXObject.jsx")); 

        case "incident":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentIncidentSTIXObject.jsx")); 

        case "infrastructure":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentInfrastructureSTIXObject.jsx")); 

        case "intrusion-set":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentIntrusionSetSTIXObject.jsx")); 

        case "ipv4-addr":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentIPv4AddrSTIXObject.jsx")); 

        case "ipv6-addr":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentIPv6AddrSTIXObject.jsx")); 

        case "location":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentLocationSTIXObject.jsx")); 

        case "mac-addr":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentMacAddrSTIXObject.jsx")); 

        case "malware": 
        //"malware-analysis": "", напрямую относится к "malware"
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentMalwareSTIXObject.jsx")); 

        case "network-traffic":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentNetworkTrafficSTIXObject.jsx")); 

        case "note":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentNoteSTIXObject.jsx")); 

        case "observed-data":
        //"indicator": "",зависит от "observed-data"
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentObservedDataSTIXObject.jsx")); 

        case "opinion":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentOpinionSTIXObject.jsx")); 

        case "threat-actor":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentThreatActorSTIXObject.jsx")); 

        case "tool":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentToolSTIXObject.jsx")); 

        case "user-account":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentUserAccountSTIXObject.jsx")); 

        case "vulnerability":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentVulnerabilitySTIXObject.jsx")); 

        case "indicator":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentAuxiliarySTIXObject.jsx"));

        case "email-message":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentAuxiliarySTIXObject.jsx"));

        case "malware-analysis":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentAuxiliarySTIXObject.jsx"));

        case "relationship":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentAuxiliarySTIXObject.jsx"));

        case "sighting":
            return React.lazy(() => import("../module_managing_records_structured_information/any_elements/dialog_contents/contentAuxiliarySTIXObject.jsx"));
            
        }

        return null;
    };

    let MyModule = getMyModule(idSTIXObject);

    const handlerDialogButtonSaveOrAdd = (data) => {
        handlerNewAdditionalSTIXObject(data);

        handelrDialogClose();
    };

    return (<Dialog 
        fullWidth
        maxWidth="xl"
        scroll="paper"
        open={showDialogElement} >
        <DialogTitle>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={11}>{img}&nbsp;<span className="pt-2">{titleName}</span></Grid>
                <Grid item container md={1} justifyContent="flex-end">
                    <IconButton edge="start" color="inherit" onClick={handelrDialogClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid> 
        </DialogTitle>
        <Suspense fallback={<div style={{ textAlign: "center", marginBottom: 22}}>Загрузка...</div>}>
            {(MyModule)?
                <MyModule
                    listObjectInfo={listObjectInfo}
                    listPreviousState={listPreviousState}
                    optionsPreviousState={optionsPreviousState}
                    currentIdSTIXObject={currentAdditionalIdSTIXObject} 
                    socketIo={socketIo}
                    handlerDialog={handlerDialogButtonSaveOrAdd}
                    handelrDialogClose={handelrDialogClose}
                    isNotDisabled={isNotDisabled}
                />:
                ""}
        </Suspense>
    </Dialog>);
}

CreateAnyModalWindowSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listPreviousState: PropTypes.array.isRequired,
    listObjectInfo: PropTypes.object.isRequired,
    optionsPreviousState: PropTypes.object.isRequired,
    showDialogElement: PropTypes.bool.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    handlerNewAdditionalSTIXObject: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};

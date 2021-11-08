"use strict";

import React, { Suspense } from "react";
import { Col, Row } from "react-bootstrap";
import { 
    AppBar,
    Button,
    Breadcrumbs,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Toolbar,
    IconButton,
    Typography,
    Tooltip,
    Grid,
    Link,
    TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { teal, purple, grey } from "@material-ui/core/colors";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import { MainTextField } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";
import CreateChipList from "../module_managing_records_structured_information/any_elements/createChipList.jsx";
import CreateListSelect from "../module_managing_records_structured_information/any_elements/createListSelect.jsx";
import CreateListUnprivilegedGroups from "../module_managing_records_structured_information/any_elements/createListUnprivilegedGroups.jsx";
import DialogElementAdditionalThechnicalInformation from "./modalWindowDialogElementAdditionalThechnicalInformation.jsx";
import CreateElementAdditionalTechnicalInformation from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformation.jsx";


//import CreateModalWindowNewSTIXObject from "./modal_window_stix_object/modalWindowCreateNewSTIXObject.jsx";
//import CreateModalWindowArtifactSTIXObject from "./modal_window_stix_object/modalWindowCreateNewSTIXObject.jsx";
//import CreateModalWindowDirectorySTIXObject from "./modal_window_stix_object/modalWindowDirectorySTIXObject.jsx";
//import CreateModalWindowFileSTIXObject from "./modal_window_stix_object/modalWindowFileSTIXObject.jsx";
//import CreateModalWindowMutexSTIXObject from "./modal_window_stix_object/modalWindowMutexSTIXObject.jsx";
//import CreateModalWindowProcessSTIXObject from "./modal_window_stix_object/modalWindowProcessSTIXObject.jsx";
//import CreateModalWindowSoftwareSTIXObject from "./modal_window_stix_object/modalWindowSoftwareSTIXObject.jsx";
//import CreateModalWindowURLSTIXObject from "./modal_window_stix_object/modalWindowURLSTIXObject.jsx";
//import CreateModalWindowWindowsRegistryKeySTIXObject from "./modal_window_stix_object/modalWindowWindowsRegistryKeySTIXObject.jsx";
//import CreateModalWindowX509CertificateSTIXObject from "./modal_window_stix_object/modalWindowX509CertificateSTIXObject.jsx";
//import CreateModalWindowAttackPatternSTIXObject from "./modal_window_stix_object/modalWindowAttackPatternSTIXObject.jsx";
//import CreateModalWindowToolSTIXObject from "./modal_window_stix_object/modalWindowToolSTIXObject.jsx";

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

export default class ModalWindowShowInformationReportSTIX extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            uuidValue: "",
            listObjectInfo: {},
            availableForGroups: [],
            listGroupAccessToReport: [],
            secondBreadcrumbsObjectId: "",
            currentGroupAccessToReport: "select_group",
            currentAdditionalIdSTIXObject: "",
            showDialogElementAdditionalSTIXObject: false,
            showDialogElementAdditionalThechnicalInfo: false,
            objectDialogElementAdditionalThechnicalInfo: {},
        };

        this.handleSave = this.handleSave.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handlePublished = this.handlePublished.bind(this);
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
        this.handlerChangeCurrentObjectIdBreadcrumbsObjects = this.handlerChangeCurrentObjectIdBreadcrumbsObjects.bind(this);
        this.handlerExternalReferencesButtonSave = this.handlerExternalReferencesButtonSave.bind(this);

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

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

                console.log("__--__ send search request, get report for id");
                console.log(data.information.additional_parameters.transmitted_data);

                reportInfo = data.information.additional_parameters.transmitted_data[0];
                listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);
                listObjectInfoTmp[reportInfo.id] = reportInfo;

                this.setState({ 
                    //reportInfo: data.information.additional_parameters.transmitted_data,
                    listObjectInfo: listObjectInfoTmp,
                });

                /** 
         *              ВНИМАНИЕ!!!
         * Функция testWriteAdditionalInfoForListObjectInfo осуществляет ДОПОЛНИТЕЛЬНОЕ наполнение ТЕСТОВОЙ информацией объекта
         * listObjectInfo
         *  */
                this.testWriteAdditionalInfoForListObjectInfo.call(this);
        
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
            }
        }); 
    }

    requestEmitter(){}

    handleClose(){
        this.modalClose();
    }

    //обработчик выбора текущего объекта из общего пути объектов (строка вида "id--<uuid>/id--<uuid>/id--<uuid>")
    handlerChangeCurrentObjectIdBreadcrumbsObjects(objectId){
        console.log("func 'handlerChangeCurrentObjectIdBreadcrumbsObjects', START...");
        console.log(`new ID: '${objectId}''`);

        this.setState({ currentAdditionalIdSTIXObject: objectId });
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
        this.setState({ listGroupAccessToReport: listGroupAccessToReport });

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
                newExternalReferences.external_id = this.state.uuidValue;
                listObjectTmp[this.props.showReportId].external_references.push(newExternalReferences);
            }

            if(obj.actionType === "edit"){
                for(let i = 0; i < listObjectTmp[this.props.showReportId].external_references.length; i++){
                    if(listObjectTmp[this.props.showReportId].external_references[i].source_name === obj.value.source_name){                        
                        listObjectTmp[this.props.showReportId].external_references[i] = newExternalReferences;
                    
                        break;
                    }
                }
            }
        }

        if(obj.modalType === "granular_markings"){
            if(obj.actionType === "new"){
                listObjectTmp[this.props.showReportId].granular_markings.push({
                    lang: obj.value.lang,
                    marking_ref: obj.value.marking_ref,
                    selectors: obj.value.selectors, 
                });
            }

            if(obj.actionType === "edit"){
                listObjectTmp[this.props.showReportId].granular_markings[obj.value.orderNumber] = {
                    lang: obj.value.lang,
                    marking_ref: obj.value.marking_ref,
                    selectors: obj.value.selectors, 
                };
            }
        }

        if(obj.modalType === "extensions"){
            listObjectTmp[this.props.showReportId].extensions[obj.value.name] = obj.value.description;
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

        if((listObjectInfoTmp[obj.objectId].confidence === null) || (typeof listObjectInfoTmp[obj.objectId].confidence === "undefined")){
            listObjectInfoTmp[obj.objectId].confidence = {};
        }

        listObjectInfoTmp[obj.objectId].confidence = obj.data;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //пункт "набор терминов, используемых для описания данного объекта"
    handlerElementLabels(obj){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        if((listObjectInfoTmp[obj.objectId].labels === null) || (typeof listObjectInfoTmp[obj.objectId].labels === "undefined")){
            listObjectInfoTmp[obj.objectId].labels = {};
        }

        listObjectInfoTmp[obj.objectId].labels = obj.listTokenValue;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //пункт "определены ли данные содержащиеся в объекте"
    handlerElementDefanged(obj){
        let listObjectInfoTmp = _.cloneDeep(this.state.listObjectInfo);

        if((listObjectInfoTmp[obj.objectId].defanged === null) || (typeof listObjectInfoTmp[obj.objectId].defanged === "undefined")){
            listObjectInfoTmp[obj.objectId].defanged = {};
        }

        listObjectInfoTmp[obj.objectId].defanged = obj.data;
        this.setState({ listObjectInfo: listObjectInfoTmp });
    }

    //изменяет выбранный, текущий, дополнительный STIX объект
    handlerChangeCurrentAdditionalIdSTIXObject(currentObjectId){
        console.log("func 'handlerChangeCurrentAdditionalIdSTIXObject', START...");
        console.log(`change to new STIX object ---> ID: '${currentObjectId}'`);

        this.setState({ 
            currentAdditionalIdSTIXObject: currentObjectId,
            showDialogElementAdditionalSTIXObject: true 
        });
    }

    //обрабатывает добавление новых объектов STIX или изменение информации о старых (при этом все равно происходит добавление объекта)
    handlerNewAdditionalSTIXObject(newSTIXObject){
        console.log("func 'handlerNewAdditionalSTIXObject', START...");
        console.log("----- ______ NEW STIX OBJECT ______-----");
        console.log(newSTIXObject);

    }

    handleSave(){

        console.log("func 'handleSave', START...\n'BUTTON SAVE'");
        console.log(this.state.listObjectInfo);

    }

    handelrDialogClose(){
        console.log("func 'handelrDialogClose', START...\n'BUTTON DIALOG CLOSE'");

        this.setState({ showDialogElementAdditionalSTIXObject: false });
    }

    handlerDialogButton(){
        console.log("func 'handlerDialogButton', START...\n'BUTTON DIALOG BUTTON'");

    }

    showDialogElementAdditionalThechnicalInfo(obj){

        console.log("func 'showDialogElementAdditionalThechnicalInfo', START...");
        console.log(obj);

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
                    handelrDialogClose={this.modalClose}
                    handlerDialogButton={this.handleSave} />
            </Dialog>);
        }

        let reportInfo = this.state.listObjectInfo[this.props.showReportId];
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
                    handelrDialogClose={this.modalClose}
                    handlerDialogButton={this.handleSave} />

                {/*<CreateBreadcrumbsObjects 
                    firstObjectId={this.props.showReportId}
                    secondObjectId={this.state.secondBreadcrumbsObjectId}
                    handlerChangeCurrentObjectId={this.handlerChangeCurrentObjectIdBreadcrumbsObjects} />*/}

                <Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>
                    <Col md={12} className="pl-3 pr-3">
                        <Row>
                            <Col md={7}>
                                <Row className="pt-3">
                                    <Col md={12} className="text-center"><strong>Основная информация</strong></Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col md={6}><span className="text-muted">Наименование</span>:</Col>
                                    <Col md={6} className="text-right">{reportInfo.name}</Col>
                                </Row>

                                <Row>
                                    <Col md={12}><span className="text-muted">Дата и время</span>:</Col>
                                </Row>      

                                <Row>
                                    <Col md={6}><span className="text-muted ml-4">создания</span></Col>
                                    <Col md={6} className="text-end">
                                        {helpers.convertDateFromString(reportInfo.created, { monthDescription: "long", dayDescription: "numeric" })}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6} className="pl-4">
                                        <span className="text-muted">последнего обновления</span>
                                    </Col>
                                    <Col md={6} className="text-end">
                                        {helpers.convertDateFromString(reportInfo.modified, { monthDescription: "long", dayDescription: "numeric" })}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6} className="pl-4">
                                        <span className="text-muted">публикации</span>
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
                                            rows={4}
                                            fullWidth
                                            onChange={this.handlerOnChangeDescription}
                                            defaultValue={reportInfo.description}
                                            variant="outlined"/>
                                    </Col>  
                                </Row>

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

                                {((reportInfo.outside_specification.decisions_made_computer_threat === null) || (typeof reportInfo.outside_specification.decisions_made_computer_threat === "undefined"))? 
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
                                
                                {((reportInfo.outside_specification.computer_threat_type === null) || (typeof reportInfo.outside_specification.computer_threat_type === "undefined"))? 
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

                                <CreateElementAdditionalTechnicalInformation 
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
                                <Row className="pt-3">
                                    <Col md={12} className="text-center"><strong>История изменений</strong></Col>
                                </Row>
                                <br/>
                                {this.state.listGroupAccessToReport.map((item, num) => {
                                    return (<React.Fragment key={`key_list_group_access_report_${num}`}>
                                        <Row className="pl-3 pr-3">
                                            <Col md={6} className="text-muted">группа:</Col>
                                            <Col md={6} className="">{item.group}</Col>
                                        </Row>
                                        <Row className="pl-3 pr-3">
                                            <Col md={6} className="text-muted">добавлена:</Col>
                                            <Col md={6} className="">{item.time}</Col>
                                        </Row>
                                        <Row className="pl-3 pr-3 mb-2">
                                            <Col md={6} className="text-muted">пользователем:</Col>
                                            <Col md={6} className="">{item.userName}</Col>
                                        </Row>
                                    </React.Fragment>);
                                })}
                            </Col>
                        </Row>
                    </Col>
                </Container>
            </Dialog>

            <CreateAnyWodalWindowSTIXObject
                showDialogElement={this.state.showDialogElementAdditionalSTIXObject}
                handelrDialogClose={this.handelrDialogClose}
                handlerDialogButton={this.handlerDialogButton}
                //handlerChangeCurrentObjectId={this.handlerChangeCurrentObjectIdBreadcrumbsObjects}
                currentAdditionalIdSTIXObject={this.state.currentAdditionalIdSTIXObject}
                handlerNewAdditionalSTIXObject={this.handlerNewAdditionalSTIXObject} />

            <DialogElementAdditionalThechnicalInformation 
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
    const { title, nameDialogButton, handelrDialogClose, handlerDialogButton } = props;
    
    return (<AppBar className={classes.appBar}>
        <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handelrDialogClose} aria-label="close">
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>{title}</Typography>
            <Button size="small" className={classes.buttonSave} onClick={handlerDialogButton}>{nameDialogButton}</Button>
        </Toolbar>
    </AppBar>);
}

CreateAppBar.propTypes = {
    title: PropTypes.string.isRequired,
    nameDialogButton: PropTypes.string.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    handlerDialogButton: PropTypes.func.isRequired,
};


/**
ID report: "report--90e4d82a-13dd-2cf1-b4da-ccc1c556ab13"
object_ref объекта содержит ссылки на следующие объекты:
    "tool--26ffb872-1dd9-446e-b6f5-fdfa455faa2"
    "opinion--56ee12bd-6710-eff1-bb67-tt45266477a"
    "indicator--67aab223b-7800-12fa-0234-eeab120bdf"
    "campaign--83422c77-904c-4dc1-aff5-5c38f3a2c55c"
    "relationship--f82356ae-fe6c-437c-9c24-6b64314ae68a"
    
    Нет ни одного объекта на который ссылается данный объект 
 */


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
                    <Tooltip title="добавить новый STIX объект">
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

function CreateAnyWodalWindowSTIXObject(props){
    let { showDialogElement,
        handelrDialogClose,
        handlerDialogButton,
        currentAdditionalIdSTIXObject, 
        handlerNewAdditionalSTIXObject } = props;

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
    
    let buttonName = (currentAdditionalIdSTIXObject === "create-new-stix-object")? "добавить": "сохранить",
        titleName = (currentAdditionalIdSTIXObject === "create-new-stix-object")? 
            "Создание нового объекта или добавление существующего": 
            `${(typeof objectElem === "undefined")? "": objectElem.description} id: ${currentAdditionalIdSTIXObject}`,
        img = (typeof objectElem === "undefined")? "": <img src={`/images/stix_object/${objectElem.link}`} width="35" height="35" />;

    let getMyModule = (name) => {
        switch(name){
        case "create-new-stix-object": 
            return React.lazy(() => import("./modal_window_stix_object/modalWindowCreateNewSTIXObject.jsx")); 

        case "artifact":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowCreateNewSTIXObject.jsx")); 
        
        case "directory":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowDirectorySTIXObject.jsx")); 
        
        case "file":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowFileSTIXObject.jsx")); 
        
        case "mutex":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowMutexSTIXObject.jsx")); 
        
        case "process":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowProcessSTIXObject.jsx")); 
        
        case "software":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowSoftwareSTIXObject.jsx")); 
        
        case "url":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowURLSTIXObject.jsx")); 
        
        case "windows-registry-key":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowWindowsRegistryKeySTIXObject.jsx")); 
        
        case "x509-certificate":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowX509CertificateSTIXObject.jsx")); 
        
        case "attack-pattern":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowAttackPatternSTIXObject.jsx")); 

        case "autonomous-system":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowAutonomousSystemSTIXObject.jsx")); 

        case "campaign":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowCampaignSTIXObject.jsx")); 
            
        case "course-of-action":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowCourseOfActionSTIXObject.jsx")); 

        case "domain-name":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowDomainNameSTIXObject.jsx")); 

        case "email-addr":
            //"email-message"
            return React.lazy(() => import("./modal_window_stix_object/modalWindowEmailAddrSTIXObject.jsx")); 

        case "grouping":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowGroupingSTIXObject.jsx")); 

        case "identity":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowIdentitySTIXObject.jsx")); 

        case "incident":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowIncidentSTIXObject.jsx")); 

        case "infrastructure":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowInfrastructureSTIXObject.jsx")); 

        case "intrusion-set":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowIntrusionSetSTIXObject.jsx")); 

        case "ipv4-addr":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowIPv4AddrSTIXObject.jsx")); 

        case "ipv6-addr":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowIPv6AddrSTIXObject.jsx")); 

        case "location":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowLocationSTIXObject.jsx")); 

        case "mac-addr":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowMacAddrSTIXObject.jsx")); 

        case "malware": 
        //"malware-analysis": "", напрямую относится к "malware"
            return React.lazy(() => import("./modal_window_stix_object/modalWindowMalwareSTIXObject.jsx")); 

        case "network-traffic":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowNetworkTrafficSTIXObject.jsx")); 

        case "note":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowNoteSTIXObject.jsx")); 

        case "observed-data":
        //"indicator": "",зависит от "observed-data"
            return React.lazy(() => import("./modal_window_stix_object/modalWindowObservedDataSTIXObject.jsx")); 

        case "opinion":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowOpinionSTIXObject.jsx")); 

        case "threat-actor":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowThreatActorSTIXObject.jsx")); 

        case "tool":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowToolSTIXObject.jsx")); 

        case "user-account":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowUserAccountSTIXObject.jsx")); 

        case "vulnerability":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowVulnerabilitySTIXObject.jsx")); 

        case "indicator":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowAuxiliarySTIXObject.jsx"));

        case "email-message":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowAuxiliarySTIXObject.jsx"));

        case "malware-analysis":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowAuxiliarySTIXObject.jsx"));

        case "relationship":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowAuxiliarySTIXObject.jsx"));

        case "sighting":
            return React.lazy(() => import("./modal_window_stix_object/modalWindowAuxiliarySTIXObject.jsx"));
            
        }

        return null;
    };

    let MyModule = getMyModule(idSTIXObject);

    return (<Dialog 
        fullWidth
        maxWidth="xl"
        scroll="paper"
        open={showDialogElement} >
        <DialogTitle>
            {img} {titleName}
        </DialogTitle>
        <DialogContent>
            <Suspense fallback={<div>Загрузка...</div>}>
                {(MyModule)?
                    <MyModule handlerDialog={handlerNewAdditionalSTIXObject} />:
                    ""}
            </Suspense>
        </DialogContent>
        <DialogActions>
            <Button onClick={handelrDialogClose} color="primary">закрыть</Button>
            <Button 
                //disabled={buttonIsDisabled}
                onClick={handlerDialogButton}
                color="primary">
                {buttonName}
            </Button>
        </DialogActions>
    </Dialog>);
}

CreateAnyWodalWindowSTIXObject.propTypes = {
    showDialogElement: PropTypes.bool.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    handlerDialogButton: PropTypes.func.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handlerNewAdditionalSTIXObject: PropTypes.func.isRequired,
};
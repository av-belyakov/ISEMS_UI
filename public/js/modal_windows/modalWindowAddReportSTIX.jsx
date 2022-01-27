"use strict";

import React, { Suspense } from "react";
import { Col, Row } from "react-bootstrap";
import { 
    AppBar,
    Button,
    Container,
    Dialog,
    DialogTitle,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    IconButton,
    Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { teal, green, red } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { MainTextField } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import CreateListSelect from "../module_managing_records_structured_information/any_elements/createListSelect.jsx";
import ContentCreateNewSTIXObject from "../module_managing_records_structured_information/any_elements/dialog_contents/contentCreateNewSTIXObject.jsx"; 
import CreateAnyModalWindowSTIXObject from "../module_managing_records_structured_information/any_elements/createAnyModalWindowSTIXObject.jsx";
import CreateElementAdditionalTechnicalInformationReportObject from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformationReportObject.jsx";
import ModalWindowDialogElementAdditionalThechnicalInformation from "./modalWindowDialogElementAdditionalThechnicalInformation.jsx";

const tzoffset = (new Date()).getTimezoneOffset() * 60000;
const myDate = (new Date(Date.now() - tzoffset)).toISOString();
const newReportId = `report--${uuidv4()}`;
const defaultOptionsDEATI = {
    uuidValue: "",
    objectDialogElementAdditionalThechnicalInfo: { 
        actionType: "",
        modalType: "", 
        objectId: "",
        sourceName: "",
        orderNumber: "",
    },
};
const dataInformationObject = {
    id: newReportId,
    type: "report",
    spec_version: "2.1",
    created: myDate,
    modified: myDate,
    created_by_ref: "identity-isems-ui--a463ffb3-1bd9-4d94-b02d-74e4f1658283",
    revoked: false,
    labels: [],
    confidence: 0,
    lang: "RU",
    external_references: [],
    object_marking_refs: [],
    granular_markings: [],
    defanged: false,
    extensions: {},
    name: "",
    description: "",
    report_types: [ "campaign" ],
    //published: "0001-01-01T00:00:00.000Z",
    object_refs: [ "campaign--0bd1475b-02df-4f51-99db-e061b16a6956" ], //НЕ ПУСТОЙ только для ТЕСТА так как пустое значение object_refs не пройдет валидацию
    /*
    "2021-12-29T07:08:49.753Z"
        ЭТО ТОЛЬКО ДЛЯ ТЕСТА
    object_refs: [
        "campaign--0bd1475b-02df-4f51-99db-e061b16a6956",
        "infrastructure--fc340924-8b03-4d92-a450-cd8e01965a12",
        "course-of-action--2a8aa9ff-d7dd-4768-9877-cf571ae2226b",
        "malware--d25f4428-5b5d-4f25-924a-a84d733f4142",
    ],*/
    outside_specification: {
        additional_name: `report-user-name--${+new Date}`,
        decisions_made_computer_threat: "",
        computer_threat_type: "",
    },
};

const SizePart = 15;
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
}));

export default function ModalWindowAddReportSTIX(props) {
    let { 
        show, 
        onHide, 
        changeValueAddNewReport,
        listTypesComputerThreat,
        listTypesDecisionsMadeComputerThreat,
        userPermissions,
        handlerButtonSave,
        socketIo,
    } = props;

    const classes = useStyles();

    let [ reportInfo, setReportInfo ] = React.useState({ [newReportId]: dataInformationObject });
    let [ buttonReportSave, setButtonReportSave ] = React.useState(true);
    let [ showDialogNewSTIXObject, setShowDialogNewSTIXObject ] = React.useState(false);
    let [ valuesIsInvalideReportName, setValuesIsInvalideReportName ] = React.useState(true);
    let [ showDialogElementAdditionalThechnicalInfo, setShowDialogElementAdditionalThechnicalInfo ] = React.useState(false);
    let [ optionsDialogElementAdditionalThechnicalInfo, setOptionsDialogElementAdditionalThechnicalInfo ] = React.useState(defaultOptionsDEATI);

    let [ listObjectInfo, setListObjectInfo ] = React.useState({});
    let [ listPreviousState, setListPreviousState ] = React.useState([]);
    let [ optionsPreviousState, setOptionsPreviousState ] = React.useState({
        sizePart: SizePart,
        countFoundDocuments: 0,
        objectId: "",
        currentPartNumber: 1,
    });
    let [ showDialogElementAdditionalSTIXObject, setShowDialogElementAdditionalSTIXObject ] = React.useState(false);
    let [ currentAdditionalIdSTIXObject, setCurrentAdditionalIdSTIXObject ] = React.useState("");

    (() => {
        socketIo.on("isems-mrsi response ui", (data) => {
            if((data.information === null) || (typeof data.information === "undefined")){
                return;
            }

            if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                return;
            }

            let objectId = "", 
                listObjectInfoTmp = {},
                listPreviousStateTmp = [],
                optionsPreviousStateTmp = {};

            switch(data.section){
            case "isems-mrsi ui request: send search request, get STIX object for id":
                if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
                    break;
                }

                if(data.information.additional_parameters.transmitted_data.length === 0){
                    break;
                }

                listObjectInfoTmp = _.cloneDeep(listObjectInfo);
                for(let obj of data.information.additional_parameters.transmitted_data){
                    listObjectInfoTmp[obj.id] = obj;
                }

                setListObjectInfo(listObjectInfoTmp);

                break;

            case "isems-mrsi ui request: send search request, list different objects STIX object for id":
                if(data.information.additional_parameters.transmitted_data.length === 0){
                    return;
                }

                objectId = (data.information.additional_parameters.transmitted_data.length > 1)? data.information.additional_parameters.transmitted_data[0].document_id: "";

                if((listPreviousState.length === 0) || (optionsPreviousState.objectId !== objectId)){
                    listPreviousStateTmp = (data.information.additional_parameters.transmitted_data.length === 0)? 
                        [{}]: 
                        data.information.additional_parameters.transmitted_data;
                } else {
                    listPreviousStateTmp = listPreviousState.slice();
    
                    for(let item of data.information.additional_parameters.transmitted_data){
                        if(!listPreviousStateTmp.find((elem) => elem.modified_time === item.modified_time)){
                            listPreviousStateTmp.push(item);
                        }
                    }
    
                    listPreviousStateTmp.sort((a, b) => {
                        let timeA = +new Date(a.modified_time);
                        let timeB = +new Date(b.modified_time);
                    
                        if(timeA > timeB) return -1;
                        if(timeA === timeB) return 0;
                        if(timeA < timeB) return 1;
                    });                
                }

                setListPreviousState(listPreviousStateTmp);

                optionsPreviousStateTmp = _.cloneDeep(optionsPreviousState);
                optionsPreviousStateTmp.objectId = objectId;
                optionsPreviousStateTmp.currentPartNumber = data.information.additional_parameters.number_transmitted_part + optionsPreviousStateTmp.currentPartNumber;
        
                setOptionsPreviousState(optionsPreviousStateTmp);

                break;

            case "isems-mrsi ui request: send search request, count list different objects STIX object for id":
                optionsPreviousStateTmp = _.cloneDeep(optionsPreviousState);
                optionsPreviousStateTmp.objectId = data.information.additional_parameters.document_id;
                optionsPreviousStateTmp.countFoundDocuments = data.information.additional_parameters.number_documents_found;
    
                setOptionsPreviousState(optionsPreviousStateTmp);

                break;
            }
        });
    })();

    let handlerName = (e) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            reportInfoTmp[newReportId].name = e.target.value;
            
            setReportInfo(reportInfoTmp);
            
            if(e.target.value.length === 0){
                setButtonReportSave(true);
                setValuesIsInvalideReportName(true);
            } else {
                setValuesIsInvalideReportName(false);

                if(reportInfoTmp[newReportId].object_refs.length === 0){
                    setButtonReportSave(true);
                } else {
                    setButtonReportSave(false);
                }
            }
        },
        handlerDescription = (e) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            reportInfoTmp[newReportId].description = e.target.value;
            
            setReportInfo(reportInfoTmp);
        },
        handlerOutsideSpecificationAdditionalName = (e) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            reportInfoTmp[newReportId].outside_specification.additional_name = e.target.value;
            
            setReportInfo(reportInfoTmp);
        },
        handlerComputerThreatType = (e) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            reportInfoTmp[newReportId].outside_specification.computer_threat_type = e.target.value;
            
            setReportInfo(reportInfoTmp);
        },
        handlerDecisionsMadeComputerThreat = (e) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            reportInfoTmp[newReportId].outside_specification.decisions_made_computer_threat = e.target.value;
            
            setReportInfo(reportInfoTmp);
        },
        //пункт "уверенность создателя в правильности своих данных от 0 до 100"
        handlerElementConfidence = (obj) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            reportInfoTmp[newReportId].confidence = obj.data;
            
            setReportInfo(reportInfoTmp);
        },
        //пункт "определены ли данные содержащиеся в объекте"
        handlerElementDefanged = (obj) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            reportInfoTmp[newReportId].defanged = (obj.data === "true");

            setReportInfo(reportInfoTmp);
        },
        //пункт "набор терминов, используемых для описания данного объекта"
        handlerElementLabels = (obj) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            if(!Array.isArray(reportInfoTmp[newReportId].labels)){
                reportInfoTmp[newReportId].labels = [];
            }
    
            reportInfoTmp[newReportId].labels = obj.listTokenValue;

            setReportInfo(reportInfoTmp);
        },
        //пункт "Идентификаторы объектов связанных с Отчётом"
        handlerDeleteObjectRef = (key) => {
            let listObjectInfoTmp = _.cloneDeep(reportInfo);
            let refElemTmp = listObjectInfoTmp[newReportId].object_refs.splice(key, 1);
            let refElem = refElemTmp[0].split("--");
            let listReportTypes = listObjectInfoTmp[newReportId].report_types.filter((item) => item !== refElem[0]);
    
            listObjectInfoTmp[newReportId].report_types = listReportTypes;
            if(listObjectInfoTmp[newReportId].object_refs.length === 0){
                setButtonReportSave(true);
            } else {
                setButtonReportSave(false);
            }

            setReportInfo(listObjectInfoTmp);
        },
        handlerExternalReferencesButtonSave = (obj) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);

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
                    if(!Array.isArray(reportInfoTmp[newReportId].external_references)){
                        reportInfoTmp[newReportId].external_references = [];
                    }
    
                    newExternalReferences.external_id = optionsDialogElementAdditionalThechnicalInfo.uuidValue;
                    reportInfoTmp[newReportId].external_references.push(newExternalReferences);
                }
    
                if(obj.actionType === "edit"){
                    for(let i = 0; i < reportInfoTmp[newReportId].external_references.length; i++){
                        if(reportInfoTmp[newReportId].external_references[i].source_name === obj.value.source_name){                        
                            reportInfoTmp[newReportId].external_references[i] = newExternalReferences;
                        
                            break;
                        }
                    }
                }
            }

            if(obj.modalType === "granular_markings"){
                if(obj.actionType === "new"){
                    if(!Array.isArray(reportInfoTmp[newReportId].granular_markings)){
                        reportInfoTmp[newReportId].granular_markings = [];
                    }
    
                    reportInfoTmp[newReportId].granular_markings.push({
                        lang: obj.value.lang,
                        marking_ref: obj.value.marking_ref,
                        selectors: obj.value.selectors, 
                    });
                }
    
                if(obj.actionType === "edit"){
                    reportInfoTmp[newReportId].granular_markings[obj.value.orderNumber] = {
                        lang: obj.value.lang,
                        marking_ref: obj.value.marking_ref,
                        selectors: obj.value.selectors, 
                    };
                }
            }

            if(obj.modalType === "extensions"){
                if((reportInfoTmp[newReportId].extensions === null) || (typeof reportInfoTmp[newReportId].extensions === "undefined")){
                    reportInfoTmp[newReportId].extensions = {};
                }
    
                reportInfoTmp[newReportId].extensions[obj.value.name] = obj.value.description;
            }

            setReportInfo(reportInfoTmp);
            setShowDialogElementAdditionalThechnicalInfo(false);
        },
        handlerElementDelete = (obj) => {
            let externalReferences = [];
            let reportInfoTmp = _.cloneDeep(reportInfo);
    
            if(obj.itemType === "external_references"){
                externalReferences = reportInfoTmp[newReportId].external_references.filter((item) => item.source_name !== obj.item);
                reportInfoTmp[newReportId].external_references = externalReferences;
            }
    
            if(obj.itemType === "granular_markings"){
                if(obj.orderNumber < 0){
                    return;
                }
    
                reportInfoTmp[newReportId].granular_markings.splice(obj.orderNumber, 1);
            }
    
            if(obj.itemType === "extensions"){
                delete reportInfoTmp[newReportId].extensions[obj.item];
            }

            setReportInfo(reportInfoTmp);
        },
        handlerShowObjectRefSTIXObject = (currentObjectId) => {

            console.log("func 'handlerShowObjectRefSTIXObject', obejct id: ", currentObjectId);

            setCurrentAdditionalIdSTIXObject(currentObjectId);
            setShowDialogElementAdditionalSTIXObject(true);

            let optionsPreviousStateTmp = _.cloneDeep(optionsPreviousState);
            optionsPreviousStateTmp.objectId = currentObjectId;
    
            setOptionsPreviousState(optionsPreviousStateTmp);

            //запрос на получение количества документов о предыдущем состоянии STIX объектов
            socketIo.emit("isems-mrsi ui request: send search request, get count different objects STIX object for id", {
                arguments: { "documentId": currentObjectId },
            });

            //запрос на получение дополнительной информации о предыдущем состоянии STIX объектов
            socketIo.emit("isems-mrsi ui request: send search request, get different objects STIX object for id", { 
                arguments: { 
                    "documentId": currentObjectId,
                    "paginateParameters": {
                        "max_part_size": optionsPreviousState.sizePart,
                        "current_part_number": optionsPreviousState.currentPartNumber,
                    } 
                }});

            //проверяем наличие информации об запрашиваемом STIX объекте
            if((listObjectInfo[currentObjectId] !== null) && (typeof listObjectInfo[currentObjectId] !== "undefined")){
                return;
            }

            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentObjectId,
                parentObjectId: newReportId,
            }});
        },
        handelrDialogClose = () => {
            setShowDialogElementAdditionalSTIXObject(false);
        },
        handelrDialogSaveAnySTIXObject = (newSTIXObject) => {
            console.log("func 'modalWindowAddReportSTIX', func 'handelrDialogSaveAnySTIXObject', START...");
            console.log(newSTIXObject);

            let listObjectInfoTmp = _.cloneDeep(listObjectInfo);

            listObjectInfoTmp[newSTIXObject.id] = newSTIXObject;
            setListObjectInfo(listObjectInfoTmp);
        },
        handlerDialogSaveDialogNewSTIXObject = (obj) => {
            console.log("func 'handlerDialogSaveDialogNewSTIXObject', START");
            console.log("Information: ", JSON.stringify(obj));

            //так как при выполнении данной функции мы добавляем ссылку на новый или существующий STIX объект
            // то мы можем утверждать что ссылка на объект в параметре obj.object_ref уже есть, а значит можно
            // разрешить сохранение нового объекта типа Отчёт
            setButtonReportSave(false);

        },
        handlerCloseDialogNewSTIXObject = () => {
            setShowDialogNewSTIXObject(false);
        };

    return (<React.Fragment>
        <Dialog 
            fullScreen
            scroll="paper"
            open={show}>

            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => { 
                        onHide(); 

                        setReportInfo({ [newReportId]: dataInformationObject });
                        setButtonReportSave(true);
                        setValuesIsInvalideReportName(true);
                    }} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>{`Новый отчёт (${newReportId})`}</Typography>
                    <Button 
                        size="small"
                        disabled={buttonReportSave} 
                        className={classes.buttonSave} 
                        onClick={() => { 
                            onHide();
                            handlerButtonSave(reportInfo[newReportId]);

                            setReportInfo({ [newReportId]: dataInformationObject });
                            changeValueAddNewReport(true);
                        }}>
                        сохранить
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>
                <Row className="mt-4">
                    <Col md={12}>
                        <TextField
                            id="name-new-report"
                            label="наименование"
                            value={reportInfo[newReportId].name}
                            //disabled={(typeof erInfo.source_name !== "undefined")}
                            error={valuesIsInvalideReportName}
                            fullWidth={true}
                            helperText="обязательное для заполнения поле"
                            onChange={handlerName}
                        />
                    </Col>
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
                            onChange={handlerDescription}
                            defaultValue={reportInfo[newReportId].description}
                            variant="outlined"/>
                    </Col>  
                </Row>

                <Row className="mt-4">
                    <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с Отчётом</span></Col>
                </Row>

                <Row>
                    <Col md={12}>
                        {(reportInfo[newReportId].object_refs.length === 0)? 
                            <Typography variant="caption">
                                <span  style={{ color: red[800] }}>
                                    * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                                </span>
                            </Typography>:
                            reportInfo[newReportId].object_refs.map((item, key) => {
                                let type = item.split("--");
                                let objectElem = helpers.getLinkImageSTIXObject(type[0]);
                    
                                if(typeof objectElem === "undefined" ){
                                    return "";
                                }

                                return (<Row key={`key_object_ref_${key}`}>
                                    <Col md={12}>
                                        <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                                            <Button onClick={handlerShowObjectRefSTIXObject.bind(null, item)}>
                                                <img 
                                                    key={`key_object_ref_type_${key}`} 
                                                    src={`/images/stix_object/${objectElem.link}`} 
                                                    width="35" 
                                                    height="35" />
                                                &nbsp;{item}&nbsp;
                                            </Button>
                                        </Tooltip>

                                        <IconButton aria-label="delete" onClick={handlerDeleteObjectRef.bind(null, key)}>
                                            <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                                        </IconButton>
                                    </Col>
                                </Row>);
                            })}
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="text-end">
                        <Button
                            size="small"
                            startIcon={<AddIcon style={{ color: green[500] }} />}
                            onClick={() => setShowDialogNewSTIXObject(true)}>
                            прикрепить дополнительный объект
                        </Button>
                    </Col>
                </Row>

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
                                value={reportInfo[newReportId].outside_specification.additional_name}
                                fullWidth={true}
                                onChange={handlerOutsideSpecificationAdditionalName}
                            />
                        </span>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={12}>
                        <span className="pl-4">
                            <CreateListSelect
                                list={listTypesDecisionsMadeComputerThreat}
                                label="принятое решение по компьютерной угрозе"
                                uniqId="decisions_made_computer_threat"
                                currentItem={reportInfo[newReportId].outside_specification.decisions_made_computer_threat}
                                handlerChosen={handlerDecisionsMadeComputerThreat}
                                isNotDisabled={true} 
                            />
                        </span>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={12}>
                        <span className="pl-4">
                            <CreateListSelect
                                list={listTypesComputerThreat}
                                label="тип компьютерной угрозы"
                                uniqId="computer_threat_type"
                                currentItem={reportInfo[newReportId].outside_specification.computer_threat_type}
                                handlerChosen={handlerComputerThreatType}
                                isNotDisabled={true} 
                            />
                        </span>
                    </Col>
                </Row>

                <CreateElementAdditionalTechnicalInformationReportObject 
                    reportInfo={reportInfo[newReportId]}
                    objectId={newReportId}
                    handlerElementConfidence={handlerElementConfidence}
                    handlerElementDefanged={handlerElementDefanged}
                    handlerElementLabels={handlerElementLabels}
                    handlerElementDelete={handlerElementDelete}
                    showDialogElementAdditionalThechnicalInfo={(obj) => {            
                        setOptionsDialogElementAdditionalThechnicalInfo({
                            uuidValue: uuidv4(),
                            objectDialogElementAdditionalThechnicalInfo: { 
                                actionType: obj.actionType,
                                modalType: obj.modalType, 
                                objectId: obj.objectId,
                                sourceName: obj.sourceName,
                                orderNumber: obj.orderNumber,
                            },                        
                        });

                        setShowDialogElementAdditionalThechnicalInfo(true);
                    }}
                    isNotDisabled={true}                   
                />  
            </Container>
        </Dialog>
    
        <ModalWindowDialogElementAdditionalThechnicalInformation 
            show={showDialogElementAdditionalThechnicalInfo}
            onHide={() => {
                setShowDialogElementAdditionalThechnicalInfo(false);
                setOptionsDialogElementAdditionalThechnicalInfo(defaultOptionsDEATI);
            }}
            objInfo={optionsDialogElementAdditionalThechnicalInfo.objectDialogElementAdditionalThechnicalInfo}
            uuidValue={optionsDialogElementAdditionalThechnicalInfo.uuidValue}
            listObjectInfo={reportInfo}
            handlerExternalReferencesButtonSave={handlerExternalReferencesButtonSave} />

        <Dialog 
            fullWidth
            maxWidth="xl"
            scroll="paper"
            open={showDialogNewSTIXObject} >
            <DialogTitle>
                <Grid item container md={12} justifyContent="flex-end">
                    <IconButton edge="start" color="inherit" onClick={handlerCloseDialogNewSTIXObject} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <Suspense fallback={<div style={{ textAlign: "center", marginBottom: 22}}>Загрузка...</div>}>
                <ContentCreateNewSTIXObject 
                    listObjectInfo={reportInfo}
                    currentIdSTIXObject={newReportId} 
                    socketIo={socketIo}
                    handlerDialog={handlerDialogSaveDialogNewSTIXObject}
                    handelrDialogClose={handlerCloseDialogNewSTIXObject}
                    isNotDisabled={true}
                />
            </Suspense>
        </Dialog>

        <CreateAnyModalWindowSTIXObject
            socketIo={socketIo}
            listObjectInfo={listObjectInfo}
            listPreviousState={listPreviousState}
            optionsPreviousState={optionsPreviousState}
            showDialogElement={showDialogElementAdditionalSTIXObject}
            currentAdditionalIdSTIXObject={currentAdditionalIdSTIXObject}
            showListPreviousState={false}
            handelrDialogClose={handelrDialogClose}
            handelrDialogSave={handelrDialogSaveAnySTIXObject}
            isNotDisabled={userPermissions.editing_information.status} />
    </React.Fragment>);
}

ModalWindowAddReportSTIX.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
    changeValueAddNewReport: PropTypes.func.isRequired,
    listTypesComputerThreat: PropTypes.object.isRequired,
    listTypesDecisionsMadeComputerThreat: PropTypes.object.isRequired,
    handlerButtonSave: PropTypes.func.isRequired,
};

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
    IconButton,
    Typography,
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
import CreateElementAdditionalTechnicalInformationReportObject from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformationReportObject.jsx";
import ModalWindowDialogElementAdditionalThechnicalInformation from "./modalWindowDialogElementAdditionalThechnicalInformation.jsx";

const myDate = new Date();
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
    created: myDate.toISOString(), // дата создания отстает на 3 часа
    modified: myDate.toISOString(),
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

    //let outsideSpecificationIsNotExist = ((reportInfo.outside_specification === null) || (typeof reportInfo.outside_specification === "undefined"));
        
    let handlerName = (e) => {
            let reportInfoTmp = _.cloneDeep(reportInfo);
            reportInfoTmp[newReportId].name = e.target.value;
            
            setReportInfo(reportInfoTmp);
            
            if(e.target.value.length === 0){
                setButtonReportSave(true);
                setValuesIsInvalideReportName(true);
            } else {
                setButtonReportSave(false);
                setValuesIsInvalideReportName(false);
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
            reportInfoTmp[newReportId].defanged = obj.data;

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
        handelrCloseDialogNewSTIXObject = () => {
            setShowDialogNewSTIXObject(false);
        };

    return (<React.Fragment>
        <Dialog 
            fullScreen
            scroll="paper"
            open={show}>

            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => { onHide(); }} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>{`Новый доклад (${newReportId})`}</Typography>
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

            {
                /**
                             * Не доделал следующие пункты:
                             * 1. Автоматическое обновление таблицы в createPageReport после добавления нового Доклада, так и не решил
                             * 2. Время создания нового доклада всегда меньше текущего времени на 3 часа, надо решить
                             * 3. При успешном создании нового Доклада, если перейти в просмотр информации о новом докладе, то раздел просмотра 
                             *  информаци о предыдущих состояниях всегда пуст и так как он пуст то там всегда висит "Загрузка..."? надо решить этот вопрос
                             * 4. Переделать раздел вывода информации об object_refs в список, для возможности просмотра и УДАЛЕНИЯ ссылок на информацию, 
                             * так и не сделал, а как же нужно сделать возможность удаления ссылок на другие объекты из object_refs и report_types
                             */ 
            }

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
                    <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с Докладом</span></Col>
                </Row>

                <Row>
                    <Col md={12}>
                        {reportInfo[newReportId].object_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
                    
                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            /**
                             * 
                             * Для элементов object_refs нужно сделать просмотр и удаление элементов,
                             * добавленых через кнопку 'прикрепить дополнительный объект'
                             * 
                             */

                            return (<Row key={`key_object_ref_${key}`}>
                                <Col md={12}>
                                    <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                                        <IconButton onClick={() => {
                                            console.log("click to button STIX object");
                                        }}>
                                            <img 
                                                key={`key_object_ref_type_${key}`} 
                                                src={`/images/stix_object/${objectElem.link}`} 
                                                width="35" 
                                                height="35" />
                                        </IconButton>
                                    </Tooltip>
                                    {item}&nbsp;
                                    <IconButton aria-label="delete" onClick={()=>{ 
                                    //handlerElementDelete({ itemType: "external_references", item: sourceName, objectId: objectId, orderNumber: key }); 
                                    }}>
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
                    <IconButton edge="start" color="inherit" onClick={handelrCloseDialogNewSTIXObject} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <Suspense fallback={<div style={{ textAlign: "center", marginBottom: 22}}>Загрузка...</div>}>
                <ContentCreateNewSTIXObject 
                    listObjectInfo={reportInfo}
                    currentIdSTIXObject={newReportId} 
                    socketIo={socketIo}
                    handlerDialog={(obj) => {
                        console.log("func 'handlerDialog', START");
                        console.log(obj);
                    }}
                    handelrDialogClose={handelrCloseDialogNewSTIXObject}
                    isNotDisabled={true}
                />
            </Suspense>
        </Dialog>
    </React.Fragment>);
}

ModalWindowAddReportSTIX.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    changeValueAddNewReport: PropTypes.func.isRequired,
    listTypesComputerThreat: PropTypes.object.isRequired,
    listTypesDecisionsMadeComputerThreat: PropTypes.object.isRequired,
    handlerButtonSave: PropTypes.func.isRequired,
};

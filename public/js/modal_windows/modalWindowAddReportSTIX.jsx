"use strict";

import React, { Suspense, useReducer } from "react";
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
import ContentCreateNewSTIXObject from "../module_managing_records_structured_information/any_elements/dialog_contents/contentCreateNewSTIXObject.jsx"; 
//import CreateAnyModalWindowSTIXObject from "../module_managing_records_structured_information/any_elements/createAnyModalWindowSTIXObject.jsx";
//import CreateElementAdditionalTechnicalInformationReportObject from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformationReportObject.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../module_managing_records_structured_information/any_elements/createElementAdditionalTechnicalInformationDO.jsx";
//import ModalWindowDialogElementAdditionalThechnicalInformation from "./modalWindowDialogElementAdditionalThechnicalInformation.jsx";
import { CreateListTypesDecisionsMadeComputerThreat, CreateListTypesComputerThreat } from "../module_managing_records_structured_information/any_elements/anyElements.jsx";

const tzoffset = (new Date()).getTimezoneOffset() * 60000;
const myDate = (new Date(Date.now() - tzoffset)).toISOString();
const newReportId = `report--${uuidv4()}`;
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
const reducer = (state, action) => {
    let elemTmp = "";

    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "updateName":
        return {...state, name: action.data};
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
    case "updateConfidence":
        if(state.confidence === action.data.data){
            return {...state};
        }

        return {...state, confidence: action.data.data};
    case "updateDefanged":
        return {...state, defanged: (action.data.data === "true")};
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
            if(!keyGM){
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
    case "deleteObjectRefs":
        if(state.object_refs.length === 0){
            return {...state};
        }

        elemTmp = state.object_refs.splice(action.data, 1)[0].split("--");    
        state.report_types = state.report_types.filter((item) => item !== elemTmp[0]);

        return {...state};
    case "deleteElementAdditionalTechnicalInformation":
        switch(action.data.itemType){
        case "extensions":
            delete state.extensions[action.data.item];

            break;
        case "granular_markings":
            state.granular_markings.splice(action.data.orderNumber, 1);

            return {...state};
        case "external_references":
            state.external_references.splice(action.data.orderNumber, 1);

            return {...state};
        }

        return state;
    }
};

export default function ModalWindowAddReportSTIX(props) {
    let { 
        show, 
        onHide, 
        socketIo,
        userPermissions,
        handlerButtonSave,
        handlerShowObjectRefSTIXObject,
    } = props;

    const classes = useStyles();

    console.log("func 'ModalWindowAddReportSTIX', MOUNT ((((((((( WINDOW ADD REPORT )))))))");


    let [ buttonReportSave, setButtonReportSave ] = React.useState(true);
    let [ showDialogNewSTIXObject, setShowDialogNewSTIXObject ] = React.useState(false);
    let [ valuesIsInvalideReportName, setValuesIsInvalideReportName ] = React.useState(true);

    //
    // useState которые ниже по большей части относятся к редактированию и просмотру других STIX объектов
    // **************************
    //____ здесь будет хранится информация о любом STIX объекте ссылка на которую есть в object_refs
    let [ listObjectInfo, setListObjectInfo ] = React.useState({});
    //____ здесь будет хранится информация о предыдущем состоянии different
    let [ listPreviousState, setListPreviousState ] = React.useState([]);
    //____ здесь опции для прокручивания списка предыдущего состояния
    let [ optionsPreviousState, setOptionsPreviousState ] = React.useState({
        sizePart: SizePart,
        countFoundDocuments: 0,
        objectId: "",
        currentPartNumber: 1,
    });
    //____ модальное окно с информацией о любом типе STIX объектов
    //let [ showDialogElementAdditionalSTIXObject, setShowDialogElementAdditionalSTIXObject ] = React.useState(false);
    //____ здесь ID STIX объекта открытого в дополнительном модальном окне
    //let [ currentAdditionalIdSTIXObject, setCurrentAdditionalIdSTIXObject ] = React.useState("");
    //
    // ***************************
    //

    const [state, dispatch] = useReducer(reducer, dataInformationObject);

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
        }
        
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
        }
    };

    let listener = (data) => {
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
    };
    React.useEffect(() => {
        socketIo.on("isems-mrsi response ui", listener);
        
        return () => {
            socketIo.off("isems-mrsi response ui", listener);
        };
    }, []);

    /*let handelrDialogClose = () => {
            setShowDialogElementAdditionalSTIXObject(false);
        },
        handelrDialogSaveAnySTIXObject = (newSTIXObject) => {
            console.log("func 'modalWindowAddReportSTIX', func 'handelrDialogSaveAnySTIXObject', START...");
            console.log(newSTIXObject);

            let listObjectInfoTmp = _.cloneDeep(listObjectInfo);

            listObjectInfoTmp[newSTIXObject.id] = newSTIXObject;
            setListObjectInfo(listObjectInfoTmp);
        },*/
    let handlerDialogSaveDialogNewSTIXObject = (obj) => {
            console.log("func 'handlerDialogSaveDialogNewSTIXObject', START");
            console.log("Information: ", JSON.stringify(obj));

            //модальное окно в котором будут создаваться любые виды STIX объектов кроме Отчетов

            //так как при выполнении данной функции мы добавляем ссылку на новый или существующий STIX объект
            // то мы можем утверждать что ссылка на объект в параметре obj.object_ref уже есть, а значит можно
            // разрешить сохранение нового объекта типа Отчёт
            //setButtonReportSave(false);

        },
        handlerCloseDialogNewSTIXObject = () => {
            setShowDialogNewSTIXObject(false);
        };

    console.log("--=-=-=-=-==-==-=-=-=-=-=-=-=-");
    console.log(state);
    console.log("--=-=-=-=-==-==-=-=-=-=-=-=-=-");

    let outsideSpecificationIsNotExist = ((state.outside_specification === null) || (typeof state.outside_specification === "undefined"));

    return (<React.Fragment>
        <Dialog 
            fullScreen
            scroll="paper"
            open={show}>

            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => { 
                        onHide(); 
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
                            handlerButtonSave(state);
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
                            value={state.name}
                            //disabled={(typeof erInfo.source_name !== "undefined")}
                            error={valuesIsInvalideReportName}
                            fullWidth={true}
                            helperText="обязательное для заполнения поле"
                            onChange={(e) => {
                                let elem = e.target.value;
                                if(elem.length > 0){
                                    setValuesIsInvalideReportName(false);

                                    if(state.object_refs.length > 0){
                                        setButtonReportSave(false);
                                    } else {
                                        setButtonReportSave(true);
                                    }
                                } else {
                                    setButtonReportSave(true);
                                    setValuesIsInvalideReportName(true);
                                }

                                dispatch({ type: "updateName", data: elem });
                            }}
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
                            onChange={(e) => dispatch({ type: "updateDescription", data: e.target.value })}
                            defaultValue={state.description}
                            variant="outlined"/>
                    </Col>  
                </Row>

                <Row className="mt-4">
                    <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с Отчётом</span></Col>
                </Row>

                <Row>
                    <Col md={12}>
                        {(state.object_refs.length === 0)? 
                            <Typography variant="caption">
                                <span  style={{ color: red[800] }}>
                                    * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                                </span>
                            </Typography>:
                            state.object_refs.map((item, key) => {
                                let type = item.split("--");
                                let objectElem = helpers.getLinkImageSTIXObject(type[0]);
                    
                                if(typeof objectElem === "undefined" ){
                                    return "";
                                }

                                return (<Row key={`key_object_ref_${key}`}>
                                    <Col md={12}>
                                        <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                                            <Button 
                                                onClick={()=>{

                                                    /**
                                                     * 
                                                     * 
                                                     * 
                                                     * Здесь надо сделать просмотр и редактрование информации по STIX объектам
                                                     * на которые есть ссылка в object_refs (но это после того как будет продуманно
                                                     * аналогичное действие для окна Отчеты)
                                                     * В настоещее время можно открыть модальное окно CreateAnyModalWindowSTIXObject
                                                     * но оно может быть переделанно.
                                                     * 
                                                     * 
                                                     */

                                                    console.log("SHOW Object Ref!!!!!!!");   
                                                }}
                                                onClick={handlerShowObjectRefSTIXObject.bind(null, item)}
                                            >
                                                <img 
                                                    key={`key_object_ref_type_${key}`} 
                                                    src={`/images/stix_object/${objectElem.link}`} 
                                                    width="35" 
                                                    height="35" />
                                                    &nbsp;{item}&nbsp;
                                            </Button>
                                        </Tooltip>

                                        <IconButton aria-label="delete" onClick={() => {
                                            if((state.object_refs.length > 0) && (state.name.length > 0)){
                                                setButtonReportSave(true);
                                            } else {
                                                setButtonReportSave(false);
                                            }

                                            dispatch({ type: "deleteObjectRefs", data: key });
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
                    objectId={newReportId}
                    reportInfo={state}
                    isNotDisabled={userPermissions.create.status}
                    handlerElementConfidence={(e) => dispatch({ type: "updateConfidence", data: e })}
                    handlerElementDefanged={(e) => dispatch({ type: "updateDefanged", data: e })}
                    handlerElementLabels={(e) => dispatch({ type: "updateLabels", data: e })}
                    handlerElementDelete={(e) => dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e })}
                    handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo} 
                />
            </Container>
        </Dialog>

        {/** показать модальное окно в котором будут создаваться любые виды STIX объектов кроме Отчетов */}
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
                    listObjectInfo={state}
                    currentIdSTIXObject={newReportId} 
                    socketIo={socketIo}
                    handlerDialog={handlerDialogSaveDialogNewSTIXObject}
                    handelrDialogClose={handlerCloseDialogNewSTIXObject}
                    isNotDisabled={true}
                />
            </Suspense>
        </Dialog>

        {/** показать модальное окно с информацией о любом типе STIX объектов */}
        {/*<CreateAnyModalWindowSTIXObject
            socketIo={socketIo}
            listObjectInfo={listObjectInfo}
            listPreviousState={listPreviousState}
            optionsPreviousState={optionsPreviousState}
            showDialogElement={showDialogElementAdditionalSTIXObject}
            currentAdditionalIdSTIXObject={currentAdditionalIdSTIXObject}
            showListPreviousState={false}
            handelrDialogClose={handelrDialogClose}
            handelrDialogSave={handelrDialogSaveAnySTIXObject}
                            isNotDisabled={userPermissions.editing_information.status} />*/}
    </React.Fragment>);
}

ModalWindowAddReportSTIX.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
    handlerButtonSave: PropTypes.func.isRequired,
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
};

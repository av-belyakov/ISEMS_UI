"use strict";


import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
    Tooltip,
    TextField,
    Typography,
} from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateListObjectRefs } from "../anyElements.jsx";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

const reducer = (state, action) => {
    let elemTmp = "";
    let lastSeen = "";
    let firstSeen = "";
    let currentTimeZoneOffsetInHours = "";

    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "updateAuthors":
        return {...state, authors: action.data};
    case "updateContent":
        if(state.content === action.data){
            return {...state};
        }
    
        return {...state, content: action.data};
    case "updateAbstract":
        if(state.abstract === action.data){
            return {...state};
        }

        return {...state, abstract: action.data};
    case "updateInfrastructureTypes":
        return {...state, infrastructure_types: action.data};
    case "updateConfidence":
        if(state.confidence === action.data.data){
            return {...state};
        }

        return {...state, confidence: action.data.data};
    case "updateDefanged":
        return {...state, defanged: (action.data === "true")};
    case "updateLabels":
        return {...state, labels: action.data.listTokenValue};
    case "updateExternalReferences":
        if(!state.external_references){
            state.external_references = [];
        }

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
        if(!state.granular_markings){
            state.granular_markings = [];
        }

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
        if(!state.extensions){
            state.extensions = {};
        }

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

export default function CreateDialogContentNoteSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentIdSTIXObject,
        currentAdditionalIdSTIXObject,
        handelrDialogClose,
    } = props;

    let [ buttonIsDisabled, setButtonIsDisabled ] = React.useState(true);
    let [ buttonSaveChangeTrigger, setButtonSaveChangeTrigger ] = React.useState(false);

    const handlerButtonIsDisabled = () => {
            if(!buttonIsDisabled){
                return;
            }

            setButtonIsDisabled();
        },
        handlerButtonSaveChangeTrigger = () => {
            setButtonSaveChangeTrigger((prevState) => !prevState);
        };

    return (<React.Fragment>
        <DialogContent>
            <Grid container direction="row" spacing={3}>
                <CreateMajorContent 
                    socketIo={socketIo}
                    parentIdSTIXObject={parentIdSTIXObject}
                    currentIdSTIXObject={currentAdditionalIdSTIXObject}
                    buttonSaveChangeTrigger={buttonSaveChangeTrigger}
                    isNotDisabled={isNotDisabled}
                    handelrDialogClose={handelrDialogClose}
                    handlerButtonIsDisabled={handlerButtonIsDisabled}
                    handlerButtonSaveChangeTrigger={handlerButtonSaveChangeTrigger}
                />

                <Grid item container md={4} style={{ display: "block" }}>
                    <CreateListPreviousStateSTIX 
                        socketIo={socketIo} 
                        searchObjectId={currentAdditionalIdSTIXObject} 
                    />
                </Grid>
            </Grid>            
        </DialogContent>
        <DialogActions>
            <Button onClick={handelrDialogClose} color="primary">закрыть</Button>            
            {isNotDisabled && <Button
                disabled={buttonIsDisabled} 
                onClick={() => setButtonSaveChangeTrigger(true)}
                color="primary">
                сохранить
            </Button>}
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentNoteSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
};

function CreateMajorContent(props){
    let {
        socketIo,
        parentIdSTIXObject,
        currentIdSTIXObject,
        buttonSaveChangeTrigger,
        isNotDisabled,
        handelrDialogClose,
        handlerButtonIsDisabled,
        handlerButtonSaveChangeTrigger,
    } = props;

    const [ state, dispatch ] = useReducer(reducer, {});

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

            console.log("++++++++++++ func 'listener', reseived data: ", obj);

            dispatch({ type: "newAll", data: obj });
        }
    };
    useEffect(() => {
        socketIo.on("isems-mrsi response ui: send search request, get STIX object for id", listener);

        return () => {
            socketIo.off("isems-mrsi response ui: send search request, get STIX object for id", listener);
            dispatch({ type: "newAll", data: {} });
        };
    }, []);
    useEffect(() => {
        if(currentIdSTIXObject !== ""){
            console.log("func 'CreateMajorContent', socketIo.emit for STIX object current ID: ", currentIdSTIXObject);

            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: parentIdSTIXObject,
            }});
        }
    }, [ socketIo, currentIdSTIXObject, parentIdSTIXObject ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){
            let data = state;
            let lastSeen = Date.parse(state.last_seen);
            let firstSeen = Date.parse(state.first_seen);
            let currentTimeZoneOffsetInHours = new Date(lastSeen).getTimezoneOffset() / 60;
    
            if(currentTimeZoneOffsetInHours < 0){
                data.last_seen = new Date(lastSeen - ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
                data.first_seen = new Date(firstSeen - ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
            } else {
                data.last_seen = new Date(lastSeen + (currentTimeZoneOffsetInHours * 3600000)).toISOString();
                data.first_seen = new Date(firstSeen + (currentTimeZoneOffsetInHours * 3600000)).toISOString();
            }

            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ data ] });
            handlerButtonSaveChangeTrigger();
            handelrDialogClose();
        }
    }, [ buttonSaveChangeTrigger, handlerButtonSaveChangeTrigger ]);

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        console.log("func 'handlerDialogElementAdditionalThechnicalInfo', state:");
        console.log(state);
        console.log("func 'handlerDialogElementAdditionalThechnicalInfo', obj:");
        console.log(obj);

        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                console.log("external_references - hashes_update");

                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();

                break;
            case "hashes_delete":
                console.log("external_references - hashes_delete");
                console.log(obj);

                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();

                break;
            default:
                console.log("external_references - default");
                console.log("obj.modalType - ", obj.modalType);

                dispatch({ type: "updateExternalReferences", data: obj.data });
                handlerButtonIsDisabled();
            }
        }
    
        if(obj.modalType === "granular_markings") {
            console.log("updateGranularMarkings......");
            console.log(obj);

            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerButtonIsDisabled();
        }
    
        if(obj.modalType === "extensions") {
            console.log("obj.modalType === extensions, obj: ", obj);

            dispatch({ type: "updateExtensions", data: obj.data });
            handlerButtonIsDisabled();
        }
    };
    
    return (<Grid item container md={8}>
        <Grid container direction="row" className="pt-3">
            <CreateNotePatternElements 
                campaignPatterElement={state}
                handlerAuthors={(e) => { dispatch({ type: "updateAuthors", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerContent={(e) => { 
                    dispatch({ type: "updateContent", data: e.target.value }); 

                    if(e.target.value !== ""){
                        handlerButtonIsDisabled(); 
                    }
                }}
                handlerAbstract={(e) => { dispatch({ type: "updateAbstract", data: e.target.value }); handlerButtonIsDisabled(); }}
            />
        </Grid> 

        <CreateElementAdditionalTechnicalInformationDO
            objectId={currentIdSTIXObject}
            reportInfo={state}
            isNotDisabled={isNotDisabled}
            handlerElementConfidence={(e) => { dispatch({ type: "updateConfidence", data: e }); handlerButtonIsDisabled(); }}
            handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerButtonIsDisabled(); }}
            handlerElementLabels={(e) => { dispatch({ type: "updateLabels", data: e }); handlerButtonIsDisabled(); }}
            handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerButtonIsDisabled(); }}
            handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo} 
        />
    </Grid>);
}

CreateMajorContent.propTypes = {
    socketIo: PropTypes.object.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

function CreateNotePatternElements(props){
    let { 
        campaignPatterElement,
        handlerAuthors,
        handlerContent, 
        handlerAbstract,
    } = props;

    console.log("func 'CreateInfrastructurePatternElements', campaignPatterElement: ", campaignPatterElement);
    console.log("_______________________________________");

    let valuesIsInvalideContent = campaignPatterElement.content === "";

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование:</span></Grid>
            <Grid item container md={8} >{campaignPatterElement.name}</Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Дата и время</span>&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
            <Grid item container md={8}></Grid>
        </Grid>      

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">создания:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">последнего обновления:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Краткое изложение содержания:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-abstract-static"
                    //                    multiline
                    //                    minRows={3}
                    //                    maxRows={8}
                    fullWidth
                    onChange={handlerAbstract}
                    defaultValue={campaignPatterElement.abstract}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Основное содержание:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-content-static"
                    multiline
                    error={valuesIsInvalideContent}
                    minRows={3}
                    maxRows={8}
                    fullWidth
                    helperText="обязательное для заполнения поле"
                    onChange={handlerContent}
                    defaultValue={campaignPatterElement.content}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.authors) ? []: campaignPatterElement.authors}
                    onTokenValuesChange={handlerAuthors} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">
                    Идентификаторы объектов связанных с данным Примечанием
                </span>
            </Grid>
        </Grid>

        {campaignPatterElement.object_refs && (() => {
            return (campaignPatterElement.object_refs.length === 0)? 
                <Typography variant="caption">
                    <span  style={{ color: red[800] }}>
                        * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                    </span>
                </Typography>:
                campaignPatterElement.object_refs.map((item, key) => {
                    let type = item.split("--");
                    let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                    if(typeof objectElem === "undefined" ){
                        return "";
                    }

                    {/**
Надо продумать!
Так как object_refs обязательно для заполнения, то в нем должна быть ссылка на тот элемент,
в данном случае Отчет, дополнительное описание которого содержится в Примечании.
Соответственно надо добавить, при просмотре, если нет подобной ссылки. Думаю если
нет подобной ссылки надо добавлять ее и активировать кнопку Сохранить, все это
делать автоматически, кроме нажатии кнопки Сохранить
*/}

                    return (<Row key={`key_object_ref_${key}`}>
                        <Col md={12}>
                            <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                                <Button onClick={() => {}}>
                                    <img 
                                        key={`key_object_ref_type_${key}`} 
                                        src={`/images/stix_object/${objectElem.link}`} 
                                        width="35" 
                                        height="35" />
                                    &nbsp;{item}&nbsp;
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>);
                });
        })()}
    </React.Fragment>);
}

CreateNotePatternElements.propTypes = {
    campaignPatterElement: PropTypes.object.isRequired,
    handlerAuthors: PropTypes.func.isRequired,
    handlerContent: PropTypes.func.isRequired, 
    handlerAbstract: PropTypes.func.isRequired,
};

/**
//NoteDomainObjectsSTIX объект "Note", по терминалогии STIX, содержит текстовую информации дополняющую текущий контекст анализа либо содержащей
//  результаты дополнительного анализа которые не может быть описан в терминах объектов STIX
// Abstract - краткое изложение содержания записки
// Content - основное содержание (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Authors - список авторов
// ObjectRefs - список идентификаторов на других DO STIX объектов к которым применяется замечание (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
type NoteDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Abstract   string               `json:"abstract" bson:"abstract"`
	Content    string               `json:"content" bson:"content" required:"true"`
	Authors    []string             `json:"authors" bson:"authors"`
	ObjectRefs []IdentifierTypeSTIX `json:"object_refs" bson:"object_refs" required:"true"`
}
 */
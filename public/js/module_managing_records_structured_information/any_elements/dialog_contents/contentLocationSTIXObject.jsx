"use strict";

import React, { useEffect, useReducer, useState } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";
import validatorjs from "validatorjs";

import { helpers } from "../../../common_helpers/helpers";
import { CreateListRegion } from "../anyElements.jsx";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

const reducer = (state, action) => {
    switch(action.type){
    case "newAll":

        console.log("func 'reducer' ___________, action.type:", action.type, " action.data:", action.data);

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
    case "updateRegion":
        return {...state, region: action.data};
    case "updateLatitude":
        return {...state, latitude: action.data};
    case "updateLongitude":
        return {...state, longitude: action.data};
    case "updatePrecision":
        return {...state, precision: +action.data};
    case "updateCity":
        return {...state, city: action.data};
    case "updateCountry":
        return {...state, country: action.data};
    case "updateAdministrativeArea":
        return {...state, administrative_area: action.data};
    case "updateStreetAddress":
        return {...state, street_address: action.data};
    case "updatePostalCode":
        return {...state, postal_code: action.data+""};
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

export default function CreateDialogContentLocationSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentIdSTIXObject,
        currentAdditionalIdSTIXObject,
        handlerDialogClose,
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
                    handlerDialogClose={handlerDialogClose}
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
            <Button onClick={handlerDialogClose} color="primary">закрыть</Button>            
            {isNotDisabled && <Button
                disabled={buttonIsDisabled} 
                onClick={() => setButtonSaveChangeTrigger(true)}
                color="primary">
                сохранить
            </Button>}
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentLocationSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

function CreateMajorContent(props){
    let {
        socketIo,
        parentIdSTIXObject,
        currentIdSTIXObject,
        buttonSaveChangeTrigger,
        isNotDisabled,
        handlerDialogClose,
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
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
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
            <CreateLocationPatternElements 
                campaignPatterElement={state}
                handlerCity={(e) => { dispatch({ type: "updateCity", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerRegion={(e) => { dispatch({ type: "updateRegion", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerCountry={(e) => { dispatch({ type: "updateCountry", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerLatitude={(e) => { dispatch({ type: "updateLatitude", data: e }); handlerButtonIsDisabled(); }}
                handlerLongitude={(e) => { dispatch({ type: "updateLongitude", data: e }); handlerButtonIsDisabled(); }}
                handlerPrecision={(e) => { dispatch({ type: "updatePrecision", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerPostalCode={(e) => { dispatch({ type: "updatePostalCode", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerStreetAddress={(e) => { dispatch({ type: "updateStreetAddress", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerAdministrativeArea={(e) => { dispatch({ type: "updateAdministrativeArea", data: e.target.value }); handlerButtonIsDisabled(); }}
            />
        </Grid> 
        
        <Grid container direction="row" className="pt-3">
            <Grid item container md={12} justifyContent="center">
                <h3>
                    Здесь нужно разместить область с ссылками на объекты Report с которыми может быть связан данный объект. 
                    При чем нужно ограничить переходы по этим ссылка для непривелегированных пользователей. Это надо доделать.
                </h3>
            </Grid>
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
    handlerDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

function CreateLocationPatternElements(props){
    let { 
        campaignPatterElement,
        handlerCity,
        handlerName,
        handlerRegion,
        handlerCountry,
        handlerLatitude,
        handlerLongitude,
        handlerPrecision,
        handlerPostalCode,
        handlerDescription,
        handlerStreetAddress,
        handlerAdministrativeArea,
    } = props;

    console.log("func 'CreateInfrastructurePatternElements', campaignPatterElement: ", campaignPatterElement);
    console.log("_______________________________________");

    let [ isInvalidCountry, setIsInvalidCountry ] = useState(false);
    let [ isInvalidLatitude, setIsInvalidLatitude ] = useState(false);
    let [ isInvalidLongitude, setIsInvalidLongitude ] = useState(false);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование:</span></Grid>
            {/*<Grid item container md={8} >{campaignPatterElement.name}</Grid>*/}
            <Grid item container md={8} justifyContent="flex-start">
                <TextField
                    fullWidth
                    id="name-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerName}
                    value={(campaignPatterElement.name)? campaignPatterElement.name: ""}
                />
            </Grid>
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
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Подробное описание:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-description-static"
                    multiline
                    minRows={3}
                    maxRows={8}
                    fullWidth
                    onChange={handlerDescription}
                    defaultValue={campaignPatterElement.description}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={3} justifyContent="flex-start">
                <TextField
                    id="latitude-number"
                    label="Широта (Latitude)"
                    type="number"
                    error={isInvalidLatitude}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.latitude)? campaignPatterElement.latitude: ""}
                    onChange={(e) => {
                        let latitude = e.target.value;
                        if((e.target.value > 90.0) || (e.target.value < -90.0)){
                            setIsInvalidLatitude(true);

                            return;
                        }

                        if((latitude+"").includes(",")){
                            latitude = latitude.replace("\\,", ".");
                        }

                        setIsInvalidLatitude(false);
                        handlerLatitude.call(this, +latitude);
                    }}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    id="longitude-number"
                    label="Долгота (Longitude)"
                    type="number"
                    error={isInvalidLongitude}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.longitude)? campaignPatterElement.longitude: ""}
                    onChange={(e) => {
                        let longitude = e.target.value;
                        if((e.target.value > 180.0) || (e.target.value < -180.0)){
                            setIsInvalidLongitude(true);

                            return;
                        }

                        if((longitude+"").includes(",")){
                            longitude = longitude.replace("\\,", ".");
                        }

                        setIsInvalidLongitude(false);
                        handlerLongitude.call(this, +longitude);
                    }}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    id="precision-number"
                    label="Точность (Precision)"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.precision)? campaignPatterElement.precision: 0}
                    onChange={handlerPrecision}
                />
            </Grid>
            <Grid item container md={3} justifyContent="flex-end">
                <CreateListRegion 
                    campaignPatterElement={campaignPatterElement}
                    handlerRegion={handlerRegion}        
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={3} justifyContent="flex-start">
                <TextField
                    id="country-element"
                    error={isInvalidCountry}
                    label="Страна (на латинице)"
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.country)? campaignPatterElement.country: ""}
                    onChange={(e) => {
                        if(e.target.value.length === 0){
                            setIsInvalidCountry(false);
                            handlerCountry.call(null, e);

                            return;
                        }

                        if(!validatorjs.isAlpha(e.target.value, "en-US")){
                            setIsInvalidCountry(true);

                            return;
                        }                

                        setIsInvalidCountry(false);
                        handlerCountry.call(null, e);
                    }}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    id="administrative-area-element"
                    label="Административный округ"
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.administrative_area)? campaignPatterElement.administrative_area: ""}
                    onChange={handlerAdministrativeArea}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    id="city-element"
                    label="Город"
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.city)? campaignPatterElement.city: ""}
                    onChange={handlerCity}
                />
            </Grid>
            <Grid item container md={3} justifyContent="flex-end">
                <TextField
                    id="postal-code-element"
                    label="Почтовый код"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.postal_code)? campaignPatterElement.postal_code: ""}
                    onChange={handlerPostalCode}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <TextField
                    fullWidth
                    id="street-address-element"
                    label="Адрес"
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.street_address)? campaignPatterElement.street_address: ""}
                    onChange={handlerStreetAddress}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateLocationPatternElements.propTypes = {
    campaignPatterElement: PropTypes.object.isRequired,
    handlerCity: PropTypes.func.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerRegion: PropTypes.func.isRequired,
    handlerCountry: PropTypes.func.isRequired,
    handlerLatitude: PropTypes.func.isRequired,
    handlerLongitude: PropTypes.func.isRequired,
    handlerPrecision: PropTypes.func.isRequired,
    handlerPostalCode: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerStreetAddress: PropTypes.func.isRequired,
    handlerAdministrativeArea: PropTypes.func.isRequired,
};

/**
//LocationDomainObjectsSTIX объект "Location", по терминалогии STIX, содержит описание географического местоположения
// Name - имя используемое для идентификации "Location"
// Description - более подробное описание
// Latitude - широта
// Longitude - долгота
// Precision - определяет точность координат, заданных свойствами широта и долгота (измеряется в метрах)
// Region - один, из заранее определенного (предложенного) перечня регионов
// Country - наименование страны
// AdministrativeArea - административный округ
// City - наименование города
// StreetAddress - физический адрес
// PostalCode - почтовый адрес
type LocationDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name               string            `json:"name" bson:"name"`
	Description        string            `json:"description" bson:"description"`
	Latitude           float32           `json:"latitude" bson:"latitude"`
	Longitude          float32           `json:"longitude" bson:"longitude"`
	Precision          float32           `json:"precision" bson:"precision"`
	Region             OpenVocabTypeSTIX `json:"region" bson:"region"`
	Country            string            `json:"country" bson:"country"`
	AdministrativeArea string            `json:"administrative_area" bson:"administrative_area"`
	City               string            `json:"city" bson:"city"`
	StreetAddress      string            `json:"street_address" bson:"street_address"`
	PostalCode         string            `json:"postal_code" bson:"postal_code"`
}
 */
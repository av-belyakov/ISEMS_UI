"use strict";

import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
    TextField,
} from "@material-ui/core";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { CreateKillChainPhases, CreateKillChainPhasesList, CreateListInfrastructureTypes } from "../anyElements.jsx";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

const minDefaultData = "0001-01-01T00:00:00Z",
    defaultData = "2001-01-01T00:00:01Z";

const reducer = (state, action) => {
    let lastSeen = "";
    let firstSeen = "";
    let currentTimeZoneOffsetInHours = "";

    switch(action.type){
    case "newAll":

        console.log("func 'reducer' ___________, action.type:", action.type, " action.data:", action.data);

        lastSeen = Date.parse(action.data.last_seen);
        firstSeen = Date.parse(action.data.first_seen);
        currentTimeZoneOffsetInHours = new Date(lastSeen).getTimezoneOffset() / 60;
    
        if(currentTimeZoneOffsetInHours < 0){
            action.data.last_seen = new Date(lastSeen - ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
            action.data.first_seen = new Date(firstSeen - ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
        } else {
            action.data.last_seen = new Date(lastSeen + (currentTimeZoneOffsetInHours * 3600000)).toISOString();
            action.data.first_seen = new Date(firstSeen + (currentTimeZoneOffsetInHours * 3600000)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {};
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }

        return {...state, description: action.data};
    case "updateInfrastructureTypes":
        return {...state, infrastructure_types: action.data};
    case "updateAliasesTokenValuesChange":
        return {...state, aliases: action.data};
    case "updateGoalsTokenValuesChange":
        return {...state, goals: action.data};
    case "updateDateTimeFirstSeen":
        return {...state, first_seen: new Date(action.data).toISOString()};
    case "updateDateTimeLastSeen":
        return {...state, last_seen: new Date(action.data).toISOString()};
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

export default function CreateDialogContentIntrusionSetSTIXObject(props){
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

CreateDialogContentIntrusionSetSTIXObject.propTypes = {
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
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
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
            <CreateIntrusionSetPatternElements 
                campaignPatterElement={state}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerGoalsTokenValuesChange={(e) => { dispatch({ type: "updateGoalsTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeLastSeen={(e) => { dispatch({ type: "updateDateTimeLastSeen", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeFirstSeen={(e) => { dispatch({ type: "updateDateTimeFirstSeen", data: e }); handlerButtonIsDisabled(); }}
                handlerAliasesTokenValuesChange={(e) => { dispatch({ type: "updateAliasesTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
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
    handelrDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

function CreateIntrusionSetPatternElements(props){
    let { 
        campaignPatterElement,
        handlerDescription, 
        //handlerInfrastructureTypes,
        handlerGoalsTokenValuesChange,
        handlerChangeDateTimeLastSeen,
        handlerChangeDateTimeFirstSeen,
        handlerAliasesTokenValuesChange,
    } = props;

    console.log("func 'CreateInfrastructurePatternElements', campaignPatterElement: ", campaignPatterElement);
    console.log("_______________________________________");

    let firstSeen = (campaignPatterElement.first_seen === minDefaultData)? defaultData: campaignPatterElement.first_seen;
    let lastSeen = (campaignPatterElement.last_seen === minDefaultData)? defaultData: campaignPatterElement.last_seen;

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
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Первое обнаружение:</span>
            </Grid>
            <Grid item container md={8}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        variant="inline"
                        ampm={false}
                        value={firstSeen}
                        minDate={new Date("2000-01-01")}
                        maxDate={new Date()}
                        onChange={handlerChangeDateTimeFirstSeen}
                        format="dd.MM.yyyy HH:mm"
                    />
                </MuiPickersUtilsProvider>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Последнее обнаружение:</span>
            </Grid>
            <Grid item container md={8}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        variant="inline"
                        ampm={false}
                        value={lastSeen}
                        minDate={new Date("2000-01-02")}
                        maxDate={new Date()}
                        onChange={handlerChangeDateTimeLastSeen}
                        format="dd.MM.yyyy HH:mm"
                    />
                </MuiPickersUtilsProvider>
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
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.aliases) ? []: campaignPatterElement.aliases}
                    onTokenValuesChange={handlerAliasesTokenValuesChange} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Высокоуровневые цели этого набора вторжения:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.goals) ? []: campaignPatterElement.goals}
                    onTokenValuesChange={handlerGoalsTokenValuesChange} />
            </Grid>
        </Grid>

        {/*
        
        Надо доделать: 
            ResourceLevel        OpenVocabTypeSTIX   `json:"resource_level" bson:"resource_level"`
                "attack-resource-level-ov"

	        PrimaryMotivation    OpenVocabTypeSTIX   `json:"primary_motivation" bson:"primary_motivation"`
                "attack-motivation-ov"

            SecondaryMotivations []OpenVocabTypeSTIX `json:"secondary_motivations" bson:"secondary_motivations"`
                "attack-motivation-ov"
        
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListInfrastructureTypes
                    campaignPatterElement={campaignPatterElement}
                    handlerInfrastructureTypes={handlerInfrastructureTypes}
                />
            </Grid>
        </Grid>*/}

    </React.Fragment>);
}

CreateIntrusionSetPatternElements.propTypes = {
    campaignPatterElement: PropTypes.object.isRequired,
    handlerDescription: PropTypes.func.isRequired, 
    //handlerInfrastructureTypes: PropTypes.func.isRequired,
    handlerGoalsTokenValuesChange: PropTypes.func.isRequired,
    handlerChangeDateTimeLastSeen: PropTypes.func.isRequired,
    handlerChangeDateTimeFirstSeen: PropTypes.func.isRequired,
    handlerAliasesTokenValuesChange: PropTypes.func.isRequired,
};

/**
//IntrusionSetDomainObjectsSTIX объект "Intrusion Set", по терминалогии STIX, содержит сгруппированный набор враждебного поведения и ресурсов
//  с общими свойствами, который, как считается, управляется одной организацией
// Name - имя используемое для идентификации "Intrusion Set" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// Aliases - альтернативные имена используемые для идентификации набора вторжения
// FirstSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный набор вторжения впервые был зафиксирован
// LastSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный набор вторжения был зафиксирован в последний раз
// Goals - высокоуровневые цели этого набора вторжения
// ResourceLevel - заранее определенный (предложенный) перечень уровней, на которых обычно работает данный набор вторжений, который, в свою очередь,
//  определяет ресурсы, доступные этому набору вторжений для использования в атаке
// PrimaryMotivation - одно, из заранее определенных (предложенных) перечней причин, мотиваций или целей определяющий данный набор вторжения
// SecondaryMotivations - заранее определенный (предложенный) вторичный перечень причин, мотиваций или целей определяющий данный набор вторжений
type IntrusionSetDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name                 string              `json:"name" bson:"name" required:"true"`
	Description          string              `json:"description" bson:"description"`
	Aliases              []string            `json:"aliases" bson:"aliases"`
	FirstSeen            time.Time           `json:"first_seen" bson:"first_seen"`
	LastSeen             time.Time           `json:"last_seen" bson:"last_seen"`
	Goals                []string            `json:"goals" bson:"goals"`
	ResourceLevel        OpenVocabTypeSTIX   `json:"resource_level" bson:"resource_level"`
	PrimaryMotivation    OpenVocabTypeSTIX   `json:"primary_motivation" bson:"primary_motivation"`
	SecondaryMotivations []OpenVocabTypeSTIX `json:"secondary_motivations" bson:"secondary_motivations"`
}
 */
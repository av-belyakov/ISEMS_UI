"use strict";

import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import PropTypes from "prop-types";

import reducerIntrusionSetSTIXObject from "../reducer_handlers/reducerIntrusionSetSTIXObject.js";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateIntrusionSetPatternElements from "../type_elements_stix/intrusionSetPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateDialogContentIntrusionSetSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentIdSTIXObject,
        listNewOrModifySTIXObject,
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
                    listNewOrModifySTIXObject={listNewOrModifySTIXObject}
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

CreateDialogContentIntrusionSetSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

function CreateMajorContent(props){
    let {
        socketIo,
        parentIdSTIXObject,
        currentIdSTIXObject,
        listNewOrModifySTIXObject,
        buttonSaveChangeTrigger,
        isNotDisabled,
        handlerDialogClose,
        handlerButtonIsDisabled,
        handlerButtonSaveChangeTrigger,
    } = props;

    let beginDataObject = {};
    for(let i = 0; i < listNewOrModifySTIXObject.length; i++){
        if(listNewOrModifySTIXObject[i].id === currentIdSTIXObject){
            beginDataObject = listNewOrModifySTIXObject[i];
        }
    }

    const [ state, dispatch ] = useReducer(reducerIntrusionSetSTIXObject, beginDataObject);

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
            <CreateIntrusionSetPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => {}}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerPrimaryMotivation={(e) => { dispatch({ type: "updatePrimaryMotivation", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerResourceLevelAttack={(e) => { dispatch({ type: "updateResourceLevelAttack", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerSecondaryMotivations={(e) => { dispatch({ type: "updateSecondaryMotivations", data: e.target.value }); handlerButtonIsDisabled(); }}
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
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

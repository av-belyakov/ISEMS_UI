"use strict";

import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import PropTypes from "prop-types";

import reducerCampaignSTIXObjects from "../reducer_handlers/reducerCampaignSTIXObject.js";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateCampaingPatternElements from "../type_elements_stix/campaingPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateDialogContentCampaignSTIXObject(props){
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

CreateDialogContentCampaignSTIXObject.propTypes = {
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

    const [state, dispatch] = useReducer(reducerCampaignSTIXObjects, beginDataObject);
    useEffect(() => {
        let listener = (data) => {
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
                dispatch({ type: "newAll", data: obj });
            }
        };

        socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", listener);

        return () => {
            dispatch({ type: "newAll", data: {} });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if(currentIdSTIXObject !== ""){
            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: parentIdSTIXObject,
            }});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentIdSTIXObject, parentIdSTIXObject ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){            
            state.first_seen = new Date(state.first_seen).toISOString();
            state.last_seen = new Date(state.last_seen).toISOString();

            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonSaveChangeTrigger ]);

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();

                break;
            case "hashes_delete":
                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();

                break;
            default:
                dispatch({ type: "updateExternalReferences", data: obj.data });
                handlerButtonIsDisabled();
            }
        }
    
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerButtonIsDisabled();
        }
    
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerButtonIsDisabled();
        }
    };

    return (<Grid item container md={8}>
        <Grid container direction="row" className="pt-3">
            <CreateCampaingPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => {}}
                handlerObjective={(e) => { dispatch({ type: "updateObjective", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerTokenValuesChange={(e) => { dispatch({ type: "updateTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeFirstSeen={(e) => { dispatch({ type: "updateDateTimeFirstSeen", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeLastSeen={(e) => { dispatch({ type: "updateDateTimeLastSeen", data: e }); handlerButtonIsDisabled(); }}
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
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

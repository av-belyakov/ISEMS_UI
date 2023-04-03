import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import reducerX509CertificatePatternSTIXObjects from "../reducer_handlers/reducerX509CertificateSTIXObject.js";
//import reducerWindowsRegistryKeyPatternSTIXObjects from "../reducer_handlers/reducerWindowsRegistryKeySTIXObject.js";
import CreateX509CertificatePatternElements from "../type_elements_stix/x509CertificatePatternElements.jsx";
//import CreateWindowsRegistryKeyPatternElements from "../type_elements_stix/windowsRegistryKeyPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

function isExistTransmittedData(data){
    if((data.information === null) || (typeof data.information === "undefined")){
        return false;
    }

    if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
        return false;
    }

    if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
        return false;
    }

    if(data.information.additional_parameters.transmitted_data.length === 0){
        return false;
    }

    return true;
}

function reducerShowRef(state, action){
    switch(action.type){
    case "addObject":
        return {...state, obj: action.data};
    case "addId":
        return {...state, id: action.data};
    case "cleanObj":
        return {...state, obj: {}};
    }
}

export default function CreateDialogContentX509CertificateSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentIdSTIXObject,
        currentAdditionalIdSTIXObject,
        handlerDialogClose,
    } = props;

    let [ buttonIsDisabled, setButtonIsDisabled ] = React.useState(true);
    let [ buttonSaveChangeTrigger, setButtonSaveChangeTrigger ] = React.useState(false);

    const handlerButtonIsDisabled = (status) => {
            setButtonIsDisabled(status);
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
            </Grid>            
        </DialogContent>
        <DialogActions>
            <Button 
                onClick={handlerDialogClose} 
                style={{ color: blue[500] }}
                color="primary">закрыть</Button>            
            {isNotDisabled && <Button
                disabled={buttonIsDisabled} 
                onClick={() => setButtonSaveChangeTrigger(true)}
                style={{ color: blue[500] }} 
                color="primary">
                    сохранить
            </Button>}
        </DialogActions>
    </React.Fragment>);
}
     
CreateDialogContentX509CertificateSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerX509CertificatePatternSTIXObjects, {});
    const [ stateShowRef, dispatchShowRef ] = useReducer(reducerShowRef, { id: "", obj: {} });

    useEffect(() => {
        socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
            if(!isExistTransmittedData(data)){
                return;
            }

            for(let obj of data.information.additional_parameters.transmitted_data){     
                dispatch({ type: "newAll", data: obj });
            }
        });

        if(currentIdSTIXObject !== ""){
            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: parentIdSTIXObject,
            }});
        }

        return () => {
            dispatch({ type: "newAll", data: {} });
        };
    }, [ socketIo, currentIdSTIXObject, parentIdSTIXObject ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
           
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonSaveChangeTrigger, handlerButtonSaveChangeTrigger ]);

    const handlerCheckStateButtonIsDisabled = (key) => {
        if(typeof key !== "undefined"){
            if(key.length === 0){
                handlerButtonIsDisabled(true);
            } else {
                handlerButtonIsDisabled(false);
            }
        } else {
            if(state.key.length === 0){
                handlerButtonIsDisabled(true);
            } else {
                handlerButtonIsDisabled(false);
            }
        }
    };

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {    
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    };

    return (<Grid item container md={12}>
        <Grid container direction="row" className="pt-3">
            <CreateX509CertificatePatternElements 
                isDisabled={false}
                showRefElement={stateShowRef}
                campaignPatterElement={state}
                handlerHashes={(e) => { dispatch({ type: "updateHashes", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerIssuer={(e) => { dispatch({ type: "updateIssuer", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerSubject={(e) => { dispatch({ type: "updateSubject", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerVersion={(e) => { dispatch({ type: "updateVersion", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerIsSelfSigned={(e) => { dispatch({ type: "updateIsSelfSigned", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerSerialNumber={(e) => { dispatch({ type: "updateSerialNumber", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerValidityNotAfter={(e) => { dispatch({ type: "updateValidityNotAfter", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerValidityNotBefore={(e) => { dispatch({ type: "updateValidityNotBefore", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerSignatureAlgorithm={(e) => { dispatch({ type: "updateSignatureAlgorithm", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerSubjectPublicKeyModulus={(e) => { dispatch({ type: "updateSubjectPublicKeyModulus", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerSubjectPublicKeyExponent={(e) => { dispatch({ type: "updateSubjectPublicKeyExponent", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerSubjectPublicKeyAlgorithm={(e) => { dispatch({ type: "updateSubjectPublicKeyAlgorithm", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
            />

            {/*<CreateWindowsRegistryKeyPatternElements 
                isDisabled={false}
                showRefElement={stateShowRef}
                campaignPatterElement={state}
                handlerKey={(e) => { dispatch({ type: "updateKey", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerModifiedTime={(e) => { dispatch({ type: "updateModifiedTime", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerAddItemValues={(e) => { dispatch({ type: "addItemElementValues", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerButtonShowLink={(refId) => {                   
                    dispatchShowRef({ type: "addId", data: refId });
                    dispatchShowRef({ type: "cleanObj", data: {} });

                    socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
                        if(!isExistTransmittedData(data)){
                            return;
                        }

                        for(let obj of data.information.additional_parameters.transmitted_data){ 
                            dispatchShowRef({ type: "addObject", data: obj });        
                        }
                    });

                    socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                        searchObjectId: refId,
                        parentObjectId: state.id,
                    }});
                }}
                handlerNumberOfSubkeys={(e) => { dispatch({ type: "updateNumberOfSubkeys", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerDeleteItemValues={(e) => { dispatch({ type: "deleteItemElementValues", data: e }); handlerCheckStateButtonIsDisabled(); }}
            />*/}
        </Grid>

        <CreateElementAdditionalTechnicalInformationCO 
            objectId={currentIdSTIXObject}
            reportInfo={state}
            isNotDisabled={isNotDisabled}
            handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerCheckStateButtonIsDisabled(); }}
            handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerCheckStateButtonIsDisabled(); }}
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

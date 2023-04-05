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

    const handlerCheckStateButtonIsDisabled = (issuer) => {
        if(typeof issuer !== "undefined"){
            if(issuer.length === 0){
                handlerButtonIsDisabled(true);
            } else {
                handlerButtonIsDisabled(false);
            }
        } else {
            if(state.issuer.length === 0){
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
                campaignPatterElement={state}
                handlerHashes={(e) => { dispatch({ type: "updateHashes", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerIssuer={(e) => { dispatch({ type: "updateIssuer", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerSubject={(e) => { dispatch({ type: "updateSubject", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerVersion={(e) => { dispatch({ type: "updateVersion", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerIsSelfSigned={(e) => { dispatch({ type: "updateIsSelfSigned", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSerialNumber={(e) => { dispatch({ type: "updateSerialNumber", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerValidityNotAfter={(e) => { dispatch({ type: "updateValidityNotAfter", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerValidityNotBefore={(e) => { dispatch({ type: "updateValidityNotBefore", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerSignatureAlgorithm={(e) => { dispatch({ type: "updateSignatureAlgorithm", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSubjectPublicKeyModulus={(e) => { dispatch({ type: "updateSubjectPublicKeyModulus", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSubjectPublicKeyExponent={(e) => { dispatch({ type: "updateSubjectPublicKeyExponent", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSubjectPublicKeyAlgorithm={(e) => { dispatch({ type: "updateSubjectPublicKeyAlgorithm", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerExtensions={(obj) => { dispatch({ type: "updateExtensions", data: obj }); handlerCheckStateButtonIsDisabled(); }}
            />
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

import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import reducerUserAccountSTIXObject from "../reducer_handlers/reducerUserAccountSTIXObject.js";
import CreateUserAccountPatternElements from "../type_elements_stix/userAccountPatternElements.jsx";
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

export default function CreateDialogContentUserAccountSTIXObject(props){
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
     
CreateDialogContentUserAccountSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerUserAccountSTIXObject, {});

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

    const handlerCheckStateButtonIsDisabled = (accountLogin) => {
        if(typeof accountLogin !== "undefined"){
            if(accountLogin === ""){
                handlerButtonIsDisabled(true);
            } else {
                handlerButtonIsDisabled(false);
            }
        } else {
            if(state.account_login === ""){
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
        <Grid container direction="row" className="pt-3 pb-3">
            <CreateUserAccountPatternElements
                isDisabled={false}
                campaignPatterElement={state}
                handlerUserId={(e) => { dispatch({ type: "updateUserId", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerCredential={(e) => { dispatch({ type: "updateCredential", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerIsDisabled={(e) => { dispatch({ type: "updateIsDisabled", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerAccountType={(e) => { dispatch({ type: "updateAccountType", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerDisplayName={(e) => { dispatch({ type: "updateDisplayName", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerAccountLogin={(e) => { dispatch({ type: "updateAccountLogin", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerIsPrivileged={(e) => { dispatch({ type: "updateIsPrivileged", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerAccountCreated={(e) => { dispatch({ type: "updateAccountCreated", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerAccountExpires={(e) => { dispatch({ type: "updateAccountExpires", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerAccountLastLogin={(e) => { dispatch({ type: "updateAccountLastLogin", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerCanEscalatePrivs={(e) => { dispatch({ type: "updateCanEscalatePrivs", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerIsServiceAccount={(e) => { dispatch({ type: "updateIsServiceAccount", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerAccountFirstLogin={(e) => { dispatch({ type: "updateAccountFirstLogin", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerCredentialLastChanged={(e) => { dispatch({ type: "updateCredentialLastChanged", data: e }); handlerCheckStateButtonIsDisabled(); }}
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

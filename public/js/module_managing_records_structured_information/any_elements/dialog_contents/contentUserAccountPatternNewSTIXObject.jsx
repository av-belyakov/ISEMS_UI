import React, { useEffect, useReducer } from "react";
import {
    Box, 
    Paper,
    Grid,
    Typography, 
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import reducerUserAccountSTIXObject from "../reducer_handlers/reducerUserAccountSTIXObject.js";
import CreateUserAccountPatternElements from "../type_elements_stix/userAccountPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

export default function CreateUserAccountPatternNewSTIXObject(props){
    let { 
        isNotDisabled,
        buttonAddClick,
        buttonChangeClick,
        buttonAddIsDisabled,
        projectPatterElement,
        handlerAddSTIXObject,
        handlerChangeButtonAdd,
        handlerChangeNewSTIXObject,
    } = props;

    return <CreateMajorElements
        isNotDisabled={isNotDisabled}
        buttonAddClick={buttonAddClick}
        buttonChangeClick={buttonChangeClick}
        buttonAddIsDisabled={buttonAddIsDisabled}
        projectPatterElement={projectPatterElement}
        handlerAddSTIXObject={handlerAddSTIXObject}
        handlerChangeButtonAdd={handlerChangeButtonAdd}
        handlerChangeNewSTIXObject={handlerChangeNewSTIXObject}
    />;
}
     
CreateUserAccountPatternNewSTIXObject.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    buttonAddClick: PropTypes.bool.isRequired,
    buttonChangeClick: PropTypes.bool.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
    handlerChangeNewSTIXObject: PropTypes.func.isRequired,
};

function CreateMajorElements(props){
    let { 
        isNotDisabled,
        buttonAddClick,
        buttonChangeClick,
        buttonAddIsDisabled,
        projectPatterElement,
        handlerAddSTIXObject,
        handlerChangeButtonAdd,
        handlerChangeNewSTIXObject,
    } = props;

    let currentObjectId = React.useMemo(() => {
        return `user-account--${uuidv4()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonAddClick ]);

    const [ state, dispatch ] = useReducer(reducerUserAccountSTIXObject, { 
        is_service_account: false,
        is_privileged: false,
        can_escalate_privs: false,
        is_disabled: false,
    });
    useEffect(() => {
        if(projectPatterElement.type === "user-account"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);
    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "user-account";
            stateTmp.spec_version = "2.1";
            stateTmp.lang = "RU";

            dispatch({ type: "cleanAll", data: {} });

            handlerAddSTIXObject(stateTmp);
        }
    }, [ buttonAddClick, state, currentObjectId, handlerAddSTIXObject ]);
    useEffect(() => {
        if(buttonChangeClick){
            handlerChangeNewSTIXObject(state);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonChangeClick ]);

    const handlerCheckStateButtonIsDisabled = (accountLogin) => {
        if(typeof accountLogin !== "undefined"){
            if(accountLogin === ""){
                console.log("func 'handlerCheckStateButtonIsDisabled', 1111");

                handlerChangeButtonAdd(true);
            } else {
                console.log("func 'handlerCheckStateButtonIsDisabled', 2222");

                handlerChangeButtonAdd(false);
            }
        } else {
            if(typeof state.account_login === "undefined" || state.account_login === ""){
                console.log("func 'handlerCheckStateButtonIsDisabled', 3333 state.account_login: ", state.account_login);

                handlerChangeButtonAdd(true);
            } else {
                console.log("func 'handlerCheckStateButtonIsDisabled', 4444 state.account_login: ", state.account_login);

                handlerChangeButtonAdd(false);
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

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("user-account").description}`}
                    </Typography> 
                </Grid>
            </Grid>

            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.id? state.id: currentObjectId}</Grid>
            </Grid>

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

            <CreateElementAdditionalTechnicalInformationCO 
                objectId={currentObjectId}
                reportInfo={state}
                isNotDisabled={isNotDisabled}
                handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}             
            />
        </Box>
    </Paper>);
}

CreateMajorElements.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    buttonAddClick: PropTypes.bool.isRequired,
    buttonChangeClick: PropTypes.bool.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
    handlerChangeNewSTIXObject: PropTypes.func.isRequired,
};
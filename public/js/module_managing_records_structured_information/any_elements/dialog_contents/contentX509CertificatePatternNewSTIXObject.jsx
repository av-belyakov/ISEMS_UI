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
import reducerX509CertificatePatternSTIXObjects from "../reducer_handlers/reducerX509CertificateSTIXObject.js";
import CreateX509CertificatePatternElements from "../type_elements_stix/x509CertificatePatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateX509CertificatePatternNewSTIXObject(props){
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
     
CreateX509CertificatePatternNewSTIXObject.propTypes = {
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
        return `x509-certificate--${uuidv4()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonAddClick ]);

    const [ state, dispatch ] = useReducer(reducerX509CertificatePatternSTIXObjects, {
        validity_not_before: "1970-01-01T00:00:00.000Z",
        validity_not_after: "1970-01-01T00:00:00.000Z",
        is_self_signed: false,
        x509_v3_extensions: {
            basic_constraints: "",
            name_constraints: "",
            policy_contraints: "",
            key_usage: "",
            extended_key_usage: "",
            subject_key_identifier: "",
            authority_key_identifier: "",
            subject_alternative_name: "",
            issuer_alternative_name: "",
            subject_directory_attributes: "",
            crl_distribution_points: "",
            inhibit_any_policy: "",
            private_key_usage_period_not_before: "1970-01-01T00:00:00.000Z",
            private_key_usage_period_not_after: "1970-01-01T00:00:00.000Z",
            certificate_policies: "",
            policy_mappings: "",
        },
    });

    useEffect(() => {
        if(projectPatterElement.type === "x509-certificate"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);

    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "x509-certificate";
            stateTmp.spec_version = "2.1";
            stateTmp.lang = "RU";

            dispatch({ type: "cleanAll", data: {}});

            handlerAddSTIXObject(stateTmp);
        }
    }, [ buttonAddClick, state, currentObjectId, handlerAddSTIXObject ]);
    
    useEffect(() => {
        if(buttonChangeClick){
            handlerChangeNewSTIXObject(state);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonChangeClick ]);

    const handlerButtonIsDisabled = (issuer) => {
        if(issuer === "" || (!state.issuer || state.issuer === "")){
            handlerChangeButtonAdd(true);
            return;
        }
        
        if(!buttonAddIsDisabled){
            return;
        }

        handlerChangeButtonAdd(false);
    };

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

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("x509-certificate").description}`}
                    </Typography> 
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.id? state.id: currentObjectId}</Grid>
            </Grid>
            <CreateX509CertificatePatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerHashes={(e) => { dispatch({ type: "updateHashes", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerIssuer={(e) => { dispatch({ type: "updateIssuer", data: e.target.value }); handlerButtonIsDisabled(e.target.value); }}
                handlerSubject={(e) => { dispatch({ type: "updateSubject", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerVersion={(e) => { dispatch({ type: "updateVersion", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerIsSelfSigned={(e) => { dispatch({ type: "updateIsSelfSigned", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerSerialNumber={(e) => { dispatch({ type: "updateSerialNumber", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerValidityNotAfter={(e) => { dispatch({ type: "updateValidityNotAfter", data: e }); handlerButtonIsDisabled(); }}
                handlerValidityNotBefore={(e) => { dispatch({ type: "updateValidityNotBefore", data: e }); handlerButtonIsDisabled(); }}
                handlerSignatureAlgorithm={(e) => { dispatch({ type: "updateSignatureAlgorithm", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerSubjectPublicKeyModulus={(e) => { dispatch({ type: "updateSubjectPublicKeyModulus", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerSubjectPublicKeyExponent={(e) => { dispatch({ type: "updateSubjectPublicKeyExponent", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerSubjectPublicKeyAlgorithm={(e) => { dispatch({ type: "updateSubjectPublicKeyAlgorithm", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerExtensions={(obj) => { dispatch({ type: "updateExtensions", data: obj }); handlerButtonIsDisabled(); }}
            />
            <CreateElementAdditionalTechnicalInformationDO
                objectId={currentObjectId}
                reportInfo={state}
                isNotDisabled={isNotDisabled}
                handlerElementConfidence={(e) => { dispatch({ type: "updateConfidence", data: e }); handlerButtonIsDisabled(); }}
                handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerButtonIsDisabled(); }}
                handlerElementLabels={(e) => { dispatch({ type: "updateLabels", data: e }); handlerButtonIsDisabled(); }}
                handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerButtonIsDisabled(); }}
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
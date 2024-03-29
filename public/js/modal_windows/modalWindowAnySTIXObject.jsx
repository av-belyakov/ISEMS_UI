import React, { lazy, Suspense } from "react";
import { 
    Dialog,
    DialogTitle,
    IconButton,
    Grid,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers.js";
import ErrorBoundary from "../module_managing_records_structured_information/any_elements/errorBoundary.jsx";

const ContentArtifactSTIXObject = lazy(() => import(/* webpackChunkName 'ContentArtifactSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentArtifactSTIXObject.jsx"));
const ContentDirectorySTIXObject = lazy(() => import(/* webpackChunkName 'ContentDirectorySTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentDirectorySTIXObject.jsx")); 
const ContentFileSTIXObject = lazy(() => import(/* webpackChunkName 'ContentFileSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentFileSTIXObject.jsx")); 
const ContentMutexSTIXObject = lazy(() => import(/* webpackChunkName 'ContentMutexSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentMutexSTIXObject.jsx"));
const ContentProcessSTIXObject = lazy(() => import(/* webpackChunkName 'ContentProcessSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentProcessSTIXObject.jsx"));
const ContentSoftwareSTIXObject = lazy(() => import(/* webpackChunkName 'ContentSoftwareSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentSoftwareSTIXObject.jsx"));
const ContentURLSTIXObject = lazy(() => import(/* webpackChunkName 'ContentURLSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentURLSTIXObject.jsx"));
const ContentWindowsRegistryKeySTIXObject = lazy(() => import(/* webpackChunkName 'ContentWindowsRegistryKeySTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentWindowsRegistryKeySTIXObject.jsx"));
const ContentX509CertificateSTIXObject = lazy(() => import(/* webpackChunkName 'ContentX509CertificateSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentX509CertificateSTIXObject.jsx"));
const ContentAttackPatternSTIXObject = lazy(() => import(/* webpackChunkName 'ContentAttackPatternSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentAttackPatternSTIXObject.jsx"));
const ContentAutonomousSystemSTIXObject = lazy(() => import(/* webpackChunkName 'ContentAutonomousSystemSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentAutonomousSystemSTIXObject.jsx"));
const ContentCampaignSTIXObject = lazy(() => import(/* webpackChunkName 'ContentCampaignSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentCampaignSTIXObject.jsx"));
const ContentCourseOfActionSTIXObject = lazy(() => import(/* webpackChunkName 'ContentCourseOfActionSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentCourseOfActionSTIXObject.jsx"));
const ContentDomainNameSTIXObject = lazy(() => import(/* webpackChunkName 'ContentDomainNameSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentDomainNameSTIXObject.jsx"));
const ContentEmailAddrSTIXObject = lazy(() => import(/* webpackChunkName 'ContentEmailAddrSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentEmailAddrSTIXObject.jsx"));
const ContentEmailMessageSTIXObject = lazy(() => import(/* webpackChunkName 'ContentEmailMessageSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentEmailMessageSTIXObject.jsx"));
const ContentGroupingSTIXObject = lazy(() => import(/* webpackChunkName 'ContentGroupingSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentGroupingSTIXObject.jsx"));
const ContentIdentitySTIXObject = lazy(() => import(/* webpackChunkName 'ContentIdentitySTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentIdentitySTIXObject.jsx"));
const ContentIncidentSTIXObject = lazy(() => import(/* webpackChunkName 'ContentIncidentSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentIncidentSTIXObject.jsx"));
const ContentInfrastructureSTIXObject = lazy(() => import(/* webpackChunkName 'ContentInfrastructureSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentInfrastructureSTIXObject.jsx"));
const ContentIntrusionSetSTIXObject = lazy(() => import(/* webpackChunkName 'ContentIntrusionSetSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentIntrusionSetSTIXObject.jsx"));
const CreateIndicatorSTIXObject = lazy(() => import(/* webpackChunkName 'CreateIndicatorSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentIndicatorSTIXObject.jsx"));
const ContentIPv4AddrSTIXObject = lazy(() => import(/* webpackChunkName 'ContentIPv4AddrSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentIPv4AddrSTIXObject.jsx"));
const ContentIPv6AddrSTIXObject = lazy(() => import(/* webpackChunkName 'ContentIPv6AddrSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentIPv6AddrSTIXObject.jsx"));
const ContentLocationSTIXObject = lazy(() => import(/* webpackChunkName 'ContentLocationSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentLocationSTIXObject.jsx"));
const ContentMacAddrSTIXObject = lazy(() => import(/* webpackChunkName 'ContentMacAddrSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentMacAddrSTIXObject.jsx"));
const ContentMalwareSTIXObject = lazy(() => import(/* webpackChunkName 'ContentMalwareSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentMalwareSTIXObject.jsx"));
const CreateDialogContentMalwareAnalysisSTIXObject = lazy(() => import(/* webpackChunkName 'CreateDialogContentMalwareAnalysisSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentMalwareAnalysisSTIXObject.jsx"));
const ContentNetworkTrafficSTIXObject = lazy(() => import(/* webpackChunkName 'ContentNetworkTrafficSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentNetworkTrafficSTIXObject.jsx"));
const ContentNoteSTIXObject = lazy(() => import(/* webpackChunkName 'ContentNoteSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentNoteSTIXObject.jsx"));
const ContentObservedDataSTIXObject = lazy(() => import(/* webpackChunkName 'ContentObservedDataSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentObservedDataSTIXObject.jsx"));
const ContentOpinionSTIXObject = lazy(() => import(/* webpackChunkName 'ContentOpinionSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentOpinionSTIXObject.jsx"));
const ContentThreatActorSTIXObject = lazy(() => import(/* webpackChunkName 'ContentThreatActorSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentThreatActorSTIXObject.jsx"));
const ContentToolSTIXObject = lazy(() => import(/* webpackChunkName 'ContentToolSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentToolSTIXObject.jsx"));
const ContentUserAccountSTIXObject = lazy(() => import(/* webpackChunkName 'ContentUserAccountSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentUserAccountSTIXObject.jsx"));
const ContentVulnerabilitySTIXObject = lazy(() => import(/* webpackChunkName 'ContentVulnerabilitySTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentVulnerabilitySTIXObject.jsx"));
const ContentAuxiliarySTIXObject = lazy(() => import(/* webpackChunkName 'ContentAuxiliarySTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentAuxiliarySTIXObject.jsx"));
const ContentNullSTIXObject = lazy(() => import(/* webpackChunkName 'ContentNullSTIXObject' */ "../module_managing_records_structured_information/any_elements/dialog_contents/contentNullSTIXObject.jsx"));

export default function ModalWindowAnySTIXObject(props){    
    let { 
        socketIo,
        isNotDisabled, 
        showModalWindow,
        parentIdSTIXObject,
        currentAdditionalIdSTIXObject,
        handlerDialogClose,
    } = props;

    let idSTIXObject = currentAdditionalIdSTIXObject;
    let type = currentAdditionalIdSTIXObject.split("--");
    let objectElem = helpers.getLinkImageSTIXObject(type[0]);

    if(!idSTIXObject || idSTIXObject === ""){
        return null;
    }

    if(typeof objectElem !== "undefined" ){
        idSTIXObject = type[0];
        img = <img 
            src={`/images/stix_object/${objectElem.link}`} 
            width="35" 
            height="35" />;
    }

    let MyModule = somethingModule(idSTIXObject);
    let titleName = `${(typeof objectElem === "undefined")? "": objectElem.description} id: ${currentAdditionalIdSTIXObject}`,
        img = (typeof objectElem === "undefined")? "": <img src={`/images/stix_object/${objectElem.link}`} width="35" height="35" />;

    return (<Dialog 
        fullWidth
        maxWidth="xl"
        scroll="paper"
        open={showModalWindow} >
        <DialogTitle>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={11}>{img}&nbsp;{titleName}</Grid>
                <Grid item container md={1} justifyContent="flex-end">
                    <IconButton edge="start" color="inherit" onClick={handlerDialogClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid> 
        </DialogTitle>
 
        <ErrorBoundary>
            <Suspense fallback={<div style={{ textAlign: "center", marginBottom: 22}}>Загрузка...</div>}>
                {MyModule && <MyModule 
                    socketIo={socketIo}
                    isNotDisabled={isNotDisabled}
                    parentIdSTIXObject={parentIdSTIXObject}
                    currentAdditionalIdSTIXObject={currentAdditionalIdSTIXObject}
                    handlerDialogClose={handlerDialogClose}
                />}
            </Suspense>
        </ErrorBoundary>
    </Dialog>);
}

ModalWindowAnySTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired, 
    showModalWindow: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

function somethingModule(nameSTIX){
    const nameList = {
        "artifact": ContentArtifactSTIXObject, 
        "directory": ContentDirectorySTIXObject, 
        "file": ContentFileSTIXObject, 
        "mutex": ContentMutexSTIXObject,
        "process": ContentProcessSTIXObject, 
        "software": ContentSoftwareSTIXObject,
        "url": ContentURLSTIXObject,
        "windows-registry-key": ContentWindowsRegistryKeySTIXObject,
        "x509-certificate": ContentX509CertificateSTIXObject,
        "attack-pattern": ContentAttackPatternSTIXObject,
        "autonomous-system": ContentAutonomousSystemSTIXObject, 
        "campaign": ContentCampaignSTIXObject,
        "course-of-action": ContentCourseOfActionSTIXObject, 
        "domain-name": ContentDomainNameSTIXObject,
        "email-addr": ContentEmailAddrSTIXObject,
        "email-message": ContentEmailMessageSTIXObject,
        "grouping": ContentGroupingSTIXObject,
        "identity": ContentIdentitySTIXObject,
        "incident": ContentIncidentSTIXObject,
        "infrastructure": ContentInfrastructureSTIXObject,
        "intrusion-set": ContentIntrusionSetSTIXObject,
        "ipv4-addr": ContentIPv4AddrSTIXObject,
        "ipv6-addr": ContentIPv6AddrSTIXObject,
        "location": ContentLocationSTIXObject,
        "mac-addr": ContentMacAddrSTIXObject,
        "malware": ContentMalwareSTIXObject,//"malware-analysis": "", напрямую относится к "malware"
        "network-traffic": ContentNetworkTrafficSTIXObject,
        "note": ContentNoteSTIXObject,
        "observed-data": ContentObservedDataSTIXObject,//"indicator": "",зависит от "observed-data"
        "opinion": ContentOpinionSTIXObject,
        "threat-actor": ContentThreatActorSTIXObject,
        "tool": ContentToolSTIXObject,
        "user-account": ContentUserAccountSTIXObject,
        "vulnerability": ContentVulnerabilitySTIXObject,
        "indicator": CreateIndicatorSTIXObject,
        "malware-analysis": CreateDialogContentMalwareAnalysisSTIXObject,
        "relationship": ContentAuxiliarySTIXObject,
        "sighting": ContentAuxiliarySTIXObject,
    };

    if(!nameList[nameSTIX]){
        return ContentNullSTIXObject;
    }

    return nameList[nameSTIX];
}

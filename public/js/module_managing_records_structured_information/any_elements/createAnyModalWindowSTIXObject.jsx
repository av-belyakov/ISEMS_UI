"use strict";

import React, { Suspense } from "react";
import { 
    Dialog,
    DialogTitle,
    IconButton,
    Grid,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";

export default function CreateAnyModalWindowSTIXObject(props){    
    let { 
        socketIo,
        listObjectInfo,
        listPreviousState,
        optionsPreviousState,
        showDialogElement,
        currentAdditionalIdSTIXObject,
        showListPreviousState, 
        handelrDialogClose,
        handelrDialogSave,
        isNotDisabled, 
    } = props;

    let idSTIXObject = currentAdditionalIdSTIXObject;
    let type = currentAdditionalIdSTIXObject.split("--");
    let objectElem = helpers.getLinkImageSTIXObject(type[0]);

    if(typeof objectElem !== "undefined" ){
        idSTIXObject = type[0];
        img = <img 
            src={`/images/stix_object/${objectElem.link}`} 
            width="35" 
            height="35" />;
    }
    
    let titleName = (currentAdditionalIdSTIXObject === "create-new-stix-object")? 
            "Создание нового объекта или добавление существующего": 
            `${(typeof objectElem === "undefined")? "": objectElem.description} id: ${currentAdditionalIdSTIXObject}`,
        img = (typeof objectElem === "undefined")? "": <img src={`/images/stix_object/${objectElem.link}`} width="35" height="35" />;

    let getMyModule = (name) => {
        switch(name){
        case "artifact":
            console.log("11111");

            return React.lazy(() => import("./dialog_contents/contentArtifactSTIXObject.jsx")); 
        
        case "directory":
            console.log("222222");
        
            return React.lazy(() => import("./dialog_contents/contentDirectorySTIXObject.jsx")); 
        
        case "file":
            console.log("333333");

            return React.lazy(() => import("./dialog_contents/contentFileSTIXObject.jsx")); 
        
        case "mutex":
            console.log("4444444");

            return React.lazy(() => import("./dialog_contents/contentMutexSTIXObject.jsx")); 
        
        case "process":
            console.log("5555555");

            return React.lazy(() => import("./dialog_contents/contentProcessSTIXObject.jsx")); 
        
        case "software":
            console.log("6666666");

            return React.lazy(() => import("./dialog_contents/contentSoftwareSTIXObject.jsx")); 
        
        case "url":
            console.log("777777");

            return React.lazy(() => import("./dialog_contents/contentURLSTIXObject.jsx")); 
        
        case "windows-registry-key":
            console.log("888888");

            return React.lazy(() => import("./dialog_contents/contentWindowsRegistryKeySTIXObject.jsx")); 
        
        case "x509-certificate":
            console.log("9999999");

            return React.lazy(() => import("./dialog_contents/contentX509CertificateSTIXObject.jsx")); 
        
        case "attack-pattern":
            console.log("1011010");

            return React.lazy(() => import("./dialog_contents/contentAttackPatternSTIXObject.jsx")); 

        case "autonomous-system":
            console.log("111|1111");

            return React.lazy(() => import("./dialog_contents/contentAutonomousSystemSTIXObject.jsx")); 

        case "campaign":
            console.log("121212|121212");

            return React.lazy(() => import("./dialog_contents/contentCampaignSTIXObject.jsx")); 
            
        case "course-of-action":
            console.log("131313|131313");

            return React.lazy(() => import("./dialog_contents/contentCourseOfActionSTIXObject.jsx")); 

        case "domain-name":
            console.log("141414|141414");

            return React.lazy(() => import("./dialog_contents/contentDomainNameSTIXObject.jsx")); 

        case "email-addr":
            //"email-message"
            console.log("151515|1511515");

            return React.lazy(() => import("./dialog_contents/contentEmailAddrSTIXObject.jsx")); 

        case "grouping":
            return React.lazy(() => import("./dialog_contents/contentGroupingSTIXObject.jsx")); 

        case "identity":
            return React.lazy(() => import("./dialog_contents/contentIdentitySTIXObject.jsx")); 

        case "incident":
            return React.lazy(() => import("./dialog_contents/contentIncidentSTIXObject.jsx")); 

        case "infrastructure":
            return React.lazy(() => import("./dialog_contents/contentInfrastructureSTIXObject.jsx")); 

        case "intrusion-set":
            return React.lazy(() => import("./dialog_contents/contentIntrusionSetSTIXObject.jsx")); 

        case "ipv4-addr":
            return React.lazy(() => import("./dialog_contents/contentIPv4AddrSTIXObject.jsx")); 

        case "ipv6-addr":
            return React.lazy(() => import("./dialog_contents/contentIPv6AddrSTIXObject.jsx")); 

        case "location":
            return React.lazy(() => import("./dialog_contents/contentLocationSTIXObject.jsx")); 

        case "mac-addr":
            return React.lazy(() => import("./dialog_contents/contentMacAddrSTIXObject.jsx")); 

        case "malware": 
        //"malware-analysis": "", напрямую относится к "malware"
            return React.lazy(() => import("./dialog_contents/contentMalwareSTIXObject.jsx")); 

        case "network-traffic":
            return React.lazy(() => import("./dialog_contents/contentNetworkTrafficSTIXObject.jsx")); 

        case "note":
            return React.lazy(() => import("./dialog_contents/contentNoteSTIXObject.jsx")); 

        case "observed-data":
        //"indicator": "",зависит от "observed-data"
            return React.lazy(() => import("./dialog_contents/contentObservedDataSTIXObject.jsx")); 

        case "opinion":
            return React.lazy(() => import("./dialog_contents/contentOpinionSTIXObject.jsx")); 

        case "threat-actor":
            return React.lazy(() => import("./dialog_contents/contentThreatActorSTIXObject.jsx")); 

        case "tool":
            return React.lazy(() => import("./dialog_contents/contentToolSTIXObject.jsx")); 

        case "user-account":
            return React.lazy(() => import("./dialog_contents/contentUserAccountSTIXObject.jsx")); 

        case "vulnerability":
            return React.lazy(() => import("./dialog_contents/contentVulnerabilitySTIXObject.jsx")); 

        case "indicator":
            return React.lazy(() => import("./dialog_contents/contentAuxiliarySTIXObject.jsx"));

        case "email-message":
            return React.lazy(() => import("./dialog_contents/contentAuxiliarySTIXObject.jsx"));

        case "malware-analysis":
            return React.lazy(() => import("./dialog_contents/contentAuxiliarySTIXObject.jsx"));

        case "relationship":
            return React.lazy(() => import("./dialog_contents/contentAuxiliarySTIXObject.jsx"));

        case "sighting":
            return React.lazy(() => import("./dialog_contents/contentAuxiliarySTIXObject.jsx"));
            
        }

        return null;
    };

    let MyModule = getMyModule(idSTIXObject);

    const handlerDialogButtonSave = (data) => {
        handelrDialogSave(data);

        handelrDialogClose();
    };

    return (<Dialog 
        fullWidth
        maxWidth="xl"
        scroll="paper"
        open={showDialogElement} >
        <DialogTitle>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={11}>{img}&nbsp;<span className="pt-2">{titleName}</span></Grid>
                <Grid item container md={1} justifyContent="flex-end">
                    <IconButton edge="start" color="inherit" onClick={handelrDialogClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid> 
        </DialogTitle>

        {/** ЭТО СПЕЦИАЛЬНЫЙ СТРОГИЙ РЕЖИМ REACT ДЛЯ ПРОВЕРКИ */}
        <React.StrictMode></React.StrictMode>

        <Suspense fallback={<div style={{ textAlign: "center", marginBottom: 22}}>Загрузка...</div>}>
            {(MyModule)?
                <MyModule
                    listObjectInfo={listObjectInfo}
                    listPreviousState={listPreviousState}
                    optionsPreviousState={optionsPreviousState}
                    currentIdSTIXObject={currentAdditionalIdSTIXObject}
                    showListPreviousState={showListPreviousState}
                    socketIo={socketIo}
                    handlerDialog={handlerDialogButtonSave}
                    handelrDialogClose={handelrDialogClose}
                    isNotDisabled={isNotDisabled}
                />:
                ""}
        </Suspense>
    </Dialog>);
}

CreateAnyModalWindowSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listPreviousState: PropTypes.array.isRequired,
    listObjectInfo: PropTypes.object.isRequired,
    optionsPreviousState: PropTypes.object.isRequired,
    showDialogElement: PropTypes.bool.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    showListPreviousState: PropTypes.bool.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    handelrDialogSave: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};
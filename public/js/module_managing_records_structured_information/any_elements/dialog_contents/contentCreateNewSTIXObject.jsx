"use strict";

import React, { lazy } from "react";
import { 
    Box,
    Button,
    DialogActions,
    DialogContent,
    IconButton,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    FormControlLabel,    
    MenuItem,
    Typography,
} from "@material-ui/core";
import { teal, grey, red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import ContentNullSTIXObject from "../dialog_contents/contentNullSTIXObject.jsx";

const CreateDialogContentAttackPatternNewSTIXObject = lazy(() => import("./contentAttackPatternNewSTIXObject.jsx"));
const CreateCourseOfActionPatternNewSTIXObject = lazy(() => import("./contentCourseOfActionPatternNewSTIXObject.jsx"));
const CreateCampaignPatternNewSTIXObject = lazy(() => import("./contentCampaignPatternNewSTIXObject.jsx"));

//const CreateAttackPatternElements = lazy(() => import(/* webpackChunkName 'CreateAttackPatternElements' */ "../type_elements_stix/attackPatternElements.jsx"));
//const CreateCourseOfActionPatternElements = lazy(() => import(/* webpackChunkName 'CreateCourseOfActionPatternElements' */ "../type_elements_stix/courseOfActionPatternElements.jsx"));
//const CreateCampaingPatternElements = lazy(() => import(/* webpackChunkName 'CreateCampaingPatternElements' */ "../type_elements_stix/campaingPatternElements.jsx"));
//const CreateGroupingPatternElements = lazy(() => import(/* webpackChunkName 'CreateGroupingPatternElements' */ "../type_elements_stix/groupingPatternElements.jsx"));
//const CreateIdentityPatternElements = lazy(() => import(/* webpackChunkName 'CreateIdentityPatternElements' */ "../type_elements_stix/identityPatternElements.jsx"));
//const CreateInfrastructurePatternElements = lazy(() => import(/* webpackChunkName 'CreateInfrastructurePatternElements' */ "../type_elements_stix/infrastructurePatternElements.jsx"));
//const CreateIntrusionSetPatternElements = lazy(() => import(/* webpackChunkName 'CreateIntrusionSetPatternElements' */ "../type_elements_stix/intrusionSetPatternElements.jsx"));
//const CreateLocationPatternElements = lazy(() => import(/* webpackChunkName 'CreateLocationPatternElements' */ "../type_elements_stix/locationPatternElements.jsx"));
//const CreateMalwarePatternElements = lazy(() => import(/* webpackChunkName 'CreateMalwareElements' */ "../type_elements_stix/malwarePatternElements.jsx"));
//const CreateNotePatternElements = lazy(() => import(/* webpackChunkName 'CreateNotePatternElements' */ "../type_elements_stix/notePatternElements.jsx"));
//const CreateObservedDataPatternElements = lazy(() => import(/* webpackChunkName 'CreateObservedDataPatternElements' */ "../type_elements_stix/observedDataPatternElements.jsx"));
//const CreateOpinionPatternElements = lazy(() => import(/* webpackChunkName 'CreateOpinionPatternElements' */ "../type_elements_stix/opinionPatternElements.jsx"));
//const CreateThreatActorsPatternElements = lazy(() => import(/* webpackChunkName 'CreateThreatActorsPatternElements' */ "../type_elements_stix/threatActorPatternElements.jsx"));
//const CreateToolPatternElements = lazy(() => import(/* webpackChunkName 'CreateToolPatternElements' */ "../type_elements_stix/toolPatternElements.jsx"));
//const CreateVulnerabilityPatternElements = lazy(() => import(/* webpackChunkName 'CreateVulnerabilityPatternElements' */ "../type_elements_stix/vulnerabilityPatternElements.jsx"));
//const CreateArtifactPatternElements = lazy(() => import(/* webpackChunkName 'CreateArtifactPatternElements' */ "../type_elements_stix/artifactPatternElements.jsx"));
//const CreateAutonomousSystemPatternElements = lazy(() => import(/* webpackChunkName 'CreateAutonomousSystemPatternElements' */ "../type_elements_stix/autonomousSystemPatternElements.jsx"));
//const CreateDirectoryPatternElements = lazy(() => import(/* webpackChunkName 'CreateDirectoryPatternElements' */ "../type_elements_stix/directoryPatternElements.jsx"));
//const CreateDomainNamePatternElements = lazy(() => import(/* webpackChunkName 'CreateDomainNamePatternElements' */ "../type_elements_stix/domainNamePatternElements.jsx"));
//const CreateEmailAddressPatternElements = lazy(() => import(/* webpackChunkName 'CreateEmailAddressPatternElements' */ "../type_elements_stix/emailAddressPatternElements.jsx"));
//const CreateFilePatternElements = lazy(() => import(/* webpackChunkName 'CreateFilePatternElements' */ "../type_elements_stix/filePatternElements.jsx"));
//const CreateIpv4AddrPatternElements = lazy(() => import(/* webpackChunkName 'CreateIpv4AddrPatternElements' */ "../type_elements_stix/ipv4AddrPatternElements.jsx"));
//const CreateIpv6AddrPatternElements = lazy(() => import(/* webpackChunkName 'CreateIpv6AddrPatternElements' */ "../type_elements_stix/ipv6AddrPatternElements.jsx"));
//const CreateMacAddrPatternElements = lazy(() => import(/* webpackChunkName 'CreateMacAddrPatternElements' */ "../type_elements_stix/macAddrPatternElements.jsx"));
//const CreateMutexPatternElements = lazy(() => import(/* webpackChunkName 'CreateMutexPatternElements' */ "../type_elements_stix/mutexPatternElements.jsx"));
//const CreateNetworkTrafficPatternElements = lazy(() => import(/* webpackChunkName 'CreateNetworkTrafficPatternElements' */ "../type_elements_stix/networkTrafficPatternElements.jsx"));
//const CreateProcessPatternElements = lazy(() => import(/* webpackChunkName 'CreateProcessPatternElements' */ "../type_elements_stix/processPatternElements.jsx"));
//const CreateSoftwarePatternElements = lazy(() => import(/* webpackChunkName 'CreateSoftwarePatternElements' */ "../type_elements_stix/softwarePatternElements.jsx"));
//const CreateUrlPatternElements = lazy(() => import(/* webpackChunkName 'CreateUrlPatternElements' */ "../type_elements_stix/urlPatternElements.jsx"));
//const CreateUserAccountPatternElements = lazy(() => import(/* webpackChunkName 'CreateUserAccountPatternElements' */ "../type_elements_stix/userAccountPatternElements.jsx"));
//const CreateWindowsRegistryKeyPatternElements = lazy(() => import(/* webpackChunkName 'CreateWindowsRegistryKeyPatternElements' */ "../type_elements_stix/windowsRegistryKeyPatternElements.jsx"));
//const CreateX509CertificatePatternElements = lazy(() => import(/* webpackChunkName 'CreateX509CertificatePatternElements' */ "../type_elements_stix/x509CertificatePatternElements.jsx"));
//const CreateMalwareAnalysisPatternElements = lazy(() => import(/* webpackChunkName 'CreateMalwareAnalysisPatternElements' */ "../type_elements_stix/malwareAnalysisPatternElements.jsx"));

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "fixed",
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    appBreadcrumbs: {
        position: "fixed",
        top: "60px",
        color: theme.palette.getContrastText(grey[50]),
        backgroundColor: grey[50],
        paddingLeft: theme.spacing(4),
    },
    buttonSave: {
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const listRefPropertyObject = {
    "object_refs": [ 
        "artifact",				
        "directory",				
        "file",					
        "mutex",				
        "process",			
        "software",				
        "url",				
        "windows-registry-key",			
        "x509-certificate",		
        "attack-pattern",
        "autonomous-system",
        "campaign",		
        "course-of-action",	
        "domain-name",		
        "email-addr",	
        "email-message",	
        "grouping",	
        "identity",		
        "incident",	
        "indicator",		
        "infrastructure",	
        "intrusion-set",
        "ipv4-addr",
        "ipv6-addr",
        "location",
        "mac-addr",
        "malware",
        "malware-analysis",
        "network-traffic",
        "note",
        "observed-data",
        "opinion",
        "relationship",
        "report",
        "sighting",
        "threat-actor",
        "tool",
        "user-account",
        "vulnerability",
    ],
    "operating_system_refs": [ "software" ],
    "sample_refs": [ "file", "artifact" ],
    "host_vm_ref": [ "software" ],
    "operating_system_ref": [ "software" ],
    "installed_software_refs": [ "software" ],
    "resolves_to_refs": [ "ipv4-addr", "ipv6-addr", "domain-name" ],
    "contains_refs": [ "file", "directory" ], 
    "src_ref": [ "ipv4-addr", "ipv6-addr", "mac-addr", "domain-name" ], 
    "dst_ref": [ "ipv4-addr", "ipv6-addr", "mac-addr", "domain-name" ],
    "src_payload_ref": [ "artifact" ], 
    "dst_payload_ref": [ "artifact" ],
    "encapsulates_refs": [ "network-traffic" ], 
    "encapsulated_by_ref": [ "network-traffic" ], 
    "message_body_data_ref": [ "artifact" ],          
    "opened_connection_refs": [ "network-traffic" ],
    "creator_user_ref": [ "user-account" ],
    "image_ref": [ "file" ],
    "parent_ref": [ "process" ],
    "child_refs": [ "process" ],
};

let reducer = () => {
    /**
     * здесь должна быть обработка объекта после его поиска по id
     * через useEffect
     */
};

export default function CreateDialogContentNewSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentSTIXObject,
        currentIdSTIXObject,
        listRefsForObjectSTIX,
        handlerDialog,
        handlerDialogClose,
    } = props;

    let [ typeObjectSTIX, setTypeObjectSTIX ] = React.useState("");
    let [ itemReactSearchAutocomplete, setItemReactSearchAutocomplete ] = React.useState([]);
    let [ currentRefObjectSTIX, setCurrentRefObjectSTIX ] = React.useState(listRefsForObjectSTIX.find((item) => item === "object_refs")? "object_refs": listRefsForObjectSTIX[0]);
    let [ parentObject, setParentObject ] = React.useState(parentSTIXObject);
    let [ projectPatterElement, setProjectPatterElement ] = React.useReducer(reducer, {});
    let [ listNewOrModifySTIXObject, setListNewOrModifySTIXObject ] = React.useState([]);

    let buttonSaveIsDisabled = (listRefsForObjectSTIX.length === 0);
    let listObjectTypeTmp = new Set();
    for(let value of listRefsForObjectSTIX){
        if(listRefPropertyObject[value]){
            listRefPropertyObject[value].forEach((item) => listObjectTypeTmp.add(item));
        }
    }

    console.log("_________________ listObjectTypeTmp: ", listObjectTypeTmp);
    console.log("***************** listNewOrModifySTIXObject: ", listNewOrModifySTIXObject);

    let listLinkImageSTIXObjectTmp = Object.keys(helpers.getListLinkImageSTIXObject());
    let listLinkImageSTIXObject = listLinkImageSTIXObjectTmp.filter((item) =>  listObjectTypeTmp.has(item));
    if(listRefsForObjectSTIX.find((item) => item === "object_refs")){
        listLinkImageSTIXObject = listLinkImageSTIXObjectTmp;
    }
    
    React.useEffect(() => {
        for(let item of listRefsForObjectSTIX){
            if(listRefPropertyObject[item] && listRefPropertyObject[item].find((v) => v === typeObjectSTIX)){
                setCurrentRefObjectSTIX(item);

                return;
            }
        }
    }, [ typeObjectSTIX ]);

    console.log("func 'CreateDialogContentNewSTIXObject' currentRefObjectSTIX = ", currentRefObjectSTIX);
    console.log(helpers.getListLinkImageSTIXObject());
    console.log("------ listRefsForObjectSTIX = ", listRefsForObjectSTIX);
    //console.log("helpers.getListOnceProperties() = ", helpers.getListOnceProperties());
    //console.log("helpers.getListManyProperties() = ", helpers.getListManyProperties());

    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: "block", textAlign: "left" }}>id: {item.id}</span>
                <span style={{ display: "block", textAlign: "left" }}>name: {item.name}</span>
            </>
        );
    };

    let handleRadioChange = (obj) => {
            setCurrentRefObjectSTIX(obj.target.value);
        },
        handleOnSearch = () => {

        },
        handleOnHover = () => {

        },
        handleOnSelect = () => {

        },
        handleOnFocus = () => {

        };

    let handlerAddSTIXObject = () => {

    };

    let MyModule = somethingModule(typeObjectSTIX);

    console.log("func 'CreateDialogContentNewSTIXObject' MyModule: ", MyModule);
    //<Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>

    return (<React.Fragment>
        <DialogContent>
            <Grid container direction="row" className="pt-3" spacing={3}>
                <Grid item container md={4}>
                    <Grid container direction="row">
                        <Grid item container md={12} justifyContent="flex-start">
                        В родительский объект &nbsp;<strong className="text-muted">{currentIdSTIXObject}</strong>&nbsp; добавлены ссылки на следующие объекты:
                            {listNewOrModifySTIXObject.map((item, key) => {
                                let objectElem = helpers.getLinkImageSTIXObject(item.type);

                                return (<Grid container direction="row" key={`key_new_or_modify_${key}`}>
                                    <Grid item container md={12} justifyContent="flex-start"><img 
                                        key={`key_img_new_or_modify_${key}`} 
                                        src={`/images/stix_object/${objectElem.link}`} 
                                        width="30" 
                                        height="30" />&nbsp;
                                    <strong className="text-muted pt-1">{item.id}</strong>&nbsp;
                                    <IconButton className="mb-2" size="small" aria-label="delete" onClick={() => {
                                        let listNewOrModifySTIXObjectTmp = listNewOrModifySTIXObject.slice();
                                        listNewOrModifySTIXObjectTmp.splice(key, 1);

                                        setListNewOrModifySTIXObject(listNewOrModifySTIXObjectTmp);
                                    }}>
                                        <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                                    </IconButton>
                                    </Grid>
                                </Grid>);
                            })}
                        </Grid>
                    </Grid>                    
                    <Grid container direction="row">
                        <Grid item container md={12} justifyContent="flex-start">
                            <TextField
                                id={"select-type-create-object"}
                                select
                                fullWidth
                                label={"тип искомого или создаваемого объекта (не обязательный параметр)"}
                                value={typeObjectSTIX}
                                onChange={(obj) => setTypeObjectSTIX(obj.target.value)}>
                                <MenuItem key={"key-type-none"} value="">тип не определен</MenuItem>
                                {listLinkImageSTIXObject.map((item) => <MenuItem key={`key-${item}`} value={item}>{helpers.getLinkImageSTIXObject(item).description}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>
                    {(listRefsForObjectSTIX.length > 1)?
                        <Grid container direction="row" className="pt-3">
                            <Grid item container md={12} justifyContent="flex-start">
                                <RadioGroup row aria-label="quiz" name="quiz" value={currentRefObjectSTIX} onChange={handleRadioChange}>
                                    {listRefsForObjectSTIX.map((item) => {
                                        let isDisabled = false;
                                        if(typeObjectSTIX === ""){
                                            isDisabled = true;
                                        } else {
                                            if(listRefPropertyObject[item] && !listRefPropertyObject[item].find((v) => v === typeObjectSTIX)){
                                                isDisabled = true;    
                                            }
                                        }

                                        return <FormControlLabel disabled={isDisabled} key={`key-${item}`} value={item} control={<Radio size="small"/>} label={item} />;
                                    })}
                                </RadioGroup>
                            </Grid>
                        </Grid>:
                        ""}
                    {helpers.getListOnceProperties().find((item) => item === currentRefObjectSTIX && typeObjectSTIX !== "")?
                        <Typography variant="caption" display="block" gutterBottom style={{ color: red[400] }}>
                            Внимание!!! Выбранное свойство объекта может содержать только одну ссылку, если вы добавите новую ссылку, то предидущая,
                            если она есть, будет перезаписанна.
                        </Typography>:
                        ""}
                    <Grid container direction="row" className="pt-3">
                        <div style={{ width: "100%" }}>
                            <ReactSearchAutocomplete
                                items={itemReactSearchAutocomplete}
                                onSearch={handleOnSearch}
                                onHover={handleOnHover}
                                onSelect={handleOnSelect}
                                onFocus={handleOnFocus}
                                autoFocus
                                formatResult={formatResult}
                            />
                        </div>
                    </Grid>
                    <Grid container direction="row" className="pt-3">
                        <Grid item container md={12} justifyContent="flex-start">

                    1. Выбор свойства куда нужно добавить объект, если listRefsForObjectSTIX то вообще нельзя ничего делать, а 
                    если только object_refs то не показывать этот шаг.
                    2. Тип создаваемого объекта, при поиске не обязателен.
                    3. Строка поиска по id, name, domainame, ip и т.д. (поиск из кеша).
                    4. Вывод списка найденных ссылок.

                    Не для каждого типа родительского объекта и свойств данного объекта, возможно добавление всех видов дочерних объектов 
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container md={8}>
                    <Paper>
                        <Box m={2} pb={2}>
                            {MyModule && <MyModule 
                                isNotDisabled={isNotDisabled}
                                parentIdSTIXObject={currentIdSTIXObject}
                                projectPatterElement={projectPatterElement}
                                handlerAddSTIXObject={handlerAddSTIXObject}
                            />}
                        
                        
                        
                            {/*
                        <MyModule
                            campaignPatterElement={{}}
                            handlerCommon={(id, fieldType) => {
                                console.log("func 'handlerCommon', id:", id, " fieldType:", fieldType);
                            }}
                        <ContentAttackPatternSTIXObject 
                            socketIo={socketIo}
                            isNotDisabled={isNotDisabled}
                            parentIdSTIXObject={currentIdSTIXObject}
                            currentAdditionalIdSTIXObject={""}
                            handlerDialogClose={handlerDialogClose}
                                />*/}
                    Добавление какого либо нового STIX объекта. При это можно как добавить новый STIX объект, так и выполнить поиск
            уже существующих STIX объектов по их типам, времени создания, идентификатору и т.д. Родительский объект {currentIdSTIXObject}.
            listRefsForObjectSTIX = {listRefsForObjectSTIX}
            *  На основе типа родительского объекта и его свойств, которые позволяют прекрипить определенный объект, ограничить 
 * добавление ссылки на новый объект или поиск (в том числе по id) уже существующего объекта

 1. выбираем stix объект к которому нужно добавить ссылку на другой объект (автоматически выбираются свойства для родительского объекта) +
 2. на основе выбранных свойств формируется список из активных для выбора и неактивных stix объектов ссылки на которые можно добавить данному
 родительскому объекту
 3. данный факт касается как создании нового объекта так и поиск уже существующих (поиск выполняется не явно по типам)
 4. если поиск выполняется по id то надо автоматически проверить тип объетка по его id
 5. а при выборе типа объекта автоматически выбирать свойство в которое добавлять свойство (если данный тип можно добавить в несколько свойств то приоритет тому
 в котором хранится список), если такого нет или их несколько то выбирать первое попавшийся свойство

/
здесь должно быть поле для просмотра и редактирования найденных STIX объектов и вновь созданных объектов, при этом вся обработка данных объекта
должна выполнятся здесь. Нужно предусмотреть кнопку 'добавить' для добавления вновь созданных объектов и объектов по которым выполнялось редактирование
в listNewOrModifySTIXObject для последующей отправки отредактированных объектов в СУБД
/
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </DialogContent>

        <DialogActions>
            <Button onClick={handlerDialogClose} color="primary">закрыть</Button>
            <Button 
                disabled={buttonSaveIsDisabled}
                onClick={() => {
                    handlerDialog({});
                }}
                color="primary">
                подтвердить
            </Button>
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentNewSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    parentSTIXObject: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired, 
    listRefsForObjectSTIX: PropTypes.array.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

function somethingModule(nameSTIX){
    
    console.log("func 'somethingModule', START... nameSTIX: ", nameSTIX);
    
    const nameList = {
        //"artifact": CreateArtifactPatternElements, 
        //"directory": CreateDirectoryPatternElements, 
        //"file": CreateFilePatternElements, 
        //"mutex": CreateMutexPatternElements,
        //"process": CreateProcessPatternElements, 
        //"software": CreateSoftwarePatternElements,
        //"url":CreateUrlPatternElements,
        //"windows-registry-key": CreateWindowsRegistryKeyPatternElements,
        //"x509-certificate": CreateX509CertificatePatternElements,
        "attack-pattern": CreateDialogContentAttackPatternNewSTIXObject,
        //"autonomous-system": CreateAutonomousSystemPatternElements, 
        "campaign": CreateCampaignPatternNewSTIXObject,
        "course-of-action": CreateCourseOfActionPatternNewSTIXObject, 
        //"domain-name": CreateDomainNamePatternElements,
        //"email-addr": CreateEmailAddressPatternElements,
        //"grouping": CreateGroupingPatternElements,
        //"identity": CreateIdentityPatternElements,
        ////"incident": CreateIncidentSTIXObject,
        //"infrastructure": CreateInfrastructurePatternElements,
        //"intrusion-set": CreateIntrusionSetPatternElements,
        //"ipv4-addr": CreateIpv4AddrPatternElements,
        //"ipv6-addr": CreateIpv6AddrPatternElements,
        //"location": CreateLocationPatternElements,
        //"mac-addr": CreateMacAddrPatternElements,
        //"malware": CreateMalwarePatternElements,//"malware-analysis": "", напрямую относится к "malware"
        //"network-traffic": CreateNetworkTrafficPatternElements,
        //"note": CreateNotePatternElements,
        //"observed-data": CreateObservedDataPatternElements,//"indicator": "",зависит от "observed-data"
        //"opinion": CreateOpinionPatternElements,
        //"threat-actor": CreateThreatActorsPatternElements,
        //"tool": CreateToolPatternElements,
        //"user-account": CreateUserAccountPatternElements,
        //"vulnerability": CreateVulnerabilityPatternElements,
        ////"indicator": ContentAuxiliarySTIXObject,
        //"malware-analysis": CreateMalwareAnalysisPatternElements,
    };

    if(!nameList[nameSTIX]){
        return ContentNullSTIXObject;
    }

    return nameList[nameSTIX];
}

/*function somethingModule(nameSTIX){
    const nameList = {
        "artifact": CreateArtifactPatternElements, 
        "directory": CreateDirectoryPatternElements, 
        "file": CreateFilePatternElements, 
        "mutex": CreateMutexPatternElements,
        "process": CreateProcessPatternElements, 
        "software": CreateSoftwarePatternElements,
        "url":CreateUrlPatternElements,
        "windows-registry-key": CreateWindowsRegistryKeyPatternElements,
        "x509-certificate": CreateX509CertificatePatternElements,
        "attack-pattern": CreateAttackPatternElements,
        "autonomous-system": CreateAutonomousSystemPatternElements, 
        "campaign": CreateCampaingPatternElements,
        "course-of-action": CreateCourseOfActionPatternElements, 
        "domain-name": CreateDomainNamePatternElements,
        "email-addr": CreateEmailAddressPatternElements,
        "grouping": CreateGroupingPatternElements,
        "identity": CreateIdentityPatternElements,
        //"incident": CreateIncidentSTIXObject,
        "infrastructure": CreateInfrastructurePatternElements,
        "intrusion-set": CreateIntrusionSetPatternElements,
        "ipv4-addr": CreateIpv4AddrPatternElements,
        "ipv6-addr": CreateIpv6AddrPatternElements,
        "location": CreateLocationPatternElements,
        "mac-addr": CreateMacAddrPatternElements,
        "malware": CreateMalwarePatternElements,//"malware-analysis": "", напрямую относится к "malware"
        "network-traffic": CreateNetworkTrafficPatternElements,
        "note": CreateNotePatternElements,
        "observed-data": CreateObservedDataPatternElements,//"indicator": "",зависит от "observed-data"
        "opinion": CreateOpinionPatternElements,
        "threat-actor": CreateThreatActorsPatternElements,
        "tool": CreateToolPatternElements,
        "user-account": CreateUserAccountPatternElements,
        "vulnerability": CreateVulnerabilityPatternElements,
        //"indicator": ContentAuxiliarySTIXObject,
        "malware-analysis": CreateMalwareAnalysisPatternElements,
    };

    if(!nameList[nameSTIX]){
        return ContentNullSTIXObject;
    }

    return nameList[nameSTIX];
}*/
import React, { lazy, useEffect, useState, useReducer } from "react";
import { 
    Box,
    Button,
    DialogActions,
    DialogContent,
    IconButton,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    FormControlLabel,    
    MenuItem,
    Typography,
} from "@material-ui/core";
import { blue, green, red } from "@material-ui/core/colors";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import ContentNullSTIXObject from "../dialog_contents/contentNullSTIXObject.jsx";

const CreateDialogContentAttackPatternNewSTIXObject = lazy(() => import("./contentAttackPatternNewSTIXObject.jsx"));
const CreateCourseOfActionPatternNewSTIXObject = lazy(() => import("./contentCourseOfActionPatternNewSTIXObject.jsx"));
const CreateCampaignPatternNewSTIXObject = lazy(() => import("./contentCampaignPatternNewSTIXObject.jsx"));
const CreateGroupingPatternNewSTIXObject = lazy(() => import("./contentGroupingPatternNewSTIXObject.jsx"));
const CreateIdentityPatternNewSTIXObject = lazy(() => import("./contentIdentityPatternNewSTIXObject.jsx"));
const CreateInfrastructurePatternNewSTIXObject = lazy(() => import("./contentInfrastructurePatternNewSTIXObject.jsx"));
const CreateIntrusionSetPatternNewSTIXObject = lazy(() => import("./contentIntrusionSetPatternNewSTIXObject.jsx"));
const CreateLocationPatternNewSTIXObject = lazy(() => import("./contentLocationPatternNewSTIXObject.jsx"));
const CreateNotePatternNewSTIXObject = lazy(() => import("./contentNotePatternNewSTIXObject.jsx"));
const CreateToolPatternNewSTIXObject = lazy(() => import("./contentToolPatternNewSTIXObject.jsx"));
const CreateMalwarePatternNewSTIXObject = lazy(() => import("./contentMalwarePatternNewSTIXObject.jsx"));
const CreateMalwareAnalysisPatternNewSTIXObject = lazy(() => import("./contentMalwareAnalysisPatternNewSTIXObject.jsx"));
const CreateThreatActorPatternNewSTIXObject = lazy(() => import("./contentThreatActorPatternSTIXObject.jsx"));
const CreateOpinionPatternNewSTIXObject = lazy(() => import("./contentOpinionPatternNewSTIXObject.jsx"));
const CreateVulnerabilityPatternNewSTIXObject = lazy(() => import("./contentVulnerabilityPatternNewSTIXObject.jsx"));
const CreateObservedDataPatternNewSTIXObject = lazy(() => import("./contentObservedDataPatternNewSTIXObject.jsx"));
const CreateArtifactPatternNewSTIXObject = lazy(() => import("./contentArtifactPatternNewSTIXObject.jsx"));
const CreateAutonomousSystemPatternNewSTIXObject = lazy(() => import("./contentAutonomousSystemPatternNewSTIXObject.jsx"));
const CreateDirectoryPatternNewSTIXObject = lazy(() => import("./contentDirectoryPatternNewSTIXObject.jsx"));
const CreateDomainNamePatternNewSTIXObject = lazy(() => import("./contentDomainNamePatternNewSTIXObject.jsx"));
const CreateEmailAddrPatternNewSTIXObject = lazy(() => import("./contentEmailAddrPatternNewSTIXObject.jsx"));
const CreateEmailMessagePatternNewSTIXObject = lazy(() => import("./contentEmailMessagePatternNewSTIXObject.jsx"));
const CreateFilePatternNewSTIXObject = lazy(() => import("./contentFilePatternNewSTIXObject.jsx"));
const CreateIPv4AddrPatternNewSTIXObject = lazy(() => import("./contentIPv4AddrPatternNewSTIXObject.jsx"));
const CreateIPv6AddrPatternNewSTIXObject = lazy(() => import("./contentIPv6AddrPatternNewSTIXObject.jsx"));
const CreateMacAddrPatternNewSTIXObject = lazy(() => import("./contentMacAddrPatternNewSTIXObject.jsx"));
const CreateMutexPatternNewSTIXObject = lazy(() => import("./contentMutexPatternNewSTIXObject.jsx"));
const CreateURLPatternNewSTIXObject = lazy(() => import("./contentURLPatternNewSTIXObject.jsx"));
const CreateSoftwarePatternNewSTIXObject = lazy(() => import("./contentSoftwarePatternNewSTIXObject.jsx"));
const CreateNetworkTrafficPatternNewSTIXObject = lazy(() => import("./contentNetworkTrafficPatternNewSTIXObject.jsx"));
const CreateProcessPatternNewSTIXObject = lazy(() => import("./contentProcessPatternNewSTIXObject.jsx"));
const CreateUserAccountPatternNewSTIXObject = lazy(() => import("./contentUserAccountPatternNewSTIXObject.jsx"));
const CreateWindowsRegistryKeyPatternNewSTIXObject = lazy(() => import("./contentWindowsRegistryKeyPatternNewSTIXObject.jsx"));
const CreateX509CertificatePatternNewSTIXObject = lazy(() => import("./contentX509CertificatePatternNewSTIXObject.jsx"));
const CreateIndicatorPatternNewSTIXObject = lazy(() => import("./contentIndicatorPatternNewSTIXObject.jsx"));

const sco = [ 
    "artifact",				
    "autonomous-system",
    "directory",				
    "domain-name",		
    "email-addr",	
    "email-message",	
    "file",					
    "ipv4-addr",
    "ipv6-addr",
    "mac-addr",
    "mutex",				
    "network-traffic",
    "process",			
    "software",				
    "url",				
    "user-account",
    "windows-registry-key",			
    "x509-certificate",		
];

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
    "analysis_sco_refs": sco,
    "sample_ref": sco,
    "sample_refs": [ "artifact", "file" ],
    "host_vm_ref": [ "software" ],
    "operating_system_ref": [ "software" ],
    "operating_system_refs": [ "software" ],
    "installed_software_refs": [ "software" ],
    "resolves_to_refs": [ "ipv4-addr", "ipv6-addr", "mac-addr", "domain-name" ],
    "content_ref": [ "artifact" ],
    "contain_ref": [ "artifact" ],
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
    "belongs_to_ref": [ "user-account" ],
    "belongs_to_refs": [ "autonomous-system" ],
    "raw_email_ref": [ "artifact" ],
    "bcc_refs": [ "email-addr" ],
    "cc_refs": [ "email-addr" ],
    "to_refs": [ "email-addr" ],
    "sender_ref": [ "email-addr" ],
    "from_ref": [ "email-addr" ],
};

const typesRelationshipsBetweenObjects = {
    "domain-name": [ "ipv4-addr", "ipv6-addr", "domain-name" ],
    "file": sco,
    "observed-data": sco,
    "malware": [ "artifact", "file", "software" ],
    "malware-analysis": sco,
};

let reducer = (state, action) => {
    /**
     * здесь должна быть обработка объекта после его поиска по id
     * через useEffect
     */

    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    }
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

    let [ projectPatterElement, dispatchProjectPatterElement ] = useReducer(reducer, {});
    let [ typeObjectSTIX, setTypeObjectSTIX ] = useState("");
    let [ itemReactSearchAutocomplete, setItemReactSearchAutocomplete ] = useState([]);
    let [ currentRefObjectSTIX, setCurrentRefObjectSTIX ] = useState(listRefsForObjectSTIX.find((item) => item === "object_refs")? "object_refs": listRefsForObjectSTIX[0]);
    let [ listNewOrModifySTIXObject, setListNewOrModifySTIXObject ] = useState([]);
    let [ buttonAddClick, setButtonAddClick ] = useState(false);
    let [ buttonAddIsDisabled, setButtonAddIsDisabled ] = useState(true);
    let [ buttonChangeClick, setButtonChangeClick ] = useState(false);
    let [ buttonSaveIsDisabled, setButtonSaveIsDisabled ] = useState(true);

    useEffect(() => {
        if(listNewOrModifySTIXObject.length > 0){
            setButtonSaveIsDisabled(false);
        } else {
            setButtonSaveIsDisabled(true);
        }
    }, [ listNewOrModifySTIXObject ]);

    let listObjectTypeTmp = new Set();
    let parentType = currentIdSTIXObject.split("--")[0];

    if(parentType === "file"){
        listRefPropertyObject["contains_refs"] = sco;
    }

    for(let value of listRefsForObjectSTIX){      
        if(listRefPropertyObject[value]){
            listRefPropertyObject[value].forEach((item) => {
                if(currentIdSTIXObject.includes("domain-name")){
                    if(item !== "mac-addr"){
                        listObjectTypeTmp.add(item);
                    }
                } else if(currentIdSTIXObject.includes("ipv4-addr") || currentIdSTIXObject.includes("ipv6-addr")){
                    if(item === "mac-addr" || item === "autonomous-system"){
                        listObjectTypeTmp.add(item);
                    }
                } else {
                    listObjectTypeTmp.add(item);
                }
            });
        }
    }

    //if(currentIdSTIXObject.includes("file")
    if(typeof typesRelationshipsBetweenObjects[parentType] !== "undefined"){
        for(let value of listObjectTypeTmp){
            if(typesRelationshipsBetweenObjects[parentType].find((item) => item === value)){
                continue;
            }

            listObjectTypeTmp.delete(value);
        }
    }

    let listLinkImageSTIXObjectTmp = Object.keys(helpers.getListLinkImageSTIXObject());
    let listLinkImageSTIXObject = listLinkImageSTIXObjectTmp.filter((item) => item !== "sighting" && item !== "relationship" && item !== "report" && listObjectTypeTmp.has(item));
    listLinkImageSTIXObject.sort();

    console.log("func 'CreateDialogContentNewSTIXObject' currentIdSTIXObject = ", currentIdSTIXObject, " --- listRefsForObjectSTIX:", listRefsForObjectSTIX, " ---  listLinkImageSTIXObject = ", listLinkImageSTIXObject);

    React.useEffect(() => {
        for(let item of listRefsForObjectSTIX){
            if(listRefPropertyObject[item] && listRefPropertyObject[item].find((v) => v === typeObjectSTIX)){
                setCurrentRefObjectSTIX(item);

                return;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ typeObjectSTIX ]);

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


    let handlerAddSTIXObject = (elem) => {
        let elemIsExist = false;
        let listNewOrModifySTIXObjectTmp = listNewOrModifySTIXObject.slice();

        for(let item of listNewOrModifySTIXObjectTmp){
            if(item.obj.id === elem.id){
                elemIsExist = true;
        
                return;
            }
        }

        if(elemIsExist){
            return; 
        }

        listNewOrModifySTIXObjectTmp.push({ "obj": elem, "ref": currentRefObjectSTIX });
        setButtonAddClick(false);
        setListNewOrModifySTIXObject(listNewOrModifySTIXObjectTmp);
    };
    
    let handlerChangeButtonAdd = (status) => {
        setButtonAddIsDisabled(status);
    };

    let handlerChangeNewSTIXObject = (state) => {
        for(let i = 0; i < listNewOrModifySTIXObject.length; i++){
            if(listNewOrModifySTIXObject[i].obj.id === state.id){
                listNewOrModifySTIXObject[i].obj = state;

                break;
            }
        }

        setButtonChangeClick(false);
    };

    let MyModule = somethingModule(typeObjectSTIX);

    return (<React.Fragment>
        <DialogContent>
            <Grid container direction="row" className="pt-3" spacing={3}>
                <Grid item container md={5}>
                    <Box m={2} pb={2}>
                        <Grid container direction="row">
                            <Grid item container md={12} justifyContent="flex-start">
                                <Typography variant="overline" display="block" gutterBottom>
                                    <span className="text-muted">родительский объект:</span>&nbsp;{currentIdSTIXObject}
                                </Typography>
                                {listNewOrModifySTIXObject.length > 0? 
                                    <span className="text-muted pb-2">добавлены ссылки на следующие STIX объекты:</span>:
                                    ""}
                                {listNewOrModifySTIXObject.map((item, key) => {
                                    let objectElem = helpers.getLinkImageSTIXObject(item.obj.type);

                                    return (<Grid container direction="row" key={`key_new_or_modify_${key}`}>
                                        <Grid item container md={12} justifyContent="flex-start">
                                            <Button 
                                                className="mb-2" 
                                                size="small" 
                                                aria-label="show-element" 
                                                onClick={() => {                                                   
                                                    for(let k of listNewOrModifySTIXObject){
                                                        if(k.obj.id === item.obj.id){
                                                            dispatchProjectPatterElement({ type: "newAll", data: k.obj });
                                                            setTypeObjectSTIX(k.obj.type);

                                                            break;
                                                        }
                                                    } 
                                                }}>
                                                <img 
                                                    key={`key_img_new_or_modify_${key}`} 
                                                    src={`/images/stix_object/${objectElem.link}`} 
                                                    width="30" 
                                                    height="30" />&nbsp;
                                                <span className="pt-1">{item.obj.id}</span>
                                            </Button>
                                            &nbsp;
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
                                    onChange={(obj) => {
                                        setTypeObjectSTIX(obj.target.value);

                                        dispatchProjectPatterElement({ type: "cleanAll" });
                                    }}>
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

                                            return <FormControlLabel 
                                                disabled={isDisabled} 
                                                key={`key-${item}`} 
                                                value={item} 
                                                control={isDisabled?
                                                    <Radio size="small"/>:
                                                    <Radio size="small" style={{ color: red[400] }}/>} 
                                                label={item} />;
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
                                Здесь выводим результаты поиска если он выполнялся. 
                                Результаты выводим через import InfiniteScroll from \"react-infinite-scroll-component\";
                                Пример в createListPreviouseStateSTIX.jsx

                                {/*1. Выбор свойства куда нужно добавить объект, если listRefsForObjectSTIX то вообще нельзя ничего делать, а 
                    если только object_refs то не показывать этот шаг.
                    2. Тип создаваемого объекта, при поиске не обязателен.
                    3. Строка поиска по id, name, domainame, ip и т.д. (поиск из кеша).
                    4. Вывод списка найденных ссылок.

                    Не для каждого типа родительского объекта и свойств данного объекта, возможно добавление всех видов дочерних объектов

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
 / */}
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item container md={7} style={{ display: "block" }}>
                    {MyModule && <MyModule 
                        isNotDisabled={isNotDisabled}
                        buttonAddClick={buttonAddClick}
                        buttonChangeClick={buttonChangeClick}
                        parentIdSTIXObject={currentIdSTIXObject}
                        buttonAddIsDisabled={buttonAddIsDisabled}
                        projectPatterElement={projectPatterElement}
                        handlerAddSTIXObject={handlerAddSTIXObject}
                        handlerChangeButtonAdd={handlerChangeButtonAdd}
                        handlerChangeNewSTIXObject={handlerChangeNewSTIXObject}
                    />}
                </Grid>
            </Grid>
        </DialogContent>

        <DialogActions>
            <Button onClick={handlerDialogClose} color="inherit">закрыть</Button>
            {typeof projectPatterElement.id === "undefined"? <Button 
                disabled={buttonAddIsDisabled}
                onClick={() => { 
                    setButtonAddClick(true);
                    setButtonAddIsDisabled(true);
                }}
                style={{ color: blue[500] }}>
                    добавить объект
            </Button>:
                <Button 
                    disabled={buttonAddIsDisabled}
                    onClick={() => { 
                        setButtonChangeClick(true);
                    }}
                    style={{ color: blue[500] }}>
                    сохранить изменения
                </Button>}
            <Button 
                disabled={buttonSaveIsDisabled}
                onClick={() => { handlerDialog(currentIdSTIXObject, listNewOrModifySTIXObject); }}
                style={{ color: green[500] }}>
                    добавить ссылки
            </Button>
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentNewSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    parentSTIXObject: PropTypes.object.isRequired,
    //parentSTIXObject: PropTypes.string.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired, 
    listRefsForObjectSTIX: PropTypes.array.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

function somethingModule(nameSTIX){
    
    console.log("func 'somethingModule', START... nameSTIX: ", nameSTIX);
    
    /**
 * 
 * Это не относится к ISEMS-UI но все же косвенно его касается
 * 
 * Надо сделать апдейт докера ISEMS-MRSICT так как в обработчике объекта threat-actor ISEMS-MRSICT
 * была ошибка при обработке таких свойств объекта как ThreatActorPrimaryMotivation и ThreatActorSecondaryMotivations
 * которые при изменении значений вносят изменение в свойство ThreatActorRoles
 * 
 */

    const nameList = {
        "artifact": CreateArtifactPatternNewSTIXObject, 
        "directory": CreateDirectoryPatternNewSTIXObject, 
        "file": CreateFilePatternNewSTIXObject, 
        "mutex": CreateMutexPatternNewSTIXObject,
        "process": CreateProcessPatternNewSTIXObject, 
        "software": CreateSoftwarePatternNewSTIXObject,
        "url": CreateURLPatternNewSTIXObject,
        "windows-registry-key": CreateWindowsRegistryKeyPatternNewSTIXObject,
        "x509-certificate": CreateX509CertificatePatternNewSTIXObject,
        "attack-pattern": CreateDialogContentAttackPatternNewSTIXObject,
        "autonomous-system": CreateAutonomousSystemPatternNewSTIXObject, 
        "campaign": CreateCampaignPatternNewSTIXObject,
        "course-of-action": CreateCourseOfActionPatternNewSTIXObject, 
        "domain-name": CreateDomainNamePatternNewSTIXObject,
        "email-addr": CreateEmailAddrPatternNewSTIXObject,
        "email-message": CreateEmailMessagePatternNewSTIXObject,
        "grouping": CreateGroupingPatternNewSTIXObject,
        "identity": CreateIdentityPatternNewSTIXObject,
        "infrastructure": CreateInfrastructurePatternNewSTIXObject,
        "intrusion-set": CreateIntrusionSetPatternNewSTIXObject,
        "ipv4-addr": CreateIPv4AddrPatternNewSTIXObject,
        "ipv6-addr": CreateIPv6AddrPatternNewSTIXObject,
        "location": CreateLocationPatternNewSTIXObject,
        "mac-addr": CreateMacAddrPatternNewSTIXObject,
        "malware": CreateMalwarePatternNewSTIXObject,//"malware-analysis": "", напрямую относится к "malware"
        "network-traffic": CreateNetworkTrafficPatternNewSTIXObject,
        "note": CreateNotePatternNewSTIXObject,
        "observed-data": CreateObservedDataPatternNewSTIXObject,
        "opinion": CreateOpinionPatternNewSTIXObject,
        "threat-actor": CreateThreatActorPatternNewSTIXObject,
        "tool": CreateToolPatternNewSTIXObject,
        "user-account": CreateUserAccountPatternNewSTIXObject,
        "vulnerability": CreateVulnerabilityPatternNewSTIXObject,
        "indicator": CreateIndicatorPatternNewSTIXObject,
        "malware-analysis": CreateMalwareAnalysisPatternNewSTIXObject,
    };

    if(!nameList[nameSTIX]){
        return ContentNullSTIXObject;
    }

    return nameList[nameSTIX];
}

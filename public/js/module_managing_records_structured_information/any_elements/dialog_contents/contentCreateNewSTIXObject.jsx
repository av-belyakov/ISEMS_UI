"use strict";

import React from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Container,
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
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import ContentAttackPatternSTIXObject from "./contentAttackPatternSTIXObject.jsx";

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

export default function CreateDialogContentNewSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        currentIdSTIXObject,
        listRefsForObjectSTIX,
        handlerDialog,
        handlerDialogClose,
    } = props;

    let [ typeObjectSTIX, setTypeObjectSTIX ] = React.useState("");
    let [ itemReactSearchAutocomplete, setItemReactSearchAutocomplete ] = React.useState([]);
    let [ currentRefObjectSTIX, setCurrentRefObjectSTIX ] = React.useState(listRefsForObjectSTIX.find((item) => item === "object_refs")? "object_refs": listRefsForObjectSTIX[0]);

    let buttonSaveIsDisabled = (listRefsForObjectSTIX.length === 0);
    let listObjectTypeTmp = new Set();
    for(let value of listRefsForObjectSTIX){
        if(listRefPropertyObject[value]){
            listRefPropertyObject[value].forEach((item) => listObjectTypeTmp.add(item));
        }
    }

    console.log("_________________ listObjectTypeTmp: ", listObjectTypeTmp);

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
    //<Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>
    return (<React.Fragment>
        <DialogContent>
            <Grid container direction="row" className="pt-3" spacing={3}>
                <Grid item container md={4}>
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
                        <ContentAttackPatternSTIXObject 
                            socketIo={socketIo}
                            isNotDisabled={isNotDisabled}
                            parentIdSTIXObject={currentIdSTIXObject}
                            currentAdditionalIdSTIXObject={""}
                            handlerDialogClose={handlerDialogClose}
                        />
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
                сохранить
            </Button>
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentNewSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired, 
    listRefsForObjectSTIX: PropTypes.array.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

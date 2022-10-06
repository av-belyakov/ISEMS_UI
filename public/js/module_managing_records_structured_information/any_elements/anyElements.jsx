import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    Collapse,
    Chip,
    Select,
    Tooltip,
    TextField, 
    Typography,
    FormControl,
    Grid,
    Input,
    InputLabel,
    NativeSelect,
    MenuItem,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { grey, green, red } from "@material-ui/core/colors";
//import lodash from "lodash";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";
import dictionaryLists from "../../common_helpers/dictionaryLists.js";
import listExtendedObject from "../../common_helpers/listExtendedObject";

const useStyles = makeStyles((theme) => ({
    formControl: {
        //margin: theme.spacing(1),
        minWidth: 300,
        maxWidth: 1500,
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    customPaper: {
        width: "100%",
        color: theme.palette.getContrastText(grey[50]),
        backgroundColor: grey[50],
        margin: theme.spacing(1),
    },
}));

function getStyles(name, personName, theme) {
    return {
        fontWeight: theme.typography.fontWeightMedium
        //personName.indexOf(name) === -1? 
        //    theme.typography.fontWeightRegular: 
        //    theme.typography.fontWeightMedium,
    };
}

/**
 * 
 * @param {*} props
 *  variant - "standard", "filled" and "outlined"  
 * @returns 
 */
export function MainTextField(props) {
    let { 
        uniqName, 
        variant, 
        label, 
        value, 
        fullWidth, 
        onChange 
    } = props;

    return <TextField 
        id={`${variant}_basic_${uniqName}`} 
        label={label} 
        variant={variant} 
        onChange={onChange} 
        //defaultValue={value}
        value={value}
        fullWidth={fullWidth} />;
}

MainTextField.propTypes = {
    uniqName: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

/**
 * Формирует список из свойства object_refs, а также элементы его управления
 * @param {*} props 
 * @returns 
 */
export function CreateListObjectRefs(props){
    let { 
        objectRefs,
        handlerDeleteObjectRef, 
        handlerShowObjectRefSTIXObject,
        handlerChangeCurrentSTIXObject 
    } = props;

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={12}><span className="text-muted"> 2.22 Идентификаторы объектов связанных с данным Отчётом</span></Col>
        </Row>
        <Row>
            <Col md={12}>
                {objectRefs && (objectRefs.length === 0)? 
                    <Typography variant="caption">
                        <span  style={{ color: red[800] }}>
                            * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                        </span>
                    </Typography>:
                    objectRefs.map((item, key) => {
                        let type = item.split("--");
                        let objectElem = helpers.getLinkImageSTIXObject(type[0]);
                    
                        if(typeof objectElem === "undefined" ){
                            return "";
                        }

                        return (<Row key={`key_object_ref_${key}`}>
                            <Col md={12}>
                                <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                                    <Button onClick={handlerShowObjectRefSTIXObject.bind(null, item)}>
                                        <img 
                                            key={`key_object_ref_type_${key}`} 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="35" 
                                            height="35" />
                                                &nbsp;{item}&nbsp;
                                    </Button>
                                </Tooltip>

                                <IconButton aria-label="delete" onClick={handlerDeleteObjectRef.bind(null, key)}>
                                    <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                                </IconButton>
                            </Col>
                        </Row>);
                    })}
            </Col>
        </Row>
        <Row>
            <Col md={12} className="text-end">
                <Button
                    size="small"
                    startIcon={<AddIcon style={{ color: green[500] }} />}
                    onClick={handlerChangeCurrentSTIXObject}>
                        прикрепить дополнительный объект
                </Button>
            </Col>
        </Row>
    </React.Fragment>);
}

CreateListObjectRefs.propTypes = {
    objectRefs: PropTypes.array.isRequired, 
    handlerDeleteObjectRef: PropTypes.func.isRequired, 
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
    handlerChangeCurrentSTIXObject: PropTypes.func.isRequired, 
};

function CreateListObjectRefsReportGetListId(props){
    let {
        list,
        depth,
        parentId,
        listActivatedObjectNumbers,
        handleClick,
        handlerDeleteObjectRef,
        handlerShowObjectRefSTIXObject,
    } = props;

    let getListId = (list, parentId, depth) => {
        return list.map((item, key) => {
            let type = item.currentId.split("--");
            let objectElem = helpers.getLinkImageSTIXObject(type[0]);

            if(typeof objectElem === "undefined"){
                return "";
            }

            let elemIsExist = listExtendedObject.find((item) => item.name === type[0]);
            let isExist = listExtendedObject.filter((item) => item.name === type[0]);
            let open = listActivatedObjectNumbers[depth] && (listActivatedObjectNumbers[depth] === key);

            return (<React.Fragment key={`rf_${key}`}>
                <ListItem 
                    button 
                    key={`key_list_item_button_ref_${key}`} 
                    onClick={() => {
                        if(!elemIsExist){
                            return;
                        }

                        handleClick.call(null, item.currentId, key, isExist.length > 0? item.currentId: "", depth);
                    }}
                >
                    <Button onClick={handlerShowObjectRefSTIXObject.bind(null, item.currentId)}>
                        <img 
                            key={`key_object_ref_type_${key}`} 
                            src={`/images/stix_object/${objectElem.link}`} 
                            width="35" 
                            height="35" />&nbsp;
                        <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                            <ListItemText primary={item.currentId}/>
                        </Tooltip>
                    </Button>
                    <IconButton aria-label="delete" onClick={handlerDeleteObjectRef.bind(null, parentId, item.currentId, depth, key)}>
                        <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                    </IconButton>
                    {((item.childId.length > 0) || ((isExist.length > 0)))?
                        (listActivatedObjectNumbers[depth] && (listActivatedObjectNumbers[depth] === key)? 
                            <ExpandLess />: 
                            <ExpandMore />):
                        ""}
                </ListItem>
                {item.childId.length > 0 && (listActivatedObjectNumbers[depth] && (listActivatedObjectNumbers[depth] === key))?
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button >
                                <ListItemText primary={getListId(item.childId, item.currentId, depth+1)} />
                            </ListItem>
                        </List>
                    </Collapse>:
                    ""}
            </React.Fragment>);
        });
    };

    return getListId(list, parentId, depth);
}

CreateListObjectRefsReportGetListId.propTypes = {
    list: PropTypes.array.isRequired,
    depth: PropTypes.number.isRequired,
    parentId: PropTypes.string.isRequired,
    listActivatedObjectNumbers: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired,
    handlerDeleteObjectRef: PropTypes.func.isRequired,
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
};

export function CreateListThreatActorSophistication(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerSophistication, 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["threat-actor-sophistication-ov"].content.length; i++){
            if(elem === dictionaryLists["threat-actor-sophistication-ov"].content[i].name){
                return dictionaryLists["threat-actor-sophistication-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.sophistication);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["threat-actor-sophistication-ov"] && <React.Fragment>
        <TextField
            id={"select-threat-actor-sophistication-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"перечень навыков, специальных знаний, специальной подготовки или опыта, которыми должен обладать субъект угрозы, чтобы осуществить атаку"}
            value={campaignPatterElement.sophistication? campaignPatterElement.sophistication: "" }
            onChange={(e) => {
                handlerSophistication.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="threat-actor-sophistication-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["threat-actor-sophistication-ov"].content.map((item, key) => {
                return (<MenuItem key={`threat-actor-sophistication-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListThreatActorSophistication.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerSophistication: PropTypes.func.isRequired,
};

export function CreateListCapabilities(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerCapabilities, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["malware-capabilities-ov"].content.length; i++){
            if(value === dictionaryLists["malware-capabilities-ov"].content[i].name){
                return dictionaryLists["malware-capabilities-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["malware-capabilities-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>        
        <InputLabel id="malware-capabilities-mutiple-chip-id">
            перечень общих возможностей, которые могут быть продемонстрированы экземпляром или семейством вредоносных программ
        </InputLabel>
        <Select
            labelId="malware-capabilities-mutiple-chip-label"
            id="malware-capabilities-mutiple-chip-id"
            multiple
            value={campaignPatterElement.capabilities? campaignPatterElement.capabilities: []}
            onChange={(e) => handlerCapabilities.call(null, e)}
            input={<Input id="malware-capabilities-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["malware-capabilities-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`malware-capabilities-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.capabilities, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListCapabilities.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerCapabilities: PropTypes.func.isRequired,
};

export function CreateListMalwareType(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerMalware, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["malware-type-ov"].content.length; i++){
            if(value === dictionaryLists["malware-type-ov"].content[i].name){
                return dictionaryLists["malware-type-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["malware-type-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>        
        <InputLabel id="malware-type-mutiple-chip-id">
            перечень вредоносного програмного обеспечения
        </InputLabel>
        <Select
            labelId="malware-type-mutiple-chip-label"
            id="malware-type-mutiple-chip-id"
            multiple
            value={campaignPatterElement.malware_types? campaignPatterElement.malware_types: []}
            onChange={(e) => handlerMalware.call(null, e)}
            input={<Input id="malware-type-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["malware-type-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`malware-type-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.malware_types, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListMalwareType.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerMalware: PropTypes.func.isRequired,
};

export function CreateListImplementationLanguages(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerImplementationLanguages, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["implementation-language-ov"].content.length; i++){
            if(value === dictionaryLists["implementation-language-ov"].content[i].name){
                return dictionaryLists["implementation-language-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["implementation-language-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>        
        <InputLabel id="implementation-language-mutiple-chip-id">
            перечень языков программирования, используемых для реализации вредоносного програмного обеспечения или семейства вредоносных программ
        </InputLabel>
        <Select
            labelId="implementation-language-mutiple-chip-label"
            id="implementation-language-mutiple-chip-id"
            multiple
            value={campaignPatterElement.implementation_languages? campaignPatterElement.implementation_languages: []}
            onChange={(e) => handlerImplementationLanguages.call(null, e)}
            input={<Input id="implementation-language-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["implementation-language-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`implementation-language-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.implementation_languages, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListImplementationLanguages.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerImplementationLanguages: PropTypes.func.isRequired,
};

export function CreateListArchitectureExecutionEnvs(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerArchitectureExecutionEnvs, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["processor-architecture-ov"].content.length; i++){
            if(value === dictionaryLists["processor-architecture-ov"].content[i].name){
                return dictionaryLists["processor-architecture-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["processor-architecture-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>        
        <InputLabel id="processor-architecture-mutiple-chip-id">
            список содержащий распространенные архитектуры процессоров
        </InputLabel>
        <Select
            labelId="processor-architecture-mutiple-chip-label"
            id="processor-architecture-mutiple-chip-id"
            multiple
            value={campaignPatterElement.architecture_execution_envs? campaignPatterElement.architecture_execution_envs: []}
            onChange={(e) => handlerArchitectureExecutionEnvs.call(null, e)}
            input={<Input id="processor-architecture-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["processor-architecture-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`processor-architecture-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.architecture_execution_envs, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListArchitectureExecutionEnvs.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerArchitectureExecutionEnvs: PropTypes.func.isRequired,
};

export function CreateListThreatActorResourceLevel(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerResourceLevel, 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["attack-resource-level-ov"].content.length; i++){
            if(elem === dictionaryLists["attack-resource-level-ov"].content[i].name){
                return dictionaryLists["attack-resource-level-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.resource_level);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["attack-resource-level-ov"] && <React.Fragment>
        <TextField
            id={"select-attack-resource-level-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"уровень ресурсов атаки"}
            value={campaignPatterElement.resource_level? campaignPatterElement.resource_level: "" }
            onChange={(e) => {
                handlerResourceLevel.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="attack-resource-level-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["attack-resource-level-ov"].content.map((item, key) => {
                return (<MenuItem key={`attack-resource-level-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListThreatActorResourceLevel.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerResourceLevel: PropTypes.func.isRequired,
};

export function CreateListIdentityClass(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerIdentityClass, 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["identity-class-ov"].content.length; i++){
            if(elem === dictionaryLists["identity-class-ov"].content[i].name){
                return dictionaryLists["identity-class-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.identity_class);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["identity-class-ov"] && <React.Fragment>
        <TextField
            id={"select-search-identity-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"тип физического лица или организации"}
            value={campaignPatterElement.identity_class? campaignPatterElement.identity_class: "" }
            onChange={(e) => {
                handlerIdentityClass.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="identity-class-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["identity-class-ov"].content.map((item, key) => {
                return (<MenuItem key={`identity-class-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListIdentityClass.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerIdentityClass: PropTypes.func.isRequired,
};


export function CreateListHashes(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerHashes, 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["hash-algorithm-ov"].content.length; i++){
            if(elem === dictionaryLists["hash-algorithm-ov"].content[i].name){
                return dictionaryLists["hash-algorithm-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.hashes);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["hash-algorithm-ov"] && <React.Fragment>
        <TextField
            id={"hash-algorithm-identity-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"словарь хешей для URL или PayloadBin"}
            value={campaignPatterElement.hashes? campaignPatterElement.hashes: "" }
            onChange={(e) => {
                handlerHashes.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="hash-algorithm-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["hash-algorithm-ov"].content.map((item, key) => {
                return (<MenuItem key={`hash-algorithm-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListHashes.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerHashes: PropTypes.func.isRequired,
};

export function CreateHashes(props){
    let { 
        isDisabled, 
        handlerAddHashe, 
    } = props;

    let [ valueHashAlgorithm, setValueHashAlgorithm ] = useState("");
    let [ valueHash, setValueHash ] = useState("");
    let [ isDisabledButton, setIsDisabledButton ] = useState(true);

    const handlerHashAlgorithm = (e) => {
            if(e.target.value !== "" && valueHash !== ""){
                setIsDisabledButton(false);
            } else {
                setIsDisabledButton(true);
            }

            setValueHashAlgorithm(e.target.value); 
        },
        handlerHash = (e) => {
            if(e.target.value !== "" && valueHashAlgorithm !== ""){
                setIsDisabledButton(false);
            } else {
                setIsDisabledButton(true);
            }
        
            setValueHash(e.target.value);
        };

    return (<Grid container direction="row" spacing={1}>
        <Grid item container md={5}>
            {dictionaryLists["hash-algorithm-ov"] && <TextField
                id={"hash-algorithm-identity-class"}
                select
                disabled={isDisabled}
                fullWidth
                label={"словарь хешей для URL или PayloadBin"}
                value={valueHashAlgorithm}
                onChange={handlerHashAlgorithm} >
                <MenuItem key="hash-algorithm-item-value-empty" value="">пустое значение</MenuItem>
                {dictionaryLists["hash-algorithm-ov"].content.map((item, key) => {
                    return (<MenuItem key={`hash-algorithm-item-${key}`} value={item.name}>
                        {item.summary}
                    </MenuItem>);
                })}
            </TextField>}
        </Grid>
        <Grid item container md={5}>
            <TextField
                id="input_new_name_phases"
                fullWidth
                disabled={isDisabled}
                label="хеш-значение"
                value={valueHash}
                onChange={handlerHash} />
        </Grid>
        <Grid item container md={2} justifyContent="center" className="mt-2">
            <Button 
                onClick={() => {
                    if(valueHashAlgorithm === "" || valueHash === ""){
                        return;
                    }
                
                    handlerAddHashe.call(null, { [valueHashAlgorithm]: valueHash });

                    setValueHash("");
                    setValueHashAlgorithm("");
                    setIsDisabledButton(true);
                }} disabled={isDisabledButton}>
                добавить цепочку
            </Button>
        </Grid>
    </Grid>);
}

CreateHashes.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    handlerAddHashe: PropTypes.func.isRequired,
};

export function CreateHashesList(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerDeleteHashe,
    } = props;

    if(!campaignPatterElement.hashes){
        return "";
    }

    let listHashes = [];
    for(let k in campaignPatterElement.hashes){
        listHashes.push({ [k]: campaignPatterElement.hashes[k] });
    }

    return (<Grid container direction="row" className="mt-3">
        <Grid item container md={12} justifyContent="flex-start">
            <ol>
                {listHashes.map((item, num) => {
                    let key, value;
                    for(let k in item){
                        key = k;
                        value = item[k];
                    }

                    return (<li key={`key_item_hashe_${num}`}>
                        <span className="text-muted">алгоритм:</span> {key}, <span className="text-muted">хеш:</span> {value}&nbsp;
                        <IconButton aria-label="delete-hashe" onClick={handlerDeleteHashe.bind(null, key)}>
                            {isDisabled? "": <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />}
                        </IconButton>
                    </li>);
                })}
            </ol>
        </Grid>
    </Grid>);
}

CreateHashesList.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerDeleteHashe: PropTypes.func.isRequired,
};

export function CreateListEncryptionAlgorithm(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerEncryptionAlgorithm, 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["encryption-algorithm-enum"].content.length; i++){
            if(elem === dictionaryLists["encryption-algorithm-enum"].content[i].name){
                return dictionaryLists["encryption-algorithm-enum"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.encryption_algorithm);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["encryption-algorithm-enum"] && <React.Fragment>
        <TextField
            id={"hencryption-algorithm-identity-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"тип алгоритма шифрования для бинарных данных"}
            value={campaignPatterElement.encryption_algorithm? campaignPatterElement.encryption_algorithm: "" }
            onChange={(e) => {
                handlerEncryptionAlgorithm.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="encryption-algorithm-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["encryption-algorithm-enum"].content.map((item, key) => {
                return (<MenuItem key={`encryption-algorithm-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListEncryptionAlgorithm.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerEncryptionAlgorithm: PropTypes.func.isRequired,
};

export function CreateListSectors(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        headerSectors, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["industry-sector-ov"].content.length; i++){
            if(value === dictionaryLists["industry-sector-ov"].content[i].name){
                return dictionaryLists["industry-sector-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["industry-sector-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>
        <InputLabel id="industry-sector-mutiple-chip-lable">тип промышленного сектора</InputLabel>
        <Select
            labelId="industry-sector-mutiple-chip"
            id="industry-sector-mutiple-chip-id"
            multiple
            value={campaignPatterElement.sectors? campaignPatterElement.sectors: []}
            onChange={(e) => headerSectors.call(null, e)}
            input={<Input id="industry-sector-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["industry-sector-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`industry-sector-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.sectors, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListSectors.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    headerSectors: PropTypes.func.isRequired,
};

export function CreateListThreatActorPrimaryMotivation(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerPrimaryMotivation, 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["attack-motivation-ov"].content.length; i++){
            if(elem === dictionaryLists["attack-motivation-ov"].content[i].name){
                return dictionaryLists["attack-motivation-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.primary_motivation);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["attack-motivation-ov"] && <React.Fragment>
        <TextField
            id={"select-primary-attack-motivation-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"перечень причин, мотиваций или целей стоящих за этим субъектом угрозы"}
            value={campaignPatterElement.primary_motivation? campaignPatterElement.primary_motivation: "" }
            onChange={(e) => {
                handlerPrimaryMotivation.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="primary-attack-motivation-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["attack-motivation-ov"].content.map((item, key) => {
                return (<MenuItem key={`primary-attack-motivation-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListThreatActorPrimaryMotivation.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerPrimaryMotivation: PropTypes.func.isRequired,
};

export function CreateThreatActorSecondaryMotivations(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerSecondaryMotivation, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["attack-motivation-ov"].content.length; i++){
            if(value === dictionaryLists["attack-motivation-ov"].content[i].name){
                return dictionaryLists["attack-motivation-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["attack-motivation-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>
        <InputLabel id="secondary-attack-motivation-lable">перечень возможных вторичных причин, мотиваций или целей стоящих за этим субъектом угрозы</InputLabel>
        <Select
            labelId="secondary-attack-motivation-chip"
            id="secondary-attack-motivation-chip-id"
            multiple
            value={campaignPatterElement.secondary_motivations? campaignPatterElement.secondary_motivations: []}
            onChange={(e) => handlerSecondaryMotivation.call(null, e)}
            input={<Input id="secondary-attack-motivation-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["attack-motivation-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`secondary-attack-motivation-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.secondary_motivations, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateThreatActorSecondaryMotivations.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerSecondaryMotivation: PropTypes.func.isRequired,
};

export function CreateListThreatActorRole(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        headerThreatActorRole, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["threat-actor-role-ov"].content.length; i++){
            if(value === dictionaryLists["threat-actor-role-ov"].content[i].name){
                return dictionaryLists["threat-actor-role-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["threat-actor-role-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>
        <InputLabel id="threat-actor-role-mutiple-chip-lable">роль субъектов угроз</InputLabel>
        <Select
            labelId="threat-actor-role-mutiple-chip"
            id="threat-actor-role-mutiple-chip-id"
            multiple
            value={campaignPatterElement.roles? campaignPatterElement.roles: []}
            onChange={(e) => headerThreatActorRole.call(null, e)}
            input={<Input id="threat-actor-role-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["threat-actor-role-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`threat-actor-role-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.roles, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListThreatActorRole.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    headerThreatActorRole: PropTypes.func.isRequired,
};

export function CreateThreatActorPersonalMotivations(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerPersonalMotivations, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["attack-motivation-ov"].content.length; i++){
            if(value === dictionaryLists["attack-motivation-ov"].content[i].name){
                return dictionaryLists["attack-motivation-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["attack-motivation-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>
        <InputLabel id="personal-attack-motivation-lable">перечень возможных персональных причин, мотиваций или целей стоящих за этим субъектом угрозы</InputLabel>
        <Select
            labelId="personal-attack-motivation-chip"
            id="personal-attack-motivation-chip-id"
            multiple
            value={campaignPatterElement.personal_motivations? campaignPatterElement.personal_motivations: []}
            onChange={(e) => handlerPersonalMotivations.call(null, e)}
            input={<Input id="personal-attack-motivation-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["attack-motivation-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`personal-attack-motivation-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.personal_motivations, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateThreatActorPersonalMotivations.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerPersonalMotivations: PropTypes.func.isRequired,
};

export function CreateListToolTypes(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerToolTypes, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["tool-type-ov"].content.length; i++){
            if(value === dictionaryLists["tool-type-ov"].content[i].name){
                return dictionaryLists["tool-type-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["tool-type-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>
        <InputLabel id="tool-type-mutiple-chip-lable">типы инструментов</InputLabel>
        <Select
            labelId="tool-type-mutiple-chip"
            id="tool-type-mutiple-chip-id"
            multiple
            value={campaignPatterElement.tool_types? campaignPatterElement.tool_types: []}
            onChange={(e) => handlerToolTypes.call(null, e)}
            input={<Input id="tool-type-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["tool-type-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`tool-type-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.tool_types, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListToolTypes.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerToolTypes: PropTypes.func.isRequired,
};

export function CreateListThreatActorType(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        headerThreatActorType, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["threat-actor-type-ov"].content.length; i++){
            if(value === dictionaryLists["threat-actor-type-ov"].content[i].name){
                return dictionaryLists["threat-actor-type-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["threat-actor-type-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>
        <InputLabel id="threat-actor-type-mutiple-chip-lable">тип субъектов угроз</InputLabel>
        <Select
            labelId="threat-actor-type-mutiple-chip"
            id="threat-actor-type-mutiple-chip-id"
            multiple
            value={campaignPatterElement.threat_actor_types? campaignPatterElement.threat_actor_types: []}
            onChange={(e) => headerThreatActorType.call(null, e)}
            input={<Input id="threat-actor-type-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["threat-actor-type-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`threat-actor-type-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.threat_actor_types, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListThreatActorType.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    headerThreatActorType: PropTypes.func.isRequired,
};

export function CreateListInfrastructureTypes(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerInfrastructureTypes, 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["infrastructure-type-ov"].content.length; i++){
            if(value === dictionaryLists["infrastructure-type-ov"].content[i].name){
                return dictionaryLists["infrastructure-type-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["infrastructure-type-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>
        <InputLabel id="infrastructure-mutiple-chip-label">тип инфраструктуры</InputLabel>
        <Select
            labelId="infrastructure-mutiple-chip"
            id="infrastructure-mutiple-chip-id"
            multiple
            value={campaignPatterElement.infrastructure_types? campaignPatterElement.infrastructure_types: []}
            onChange={(e) => handlerInfrastructureTypes.call(null, e)}
            input={<Input id="infrastructure-multiple-chip" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["infrastructure-type-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`infrastructure-types-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.infrastructure_types, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListInfrastructureTypes.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerInfrastructureTypes: PropTypes.func.isRequired,
};

export function CreateListResourceLevelAttack(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerResourceLevelAttack 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["attack-resource-level-ov"].content.length; i++){
            if(elem === dictionaryLists["attack-resource-level-ov"].content[i].name){
                return dictionaryLists["attack-resource-level-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.resource_level);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["attack-resource-level-ov"] && <React.Fragment>
        <TextField
            id={"select-search-attack-resource-level-id"}
            select
            disabled={isDisabled}
            fullWidth
            label={"уровень ресурсов атаки"}
            value={campaignPatterElement.resource_level? campaignPatterElement.resource_level: "" }
            onChange={(e) => {
                handlerResourceLevelAttack.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="attack-resource-level-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["attack-resource-level-ov"].content.map((item, key) => {
                return (<MenuItem key={`attack-resource-level-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListResourceLevelAttack.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerResourceLevelAttack: PropTypes.func.isRequired,
};

export function CreateListPrimaryMotivation(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerPrimaryMotivation 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["attack-motivation-ov"].content.length; i++){
            if(elem === dictionaryLists["attack-motivation-ov"].content[i].name){
                return dictionaryLists["attack-motivation-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.primary_motivation);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["attack-motivation-ov"] && <React.Fragment>
        <TextField
            id={"select-search-primary-motivation-id"}
            select
            disabled={isDisabled}
            fullWidth
            label={"основной перечень причин, мотиваций или целей определяющий данный набор вторжения"}
            value={campaignPatterElement.primary_motivation? campaignPatterElement.primary_motivation: "" }
            onChange={(e) => {
                handlerPrimaryMotivation.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="primary-motivation-level-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["attack-motivation-ov"].content.map((item, key) => {
                return (<MenuItem key={`primary-motivation-level-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListPrimaryMotivation.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerPrimaryMotivation: PropTypes.func.isRequired,
};

export function CreateListSecondaryMotivations(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerSecondaryMotivations 
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const getSummary = (value) => {
        for(let i = 0; i < dictionaryLists["attack-motivation-ov"].content.length; i++){
            if(value === dictionaryLists["attack-motivation-ov"].content[i].name){
                return dictionaryLists["attack-motivation-ov"].content[i].summary;
            }
        }

        return value;
    };

    return (dictionaryLists["attack-motivation-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>        
        <InputLabel id="secondary-motivations-mutiple-chip-id">
            вторичный список причин, мотиваций или целей определяющий данный набор вторжения
        </InputLabel>
        <Select
            labelId="secondary-motivations-mutiple-chip-label"
            id="secondary-motivations-mutiple-chip-id"
            multiple
            value={campaignPatterElement.secondary_motivations? campaignPatterElement.secondary_motivations: []}
            onChange={(e) => handlerSecondaryMotivations.call(null, e)}
            input={<Input id="secondary-motivations-multiple-chip-input" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={getSummary(value)} className={classes.chip} />
                    ))}
                </div>
            )}
        >
            {dictionaryLists["attack-motivation-ov"].content.map((item, key) => (
                <MenuItem 
                    key={`secondary-motivations-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.secondary_motivations, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
}

CreateListSecondaryMotivations.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerSecondaryMotivations: PropTypes.func.isRequired,
};

/**
 * Формирование набора элементов цепочки фактов, приведших к какому либо урону
 * @param {*} props 
 * @returns 
 */
export function CreateKillChainPhases(props){
    let { isDisabled, handlerAddKillChainPhases } = props;

    let [ invalidNameChain, setInvalidNameChain ] = useState(true);
    let [ invalidNamePhases, setInvalidNamePhases ] = useState(true);
    let [ valueNameChain, setValueNameChain ] = useState("");
    let [ valueNamePhases, setValueNamePhases ] = useState("");
    let [ isDisabledButtonNewKillChain, setIsDisabledButtonNewKillChain ] = useState(true);

    const handlerNameChain = (obj) => {
            setValueNameChain(obj.target.value);

            if(!new RegExp("^[a-zA-Z0-9_-]{3,}$").test(obj.target.value)){
                setInvalidNameChain(true);
                setIsDisabledButtonNewKillChain(true);

                return;
            }

            setInvalidNameChain(false);

            if(!invalidNamePhases){
                setIsDisabledButtonNewKillChain(false);
            }
        },
        handlerNamePhases = (obj) => {
            setValueNamePhases(obj.target.value);

            if(!new RegExp("^[a-zA-Z0-9_-]{3,}$").test(obj.target.value)){
                setInvalidNamePhases(true);
                setIsDisabledButtonNewKillChain(true); 

                return;
            }

            setInvalidNamePhases(false);

            if(!invalidNameChain){
                setIsDisabledButtonNewKillChain(false);
            }
        };

    return (<Grid container direction="row" spacing={1}>
        <Grid item container md={5}>
            <TextField
                id="input_new_name_kill_chain"
                fullWidth
                disabled={isDisabled}
                error={invalidNameChain}
                label="имя цепочки"
                value={valueNameChain}
                onChange={handlerNameChain} />
        </Grid>
        <Grid item container md={5}>
            <TextField
                id="input_new_name_phases"
                fullWidth
                disabled={isDisabled}
                error={invalidNamePhases}
                label="наименование фазы"
                value={valueNamePhases}
                onChange={handlerNamePhases} />
        </Grid>
        <Grid item container md={2} justifyContent="center">
            <Button onClick={() => {
                if(invalidNameChain || invalidNamePhases){
                    return;
                }

                handlerAddKillChainPhases.call(null, {
                    kill_chain_name: valueNameChain,
                    phase_name: valueNamePhases,
                });

                setInvalidNameChain(true);
                setInvalidNamePhases(true);
                setValueNameChain("");
                setValueNamePhases("");
                setIsDisabledButtonNewKillChain(true);
            }} disabled={isDisabledButtonNewKillChain}>добавить цепочку</Button>
        </Grid>
    </Grid>);
}

CreateKillChainPhases.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    handlerAddKillChainPhases: PropTypes.func.isRequired,
};

/**
 * Формирование списка элементов цепочки фактов, приведших к какому либо урону
 * @param {*} props 
 * @returns 
 */
export function CreateKillChainPhasesList(props){
    let { 
        isDisabled,
        listKillChainPhases, 
        handlerDeleteItem 
    } = props;

    if(listKillChainPhases.length === 0){
        return "";
    }

    return (<Grid container direction="row" className="mt-3">
        <Grid item container md={12} justifyContent="flex-start">
            <ol>
                {listKillChainPhases.map((item, num) => {
                    return (<li key={`key_item_kill_phases_${num}`}>
                        <span className="text-muted">наименование:</span> {item.kill_chain_name}, <span className="text-muted">фаза:</span> {item.phase_name}&nbsp;
                        <IconButton aria-label="delete-hash" onClick={handlerDeleteItem.bind(null, num)}>
                            {isDisabled? "": <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />}
                        </IconButton>
                    </li>);
                })}
            </ol>
        </Grid>
    </Grid>);
}

CreateKillChainPhasesList.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    listKillChainPhases: PropTypes.array.isRequired,
    handlerDeleteItem: PropTypes.func.isRequired,
};



/**
 * Формирование списка элементов поля заголовка 'Received'
 * @param {*} props 
 * @returns 
 */
export function CreateBodyMultipartList(props){
    let { 
        isDisabled,
        listBodyMultipart, 
        handlerDeleteItem 
    } = props;

    const classes = useStyles();

    console.log("func 'CreateBodyMultipartList', listBodyMultipart = ", listBodyMultipart);

    if(listBodyMultipart.length === 0){
        return "";
    }
    
    return (<React.Fragment>
        <Grid container direction="row" className="mt-3">
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Список MIME-частей, которые составляют {"\"тело\""} email сообщения:</span>
            </Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item container md={12} justifyContent="flex-start">
                {listBodyMultipart.map((item, key) => {
                    let icon = helpers.getLinkImageSTIXObject(item.body_raw_ref.split("--")[0]);

                    return (<Card className={classes.customPaper} key={`key_body_multipart_${key}_fragment`}>
                        <CardContent>
                            {((typeof item.content_type === "undefined") || (item.content_type === null)) ? 
                                "": 
                                <Grid container direction="row" key={`key_body_multipart_content_type_${key}`}>
                                    <Grid item md={12} className="pl-4 pr-4">
                                        <Typography variant="body2" component="p">
                                            <span className="text-muted">Содержимое поля <strong><i>Content-Type</i></strong></span>: {item.content_type}
                                        </Typography>
                                    </Grid>
                                </Grid>}

                            {((typeof item.content_disposition === "undefined") || (item.content_disposition === null)) ? 
                                "": 
                                <Grid container direction="row" key={`key_body_multipart_content_disposition_${key}`}>
                                    <Grid item md={12} className="pl-4 pr-4">
                                        <Typography variant="body2" component="p">
                                            <span className="text-muted">Содержимое поля <strong><i>Content-Disposition</i></strong></span>: {item.content_disposition}
                                        </Typography>
                                    </Grid>
                                </Grid>}

                            {((typeof item.body === "undefined") || (item.body === null)) ? 
                                "": 
                                <Grid container direction="row" key={`key_body_multipart_body_${key}`}>
                                    <Grid item md={12} className="pl-4 pr-4">
                                        <Typography variant="body2" component="p">
                                            <span className="text-muted">Содержимое части MIME</span>: {item.body}
                                        </Typography>
                                    </Grid>
                                </Grid>}

                            {((typeof item.body_raw_ref === "undefined") || (item.body_raw_ref === null) || (item.body_raw_ref === "")) ? 
                                "": 
                                <Grid container direction="row" key={`key_body_multipart_body_raw_ref_${key}`}>
                                    <Grid item md={12} className="pl-4 pr-4">
                                        <Typography variant="body2" component="p">
                                            <span className="text-muted">Ссылка на нетекстовые части MIME:</span>
                                            {<Button onClick={() => {}} disabled>
                                                {(typeof icon !== "undefined")?
                                                    <img 
                                                        src={`/images/stix_object/${icon.link}`} 
                                                        width="35"  
                                                        height="35" />: 
                                                    ""}
                                                &nbsp;{item.body_raw_ref}
                                            </Button>}
                                        </Typography>
                                    </Grid>
                                </Grid>}
                        </CardContent>
                    </Card>);
                })}
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateBodyMultipartList.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    listBodyMultipart: PropTypes.array.isRequired,
    handlerDeleteItem: PropTypes.func.isRequired,
};

/**
 * Формирование списка элементов поля заголовка 'Received'
 * @param {*} props 
 * @returns 
 */
export function CreateReceivedLines(props){
    let { isDisabled, handlerAddReceivedLines } = props;

    let [ valueReceivedLines, setValueReceivedLines ] = useState("");
    let [ invalidReceivedLines, setInvalidReceivedLines ] = useState(true);
    let [ isDisabledButtonNewReceivedLines, setIsDisabledButtonNewReceivedLines ] = useState(true);

    const handlerReceivedLines = (obj) => {
        setValueReceivedLines(obj.target.value);

        if(obj.target.value.length === 0){
            setInvalidReceivedLines(true);
            setIsDisabledButtonNewReceivedLines(true);

            return;
        }

        setInvalidReceivedLines(false);
        setIsDisabledButtonNewReceivedLines(false);
    };

    return (<Grid container direction="row" spacing={1}>
        <Grid item container md={9}>
            <TextField
                id="input_new_name_kill_chain"
                fullWidth
                disabled={isDisabled}
                error={invalidReceivedLines}
                label="наименование элемента"
                value={valueReceivedLines}
                onChange={handlerReceivedLines} />
        </Grid>
        <Grid item container md={3} justifyContent="flex-end">
            <Button
                className="mt-2" 
                onClick={() => {
                    if(invalidReceivedLines){
                        return;
                    }

                    handlerAddReceivedLines(valueReceivedLines);

                    setInvalidReceivedLines(true);
                    setValueReceivedLines("");
                    setIsDisabledButtonNewReceivedLines(true);
                }} disabled={isDisabledButtonNewReceivedLines}>добавить элемент поля 'Received'</Button>
        </Grid>
    </Grid>);
}

CreateReceivedLines.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    handlerAddReceivedLines: PropTypes.func.isRequired,
};

/**
 * Формирование списка элементов поля заголовка 'Received'
 * @param {*} props 
 * @returns 
 */
export function CreateReceivedLinesList(props){
    let { 
        isDisabled,
        listReceivedLines, 
        handlerDeleteItem 
    } = props;

    if(listReceivedLines.length === 0){
        return "";
    }

    return (<Grid container direction="row" className="mt-3">
        <Grid item container md={12} justifyContent="flex-start">
            <ol>
                {listReceivedLines.map((item, num) => {
                    return (<li key={`key_item_received_lines_${num}`}>
                        {item}&nbsp;
                        <IconButton aria-label="delete-received_line" onClick={handlerDeleteItem.bind(null, num)}>
                            {isDisabled? "": <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />}
                        </IconButton>
                    </li>);
                })}
            </ol>
        </Grid>
    </Grid>);
}

CreateReceivedLinesList.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    listReceivedLines: PropTypes.array.isRequired,
    handlerDeleteItem: PropTypes.func.isRequired,
};

export function CreateListRegion(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerRegion 
    } = props;
    const classes = useStyles();

    return (dictionaryLists["region-ov"] && <FormControl fullWidth disabled={isDisabled} className={classes.formControl}>
        <InputLabel htmlFor="region-select">Регион</InputLabel>
        <NativeSelect
            value={campaignPatterElement.region}
            onChange={handlerRegion}
            name="name">
            {dictionaryLists["region-ov"].content.map((item, key) => {
                return (<optgroup label={item.summary} key={`region-menu-subheader-${key}`}>
                    {item.content && item.content.map((item, key) => {
                        return (<option value={item.name} key={`region-menu-item-${item.name}-${key}`}>
                            {item.summary}
                        </option>);
                    })}                        
                </optgroup>);
            })}
        </NativeSelect>
    </FormControl>);
}

CreateListRegion.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerRegion: PropTypes.func.isRequired,
};

export function CreateListContextGrouping(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerContext 
    } = props;

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["grouping-context-ov"].content.length; i++){
            if(elem === dictionaryLists["grouping-context-ov"].content[i].name){
                return dictionaryLists["grouping-context-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.context);
    let [ textMenuItem, setTextMenuItem ] = useState(text);
    let isError = campaignPatterElement.context === "";

    return (dictionaryLists["grouping-context-ov"] && <React.Fragment>
        <TextField
            id={"select-search-grouping-context-id"}
            select
            error={isError}
            disabled={isDisabled}
            fullWidth
            label={"контекст группировки"}
            value={campaignPatterElement.context? campaignPatterElement.context: "" }
            onChange={(e) => {
                handlerContext.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="grouping-context-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["grouping-context-ov"].content.map((item, key) => {
                return (<MenuItem key={`grouping-context-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
}

CreateListContextGrouping.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerContext: PropTypes.func.isRequired,
};
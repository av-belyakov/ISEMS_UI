import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
    Button,
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
import { green, red } from "@material-ui/core/colors";
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

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["malware-capabilities-ov"].content.length; i++){
            if(elem === dictionaryLists["malware-capabilities-ov"].content[i].name){
                return dictionaryLists["malware-capabilities-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.capabilities);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["malware-capabilities-ov"] && <React.Fragment>
        <TextField
            id={"select-malware-capabilities-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"перечень возможных идентификаторов используемых для обнаружения вредоносного програмного обеспечения или семейства программ"}
            value={campaignPatterElement.capabilities? campaignPatterElement.capabilities: "" }
            onChange={(e) => {
                handlerCapabilities.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="malware-capabilities-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["malware-capabilities-ov"].content.map((item, key) => {
                return (<MenuItem key={`malware-capabilities-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
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

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["malware-type-ov"].content.length; i++){
            if(elem === dictionaryLists["malware-type-ov"].content[i].name){
                return dictionaryLists["malware-type-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.malware_types);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["malware-type-ov"] && <React.Fragment>
        <TextField
            id={"select-malware-type-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"перечень вредоносного програмного обеспечения"}
            value={campaignPatterElement.malware_types? campaignPatterElement.malware_types: "" }
            onChange={(e) => {
                handlerMalware.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="malware-type-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["malware-type-ov"].content.map((item, key) => {
                return (<MenuItem key={`malware-type-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
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

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["implementation-language-ov"].content.length; i++){
            if(elem === dictionaryLists["implementation-language-ov"].content[i].name){
                return dictionaryLists["implementation-language-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.implementation_languages);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["implementation-language-ov"] && <React.Fragment>
        <TextField
            id={"select-implementation-language-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"перечень языков программирования, используемых для реализации вредоносного програмного обеспечения или семейства вредоносных программ"}
            value={campaignPatterElement.implementation_languages? campaignPatterElement.implementation_languages: "" }
            onChange={(e) => {
                handlerImplementationLanguages.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="implementation-language-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["implementation-language-ov"].content.map((item, key) => {
                return (<MenuItem key={`implementation-language-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
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

    const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["processor-architecture-ov"].content.length; i++){
            if(elem === dictionaryLists["processor-architecture-ov"].content[i].name){
                return dictionaryLists["processor-architecture-ov"].content[i].text;
            }
        }

        return "";
    };

    let text = getContentText(campaignPatterElement.architecture_execution_envs);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["processor-architecture-ov"] && <React.Fragment>
        <TextField
            id={"select-processor-architecture-class"}
            select
            disabled={isDisabled}
            fullWidth
            label={"перечень архитектур в которых может быть выполнено вредоносное програмное обеспечение или семейство программ"}
            value={campaignPatterElement.architecture_execution_envs? campaignPatterElement.architecture_execution_envs: "" }
            onChange={(e) => {
                handlerArchitectureExecutionEnvs.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="processor-architecture-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["processor-architecture-ov"].content.map((item, key) => {
                return (<MenuItem key={`processor-architecture-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);
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
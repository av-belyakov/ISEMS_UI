import React, { useState, useEffect } from "react";
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
    ListItemIcon,
    ListSubheader,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";
import dictionaryLists from "../../common_helpers/dictionaryLists.js";

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
 * Формирует список по решениям принятым по компьютерным угрозам
 * @param {*} props 
 * @returns 
 */
export function CreateListTypesDecisionsMadeComputerThreat(props){
    let { socketIo, defaultValue, handlerDecisionsMadeComputerThreat } = props;

    let [ currentDecisionsMadeComputerThreat, setCurrentDecisionsMadeComputerThreat ] = useState(defaultValue);
    let [ listTypesDecisionsMadeComputerThreat, setListTypesDecisionsMadeComputerThreat ] = useState({});
    let listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        setListTypesDecisionsMadeComputerThreat(data.information.additional_parameters.list);
    };

    useEffect(() => {
        socketIo.once("isems-mrsi response ui: list types decisions made computer threat", listener);
        socketIo.emit("isems-mrsi ui request: get list types decisions made computer threat", { arguments: {}});        
    }, []);

    return (<TextField
        id={"select-search-decisions_made_computer_threat"}
        select
        fullWidth
        label={"принятое решение"}
        value={currentDecisionsMadeComputerThreat}
        onChange={(obj) => {
            setCurrentDecisionsMadeComputerThreat(obj.target.value);
            handlerDecisionsMadeComputerThreat(obj.target.value);
        }} >
        <MenuItem key="key-decisions_made_computer_threat-value-empty" value="">пустое значение</MenuItem>
        {Object.keys(listTypesDecisionsMadeComputerThreat).map((item) => {
            return (<MenuItem key={listTypesDecisionsMadeComputerThreat[item].ID} value={item}>
                {listTypesDecisionsMadeComputerThreat[item].Description}
            </MenuItem>);
        })}
    </TextField>);
}

CreateListTypesDecisionsMadeComputerThreat.propTypes = {
    socketIo: PropTypes.object.isRequired,
    defaultValue: PropTypes.func.isRequired,
    handlerDecisionsMadeComputerThreat: PropTypes.func.isRequired,
};

/**
 * формирует список по типам компьютерных угроз
 * @param {*} props 
 * @returns 
 */
export function CreateListTypesComputerThreat(props){
    let { socketIo, defaultValue, handlerTypesComputerThreat } = props;

    let [ currentTypesComputerThreat, setCurrentTypesComputerThreat ] = useState(defaultValue);
    let [ listTypesComputerThreat, setListTypesComputerThreat ] = useState({});
    let listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        setListTypesComputerThreat(data.information.additional_parameters.list);
    };

    useEffect(() => {
        socketIo.once("isems-mrsi response ui: list types computer threat", listener);
        socketIo.emit("isems-mrsi ui request: get list types computer threat", { arguments: {}});
    }, []);

    return (<TextField
        id={"select-search-computer_threat_type"}
        select
        fullWidth
        label={"тип ком. угрозы"}
        value={currentTypesComputerThreat}
        onChange={(obj) => { 
            setCurrentTypesComputerThreat(obj.target.value);
            handlerTypesComputerThreat(obj.target.value);

        }} >
        <MenuItem key="key-computer_threat_type-value-empty" value="">пустое значение</MenuItem>
        {Object.keys(listTypesComputerThreat).map((item) => {
            return (<MenuItem key={listTypesComputerThreat[item].ID} value={item}>
                {listTypesComputerThreat[item].Description}
            </MenuItem>);
        })}
    </TextField>);
}

CreateListTypesComputerThreat.propTypes = {
    socketIo: PropTypes.object.isRequired,
    defaultValue: PropTypes.func.isRequired,
    handlerTypesComputerThreat: PropTypes.func.isRequired,
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

/**
 * Формирует список из свойства object_refs, а также элементы его управления
 * @param {*} props 
 * @returns 
 */
export function CreateListObjectRefsReport(props){
    let {
        socketIo,
        objectRefs,
        handlerDeleteObjectRef, 
        handlerShowObjectRefSTIXObject,
        handlerChangeCurrentSTIXObject 
    } = props;

    let listExtendedObject = [
        //SDO
        "grouping", //object_refs (any STIX object)
        "malware", //operating_system_refs (SCO software) and sample_refs (SCO file and artifact)
        "malware-analysis", //host_vm_ref (SCO software), 
        // operating_system_ref (SCO software),
        // installed_software_refs (SCO software),
        // sample_ref (SCO file, artifact and network traffic)
        "note", //object_refs (any STIX object)
        "observed-data", //object_refs (any SCO)
        "opinion", //object_refs (any STIX object)
        //SCO
        "domain-name", //resolves_to_refs (ipv4-addr, ipv6-addr, domain-name)
        "file", //contains_refs (any STIX object)
        "network-traffic", //src_ref or dst_ref (ipv4-addr, ipv6-addr, domain-name, mac-addr)
        // src_payload_ref or dst_payload_ref (SCO artifact)
        // "encapsulates_refs" or encapsulated_by_ref (network-traffic)
        "http-request-ext", //message_body_data_ref (SCO artifact)
        "process", //opened_connection_refs (SCO network-traffic)
        // creator_user_ref (SCO user-account), image_ref (SCO file), parent_ref (process)
        // child_refs (process)
    ];

    useEffect(() => {
        let listId = objectRefs.filter((item) => {
            let type = item.split("--");
        
            return listExtendedObject.find((item) => item === type[0]);
        });

        console.log("func 'CreateListObjectRefsReport', useEffect, listId: ", listId);

        socketIo.once("isems-mrsi response ui: send search request, get STIX object for list id", (data) => {
            console.log("isems-mrsi response ui: send search request, get STIX object for list id, receided data, ", data.information.additional_parameters.transmitted_data);
            /**
             * список объектов на которые ссылается объект Отчет получен, данные объекты имеют в своем составе свойства которые в свою
             * очередь ссылаются на другие объекты, теперь нужно сохранить эти объекты и выстроить выподающий список из ссылок
             * на другие объекты
             */
        });
        socketIo.emit("isems-mrsi ui request: send search request, get STIX object for list id", { arguments: listId});
    }, []);

    const [open, setOpen] = React.useState(false);
    const [ numElem, setNumElem ] = React.useState(0);

    const handleClick = (num) => {
        if((num !== numElem) && open){
            setNumElem(num);    

            return;
        }

        setNumElem(num);
        setOpen(!open);
    };

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с данным Отчётом</span></Col>
        </Row>
        <Row>
            <Col md={12}>
                {objectRefs && (objectRefs.length === 0)? 
                    <Typography variant="caption">
                        <span  style={{ color: red[800] }}>
                            * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                        </span>
                    </Typography>:
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        //subheader={}
                    >
                        {objectRefs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
                            let elemIsExist = listExtendedObject.find((item) => item === type[0]);
                    
                            if(typeof objectElem === "undefined"){
                                return "";
                            }

                            return (<React.Fragment key={`rf_${key}`}>
                                <ListItem 
                                    button 
                                    key={`key_list_item_button_ref_${key}`} 
                                    onClick={() => {
                                        if(!elemIsExist){
                                            return;
                                        }

                                        handleClick.call(null, key);
                                    }}
                                >
                                    <Button onClick={handlerShowObjectRefSTIXObject.bind(null, item)}>
                                        <img 
                                            key={`key_object_ref_type_${key}`} 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="35" 
                                            height="35" />&nbsp;
                                        <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                                            <ListItemText primary={item}/>
                                        </Tooltip>
                                    </Button>
                                    <IconButton aria-label="delete" onClick={handlerDeleteObjectRef.bind(null, key)}>
                                        <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                                    </IconButton>
                                    {elemIsExist?
                                        ((open && (numElem === key))? <ExpandLess />: <ExpandMore />):
                                        ""}
                                </ListItem>
                                {elemIsExist && open && (numElem === key)?
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            <ListItem button 
                                            //className={classes.nested}
                                            >
                                                <ListItemIcon>
                                
                                                </ListItemIcon>
                                                <ListItemText primary="Тут будет список STIX объектов на которые имеет ссылки данный объект
                                При этом в функцию CreateListObjectRefsReport надо пробросить socketIo
                                и выполнять дополнительный запрос к тем STIX объектам на которые ссылается
                                объекты из списка. Кроме того нужно все же постараться сделать что бы галочки
                                при открытии и закрытии списка срабатывали только для выбранного списка (сейчас 
                                они срабатывают для всех, что не красиво). Что ьы можно было одновременно открыть
                                несколько элементов списка " />
                                            </ListItem>
                                        </List>
                                    </Collapse>:
                                    ""}
                            </React.Fragment>);
                        })}
                    </List>
                }
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

CreateListObjectRefsReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    objectRefs: PropTypes.array.isRequired, 
    handlerDeleteObjectRef: PropTypes.func.isRequired, 
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
    handlerChangeCurrentSTIXObject: PropTypes.func.isRequired, 
};

export function CreateListIdentityClass(props){
    let { campaignPatterElement, handlerIdentityClass } = props;

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
    campaignPatterElement: PropTypes.object.isRequired,
    handlerIdentityClass: PropTypes.func.isRequired,
};

export function CreateListSectors(props){
    let { campaignPatterElement, headerSectors } = props;

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

    return (dictionaryLists["industry-sector-ov"] && <FormControl fullWidth className={classes.formControl}>
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
    campaignPatterElement: PropTypes.object.isRequired, 
    headerSectors: PropTypes.func.isRequired,
};

export function CreateListInfrastructureTypes(props){
    let { campaignPatterElement, handlerInfrastructureTypes } = props;

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

    return (dictionaryLists["infrastructure-type-ov"] && <FormControl fullWidth className={classes.formControl}>
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
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerInfrastructureTypes: PropTypes.func.isRequired,
};

export function CreateListResourceLevelAttack(props){
    let { campaignPatterElement, handlerResourceLevelAttack } = props;

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
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerResourceLevelAttack: PropTypes.func.isRequired,
};

export function CreateListPrimaryMotivation(props){
    let { campaignPatterElement, handlerPrimaryMotivation } = props;

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
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerPrimaryMotivation: PropTypes.func.isRequired,
};

export function CreateListSecondaryMotivations(props){
    let { campaignPatterElement, handlerSecondaryMotivations } = props;

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

    return (dictionaryLists["attack-motivation-ov"] && <FormControl fullWidth className={classes.formControl}>
        <InputLabel id="secondary-motivations-mutiple-chip-id">тип инфраструктуры</InputLabel>
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
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerSecondaryMotivations: PropTypes.func.isRequired,
};

/**
 * Формирование набора элементов цепочки фактов, приведших к какому либо урону
 * @param {*} props 
 * @returns 
 */
export function CreateKillChainPhases(props){
    let { handlerAddKillChainPhases } = props;

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
                error={invalidNameChain}
                label="имя цепочки"
                value={valueNameChain}
                onChange={handlerNameChain} />
        </Grid>
        <Grid item container md={5}>
            <TextField
                id="input_new_name_phases"
                fullWidth
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
    handlerAddKillChainPhases: PropTypes.func.isRequired,
};

/**
 * Формирование списка элементов цепочки фактов, приведших к какому либо урону
 * @param {*} props 
 * @returns 
 */
export function CreateKillChainPhasesList(props){
    let { listKillChainPhases, handlerDeleteItem } = props;

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
                            <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                        </IconButton>
                    </li>);
                })}
            </ol>
        </Grid>
    </Grid>);
}

CreateKillChainPhasesList.propTypes = {
    listKillChainPhases: PropTypes.array.isRequired,
    handlerDeleteItem: PropTypes.func.isRequired,
};

export function CreateListRegion(props){
    let { campaignPatterElement, handlerRegion } = props;
    const classes = useStyles();

    return (dictionaryLists["region-ov"] && <FormControl fullWidth className={classes.formControl}>
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
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerRegion: PropTypes.func.isRequired,
};

export function CreateListContextGrouping(props){
    let { campaignPatterElement, handlerContext } = props;

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
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerContext: PropTypes.func.isRequired,
};
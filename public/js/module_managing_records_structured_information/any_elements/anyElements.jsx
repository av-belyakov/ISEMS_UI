import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import {
    Button,
    Chip,
    Select,
    Tooltip,
    TextField, 
    Typography,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

  

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
            <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с Отчётом</span></Col>
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
            id={"select-search-computer_threat_type"}
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
        <InputLabel id="demo-mutiple-chip-label">тип промышленного сектора</InputLabel>
        <Select
            labelId="sector-mutiple-chip-label"
            id="sector-mutiple-chip"
            multiple
            value={campaignPatterElement.sectors? campaignPatterElement.sectors: []}
            onChange={(e) => headerSectors.call(null, e)}
            input={<Input id="select-multiple-chip" />}
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
            labelId="infrastructure-mutiple-chip-label"
            id="infrastructure-mutiple-chip"
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
                    key={`infrastructure_types-item-${key}`} 
                    value={item.name} 
                    style={getStyles(item.name, campaignPatterElement.infrastructure_types, theme)}
                >
                    {item.summary}
                </MenuItem>
            ))}
        </Select>
    </FormControl>);

    /*const getContentText = (elem) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists["infrastructure-type-ov"].content.length; i++){
            if(elem === dictionaryLists["infrastructure-type-ov"].content[i].name){
                return dictionaryLists["infrastructure-type-ov"].content[i].text;
            }
        }

        return "";
    };

    console.log("func 'CreateListInfrastructureTypes', getContentText = ", getContentText(campaignPatterElement.infrastructure_types), " infrastructure_types: ", campaignPatterElement.infrastructure_types);

    let text = getContentText(campaignPatterElement.infrastructure_types);
    let [ textMenuItem, setTextMenuItem ] = useState(text);

    return (dictionaryLists["infrastructure-type-ov"] && <React.Fragment>
        <TextField
            id={"select-search-infrastructure_type"}
            select
            fullWidth
            label={"тип инфраструктуры"}
            value={campaignPatterElement.infrastructure_types? campaignPatterElement.infrastructure_types: "" }
            onChange={(e) => {
                handlerInfrastructureTypes.call(null, e);
                setTextMenuItem(getContentText(e.target.value));
            }} >
            <MenuItem key="infrastructure-item-value-empty" value="">пустое значение</MenuItem>
            {dictionaryLists["infrastructure-type-ov"].content.map((item, key) => {
                return (<MenuItem key={`infrastructure-item-${key}`} value={item.name}>
                    {item.summary}
                </MenuItem>);
            })}
        </TextField>
        <Typography variant="caption" display="block" gutterBottom>{(textMenuItem === "")? text: textMenuItem}</Typography>
    </React.Fragment>);*/
}

CreateListInfrastructureTypes.propTypes = {
    campaignPatterElement: PropTypes.object.isRequired, 
    handlerInfrastructureTypes: PropTypes.func.isRequired,
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
import React, { useState, useEffect, useReducer } from "react";
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
import { forEach } from "async";

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

const listExtendedObject = [
    //SDO
    {name: "grouping", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any STIX object)
    {name: "malware", listProperties: [ 
        "operating_system_refs", 
        "sample_refs" 
    ]},//operating_system_refs (SCO software) 
    // and sample_refs (SCO file and artifact)
    {name: "malware-analysis", listProperties: [ 
        "host_vm_ref",
        "operating_system_ref",
        "installed_software_refs",
        "sample_ref",
    ]}, //host_vm_ref (SCO software), 
    // operating_system_ref (SCO software),
    // installed_software_refs (SCO software),
    // sample_ref (SCO file, artifact and network traffic)
    {name: "note", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any STIX object)
    {name: "observed-data", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any SCO)
    {name: "opinion", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any STIX object)
    //SCO
    {name: "domain-name", listProperties: [ 
        "resolves_to_refs" 
    ]}, //resolves_to_refs (ipv4-addr, ipv6-addr, domain-name)
    {name: "file", listProperties: [ 
        "contains_refs" 
    ]}, //contains_refs (any STIX object)
    {name: "network-traffic", listProperties: [ 
        "src_ref", 
        "dst_ref",
        "src_payload_ref", 
        "dst_payload_ref",
        "encapsulates_refs", 
        "encapsulated_by_ref", 
    ]}, //src_ref or dst_ref (ipv4-addr, ipv6-addr, domain-name, mac-addr)
    // src_payload_ref or dst_payload_ref (SCO artifact)
    // encapsulates_refs or encapsulated_by_ref (network-traffic)
    {name: "http-request-ext", listProperties: [ 
        "message_body_data_ref" 
    ]}, //message_body_data_ref (SCO artifact)
    {name: "process", listProperties: [ 
        "opened_connection_refs",
        "creator_user_ref",
        "image_ref",
        "parent_ref",
        "child_refs",
    ]}, //opened_connection_refs (SCO network-traffic)
    // creator_user_ref (SCO user-account), image_ref (SCO file), parent_ref (process)
    // child_refs (process)
];

/*const reducerListObjectRefsReport = (state, action) => {
    let updateState = (parentId, data) => {
        if(data.length === 0){
            return;
        }

        console.log("func 'updateState', BEFORE STATE is ARRAY", Array.isArray(state));

        for(let i = 0; i < state.length; i++){
            if(state[i].childId.length > 0){
                console.log("GGGGGGGGGGGGGGGGGG");
                
                updateState(state[i].childId, parentId, data);
            }

            data.forEach((item) => {
                if(item.id === state[i].currentId){
                    let name = state[i].currentId.split("--")[0];
                    listExtendedObject.forEach((elem) => {
                        if(elem.name === name){
                            elem.listProperties.forEach((value) => {
                                if(Array.isArray(item[value])){
                                    item[value].forEach((ce) => {
                                        state[i].childId.push({ currentId: ce, childId: [] });
                                    });
                                } else {
                                    if((item[value] !== null) && (item[value] !== "")){
                                        state[i].childId.push({ currentId: item[value], childId: [] });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }

        console.log("func 'updateState', AFTER STATE is ARRAY", Array.isArray(state));

    };

    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "update":

        //console.log("func 'reducerListObjectRefsReport', 'state' BEFORE: ", state);
        //console.log("action.parentId: ", action.data.parentId, " action: ", action.data);

        updateState(action.data.parentId, action.data.objList);
        
        console.log("func 'reducerListObjectRefsReport', updateState = 'state' AFTER: ", state);

        //return {...state};
        return state;
    }
};*/

/**
 * Формирует список из свойства object_refs, а также элементы его управления
 * @param {*} props 
 * @returns 
 */
export function CreateListObjectRefsReport(props){
    let {
        socketIo,
        parentId,
        objectRefs,
        handlerDeleteObjectRef, 
        handlerShowObjectRefSTIXObject,
        handlerChangeCurrentSTIXObject 
    } = props;

    let objListBegin = objectRefs.map((item) => {
        return { currentId: item, childId: [] };
    });

    let updateState = (parentId, data, state) => {
        if(data.length === 0){
            return;
        }

        //console.log("func 'updateState', BEFORE STATE is ARRAY", Array.isArray(state));
        //console.log("state: ", state);

        for(let i = 0; i < state.length; i++){
            if(state[i].childId.length > 0){
                //console.log("==== LENGTH state[i].childId: ", state[i].childId.length);
                
                state[i].childId = updateState(parentId, data, state[i].childId);
            }

            data.forEach((item) => {
                if(item.id === state[i].currentId){
                    let name = state[i].currentId.split("--")[0];
                    listExtendedObject.forEach((elem) => {

                        //console.log("==== elem.name: ", elem.name, ", name:", name, " ----");

                        if(elem.name === name){
                            elem.listProperties.forEach((value) => {
                                if(Array.isArray(item[value])){
                                    item[value].forEach((ce) => {

                                        //                                        console.log(")))))) CE = ", ce);

                                        state[i].childId.push({ currentId: ce, childId: [] });
                                    });
                                } else {
                                    if((item[value] !== null) && (item[value] !== "")){
                                        state[i].childId.push({ currentId: item[value], childId: [] });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }

        //console.log("func 'updateState', AFTER STATE is ARRAY", Array.isArray(state));

        return state;
    };

    let getListId = (list, parentId, depth) => {

        console.log("func 'getListId', parentId: ", parentId, " depth:", depth);
        //        console.log("func 'getListId', list: ", list);
        //        console.log("func 'getListId', list is ARRAY: ", Array.isArray(list));

        return list.map((item, key) => {
            let type = item.currentId.split("--");
            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
            let elemIsExist = listExtendedObject.find((item) => item.name === type[0]);

            if(type[0] === "grouping" || type[0] === "note"){
                console.log("------- ITEM: ", item);
            }

            if(typeof objectElem === "undefined"){
                return "";
            }

            let isExist = listExtendedObject.filter((item) => item.name === type[0]);
            let opn = testArray[depth] && (testArray[depth] === key);

            /*let isExist = listExtendedObject.filter((item) => item.name === type[0]);
            if(isExist.length > 0){
                console.log("______ TYPE[0]: ", type[0], " ________");
            }*/

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
                    <IconButton aria-label="delete" onClick={handlerDeleteObjectRef.bind(null, key)}>
                        <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                    </IconButton>

                    {
                        //listExtendedObject
                        //console.log("(((((( )))))) type[0]: ", type[0])

                        //console.log("item.currentId: ", item.currentId, "item.childId.length = ", item.childId.length, " item.childId: ", item.childId)
                    }

                    {((item.childId.length > 0) || ((isExist.length > 0)))?
                        ((testArray[depth] && (testArray[depth] === key) && (numElem === key))? <ExpandLess />: <ExpandMore />):
                        //((open && (numElem === key))? <ExpandLess />: <ExpandMore />):
                        ""}
                </ListItem>
                {item.childId.length > 0 && (testArray[depth] && (testArray[depth] === key)) && (numElem === key)?
                //item.childId.length > 0 && open && (numElem === key)?
                    <Collapse in={opn} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button >
                                <ListItemIcon>
                    
                                </ListItemIcon>
                                <ListItemText primary={getListId(item.childId, item.childId.currentId, depth++)} />
                            </ListItem>
                        </List>
                    </Collapse>:
                    ""}
            </React.Fragment>);
        });
    };

    //const [ state, dispatch ] = useReducer(reducerListObjectRefsReport, objListBegin);
    const [ state, setState ] = useState(objListBegin);

    //console.log("func 'CreateListObjectRefsReport', 11111 objListBegin: ", objListBegin);

    useEffect(() => {
        let listId = objectRefs.filter((item) => {
            let type = item.split("--");
        
            return listExtendedObject.find((item) => item.name === type[0]);
        });

        socketIo.on("isems-mrsi response ui: send search request, get STIX object for list id", (data) => {

            //console.log("isems-mrsi response ui: send search request, get STIX object for list id, receided data, ", data);//data.information.additional_parameters.transmitted_data);

            /*dispatch({ type: "update", data: { 
                parentId: data.parentObjectId, 
                objList: data.information.additional_parameters.transmitted_data, 
            }});*/

            let stateTmp = state.slice();
            stateTmp = updateState(data.parentObjectId, data.information.additional_parameters.transmitted_data, stateTmp);

            console.log("!!!!!!!!!! spcketIo.on stateTmp: ", stateTmp);

            setState(stateTmp);
        });
        socketIo.emit("isems-mrsi ui request: send search request, get STIX object for list id", { 
            arguments: { 
                searchListObjectId: listId,
                parentObjectId: "",
            }});
    }, []);

    const [open, setOpen] = React.useState(false);
    const [ numElem, setNumElem ] = React.useState(0);
    const [ testArray, setTestArray ] = React.useState([]);

    console.log("!(!(!((!(!(! TEST ARRAY: ", testArray);

    const findObjectId = (list, id) => {
        for(let i = 0; i < list.length; i++){
            if(list[i].currentId === id){
                return list[i];
            }

            if(list[i].childId.length > 0){
                findObjectId(list[i], id);
            }
        }

        return [];
    };
    const handleClick = (id, num, currentId, depth) => {
        
        console.log("func 'handleClick', START, ID = ", id, " NUM = ", num, " depth: ", depth);
        
        let tmp = testArray.slice();
        console.log("%%%%%% BEFORE TMP = ", tmp);
        console.log("testArray[depth] && testArray[depth] === num: ", testArray[depth] === num);
        if(testArray[depth] && testArray[depth] === num){
            console.log("DDDDDELETE");
            tmp.splice(depth, 10);
        } else {
            console.log("AAAAADDDD");
            tmp.push(num);
        }

        console.log("%%%%%% AFTER TMP = ", tmp);
        setTestArray(tmp);
        
        if(currentId !== ""){
            let searchListObjectId = findObjectId(state, currentId);
            let listId = [];
            searchListObjectId.childId.forEach((item) => {
                listId.push(item.currentId);
            });

            console.log("send request information about elem name: ", currentId);
            console.log("func findObjectId = ", searchListObjectId);

            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for list id", { 
                arguments: { 
                    searchListObjectId: listId,
                    parentObjectId: currentId,
                }});
        }

        if((num !== numElem) && open){
            setNumElem(num);    

            return;
        }

        setNumElem(num);
        setOpen(!open);
    };

    console.log("------------------- state: ", state);

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с данным Отчётом</span></Col>
        </Row>
        <Row>
            <Col md={12}>
                {(state.length === 0)? 
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
                        {getListId(state, parentId, 0)}   
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
    parentId: PropTypes.string.isRequired,
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
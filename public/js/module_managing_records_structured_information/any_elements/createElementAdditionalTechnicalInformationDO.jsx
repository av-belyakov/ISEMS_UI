"use strict";

import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography, 
    TextField,
    Grid,
    Select,
    IconButton,
    InputLabel,
    FormControl,
    MenuItem,
} from "@material-ui/core";
import IconCloseOutlined from "@material-ui/icons/CloseOutlined";
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import TokenInput from "react-customize-token-input";
import { grey, green, red } from "@material-ui/core/colors";
import { v4 as uuidv4 } from "uuid";
import validatorjs from "validatorjs";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    customPaper: {
        width: "100%",
        color: theme.palette.getContrastText(grey[50]),
        backgroundColor: grey[50],
        margin: theme.spacing(1),
    },
    buttonCreateElement: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
        "&:hover": {
            backgroundColor: green[700],
        },
    },
    formControlTypeHashRE: {
        minWidth: 120,
    },
}));

const listHashType = [ 
    { type: "MD5", description: "MD5" },
    { type: "SHA-1", description: "SHA-1" },
    { type: "SHA256", description: "SHA-2 (256)" },
    { type: "SHA384", description: "SHA-2 (384)" },
    { type: "SHA512", description: "SHA-2 (512)" },
    { type: "SHA-3", description: "SHA-3" },
    { type: "RIPEMD", description: "RIPEMD" },
    { type: "Base64", description: "Base64" },
];

export default function CreateElementAdditionalTechnicalInformationDO(props){
    let { 
        objectId,
        reportInfo, 
        isNotDisabled,
        handlerElementConfidence, 
        handlerElementDefanged, 
        handlerElementLabels,
        handlerElementDelete,
        handlerDialogElementAdditionalThechnicalInfo,
    } = props;

    const classes = useStyles();
    const [ expanded, setExpanded ] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded? panel: false);
    };

    console.log("func CreateElementAdditionalTechnicalInformationDO, START");

    let handlerElConf = (data) => {
            handlerElementConfidence({ data: +data.target.value, objectId: objectId });
        }, 
        handlerElDef = (data) => {
            handlerElementDefanged({ data: data.target.value, objectId: objectId }); 
        };

    let getLabelsAdditionalTechnicalInformation = () => {
        let listTmpLabelsAdditionalTechnicalInformation = ((reportInfo.labels !== null) && (Array.isArray(reportInfo.labels)))? reportInfo.labels: [];

        return (<Grid container direction="row" className="mt-2 pl-4">
            <Grid item md={6}><span className="text-muted">набор терминов, используемых для описания данного объекта:</span></Grid>
            <Grid item md={6} className="text-right">    
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={listTmpLabelsAdditionalTechnicalInformation}
                    onTokenValuesChange={(newTokenValues) => handlerElementLabels({ listTokenValue: newTokenValues, objectId: objectId })}
                />
            </Grid>    
        </Grid>);
    };

    //уверенность создателя в правильности своих данных от 0 до 100
    let listConfidence = () => {
        let list = [];

        for(let i = 0; i <= 100; i++){
            list.push(<option 
                key={`key_confidence_${i}`} 
                value={i}>
                {i}
            </option>);
        }

        return list;
    };

    return (<React.Fragment>
        <Grid container direction="row" className="mt-4">
            <Grid item md={12}><span className="text-muted">Дополнительная техническая информация</span></Grid>
        </Grid>

        <Grid container direction="row" className="mt-3 pl-4">
            <Grid item md={6}><span className="text-muted">версия спецификации STIX:</span></Grid>
            <Grid item md={6} className="text-end">
                {((typeof reportInfo.spec_version === "undefined") || (reportInfo.spec_version.length === 0))? 
                    <span className="text-dark">версия не определена</span>: 
                    <i>{reportInfo.spec_version}</i>}
            </Grid>
        </Grid>
            
        {((typeof reportInfo.lang !== "undefined") && (reportInfo.lang !== null) && (reportInfo.lang.length !== 0)) ? 
            <Grid container direction="row" className="pl-4">
                <Grid item md={6}><span className="text-muted">текстовый код языка:</span></Grid>
                <Grid item md={6} className="text-end"><i>{reportInfo.lang.toUpperCase()}</i></Grid>
            </Grid> : ""}

        <Grid container direction="row" className="pl-4">
            <Grid item md={10}><span className="text-muted">уверенность создателя в правильности своих данных от 0 до 100:</span>&sup1;</Grid>
            <Grid item md={2} className="text-end">
                <Form.Group>
                    <Form.Control 
                        disabled={!isNotDisabled}
                        as="select" 
                        size="sm" 
                        onChange={handlerElConf} 
                        value={reportInfo.confidence} 
                        id="dropdown_list_confidence">
                        {listConfidence()}
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        {((typeof reportInfo.created_by_ref !== "undefined") && (reportInfo.created_by_ref !== null) && (reportInfo.created_by_ref.length !== 0)) ? 
            <Grid container direction="row" className="mt-1 pl-4">
                <Grid item md={6}><span className="text-muted">идентификатор источника создавшего Отчёт:</span></Grid>
                <Grid item md={6}>
                    <TextField size="small" defaultValue={reportInfo.created_by_ref} disabled fullWidth/>
                </Grid>
            </Grid> : ""}

        {
            //набор терминов для описание данного объекта
            getLabelsAdditionalTechnicalInformation()
        }

        <Grid container direction="row" className="pl-4 mt-1 mb-3">
            <Grid item md={10}><span className="text-muted">определены ли данные содержащиеся в объекте:</span></Grid>
            <Grid item md={2} className="text-end">
                <Form.Group>
                    <Form.Control 
                        disabled={!isNotDisabled}
                        as="select" 
                        size="sm" 
                        onChange={handlerElDef} 
                        defaultValue={reportInfo.defanged} 
                        id="dropdown_list_defanged" >
                        <option key={"key_defanged_true"} value={true} >да</option>
                        <option key={"key_defanged_false"} value={false} >нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-add-technic-info"
                id="panel-added-links">
                <Typography className={classes.heading}>дополнительные внешние ссылки</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <GetExternalReferences
                    objectId={objectId}
                    reportInfo={reportInfo}
                    handlerElementDelete={handlerElementDelete}
                    handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}
                />
            </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-add-technic-info"
                id="panel-added-granular-labels">
                <Typography className={classes.heading}>дополнительные {"\"гранулярные метки\""}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <GetGranularMarkings
                    objectId={objectId}
                    reportInfo={reportInfo}
                    handlerElementDelete={handlerElementDelete}
                    handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}
                />
            </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-add-technic-info"
                id="panel-added-any-info">
                <Typography className={classes.heading}>любая дополнительная информация</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <GetExtensions 
                    objectId={objectId}
                    reportInfo={reportInfo}
                    handlerElementDelete={handlerElementDelete}
                    handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}
                />
            </AccordionDetails>
        </Accordion>

        <hr/>
        <Grid container direction="row" className="mb-2">
            <Grid item md={12} className="text-end"><small>1 - чем больше тем увереннее</small></Grid>
        </Grid>
    </React.Fragment>);
}

CreateElementAdditionalTechnicalInformationDO.propTypes = {
    objectId: PropTypes.string.isRequired,
    reportInfo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool,
    handlerElementConfidence: PropTypes.func.isRequired,
    handlerElementDefanged: PropTypes.func.isRequired,
    handlerElementLabels: PropTypes.func.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
    handlerDialogElementAdditionalThechnicalInfo: PropTypes.func.isRequired,
};

//дополнительные внешние ссылки
function GetExternalReferences(props){
    let {  
        objectId,
        reportInfo,
        handlerElementDelete,
        handlerDialogElementAdditionalThechnicalInfo,
    } = props;

    const classes = useStyles();
    let patternValueER = {
        source_name: "",
        description: "",
        url: "",
        hashes: [],
    };
    let [ valueER, setValueER ] = useState(patternValueER),
        [ buttonAddNewERIsDisabled, setButtonAddNewERIsDisabled ] = useState(true),
        [ valuesIsInvalideSourceNameER, setValuesIsInvalideSourceNameER ] = useState(true),
        [ valuesIsInvalidURLER, setValuesIsInvalidURLER ] = useState(false),
        [ valueTmpHashSumER, setValueTmpHashSumER ] = useState({ type: "", description: "" }),
        [ buttonAddHashIsDisabled, setButtonAddHashIsDisabled ] = useState(true),
        [ valueTmpUpdateHashSumER, setValueTmpUpdateHashSumER ] = useState({});

    let handlerDelItemHash = (num) => {
        let tmp = _.cloneDeep(valueER);
        tmp.hashes.splice(num, 1);
    
        setValueER(tmp);
    };

    return (<Grid container direction="row" key="key_external_references_link">
        <Grid container direction="row" spacing={3}>
            <Grid item md={4}>
                <TextField
                    id="external-references-source-name"
                    label="наименование"
                    value={(typeof valueER.source_name === "undefined")? "": valueER.source_name}
                    //disabled={(typeof erInfo.source_name !== "undefined")}
                    error={valuesIsInvalideSourceNameER}
                    fullWidth={true}
                    helperText="обязательное для заполнения поле"
                    onChange={(e) => {
                        let valueERTmp = _.cloneDeep(valueER);
                        valueERTmp.source_name = e.target.value;

                        setValueER(valueERTmp);

                        if(e.target.value.length === 0){
                            setButtonAddNewERIsDisabled(true);
                            setValuesIsInvalideSourceNameER(true);
                        } else {
                            setButtonAddNewERIsDisabled(false);
                            setValuesIsInvalideSourceNameER(false);
                        }
                    }}
                />
            </Grid>
            <Grid item md={8}>
                <TextField
                    id="external-references-description"
                    label="описание"
                    fullWidth={true}
                    value={(typeof valueER.description === "undefined")? "": valueER.description}
                    onChange={(e) => {
                        let valueERTmp = _.cloneDeep(valueER);
                        valueERTmp.description = e.target.value;

                        setValueER(valueERTmp);
                    }}
                />
            </Grid>
        </Grid>

        <Grid container direction="row">
            <Grid item md={12}>
                <TextField
                    id="external-references-url"
                    label="url"
                    fullWidth={true}
                    error={valuesIsInvalidURLER}
                    value={(typeof valueER.url === "undefined")? "": valueER.url}
                    onChange={(e) => {
                        let valueERTmp = _.cloneDeep(valueER);
                        valueERTmp.url = e.target.value;

                        setValueER(valueERTmp);
                        setValuesIsInvalidURLER(((typeof valueERTmp.url !== "undefined") && (valueERTmp.url !== "") && (!validatorjs.isURL(valueERTmp.url, { 
                            protocols: ["http","https","ftp"],
                        }))));
                    }}
                />
            </Grid>
                
            <Grid container direction="row" spacing={3} key="key_input_hash_field">
                <Grid item md={2}>
                    <FormControl className={classes.formControlTypeHashRE}>
                        <InputLabel id="label-hash-type-change">тип хеша</InputLabel>
                        <Select
                            labelId="chose-hash-select-label"
                            id="chose-hash-select-label"
                            value={valueTmpHashSumER.type}
                            fullWidth={true}
                            onChange={(e) => {
                                let tmp = valueTmpHashSumER.description,
                                    v = e.target.value;
                                setValueTmpHashSumER({ type: v, description: tmp });

                                ((v.length > 0) && (tmp.length > 0))? setButtonAddHashIsDisabled(false): setButtonAddHashIsDisabled(true);
                            }}>
                            {listHashType.map((elem, num)=>{
                                return <MenuItem value={elem.type} key={`key_${elem.type}_${num}`}>{elem.description}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={8}>
                    <TextField
                        id="external-references-hash"
                        label="хеш-сумма"
                        fullWidth
                        value={valueTmpHashSumER.description}
                        onChange={(e) => {
                            let tmp = valueTmpHashSumER.type,
                                v = e.target.value;
                            setValueTmpHashSumER({ type: tmp, description: v });

                            ((v.length > 0) && (tmp.length > 0))? setButtonAddHashIsDisabled(false): setButtonAddHashIsDisabled(true);
                        }}
                    />
                </Grid>
                <Grid item md={2} className="text-end mt-4">
                    <Button 
                        onClick={() => {
                            let valueERTmp = _.cloneDeep(valueER);
                            valueERTmp.hashes.push(valueTmpHashSumER);

                            setValueER(valueERTmp);
                            setValueTmpHashSumER({ type: "", description: "" });
                            setButtonAddHashIsDisabled(true);
                        }} 
                        disabled={buttonAddHashIsDisabled}
                    >добавить хеш</Button>
                </Grid>
            </Grid>
        </Grid>

        {(valueER.hashes.length === 0) ? 
            "" : 
            <Grid container direction="row" className="mt-3">
                <ol>
                    {valueER.hashes.map((elem, numHash) => {
                        return (<li key={`key_item_hash_${numHash}`}>
                            {`${elem.type}: ${elem.description}`}&nbsp;
                            <IconButton aria-label="delete-hash" onClick={() => handlerDelItemHash.call(null, numHash)}>
                                <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                            </IconButton>
                        </li>);
                    })}
                </ol>
            </Grid> }

        <Grid container direction="row" className="mt-2" key="key_external_references_link">
            <Grid item md={12} className="text-end pb-2">
                <Button onClick={() => {
                    if(valuesIsInvalidURLER){
                        return;
                    }
                        
                    let obj = {};
                    let tmpData = _.cloneDeep(valueER);
                            
                    setValueER(patternValueER);
                    setButtonAddNewERIsDisabled(true);
                    setValuesIsInvalideSourceNameER(true);
                    tmpData.hashes.map((item) => obj[item.type] = item.description);

                    tmpData.hashes = obj;
                    tmpData.external_id = `external-references--${uuidv4()}`;

                    handlerDialogElementAdditionalThechnicalInfo({ 
                        actionType: "new",
                        modalType: "external_references", 
                        objectId: objectId,
                        orderNumber: -1,
                        data: tmpData,
                    });
                }} disabled={buttonAddNewERIsDisabled}>
                    добавить новую внешнюю ссылку
                </Button>
            </Grid>
        </Grid>

        {((typeof reportInfo.external_references === "undefined") || (reportInfo.external_references === null) || (reportInfo.external_references.length === 0))?
            "":
            reportInfo.external_references.map((item, key) => {
                let listHashes = [],
                    sourceName = "";
    
                if((typeof item.source_name !== "undefined") && (item.source_name !== null) && (item.source_name.length !== 0)){
                    sourceName = item.source_name;
                }

                if((item.hashes !== null) && (typeof item.hashes !== "undefined")){
                    for(let k in item.hashes){
                        listHashes.push(<li key={`hash_${item.hashes[k]}`}>
                            {k}: {item.hashes[k]}&nbsp;
                            <IconButton aria-label="delete-ext_ref-item" onClick={() => { 
                                handlerDialogElementAdditionalThechnicalInfo({ 
                                    actionType: "hashes_delete",
                                    modalType: "external_references", 
                                    objectId: objectId,
                                    orderNumber: key,
                                    hashName: k,
                                }); 
                            }}><RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                            </IconButton>
                        </li>);
                    }    
                }
                        
                let buttonIsDisabled = true;
                if((valueTmpUpdateHashSumER[key] !== null) && (typeof valueTmpUpdateHashSumER[key] !== "undefined")){
                    if((valueTmpUpdateHashSumER[key].type.length > 0) && (valueTmpUpdateHashSumER[key].hash.length > 0)){
                        buttonIsDisabled = false;
                    }
                }

                let isInvalidURL = ((typeof item.url !== "undefined") && (item.url !== "") && (!validatorjs.isURL(item.url, { 
                    protocols: ["http","https","ftp"],
                })));

                return (<Card className={classes.customPaper} key={`key_external_references_${key}_fragment`}>
                    <CardHeader 
                        subheader={sourceName}
                        action={<React.Fragment>
                            <IconButton aria-label="delete" onClick={()=>{ 
                                handlerElementDelete({ itemType: "external_references", item: sourceName, objectId: objectId, orderNumber: key }); 
                            }}>
                                <IconDeleteOutline style={{ color: red[400] }} />
                            </IconButton>
                        </React.Fragment>}
                    />
                    <CardContent>
                        {((typeof item.external_id === "undefined") || (item.external_id === null)) ? 
                            "": 
                            <Grid container direction="row" key={`key_external_references_${key}_2`}>
                                <Grid item md={12} className="pl-4 pr-4">
                                    <Typography variant="body2" component="p">
                                        <span className="text-muted">ID</span>: {item.external_id}
                                    </Typography>
                                </Grid>
                            </Grid>}

                        <Grid container direction="row" key={`key_external_references_${key}_3`}>
                            <Grid item md={12} className="pl-4 pr-4">
                                <TextField
                                    label="описание"
                                    value={(typeof item.description === "undefined")? "": item.description}
                                    fullWidth={true}
                                    onChange={(e) => { 
                                        item.description = e.target.value;

                                        handlerDialogElementAdditionalThechnicalInfo({ 
                                            actionType: "update",
                                            modalType: "external_references", 
                                            objectId: objectId,
                                            orderNumber: key,
                                            data: item,
                                        });
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container direction="row" key={`key_external_references_${key}_4`}>
                            <Grid item md={12} className="pl-4 pr-4">
                                <TextField
                                    label="url"
                                    value={(typeof item.url === "undefined")? "": item.url}
                                    fullWidth={true}
                                    error={isInvalidURL}
                                    onChange={(e) => {
                                        item.url = e.target.value;

                                        handlerDialogElementAdditionalThechnicalInfo({ 
                                            actionType: "update",
                                            modalType: "external_references", 
                                            objectId: objectId,
                                            orderNumber: key,
                                            data: item,
                                        });
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container direction="row" key={`key_input_hash_field_${key}`}>
                            <Grid item md={2}>
                                <FormControl className={classes.formControlTypeHashRE}>
                                    <InputLabel id={`label-hash-type-change_${key}`}>тип хеша</InputLabel>
                                    <Select
                                        key={`chose-hash-select-label_${key}`}
                                        value={((valueTmpUpdateHashSumER[key] === null) || (typeof valueTmpUpdateHashSumER[key] === "undefined"))? "": valueTmpUpdateHashSumER[key].type}
                                        fullWidth={true}
                                        onChange={(e) => {
                                            let tmp = _.cloneDeep(valueTmpUpdateHashSumER);
                                            if((tmp[key] === null) || (typeof tmp[key] === "undefined")){
                                                tmp[key] = { type: e.target.value, hash: "" };
                                            } else {
                                                tmp[key].type = e.target.value;
                                            }

                                            setValueTmpUpdateHashSumER(tmp);
                                        }}>
                                        {listHashType.map((elem, num)=>{
                                            return <MenuItem value={elem.type} key={`key_${elem.type}_${num}`}>{elem.description}</MenuItem>;
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={8}>
                                <TextField
                                    id="external-references-hash"
                                    label="хеш-сумма"
                                    fullWidth
                                    value={((valueTmpUpdateHashSumER[key] === null) || (typeof valueTmpUpdateHashSumER[key] === "undefined"))? "": valueTmpUpdateHashSumER[key].hash}
                                    onChange={(e) => {
                                        let tmp = _.cloneDeep(valueTmpUpdateHashSumER);
                                        if((tmp[key] === null) || (typeof tmp[key] === "undefined")){
                                            tmp[key] = { type: "", hash: e.target.value };
                                        } else {
                                            tmp[key].hash = e.target.value;
                                        }

                                        setValueTmpUpdateHashSumER(tmp);
                                    }}
                                />
                            </Grid>
                            <Grid item md={2} className="text-end mt-4">
                                <Button 
                                    onClick={() => {
                                        if((valueTmpUpdateHashSumER[key] === null) || (typeof valueTmpUpdateHashSumER[key] === "undefined")){                                                    
                                            return;
                                        }
                    
                                        handlerDialogElementAdditionalThechnicalInfo({ 
                                            actionType: "hashes_update",
                                            modalType: "external_references", 
                                            objectId: objectId,
                                            orderNumber: key,
                                            data: valueTmpUpdateHashSumER[key],
                                        });

                                        let tmp = _.cloneDeep(valueTmpUpdateHashSumER);
                                        tmp[key] = { type: "", hash: "" };
                                        setValueTmpUpdateHashSumER(tmp);
                                    }} 
                                    disabled={buttonIsDisabled}>добавить хеш</Button>
                            </Grid>
                        </Grid>

                        {(listHashes.length !== 0) ? 
                            <Grid container direction="row" key={`key_external_references_${key}_5`} className="mt-2">
                                <Grid item md={12} className="pl-4 pr-4">
                                    <span><span className="text-muted">хеш суммы</span>:<ol>{listHashes}</ol></span>
                                </Grid>
                            </Grid>: 
                            ""}
                    </CardContent>
                </Card>);
            })}
    </Grid>);
}

GetExternalReferences.propTypes = {
    objectId: PropTypes.string.isRequired,
    reportInfo: PropTypes.object.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
    handlerDialogElementAdditionalThechnicalInfo: PropTypes.func.isRequired,
};

//дополнительные внешние ссылки
function GetGranularMarkings(props){
    let {  
        objectId,
        reportInfo,
        handlerElementDelete,
        handlerDialogElementAdditionalThechnicalInfo,
    } = props;

    const classes = useStyles();
    let patternValueGM = {
        lang: "",
        marking_ref: "",
        selectors: [],
    };
    let [ valueGM, setValueGM ] = useState(patternValueGM);
    let [ valueTmpSelector, setValueTmpSelector ] = useState("");
    let [ buttonAddNewGMIsDisabled, setButtonAddNewGMIsDisabled ] = useState(true);
    let [ buttonAddSelectorIsDisabled, setButtonAddSelectorIsDisabled ] = useState(true);

    let handlerDelSelector = (num) => {
        let tmp = _.cloneDeep(valueGM);
        tmp.selectors.splice(num, 1);

        if(tmp.selectors.length === 0){
            setButtonAddNewGMIsDisabled(true);
        }

        setValueGM(tmp);
    };

    return (<Grid container direction="row" key="key_granular_markings_link">
        <Grid container direction="row" spacing={3}>
            <Grid item md={2}>
                <TextField
                    id="granular-markings-lang"
                    label="маркер языка"
                    fullWidth={true}
                    value={valueGM.lang}
                    onChange={(e) => {
                        let valueGMTmp = _.cloneDeep(valueGM);

                        valueGMTmp.lang = e.target.value.toUpperCase();
                        setValueGM(valueGMTmp);
                    }}
                />
            </Grid>
            <Grid item md={10}>
                <Grid container direction="row">
                    <Grid item md={9}>
                        <TextField
                            id="granular-markings-marking-ref"
                            label="идентификатор объекта 'marking-definition'"
                            fullWidth={true}
                            value={valueGM.marking_ref}
                            onChange={(e) => {
                                let valueGMTmp = _.cloneDeep(valueGM);

                                valueGMTmp.marking_ref = e.target.value;
                                setValueGM(valueGMTmp);
                            }}
                        />
                    </Grid>
                    <Grid item md={3} className="text-start mt-2">
                        <Button onClick={() => {
                            let valueGMTmp = _.cloneDeep(valueGM);

                            valueGMTmp.marking_ref = `marking-definition--${uuidv4()}`;
                            setValueGM(valueGMTmp);
                        }}>
                            сгенерировать
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Grid container direction="row" key="key_input_hash_field">
            <Grid item md={7}>
                <TextField
                    id="marking-definition-selector"
                    label="идентификатор селектора"
                    fullWidth
                    value={valueTmpSelector}
                    onChange={(e) => {
                        setValueTmpSelector(e.target.value);
                        (e.target.value.length === 0)? setButtonAddSelectorIsDisabled(true): setButtonAddSelectorIsDisabled(false);
                    }}
                />
            </Grid>
            <Grid item md={2} className="text-start mt-2">
                <Button onClick={() => {
                    setValueTmpSelector(`selector--${uuidv4()}`);
                    setButtonAddSelectorIsDisabled(false);
                }} >
                    сгенерировать
                </Button>
            </Grid>
            <Grid item md={3} className="text-end mt-2">
                <Button 
                    onClick={() => {
                        if(valueTmpSelector === ""){
                            return;
                        }

                        let valueGMTmp = _.cloneDeep(valueGM);

                        valueGMTmp.selectors.push(valueTmpSelector);
                        setValueGM(valueGMTmp);
                        setValueTmpSelector("");

                        setButtonAddNewGMIsDisabled(false);
                        setButtonAddSelectorIsDisabled(true);
                    }} 
                    disabled={buttonAddSelectorIsDisabled} 
                    color="primary" >
                        добавить селектор
                </Button>
            </Grid>
        </Grid>

        {(valueGM.selectors.length === 0) ? 
            "" : 
            <Grid container direction="row" className="mt-3">
                <ol>
                    {valueGM.selectors.map((item, num) => {
                        return (<li key={`key_item_selector_${num}`}>
                            {item}&nbsp;
                            <IconButton aria-label="delete-selector" onClick={() => handlerDelSelector.call(null, num)}>
                                <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                            </IconButton>
                        </li>);
                    })}
                </ol>
            </Grid>}

        <Grid container direction="row" key="key_granular_markings_link">
            <Grid item md={12} className="text-end pt-2 pb-2">
                <Button onClick={() => {
                    let tmpData = _.cloneDeep(valueGM);
                    setValueGM(patternValueGM);
                    setButtonAddNewGMIsDisabled(true);

                    tmpData.external_id = `granular_markings--${uuidv4()}`;

                    handlerDialogElementAdditionalThechnicalInfo({ 
                        actionType: "new",
                        modalType: "granular_markings", 
                        objectId: objectId,
                        orderNumber: -1,
                        data: tmpData,
                    });
                }} disabled={buttonAddNewGMIsDisabled}>
                    {"добавить новую \"гранулярную метку\""}
                </Button>
            </Grid>
        </Grid>

        {((typeof reportInfo.granular_markings === "undefined") || (reportInfo.granular_markings === null) || (reportInfo.granular_markings.length === 0))?
            "":
            reportInfo.granular_markings.map((item, key) => {
                let markingRef = "";

                if((typeof item.marking_ref !== "undefined") && (item.marking_ref !== null) && (item.marking_ref.length !== 0)){
                    markingRef = item.marking_ref;
                }

                return (<Card className={classes.customPaper} key={`key_granular_markings_${key}_fragment`}>
                    <CardHeader 
                        subheader={markingRef}
                        action={<React.Fragment>
                            <IconButton aria-label="delete" onClick={()=>{ 
                                handlerElementDelete({ 
                                    itemType: "granular_markings", 
                                    item: markingRef,
                                    orderNumber: key,
                                    objectId: objectId }); 
                            }}>
                                <IconDeleteOutline style={{ color: red[400] }} />
                            </IconButton>
                        </React.Fragment>} />
                    <CardContent>
                        {((typeof item.lang === "undefined") || (item.lang === null) || (item.lang.length === 0) ? 
                            "": 
                            <Grid container direction="row" key={`key_granular_mark_${key}_2`}>
                                <Grid item md={12}>
                                    <Typography variant="body2" component="p"><span className="text-muted">текстовый код языка:</span> {item.lang}</Typography>
                                </Grid>
                            </Grid>)}

                        {((item.selectors === null) && (typeof item.selectors === "undefined"))?
                            "":
                            <Grid container direction="row" key={`key_granular_mark_${key}_3`}>
                                <Grid item md={12}>
                                    <span>
                                        <span className="text-muted">список селекторов для содержимого объекта STIX, к которому применяется это свойство:</span>
                                        <ol>{item.selectors.map((i, num) => {
                                            return <li key={`hash_${i.selectors}_${num}`}>{i}</li>;
                                        })}</ol>
                                    </span>
                                </Grid>
                            </Grid>}
                    </CardContent>
                </Card>);
            })}
    </Grid>);
}

GetGranularMarkings.propTypes = {
    objectId: PropTypes.string.isRequired,
    reportInfo: PropTypes.object.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
    handlerDialogElementAdditionalThechnicalInfo: PropTypes.func.isRequired,
};

//любая дополнительная информация
function GetExtensions(props){
    let {
        objectId,
        reportInfo,
        handlerElementDelete,
        handlerDialogElementAdditionalThechnicalInfo,
    } = props;

    let [ buttonAddNewEIsDisabled, setButtonAddNewEIsDisabled ] = useState(true),
        [ valuesIsInvalideNameE, setValuesIsInvalideNameE ] = useState(true),
        [ valueE, setValueE ] = useState({ name: "", description: ""});

    let  listExtensions = [];
    for(let k in reportInfo.extensions){
        listExtensions.push(<li key={`extensions_${k}`}>
            {k}: {reportInfo.extensions[k]}
            <IconButton aria-label="delete-extensions-item" onClick={() => { 
                handlerElementDelete({ 
                    itemType: "extensions", 
                    item: k, 
                    objectId: objectId,
                    orderNumber: -1 }); 
            }}>
                <IconCloseOutlined style={{ color: red[400] }} />
            </IconButton>
        </li>);
    }

    return (<Grid container direction="row" key="key_extensions_link">
        <Grid container direction="row" spacing={3}>
            <Grid item md={4}>
                <TextField
                    id="extensions-name"
                    label="наименование"
                    size="small"
                    fullWidth
                    error={valuesIsInvalideNameE}
                    value={valueE.name}
                    onChange={(e) => {
                        let valueETmp = _.cloneDeep(valueE);
                        valueETmp.name = e.target.value;
                        
                        setValueE(valueETmp);

                        if(e.target.value.length > 0){
                            setValuesIsInvalideNameE(false);
                            setButtonAddNewEIsDisabled(false);
                        } else {
                            setValuesIsInvalideNameE(true);
                            setButtonAddNewEIsDisabled(true);
                        }
                    }}
                    variant="outlined"
                    helperText="обязательное для заполнения поле"
                />
            </Grid>
            <Grid item md={8}>
                <TextField
                    id="extensions-description"
                    label="подробное описание"
                    multiline
                    rows={2}
                    fullWidth
                    value={valueE.description}
                    onChange={(e) => {
                        let valueETmp = _.cloneDeep(valueE);
                        valueETmp.description = e.target.value;

                        setValueE(valueETmp);
                    }}
                    variant="outlined"
                />
            </Grid>
        </Grid>

        <Grid container direction="row">
            <Grid item md={12} className="text-end mt-2 pb-2">
                <Button onClick={() => {
                    let tmpData = _.cloneDeep(valueE);

                    setValueE({ name: "", description: ""});
                    setValuesIsInvalideNameE(true);
                    setButtonAddNewEIsDisabled(true);

                    handlerDialogElementAdditionalThechnicalInfo({ 
                        actionType: "new",
                        modalType: "extensions", 
                        objectId: objectId,
                        orderNumber: -1,
                        data: tmpData,
                    });
                }} disabled={buttonAddNewEIsDisabled}>
                    добавить любую дополнительную информацию
                </Button>
            </Grid>
        </Grid>

        <Grid container direction="row">
            <Grid item md={12}><ul>{listExtensions}</ul></Grid>
        </Grid>
    </Grid>);
}

GetExtensions.propTypes = {
    objectId: PropTypes.string.isRequired,
    reportInfo: PropTypes.object.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
    handlerDialogElementAdditionalThechnicalInfo: PropTypes.func.isRequired,
};

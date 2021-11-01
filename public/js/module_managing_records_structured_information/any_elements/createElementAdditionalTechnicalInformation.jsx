"use strict";

import React, { useState, useCallback } from "react";
import { Form } from "react-bootstrap";
import { 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Card,
    CardHeader,
    CardContent,
    Typography, 
    TextField,
    Grid,
    Link,
    IconButton,
} from "@material-ui/core";
import IconCloseOutlined from "@material-ui/icons/CloseOutlined";
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import IconEdit from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TokenInput from "react-customize-token-input";
import { blue, grey, green, red } from "@material-ui/core/colors";
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
}));

export default function CreateElementAdditionalTechnicalInformation(props){
    let { reportInfo, 
        objectId,
        handlerElementConfidence, 
        handlerElementDefanged, 
        handlerElementLabels,
        handlerElementDelete,
        showDialogElementAdditionalThechnicalInfo,
        isNotDisabled } = props;

    let listTmpLabelsAdditionalTechnicalInformation = [];
    
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const [labelsTokenInput, setLabelsTokenInput] = useState(listTmpLabelsAdditionalTechnicalInformation);
    const handlerChangeElementLabels = useCallback((newTokenValues) => {
        setLabelsTokenInput(newTokenValues);

        handlerElementLabels({ listTokenValue: newTokenValues, objectId: objectId });
    },
    [setLabelsTokenInput, objectId, handlerElementLabels]);

    let handlerElConf = (data) => {
            handlerElementConfidence({ data: data.target.value, objectId: objectId });
        }, 
        handlerElDef = (data) => {
            handlerElementDefanged({ data: data.target.value, objectId: objectId }); 
        };

    if(reportInfo.labels !== null){
        listTmpLabelsAdditionalTechnicalInformation = reportInfo.labels;
    }

    let getLabelsAdditionalTechnicalInformation = () => {
        return (<React.Fragment>
            <Grid container direction="row" className="mt-2 pl-4">
                <Grid item md={6}><span className="text-muted">набор терминов, используемых для описания данного объекта</span>:</Grid>
                <Grid item md={6} className="text-right">
                    <TokenInput
                        style={{ height: "81px" }}
                        tokenValues={labelsTokenInput}
                        onTokenValuesChange={handlerChangeElementLabels} />
                </Grid>    
            </Grid>
        </React.Fragment>);
    };

    //дополнительные внешние ссылки
    let getExternalReferences = () => {
        return (<Grid container direction="row">
            <Grid item md={12}>
                <Grid container direction="row" key="key_external_references_link">
                    <Grid item md={12} className="text-end pb-2">
                        <Link href="#" onClick={()=>{ 
                            showDialogElementAdditionalThechnicalInfo({ 
                                actionType: "new",
                                modalType: "external_references", 
                                objectId: objectId,
                                sourceName: "",
                                orderNumber: -1 }); 
                        }} color="textPrimary">
                            <Typography variant="overline" display="block" gutterBottom>добавить новую внешнюю ссылку</Typography>
                        </Link>
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
                                listHashes.push(<li key={`hash_${item.hashes[k]}`}>{k}: {item.hashes[k]}</li>);
                            }    
                        }

                        return (<Card className={classes.customPaper} key={`key_external_references_${key}_fragment`}>
                            <CardHeader 
                                subheader={sourceName}
                                action={<React.Fragment>
                                    <IconButton aria-label="delete" onClick={()=>{ 
                                        handlerElementDelete({ itemType: "external_references", item: sourceName, objectId: objectId }); 
                                    }}>
                                        <IconDeleteOutline style={{ color: red[400] }} />
                                    </IconButton>
                                    <IconButton aria-label="edit" onClick={()=>{ 
                                        showDialogElementAdditionalThechnicalInfo({ 
                                            actionType: "edit",
                                            modalType: "external_references", 
                                            objectId: objectId,
                                            sourceName: sourceName,
                                            orderNumber: key }); }}>
                                        <IconEdit style={{ color: blue[400] }} />
                                    </IconButton>
                                </React.Fragment>
                                } />
                            <CardContent>
                                {((typeof item.external_id === "undefined") || (item.external_id === null)) ? 
                                    "": 
                                    <Grid container direction="row" key={`key_external_references_${key}_2`}>
                                        <Grid item md={12} className="pl-4 pr-4">
                                            <Typography variant="body2" component="p"><span className="text-muted">ID</span>: {item.external_id}</Typography>
                                        </Grid>
                                    </Grid>}

                                {((typeof item.description === "undefined") || (item.description === null) || (item.description.length === 0) ? 
                                    "": 
                                    <Grid container direction="row" key={`key_external_references_${key}_3`}>
                                        <Grid item md={12} className="pl-4 pr-4">
                                            <Typography variant="body2" component="p"><span className="text-muted">описание</span>: {item.description}</Typography>
                                        </Grid>
                                    </Grid>)}

                                {((typeof item.url === "undefined") ||  (item.url === null) || (item.url.length === 0) ? 
                                    "": 
                                    <Grid container direction="row" key={`key_external_references_${key}_4`}>
                                        <Grid item md={12} className="pl-4 pr-4">
                                            <Typography variant="body2" component="p"><span className="text-muted">url</span>: <a href={item.url}>{item.url}</a></Typography>
                                        </Grid>
                                    </Grid>)}

                                {(listHashes.length !== 0) ? 
                                    <Grid container direction="row" key={`key_external_references_${key}_5`}>
                                        <Grid item md={12} className="pl-4 pr-4">
                                            <span><span className="text-muted">хеш суммы</span>:<ol>{listHashes}</ol></span>
                                        </Grid>
                                    </Grid>: 
                                    ""}
                            </CardContent>
                        </Card>);
                    })}
            </Grid>
        </Grid>);
    };

    //дополнительные "гранулярные метки"
    let getGranularMarkings = () => {
        return (<Grid container direction="row">
            <Grid item md={12}>
                <Grid container direction="row" key="key_granular_markings_link">
                    <Grid item md={12} className="text-end pb-2">
                        <Link href="#" onClick={()=>{ 
                            showDialogElementAdditionalThechnicalInfo({ 
                                actionType: "new",
                                modalType: "granular_markings", 
                                objectId: objectId,
                                orderNumber: -1 }); 
                        }} color="inherit">
                            <Typography variant="overline" display="block" gutterBottom>{"добавить новую \"гранулярную метку\""}</Typography>
                        </Link>
                    </Grid>
                </Grid>
                {((typeof reportInfo.granular_markings === "undefined") || (reportInfo.granular_markings === null) || (reportInfo.granular_markings.length === 0))?
                    "":
                    reportInfo.granular_markings.map((item, key) => {
                        let listSelectors = [],
                            markingRef = "";

                        if((typeof item.marking_ref !== "undefined") && (item.marking_ref !== null) && (item.marking_ref.length !== 0)){
                            markingRef = item.marking_ref;
                        }

                        if((item.selectors !== null) && (typeof item.selectors !== "undefined")){
                            for(let k in item.selectors){
                                listSelectors.push(<li key={`hash_${item.selectors[k]}`}>{item.selectors[k]}</li>);
                            }    
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
                                    <IconButton aria-label="edit" onClick={()=>{ 
                                        showDialogElementAdditionalThechnicalInfo({ 
                                            actionType: "edit",
                                            modalType: "granular_markings",
                                            orderNumber: key,
                                            objectId: objectId }); }}>
                                        <IconEdit style={{ color: blue[400] }} />
                                    </IconButton>
                                </React.Fragment>
                                } />
                            <CardContent>
                                {((typeof item.lang === "undefined") || (item.lang === null) || (item.lang.length === 0) ? 
                                    "": 
                                    <Grid container direction="row" key={`key_granular_mark_${key}_2`}>
                                        <Grid item md={12}>
                                            <Typography variant="body2" component="p"><span className="text-muted">текстовый код языка</span>: {item.lang}</Typography>
                                        </Grid>
                                    </Grid>)}

                                {(listSelectors.length !== 0) ? 
                                    <Grid container direction="row" key={`key_granular_mark_${key}_3`}>
                                        <Grid item md={12}>
                                            <span><span className="text-muted">список селекторов для содержимого объекта STIX, к которому применяется это свойство</span>:<ol>{listSelectors}</ol></span>
                                        </Grid>
                                    </Grid> : ""}
                            </CardContent>
                        </Card>);
                    })}
            </Grid>
        </Grid>);
    };

    //любая дополнительная информация
    let getExtensions = () => {
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
            <Grid item md={12} className="text-end pb-2">
                <Link href="#" onClick={()=>{ 
                    showDialogElementAdditionalThechnicalInfo({ 
                        actionType: "new",
                        modalType: "extensions", 
                        objectId: objectId,
                        orderNumber: -1 }); 
                }} color="inherit">
                    <Typography variant="overline" display="block" gutterBottom>{"добавить любую дополнительную информацию"}</Typography>
                </Link>
            </Grid>
            <Grid item md={12}><ul>{listExtensions}</ul></Grid>
        </Grid>);
    };

    //уверенность создателя в правильности своих данных от 0 до 100
    let listConfidence = () => {
        let list = [];

        for(let i = 0; i <= 100; i++){
            list.push(<option 
                key={`key_confidence_${i}`} 
                value={i} >
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
            <Grid item md={6}><span className="text-muted">версия спецификации STIX</span>:</Grid>
            <Grid item md={6} className="text-end">{(reportInfo.spec_version.length === 0) ? <span className="text-dark">версия не определена</span> : <i>{reportInfo.spec_version}</i>}</Grid>
        </Grid>
            
        {((typeof reportInfo.lang !== "undefined") && (reportInfo.lang !== null) && (reportInfo.lang.length !== 0)) ? 
            <Grid container direction="row" className="pl-4">
                <Grid item md={6}><span className="text-muted">текстовый код языка</span>:</Grid>
                <Grid item md={6} className="text-end"><i>{reportInfo.lang.toUpperCase()}</i></Grid>
            </Grid> : ""}

        <Grid container direction="row" className="pl-4">
            <Grid item md={10}><span className="text-muted">уверенность создателя в правильности своих данных от 0 до 100</span>&sup1;:</Grid>
            <Grid item md={2} className="text-end">
                <Form.Group>
                    <Form.Control 
                        disabled={!isNotDisabled}
                        as="select" 
                        size="sm" 
                        onChange={handlerElConf} 
                        defaultValue={reportInfo.confidence} 
                        id="dropdown_list_confidence" >
                        {listConfidence()}
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        {((typeof reportInfo.created_by_ref !== "undefined") && (reportInfo.created_by_ref !== null) && (reportInfo.created_by_ref.length !== 0)) ? 
            <Grid container direction="row" className="mt-1 pl-4">
                <Grid item md={6}><span className="text-muted">идентификатор источника создавшего доклад</span>:</Grid>
                <Grid item md={6}>
                    <TextField size="small" defaultValue={reportInfo.created_by_ref} disabled fullWidth/>
                </Grid>
            </Grid> : ""}

        {
            //набор терминов для описание данного объекта
            getLabelsAdditionalTechnicalInformation()
        }

        <Grid container direction="row" className="pl-4 mt-1 mb-3">
            <Grid item md={10}><span className="text-muted">определены ли данные содержащиеся в объекте</span>:</Grid>
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
                {getExternalReferences()}
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
                {getGranularMarkings()}
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
                {getExtensions()}
            </AccordionDetails>
        </Accordion>

        <hr/>
        <Grid container direction="row" className="mb-2">
            <Grid item md={12} className="text-end"><small>1 - чем больше тем увереннее</small></Grid>
        </Grid>
    </React.Fragment>);
}

CreateElementAdditionalTechnicalInformation.propTypes = {
    reportInfo: PropTypes.object.isRequired,
    objectId: PropTypes.string.isRequired,
    handlerElementConfidence: PropTypes.func.isRequired,
    handlerElementDefanged: PropTypes.func.isRequired,
    handlerElementLabels: PropTypes.func.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
    showDialogElementAdditionalThechnicalInfo: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool,
};
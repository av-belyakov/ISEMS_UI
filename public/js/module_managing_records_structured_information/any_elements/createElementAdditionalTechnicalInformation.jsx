"use strict";

import React, { useState, useCallback } from "react";
import { Form } from "react-bootstrap";
import { 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Chip,
    Typography, 
    Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default function CreateElementAdditionalTechnicalInformation(props){
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    let { reportInfo, 
        handlerElementConfidence, 
        handlerElementDefanged, 
        handlerElementLabels,
        isNotDisabled } = props;

    let getlabelsAdditionalTechnicalInformation = () => {
        let listTmp = [];
        if(reportInfo.labels !== null){
            listTmp = reportInfo.labels;
        }

        const [labelsTokenInput, setValues] = useState(listTmp);
        const handlerChange = useCallback((newTokenValues) => {
            setValues(newTokenValues);

            handlerElementLabels(newTokenValues);
        },
        [setValues]);

        return (<React.Fragment>
            <Grid container direction="row" className="pl-4 pt-2 pb-1">
                <Grid item md={6}><span className="text-muted">набор терминов, используемых для описания данного объекта</span>:</Grid>
                <Grid item md={6} className="text-right">
                    <TokenInput
                        style={{ height: "81px" }}
                        tokenValues={labelsTokenInput}
                        onTokenValuesChange={handlerChange}
                    />
                </Grid>    
            </Grid>
        </React.Fragment>);
    };

    //дополнительные внешние ссылки
    let getExternalReferences = () => {
        if((typeof reportInfo.external_references === "undefined") || (reportInfo.external_references === null) || (reportInfo.external_references.length === 0)){
            return;
        }

        let externalReferences = () => {
            return reportInfo.external_references.map((item, key) => {
                let listHashes = [],
                    sourceName = "",
                    externalId = "";
        
                if((typeof item.source_name !== "undefined") && (item.source_name !== null) && (item.source_name.length !== 0)){
                    sourceName = item.source_name;
                }
        
                if((typeof item.external_id !== "undefined") && (item.external_id !== null) && (item.external_id.length !== 0)){
                    externalId = item.external_id;
                }

                if((item.hashes !== null) && (typeof item.hashes !== "undefined")){
                    for(let k in item.hashes){
                        listHashes.push(<li key={`hash_${item.hashes[k]}`}>{k}: {item.hashes[k]}</li>);
                    }    
                }

                return (<React.Fragment key={`key_external_references_${key}_fragment`}>
                    <Grid container direction="row" key={`key_external_references_${key}_1`}  className="pt-2">
                        <Grid item md={12} className="text-center">{`${sourceName} (ID:${externalId})`}</Grid>
                    </Grid>

                    {((typeof item.description === "undefined") || (item.description === null) || (item.description.length === 0) ? 
                        "": 
                        <Grid container direction="row" key={`key_external_references_${key}_2`}>
                            <Grid item md={12}>
                                <Typography variant="body2" component="p"><span className="text-muted">описание</span>: {item.description}</Typography>
                            </Grid>
                        </Grid>)}

                    {((typeof item.url === "undefined") ||  (item.url === null) || (item.url.length === 0) ? 
                        "": 
                        <Grid container direction="row" key={`key_external_references_${key}_3`}>
                            <Grid item md={12}>
                                <Typography variant="body2" component="p"><span className="text-muted">url</span>: <a href={item.url}>{item.url}</a></Typography>
                            </Grid>
                        </Grid>)}

                    {(listHashes.length !== 0) ? 
                        <Grid container direction="row" key={`key_external_references_${key}_4`}>
                            <Grid item md={12}>
                                <span><span className="text-muted">хеш суммы</span>:<ol>{listHashes}</ol></span>
                            </Grid>
                        </Grid>: 
                        ""}
                </React.Fragment>);
            });
        };

        return (<Grid container direction="row">
            <Grid item md={12}>{externalReferences()}</Grid>
        </Grid>);
    };

    //дополнительные "гранулярные метки"
    let getGranularMarkings = () => {
        if((typeof reportInfo.granular_markings === "undefined") || (reportInfo.granular_markings === null) || (reportInfo.granular_markings.length === 0)){
            return;
        }

        let granularMarkings = () => {
            return reportInfo.granular_markings.map((item, key) => {
                let listSelectors = [],
                    markingRef = "";

                if((typeof item.marking_ref !== "undefined") && (item.marking_ref !== null) && (item.marking_ref.length !== 0)){
                    markingRef = item.marking_ref;
                }

                if((item.selectors !== null) && (typeof item.selectors !== "undefined")){
                    for(let k in item.selectors){
                        listSelectors.push(<li key={`hash_${item.selectors[k]}`}>{k}: {item.selectors[k]}</li>);
                    }    
                }

                return (<React.Fragment key={`key_granular_markings_${key}_fragment`}>
                    <Grid container direction="row" key={`key_granular_markings_${key}_1`}  className="pt-2">
                        <Grid item md={12} className="text-center">{markingRef}</Grid>
                    </Grid>

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
                                <span><span className="text-muted">хеш суммы</span>:<ol>{listSelectors}</ol></span>
                            </Grid>
                        </Grid> : ""}
                </React.Fragment>);
            });
        };

        return (<Grid container direction="row">
            <Grid item md={12}>{granularMarkings()}</Grid>
        </Grid>);
    };

    //любая дополнительная информация
    let getExtensions = () => {
        if((typeof reportInfo.extensions === "undefined") && (reportInfo.extensions === null) && (reportInfo.extensions.length === 0)){
            return;
        }   

        let  listExtensions = [];
        for(let k in reportInfo.extensions){
            listExtensions.push(<li key={`extensions_${k}`}>{k} - {reportInfo.extensions[k]}</li>);
        }

        return (<Grid container direction="row">
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

    reportInfo.labels = ["ncjndndvnd", "vvvvnnnnc"];

    return (
        <React.Fragment>
            <Grid container direction="row">
                <Grid item md={12}><span className="text-muted">Дополнительная техническая информация</span></Grid>
            </Grid>

            <Grid container direction="row" className="mt-3 pl-4">
                <Grid item md={6}><span className="text-muted">версия спецификации STIX</span>:</Grid>
                <Grid item md={6} className="text-right">{(reportInfo.spec_version.length === 0) ? <span className="text-dark">версия не определена</span> : <i>{reportInfo.spec_version}</i>}</Grid>
            </Grid>
            
            {((typeof reportInfo.lang !== "undefined") && (reportInfo.lang !== null) && (reportInfo.lang.length !== 0)) ? 
                <Grid container direction="row" className="pl-4">
                    <Grid item md={6}><span className="text-muted">текстовый код языка</span>:</Grid>
                    <Grid item md={6} className="text-right"><i>{reportInfo.lang.toUpperCase()}</i></Grid>
                </Grid> : ""}

            <Grid container direction="row" className="pl-4">
                <Grid item md={10}><span className="text-muted">уверенность создателя в правильности своих данных от 0 до 100</span>&sup1;:</Grid>
                <Grid item md={2} className="text-right">
                    <Form.Group>
                        <Form.Control 
                            disabled={!isNotDisabled}
                            as="select" 
                            size="sm" 
                            onChange={handlerElementConfidence} 
                            defaultValue={reportInfo.confidence} 
                            id="dropdown_list_confidence" >
                            {listConfidence()}
                        </Form.Control>
                    </Form.Group>
                </Grid>
            </Grid>

            {((typeof reportInfo.created_by_ref !== "undefined") && (reportInfo.created_by_ref !== null) && (reportInfo.created_by_ref.length !== 0)) ? 
                <Grid container direction="row" className="pl-4">
                    <Grid item md={6}><span className="text-muted">идентификатор источника создавшего доклад</span>:</Grid>
                    <Grid item md={6} className="text-right"><i>{reportInfo.created_by_ref}</i></Grid>
                </Grid> : ""}

            {getlabelsAdditionalTechnicalInformation()}

            <Grid container direction="row" className="pl-4 pb-3">
                <Grid item md={10}><span className="text-muted">определены ли данные содержащиеся в объекте</span>:</Grid>
                <Grid item md={2} className="text-right">
                    <Form.Group>
                        <Form.Control 
                            disabled={!isNotDisabled}
                            as="select" 
                            size="sm" 
                            onChange={handlerElementDefanged} 
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

            <Grid container direction="row">
                <Grid item md={12} className="pt-1 pb-n2 text-right"><small>1 - чем больше тем увереннее</small></Grid>
            </Grid>
            <hr/>
        </React.Fragment>
    );
}

CreateElementAdditionalTechnicalInformation.propTypes = {
    reportInfo: PropTypes.object.isRequired,
    handlerElementConfidence: PropTypes.func.isRequired,
    handlerElementDefanged: PropTypes.func.isRequired,
    handlerElementLabels: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool,
};
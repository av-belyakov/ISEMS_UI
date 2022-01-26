"use strick";

import React from "react";
import {
    Chip, 
    Grid,
} from "@material-ui/core";
import { 
    amber, 
    blue,
    blueGrey,
    brown, 
    cyan, 
    deepOrange, 
    deepPurple, 
    teal, 
    red, 
    green, 
    orange, 
    pink, 
    purple,
    lightBlue, 
    yellow, 
    grey,
} from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";
import validatorjs from "validatorjs";

export default function CreatePatternSearchFilters(props){
    let { 
        patternFilters, 
        listTypesDecisionsMadeComputerThreat,
        handlerDeleteFilters, 
    } = props;

    let getOperatorORChild = (currentNum, size) => (currentNum < (size - 1))? <span style={{ color: red[400] }}>&nbsp;ИЛИ&nbsp;</span>: "",
        getOperatorANDChild = (currentNum, size) => (currentNum < (size - 1))? <span style={{ color: red[400] }}>&nbsp;И&nbsp;</span>: "";

    let getListDocumentId = () => {
            if(patternFilters.documentsId.length === 0){
                return null;
            } else if(patternFilters.documentsId.length === 1){
                return (<Chip
                    key="key_chip_documentId_0"
                    label={`id документа: ${patternFilters.documentsId[0]}`}
                    onDelete={handlerDeleteFilters.bind(null, "documentId", patternFilters.documentsId[0], 0)}
                    variant="outlined"
                    style={{ color: purple[400], margin: "2px" }} />);
            } else {
                return (<span>({patternFilters.documentsId.map((item, num) => {
                    return (<React.Fragment key={`key_chip_documentId_${num}`}>
                        <Chip
                            label={`id документа: ${item}`}
                            onDelete={handlerDeleteFilters.bind(null, "documentId", item, num)}
                            variant="outlined"
                            style={{ color: purple[400], margin: "2px" }} />
                        {getOperatorORChild(num, patternFilters.documentsId.length)}
                    </React.Fragment>);
                })})</span>);
            }
        },
        getDateTimeCreated = () => {
            return ((patternFilters.created.start === "0001-01-01T00:00:00.000+00:00") || (patternFilters.created.end === "0001-01-01T00:00:00.000+00:00"))? 
                null:
                <Chip
                    key={"key_chip_data_created"}
                    label={`дата создания: ${helpers.convertDateFromString(patternFilters.created.start, { monthDescription: "long", dayDescription: "numeric" })} - ${helpers.convertDateFromString(patternFilters.created.end, { monthDescription: "long", dayDescription: "numeric" })}`}
                    onDelete={handlerDeleteFilters.bind(null, "created")}
                    variant="outlined"
                    style={{ color: deepOrange[400], margin: "2px" }} />;
        },
        getDateTimeModified = () => {
            return ((patternFilters.modified.start === "0001-01-01T00:00:00.000+00:00") || (patternFilters.modified.end === "0001-01-01T00:00:00.000+00:00"))? 
                null:
                <Chip
                    key={"key_chip_data_modified"}
                    label={`дата изменения: ${helpers.convertDateFromString(patternFilters.modified.start, { monthDescription: "long", dayDescription: "numeric" })} - ${helpers.convertDateFromString(patternFilters.modified.end, { monthDescription: "long", dayDescription: "numeric" })}`}
                    onDelete={handlerDeleteFilters.bind(null, "modified")}
                    variant="outlined"
                    style={{ color: orange[400], margin: "2px" }} />;
        },
        getCreatedByRef = () => {
            return ((patternFilters.createdByRef === "")? 
                null:
                <Chip
                    key={"key_chip_createdByRef"}
                    label={`id источника: ${patternFilters.createdByRef}`}
                    onDelete={handlerDeleteFilters.bind(null, "createdByRef")}
                    variant="outlined"
                    style={{ color: pink[400], margin: "2px" }} />);
        },
        getListSpecificSearchFieldsElement = () => {
            let listFilter = [];
            let getValueElement = (elem, orderNumber) => {
                if(validatorjs.isIP(elem, 4)){
                    return (<Chip
                        key={`key_chip_value_IPv4_${orderNumber}`}
                        label={`IPv4: ${elem}`}
                        onDelete={handlerDeleteFilters.bind(null, "ipv4-addr", elem, orderNumber)}
                        variant="outlined"
                        style={{ color: green[400], margin: "2px" }} />);
                } else if(validatorjs.isIP(elem, 6)){
                    return (<Chip
                        key={`key_chip_value_IPv6_${orderNumber}`}
                        label={`IPv6: ${elem}`}
                        onDelete={handlerDeleteFilters.bind(null, "ipv6-addr", elem, orderNumber)}
                        variant="outlined"
                        style={{ color: green[600], margin: "2px" }} />);
                } else if(validatorjs.isEmail(elem)){
                    return (<Chip
                        key={`key_chip_value_email-addr_${orderNumber}`}
                        label={`email: ${elem}`}
                        onDelete={handlerDeleteFilters.bind(null, "email-addr", elem, orderNumber)}
                        variant="outlined"
                        style={{ color: teal[600], margin: "2px" }} />);
                } else if(validatorjs.isURL(elem, { 
                    protocols: ["http","https","ftp"],
                }) && ((elem.startsWith("http") || (elem.startsWith("https")) || (elem.startsWith("ftp"))))){
                    return (<Chip
                        key={`key_chip_value_url_${orderNumber}`}
                        label={`url: ${elem}`}
                        onDelete={handlerDeleteFilters.bind(null, "url", elem, orderNumber)}
                        variant="outlined"
                        style={{ color: blue[600], margin: "2px" }} />);
                } else {
                    return (<Chip
                        key={`key_chip_value_domain-name_${orderNumber}`}
                        label={`доменное имя: ${elem}`}
                        onDelete={handlerDeleteFilters.bind(null, "domain-name", elem, orderNumber)}
                        variant="outlined"
                        style={{ color: lightBlue[600], margin: "2px" }} />);
                }
            };

            //наименование
            if(patternFilters.specificSearchFields[0].name !== ""){
                listFilter.push(<Chip
                    key={"key_chip_name"}
                    label={`наименование: ${patternFilters.specificSearchFields[0].name}`}
                    onDelete={handlerDeleteFilters.bind(null, "name")}
                    variant="outlined"
                    style={{ color: teal[400], margin: "2px" }} />);
            } 

            //псевдонимы
            if(patternFilters.specificSearchFields[0].aliases.length === 1){
                listFilter.push(<Chip
                    key={"key_chip_alias"}
                    label={`псевдоним: ${patternFilters.specificSearchFields[0].aliases[0]}`}
                    onDelete={handlerDeleteFilters.bind(null, "aliases", patternFilters.specificSearchFields[0].aliases[0], 0)}
                    variant="outlined"
                    style={{ color: cyan[400], margin: "2px" }} />);
            }
            if(patternFilters.specificSearchFields[0].aliases.length > 1){
                listFilter.push(<span>({patternFilters.specificSearchFields[0].aliases.map((item, num) => {
                    return (<React.Fragment key={`key_chip_aliases_${num}`}>
                        <Chip
                            key={`key_chip_alias_${num}`}
                            label={`псевдоним: ${item}`}
                            onDelete={handlerDeleteFilters.bind(null, "aliases", item, num)}
                            variant="outlined"
                            style={{ color: cyan[400], margin: "2px" }} />
                        {getOperatorORChild(num, patternFilters.specificSearchFields[0].aliases.length)}
                    </React.Fragment>);
                })})</span>);
            }

            //роли
            if(patternFilters.specificSearchFields[0].roles.length === 1){
                listFilter.push(<Chip
                    key={"key_chip_roles"}
                    label={`роль: ${patternFilters.specificSearchFields[0].roles[0]}`}
                    onDelete={handlerDeleteFilters.bind(null, "roles", patternFilters.specificSearchFields[0].roles[0], 0)}
                    variant="outlined"
                    style={{ color: blueGrey[400], margin: "2px" }} />);
            }
            if(patternFilters.specificSearchFields[0].roles.length > 1){
                listFilter.push(<span>({patternFilters.specificSearchFields[0].roles.map((item, num) => {
                    return (<React.Fragment key={`key_chip_roles_${num}`}>
                        <Chip
                            key={`key_chip_alias_${num}`}
                            label={`роль: ${item}`}
                            onDelete={handlerDeleteFilters.bind(null, "roles", item, num)}
                            variant="outlined"
                            style={{ color: blueGrey[400], margin: "2px" }} />
                        {getOperatorORChild(num, patternFilters.specificSearchFields[0].roles.length)}
                    </React.Fragment>);
                })})</span>);
            }

            //страна
            if(patternFilters.specificSearchFields[0].country !== ""){
                listFilter.push(<Chip
                    key={"key_chip_country"}
                    label={`страна: ${patternFilters.specificSearchFields[0].country}`}
                    onDelete={handlerDeleteFilters.bind(null, "country")}
                    variant="outlined"
                    style={{ color: deepPurple[400], margin: "2px" }} />);
            } 

            //город
            if(patternFilters.specificSearchFields[0].city !== ""){
                listFilter.push(<Chip
                    key={"key_chip_city"}
                    label={`город: ${patternFilters.specificSearchFields[0].city}`}
                    onDelete={handlerDeleteFilters.bind(null, "city")}
                    variant="outlined"
                    style={{ color: deepPurple[800], margin: "2px" }} />);
            } 

            //автономная система
            if(patternFilters.specificSearchFields[0].numberAutonomousSystem !== 0){
                listFilter.push(<Chip
                    key={"key_chip_number_autonomous_system"}
                    label={`автономная система № ${patternFilters.specificSearchFields[0].numberAutonomousSystem}`}
                    onDelete={handlerDeleteFilters.bind(null, "numberAutonomousSystem")}
                    variant="outlined"
                    style={{ color: brown[400], margin: "2px" }} />);
            } 

            //значения типа "domain-name", "email-addr", "ipv4-addr", "ipv6-addr" или "url"
            if(patternFilters.specificSearchFields[0].value.length === 1){
                listFilter.push(getValueElement(patternFilters.specificSearchFields[0].value[0], 0));
            }
            if(patternFilters.specificSearchFields[0].value.length > 1){
                listFilter.push(<span>({patternFilters.specificSearchFields[0].value.map((item, num) => {
                    return (<React.Fragment key={`key_chip_value_${num}`}>
                        {getValueElement(item, num)}
                        {getOperatorORChild(num, patternFilters.specificSearchFields[0].value.length)}
                    </React.Fragment>);
                })})</span>);
            }
            
            //интервал времени когда информация была обнаружена впервые 
            let firstSeen =  ((patternFilters.specificSearchFields[0].firstSeen.start === "0001-01-01T00:00:00.000+00:00") || (patternFilters.specificSearchFields[0].firstSeen.end === "0001-01-01T00:00:00.000+00:00"))? 
                null:
                <Chip
                    key={"key_chip_data_firstSeen"}
                    label={`обнаружено впервые: ${helpers.convertDateFromString(patternFilters.specificSearchFields[0].firstSeen.start, { monthDescription: "long", dayDescription: "numeric" })} - ${helpers.convertDateFromString(patternFilters.specificSearchFields[0].firstSeen.end, { monthDescription: "long", dayDescription: "numeric" })}`}
                    onDelete={handlerDeleteFilters.bind(null, "firstSeen")}
                    variant="outlined"
                    style={{ color: amber[700], margin: "2px" }} />;
            
            //интервал времени когда информация была обнаружена в последний раз 
            let lastSeen = ((patternFilters.specificSearchFields[0].lastSeen.start === "0001-01-01T00:00:00.000+00:00") || (patternFilters.specificSearchFields[0].lastSeen.end === "0001-01-01T00:00:00.000+00:00"))? 
                null:
                <Chip
                    key={"key_chip_data_lastSeen"}
                    label={`последняя фиксация: ${helpers.convertDateFromString(patternFilters.specificSearchFields[0].lastSeen.start, { monthDescription: "long", dayDescription: "numeric" })} - ${helpers.convertDateFromString(patternFilters.specificSearchFields[0].lastSeen.end, { monthDescription: "long", dayDescription: "numeric" })}`}
                    onDelete={handlerDeleteFilters.bind(null, "lastSeen")}
                    variant="outlined"
                    style={{ color: yellow[900], margin: "2px" }} />;
            //между интервалом времени когда информация была обнаружена впервые и когда информация была обнаружена в последний раз ставится "ИЛИ"
            if(firstSeen !== null && lastSeen === null){
                listFilter.push(firstSeen);
            }
            if(firstSeen === null && lastSeen !== null){
                listFilter.push(lastSeen);
            }
            if(firstSeen !== null && lastSeen !== null){
                listFilter.push(<span>({firstSeen}<span style={{ color: red[400] }}>&nbsp;ИЛИ&nbsp;</span>{lastSeen})</span>);
            }

            //равно или больше чем заданное пользователем время, когда отчет был опубликован
            if(patternFilters.specificSearchFields[0].published !== "1970-01-01T00:00:00.000+00:00"){
                listFilter.push(<Chip
                    key={"key_chip_data_published"}
                    label={`опубликован c ${helpers.convertDateFromString(patternFilters.specificSearchFields[0].published, { monthDescription: "long", dayDescription: "numeric" })} по настоящее время`}
                    onDelete={handlerDeleteFilters.bind(null, "published")}
                    variant="outlined"
                    style={{ color: yellow[700], margin: "2px" }} />);
            }

            if(listFilter.length === 0){
                return null;
            }

            return listFilter.map((item, num) => {
                return (<React.Fragment key={`key_specific_search_fields_element_${num}`}>
                    {item}
                    {getOperatorANDChild(num, listFilter.length)}
                </React.Fragment>);
            });
        },
        getListOutsideSpecificationSearchFields = () => {
            let dmctIsExist = patternFilters.outsideSpecificationSearchFields.decisionsMadeComputerThreat.length > 0,
                cttIsExist = patternFilters.outsideSpecificationSearchFields.computerThreatType.length > 0;

            if(!dmctIsExist && !cttIsExist){
                return null;
            }

            if(dmctIsExist && !cttIsExist){
                return (<Chip
                    label={listTypesDecisionsMadeComputerThreat[patternFilters.outsideSpecificationSearchFields.decisionsMadeComputerThreat].Description}
                    variant="outlined"
                    style={{ color: grey[500], margin: "2px" }} />);
            } else if(!dmctIsExist && cttIsExist){
                return (<Chip
                    label={`attack type: ${patternFilters.outsideSpecificationSearchFields.computerThreatType}`}
                    variant="outlined"
                    style={{ color: grey[500], margin: "2px" }} />);
            } else {
                return (<span>(<Chip
                    label={listTypesDecisionsMadeComputerThreat[patternFilters.outsideSpecificationSearchFields.decisionsMadeComputerThreat].Description}
                    variant="outlined"
                    style={{ color: grey[500], margin: "2px" }} />
                <span style={{ color: red[400] }}>&nbsp;ИЛИ&nbsp;</span>
                <Chip
                    label={`attack type: ${patternFilters.outsideSpecificationSearchFields.computerThreatType}`}
                    variant="outlined"
                    style={{ color: grey[500], margin: "2px" }} />)</span>);
            }
        };

    let dateTimeCreated = getDateTimeCreated();
    let dateTimeModified = getDateTimeModified();
    let getDateTimeCreateModified = () => {
        if(!dateTimeCreated && !dateTimeModified){
            return null;
        }

        if(dateTimeCreated && dateTimeModified){
            return <span>({dateTimeCreated}<span style={{ color: red[400] }}>&nbsp;ИЛИ&nbsp;</span>{dateTimeModified})</span>;
        } else if(dateTimeCreated && !dateTimeModified){
            return dateTimeCreated;
        } else {
            return dateTimeModified;
        }
    };

    let listDocumentId = getListDocumentId(),
        dateTimeCreateModified = getDateTimeCreateModified(),
        createdByRef = getCreatedByRef(),
        listSpecificSearchFieldsElement = getListSpecificSearchFieldsElement(),
        listOutsideSpecificationSearchFields = getListOutsideSpecificationSearchFields();
        
    let listFilter = [];
    if(listDocumentId){
        listFilter.push(listDocumentId);
    }

    if(dateTimeCreateModified){
        listFilter.push(dateTimeCreateModified);
    }

    if(createdByRef){
        listFilter.push(createdByRef);
    }

    if(listSpecificSearchFieldsElement){
        listFilter.push(listSpecificSearchFieldsElement);
    }

    if(listOutsideSpecificationSearchFields){
        listFilter.push(listOutsideSpecificationSearchFields);
    }         

    return (<Grid container direction="row" className="mt-3">
        <Grid item container md={12}>
            {listFilter.map((item, num) => {
                return (<span key={`key_filter_element_${num}`}>{item}{getOperatorANDChild(num, listFilter.length)}</span>);
            })}
        </Grid>
    </Grid>);
}

CreatePatternSearchFilters.propTypes = {
    patternFilters: PropTypes.object.isRequired,
    listTypesDecisionsMadeComputerThreat: PropTypes.object.isRequired,
    handlerDeleteFilters: PropTypes.func.isRequired,
};

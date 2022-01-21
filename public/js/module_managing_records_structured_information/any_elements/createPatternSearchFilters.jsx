"use strick";

import React from "react";
import {
    Button,
    Chip, 
    Grid,
    Typography, 
    TextField, 
    MenuItem,
    IconButton,
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
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";
/**
{            
    documentsId: [],
    documentsType: ["report"],
    // если заполнены оба поля 'created' и 'modified' то тогда для поиска по данным из обоих полей работает логика "ИЛИ"
    // значение "0001-01-01T00:00:00.000+00:00" для полей с датами эквивалентно значению пустого поля
    created: { start: "0001-01-01T00:00:00.000+00:00", end: "0001-01-01T00:00:00.000+00:00" },
    modified: { start: "0001-01-01T00:00:00.000+00:00", end: "0001-01-01T00:00:00.000+00:00" }, 
    createdByRef: "",
    // specific_search_fields содержит специфичные поля объектов STIX (если для поиска используются НЕСКОЛЬКО таких объектов 
    // то срабатывает логика "ИЛИ").
    // Если в объекте заполнены несколько полей то между ними работает логика "И", со всеми полями кроме полей даты.
    // Для поля "Value" выполняется проверка на соответствия одному из следующих типов значений: "domain-name", "email-addr", "ipv4-addr", 
    // "ipv6-addr" или "url" 
    specificSearchFields: [
        {
            name: "",
            aliases: [],
            // интервал времени когда информация была обнаружена впервые 
            firstSeen: { start: "0001-01-01T00:00:00.000+00:00", end: "0001-01-01T00:00:00.000+00:00" },
            // интервал времени когда информация была обнаружена в последний раз 
            lastSeen: { start: "0001-01-01T00:00:00.000+00:00", end: "0001-01-01T00:00:00.000+00:00" },
            // равно или больше чем заданное пользователем время, когда отчет был опубликован 
            published: "0001-01-01T00:00:00.000+00:00",
            roles: [],
            country: "",
            city: "",
            numberAutonomousSystem: 0,
            // может содержать какое либо из следующих типов значений: "domain-name", "email-addr", "ipv4-addr", "ipv6-addr" или "url".
            // Или все эти значения в перемешку. Между значениями в поле 'Value' используется логика "ИЛИ".
            value: [],
        }
    ],
    // содержит поля не входящие в основную спецификацию STIX 2.0 и расширяющие набор некоторых свойств 
    // объектов STIX. Логика между ними это "ИЛИ", пустое содержимое полей не учитывается 
    outsideSpecificationSearchFields: {
        decisionsMadeComputerThreat: "", // принятые решения по компьютерной угрозе
        computerThreatType: "", // тип компьютерной угрозы
    }
 */

export default function CreatePatternSearchFilters(props){
    let { 
        patternFilters, 
        listTypesDecisionsMadeComputerThreat,
        handlerDeleteFilters, 
    } = props;

    let getOperatorORParent = (previousElem, nextElem) => {
        if((typeof previousElem === "undefined") || (typeof nextElem === "undefined")){
            return;
        }

        if((previousElem === null) || (nextElem === null)){
            return (previousElem && nextElem)? <span style={{ color: red[400] }}>&nbsp;ИЛИ&nbsp;</span>: "";
        } else {
            return (previousElem.length > 0 && nextElem.length > 0)? <span style={{ color: red[400] }}>&nbsp;ИЛИ&nbsp;</span>: ""; 
        }
    };

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
                            style={{ color: purple[400], margin: "2px" }} />{getOperatorORChild(num, patternFilters.documentsId.length)}
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

            /**
 * 
 * Надо сделать визуализацию шаблонов для свойства specificSearchFieldsElement
 * 
 */

            

            return null;
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

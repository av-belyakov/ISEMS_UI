"use strict";

import React from "react";
import {
    Button,
    Chip, 
    Grid,
    Typography, 
    TextField, 
    MenuItem,
} from "@material-ui/core";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { cyan, deepOrange, teal, red, green, orange, pink, purple } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";

const listSearchTypeElement = [
    {
        name: "documentId",
        description: "id документа",
    },
    {
        name: "created",
        description: "дата и время создания документа",
    },
    {
        name: "modified",
        description: "дата и время модификации документа",
    },
    {
        name: "createdByRef",
        description: "идентификатор источника создавшего доклад",
    },
    {
        name: "name",
        description: "наименование",
    },
    {
        name: "aliases",
        description: "псевдоним",
    },
    {
        name: "firstSeen",
        description: "дата и время первого обнаружения информации",
    },
    {
        name: "lastSeen",
        description: "дата и время последнего обнаружения информации",
    },
    {
        name: "published",
        description: "дата и время публикации Доклада (начиная от заданной даты до настоящего времени)",
    },
    {
        name: "roles",
        description: "роль",
    },
    {
        name: "country",
        description: "страна",
    },
    {
        name: "city",
        description: "город",
    },
    {
        name: "numberAutonomousSystem",
        description: "номер автономной системы",
    },
    {
        name: "domain-name",
        description: "доменное имя",
    }, 
    {
        name: "email-addr",
        description: "email адрес",
    }, 
    {
        name: "ipv4-addr",
        description: "IPv4 адрес",
    }, 
    {
        name: "ipv6-addr",
        description: "IPv4 адрес",
    },
    {
        name: "url",
        description: "URL",
    },
];

const tzoffset = (new Date()).getTimezoneOffset() * 60000;
const dateTimeStartTmp = new Date("2022-01-01 00:00:01"),
    dateTimeEndTmp = new Date();

export default function CreateSearchElementReport(props){
    let { 
        socketIo, 
        userPermissions,
        listTypesComputerThreat,
        listTypesDecisionsMadeComputerThreat,
    } = props;
    
    let listKeysTCT = Object.keys(listTypesComputerThreat),
        listKeysTDMCT = Object.keys(listTypesDecisionsMadeComputerThreat);

    let [ searchField, setSearchField ] = React.useState("");
    let [ valuesIsInvalideSearchField, setValuesIsInvalideSearchField ] = React.useState(false);
    let [ dateTimeEnd, setDateTimeEnd ] = React.useState(dateTimeEndTmp);
    let [ dateTimeStart, setDateTimeStart ] = React.useState(dateTimeStartTmp);
    let [ selectedSearchItem, setSelectedSearchItem ] = React.useState("");
    //let [ selectedSearchItemName, setSelectedSearchItemName ] = React.useState("");
    let [ searchParameters, setSearchParameters ] = React.useState({            
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
                aliases: "",
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
        },
    });

    const selectedDateTimeElement = [
        "created",
        "modified",
        "firstSeen",
        "lastSeen",
        "published",
    ];

    const listFunc = {
        "documentId": {
            checkFunc: () => (new RegExp("^[a-zA-Z0-9_\\-]{1,}--[a-zA-Z0-9]{1,}$")).test(searchField),
            addFunc: (searchParametersTmp) => {
                let myDocumentsId = new Set(searchParametersTmp.documentsId);
                myDocumentsId.add(searchField);

                searchParametersTmp.documentsId = [];
                for(let v of myDocumentsId){
                    searchParametersTmp.documentsId.push(v);
                }

                setSearchField("");
                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.documentsId.splice(elemNum, 1);
                setSearchParameters(searchParametersTmp);
            },
        },
        "created": {
            checkFunc: () => {},
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.created = { 
                    start: new Date((+new Date(dateTimeStart)) - tzoffset).toISOString(), 
                    end: new Date((+new Date(dateTimeEnd)) - tzoffset).toISOString() 
                };

                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.created = { start: "0001-01-01T00:00:00.000+00:00", end: "0001-01-01T00:00:00.000+00:00" };
                setSearchParameters(searchParametersTmp);
            },
        },
        "modified": {
            checkFunc: () => {},
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.modified = { 
                    start: new Date((+new Date(dateTimeStart)) - tzoffset).toISOString(), 
                    end: new Date((+new Date(dateTimeEnd)) - tzoffset).toISOString() 
                };

                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.modified = { start: "0001-01-01T00:00:00.000+00:00", end: "0001-01-01T00:00:00.000+00:00" };
                setSearchParameters(searchParametersTmp);
            },
        },
        "createdByRef": {
            checkFunc: () => (new RegExp("^[a-zA-Z0-9_\\-]{1,}--[a-zA-Z0-9\\-]{1,}$")).test(searchField),
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.createdByRef = searchField;
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.createdByRef = "";
                setSearchParameters(searchParametersTmp);
            },
        },
        "name": {
            checkFunc: () => true,
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].name = searchField;
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].name = "";
                setSearchParameters(searchParametersTmp);
            },
        },
        "aliases": {
            checkFunc: () => true,
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].aliases = searchField;
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].aliases = "";
                setSearchParameters(searchParametersTmp);
            },
        },
        "firstSeen": {
            checkFunc: () => {},
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
        "lastSeen": {
            checkFunc: () => {},
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
        "published": {
            checkFunc: () => {},
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
        "roles": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
        "country": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
        "city": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
        "numberAutonomousSystem": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
        "domain-name": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        }, 
        "email-addr": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        }, 
        "ipv4-addr": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        }, 
        "ipv6-addr": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
        "url": {
            checkFunc: () => {

            },
            addFunc: (searchParametersTmp) => {

            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                
            },
        },
    };

    let handlerSearchField = (obj) => {
        setSearchField(obj.target.value);

        //        console.log("func 'handlerSearchField', selectedSearchItem: ", selectedSearchItem, " test checkFunc: ", listFunc[selectedSearchItem].checkFunc());

        setValuesIsInvalideSearchField(!listFunc[selectedSearchItem].checkFunc());
    };

    if(!userPermissions.privileged_group.status){
        return (<Grid container direction="row">
            <Grid item container md={12} justifyContent="center" className="pb-3">
                <Typography variant="caption">
                    <span  style={{ color: red[800] }}>Поиск информации невозможен. Отсутствуют необходимые права доступа.</span>
                </Typography>
            </Grid>
        </Grid>);
    }

    let buttonAddFilterIsDisabled = ((searchField.length === 0) || (selectedSearchItem === "") || (valuesIsInvalideSearchField));

    if(selectedDateTimeElement.includes(selectedSearchItem)){
        buttonAddFilterIsDisabled = false;
    }

    let filterAdd = () => {

            console.log("func 'filterAdd', selectedSearchItem: ", selectedSearchItem);

            if(typeof listFunc[selectedSearchItem] === "undefined"){
                return;
            }
            
            listFunc[selectedSearchItem].addFunc(_.cloneDeep(searchParameters));
        },
        filterDelete = (filterType, elemName = "noname", elemNum = 0) => {

            console.log("func 'filterDelete'");
            console.log(listFunc[filterType]);

            if(typeof listFunc[filterType] === "undefined"){
                return;
            }
                
            listFunc[filterType].delFunc(_.cloneDeep(searchParameters), elemName, elemNum);
        };

    return (<React.Fragment>
        <hr/>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end">
                <TextField
                    id={"select-search-type"}
                    select
                    fullWidth
                    label={"тип искомого значения"}
                    value={selectedSearchItem}
                    onChange={(obj) => setSelectedSearchItem(obj.target.value)} >
                    <MenuItem key="key-search-type-value-empty" value="">пустое значение</MenuItem>
                    {listSearchTypeElement.map((item, num) => <MenuItem key={`key-search-type-value-${item.name}-${num}`} value={item.name}>{item.description}</MenuItem>)}
                </TextField>
            </Grid>
            <Grid item container md={6} justifyContent="flex-end">
                {(() => {
                    if(selectedSearchItem === ""){
                        return;
                    } else if(selectedDateTimeElement.includes(selectedSearchItem)){
                        return (<Grid container direction="row" className="mt-1" spacing={3}>
                            <Grid item container md={6} justifyContent="flex-end">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        variant="inline"
                                        ampm={false}
                                        value={dateTimeStart}
                                        minDate={new Date("2000-01-01")}
                                        maxDate={new Date()}
                                        onChange={(date) => setDateTimeStart(date)}
                                        format="dd.MM.yyyy HH:mm"
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item container md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        variant="inline"
                                        ampm={false}
                                        value={dateTimeEnd}
                                        minDate={new Date("2000-01-01")}
                                        maxDate={new Date()}
                                        onChange={(date) => setDateTimeEnd(date)}
                                        format="dd.MM.yyyy HH:mm"
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>);
                    } else {
                        return (<TextField
                            id="id-search-field"
                            label="поле поиска"
                            value={searchField}
                            //disabled={(typeof erInfo.source_name !== "undefined")}
                            error={valuesIsInvalideSearchField}
                            fullWidth={true}
                            //helperText="обязательное для заполнения поле"
                            onChange={handlerSearchField}
                        />);
                    }
                })()}             
            </Grid>
            <Grid item container md={2} justifyContent="flex-end" className="mt-3">
                <Button size="small" onClick={filterAdd} disabled={buttonAddFilterIsDisabled}>добавить фильтр</Button>
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={6}>
                <TextField
                    id={"select-search-decisions_made_computer_threat"}
                    select
                    fullWidth
                    label={"принятое решение по компьютерной угрозе"}
                    value={searchParameters.outsideSpecificationSearchFields.decisionsMadeComputerThreat}
                    onChange={(obj) => { 
                        let searchParametersTmp = _.cloneDeep(searchParameters);
                        searchParametersTmp.outsideSpecificationSearchFields.decisionsMadeComputerThreat = obj.target.value;
                        setSearchParameters(searchParametersTmp);
                    }} >
                    <MenuItem key="key-decisions_made_computer_threat-value-empty" value="">пустое значение</MenuItem>
                    {listKeysTDMCT.map((item) => {
                        return (<MenuItem key={listTypesDecisionsMadeComputerThreat[item].ID} value={item}>
                            {listTypesDecisionsMadeComputerThreat[item].Description}
                        </MenuItem>);
                    })}
                </TextField>
            </Grid>
            <Grid item container md={6}>
                <TextField
                    id={"select-search-computer_threat_type"}
                    select
                    fullWidth
                    label={"тип компьютерной угрозы"}
                    value={searchParameters.outsideSpecificationSearchFields.computerThreatType}
                    onChange={(obj) => { 
                        let searchParametersTmp = _.cloneDeep(searchParameters);
                        searchParametersTmp.outsideSpecificationSearchFields.computerThreatType = obj.target.value;
                        setSearchParameters(searchParametersTmp);
                    }} >
                    <MenuItem key="key-computer_threat_type-value-empty" value="">пустое значение</MenuItem>
                    {listKeysTCT.map((item) => {
                        return (<MenuItem key={listTypesComputerThreat[item].ID} value={item}>
                            {listTypesComputerThreat[item].Description}
                        </MenuItem>);
                    })}
                </TextField>
            </Grid>
        </Grid>

        <Grid container direction="row" className="mt-3">
            <Grid item container md={12}>
                { //documentsId filter
                    (searchParameters.documentsId.length === 0)? 
                        "":
                        searchParameters.documentsId.map((item, num) => {
                            return (<Chip
                                key={`key_chip_documentId_${num}`}
                                label={`document_id: ${item}`}
                                onDelete={filterDelete.bind(null, "documentId", item, num)}
                                variant="outlined"
                                style={{ color: purple[400], margin: "2px" }} />);
                        })}

                { //data created filter
                    ((searchParameters.created.start === "0001-01-01T00:00:00.000+00:00") || (searchParameters.created.end === "0001-01-01T00:00:00.000+00:00"))? 
                        "":
                        <Chip
                            key={"key_chip_data_created"}
                            label={`created date: ${helpers.convertDateFromString(searchParameters.created.start, { monthDescription: "long", dayDescription: "numeric" })} - ${helpers.convertDateFromString(searchParameters.created.end, { monthDescription: "long", dayDescription: "numeric" })}`}
                            onDelete={filterDelete.bind(null, "created")}
                            variant="outlined"
                            style={{ color: deepOrange[400], margin: "2px" }} />}

                { //data modified filter
                    ((searchParameters.modified.start === "0001-01-01T00:00:00.000+00:00") || (searchParameters.modified.end === "0001-01-01T00:00:00.000+00:00"))? 
                        "":
                        <Chip
                            key={"key_chip_data_modified"}
                            label={`modified date: ${helpers.convertDateFromString(searchParameters.modified.start, { monthDescription: "long", dayDescription: "numeric" })} - ${helpers.convertDateFromString(searchParameters.modified.end, { monthDescription: "long", dayDescription: "numeric" })}`}
                            onDelete={filterDelete.bind(null, "modified")}
                            variant="outlined"
                            style={{ color: orange[400], margin: "2px" }} />}

                { //createdByRef filter
                    (searchParameters.createdByRef === "")? 
                        "":
                        <Chip
                            key={"key_chip_createdByRef"}
                            label={`source_id: ${searchParameters.createdByRef}`}
                            onDelete={filterDelete.bind(null, "createdByRef")}
                            variant="outlined"
                            style={{ color: pink[400], margin: "2px" }} />}

                { //name filter
                    (searchParameters.specificSearchFields[0].name === "")? 
                        "":
                        <Chip
                            key={"key_chip_name"}
                            label={`name: ${searchParameters.specificSearchFields[0].name}`}
                            onDelete={filterDelete.bind(null, "name")}
                            variant="outlined"
                            style={{ color: teal[400], margin: "2px" }} />}

                { //aliases filter
                    (searchParameters.specificSearchFields[0].aliases === "")? 
                        "":
                        <Chip
                            key={"key_chip_alias"}
                            label={`alias: ${searchParameters.specificSearchFields[0].aliases}`}
                            onDelete={filterDelete.bind(null, "aliases")}
                            variant="outlined"
                            style={{ color: cyan[400], margin: "2px" }} />}
            </Grid>
        </Grid>

        <Grid container direction="row" className="mt-3">
            <Grid item container md={12} justifyContent="flex-end">
                <Button
                    size="small"
                    color="secondary"
                    //style={{ borderColor: red[500] }}
                    //startIcon={<AddIcon style={{ color: green[500] }} />}
                    variant="outlined"
                    //disabled={buttonIsDisabled}
                    onClick={() => {}}>
                        поиск
                </Button>
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateSearchElementReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
    listTypesComputerThreat: PropTypes.object.isRequired,
    listTypesDecisionsMadeComputerThreat: PropTypes.object.isRequired,
};
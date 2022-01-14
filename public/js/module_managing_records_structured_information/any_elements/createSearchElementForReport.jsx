"use strict";

import React from "react";
import { 
    Grid,
    Typography, 
    TextField, 
    MenuItem,
} from "@material-ui/core";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { red } from "@material-ui/core/colors";
import PropTypes from "prop-types";

const listSearchTypeElement = [
    {
        name: "documentId",
        description: "id документа",
        regPattern: "",
    },
    {
        name: "created",
        description: "дата и время создания документа",
        regPattern: "",
    },
    {
        name: "modified",
        description: "дата и время модификации документа",
        regPattern: "",
    },
    {
        name: "createdByRef",
        description: "идентификатор источника создавшего доклад",
        regPattern: "",
    },
    {
        name: "name",
        description: "наименование",
        regPattern: "",
    },
    {
        name: "aliases",
        description: "псевдоним",
        regPattern: "",
    },
    {
        name: "firstSeen",
        description: "дата и время первого обнаружения информации",
        regPattern: "",
    },
    {
        name: "lastSeen",
        description: "дата и время последнего обнаружения информации",
        regPattern: "",
    },
    {
        name: "published",
        description: "дата и время публикации Доклада (начиная от заданной даты до настоящего времени)",
        regPattern: "",
    },
    {
        name: "roles",
        description: "роль",
        regPattern: "",
    },
    {
        name: "country",
        description: "страна",
        regPattern: "",
    },
    {
        name: "city",
        description: "город",
        regPattern: "",
    },
    {
        name: "numberAutonomousSystem",
        description: "номер автономной системы",
        regPattern: "",
    },
    {
        name: "domain-name",
        description: "доменное имя",
        regPattern: "",
    }, 
    {
        name: "email-addr",
        description: "email адрес",
        regPattern: "",
    }, 
    {
        name: "ipv4-addr",
        description: "IPv4 адрес",
        regPattern: "",
    }, 
    {
        name: "ipv6-addr",
        description: "IPv4 адрес",
        regPattern: "",
    },
    {
        name: "url",
        description: "URL",
        regPattern: "",
    },
];

const dateTimeStartTmp = new Date("2022-01-01"),
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

    let handlerSearchField = (obj) => {
        setSearchField(obj.target.value);
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

    return (<React.Fragment>
        <hr/>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
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
            <Grid item container md={7} justifyContent="flex-end">
                {(() => {
                    let listTmp = [
                        "created",
                        "modified",
                        "firstSeen",
                        "lastSeen",
                        "published",
                    ];

                    if(selectedSearchItem === ""){
                        return;
                    } else if(listTmp.includes(selectedSearchItem)){
                        return <Grid container direction="row" className="pt-6" spacing={3}>
                            <Grid item container md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        variant="inline"
                                        ampm={false}
                                        value={dateTimeStart}
                                        minDate={new Date("2000-01-01")}
                                        maxDate={new Date()}
                                        onChange={(obj) => setDateTimeStart(obj.target.value)}
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
                                        onChange={(obj) => setDateTimeEnd(obj.target.value)}
                                        format="dd.MM.yyyy HH:mm"
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>;
                    } else {
                        return (<TextField
                            id="id-search-field"
                            label="поле поиска"
                            value={searchField}
                            //disabled={(typeof erInfo.source_name !== "undefined")}
                            //error={valuesIsInvalideReportName}
                            fullWidth={true}
                            //helperText="обязательное для заполнения поле"
                            onChange={handlerSearchField}
                        />);
                    }
                })()}             
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
    </React.Fragment>);
}

CreateSearchElementReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
    listTypesComputerThreat: PropTypes.object.isRequired,
    listTypesDecisionsMadeComputerThreat: PropTypes.object.isRequired,
};
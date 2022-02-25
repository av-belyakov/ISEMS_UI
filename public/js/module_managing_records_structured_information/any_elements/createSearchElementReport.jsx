"use strict";

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography, 
    TextField, 
    MenuItem,
    IconButton,
} from "@material-ui/core";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SearchIcon from "@material-ui/icons/Search";
import { blue, red, green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import validatorjs from "validatorjs";

import { helpers } from "../../common_helpers/helpers";
import CreatePatternSearchFilters from "./createPatternSearchFilters.jsx";
import { CreateListTypesDecisionsMadeComputerThreat, CreateListTypesComputerThreat } from "./anyElements.jsx";

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
        description: "идентификатор источника создавшего Отчёт",
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
        description: "дата и время публикации Отчёта (начиная от заданной даты до настоящего времени)",
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
        description: "IPv6 адрес",
    },
    {
        name: "url",
        description: "URL",
    },
];

const patternSearchParameters = {            
    documentsId: [],
    documentsType: ["report"],
    // если заполнены оба поля 'created' и 'modified' то тогда для поиска по данным из обоих полей работает логика "ИЛИ"
    // значение "0001-01-01T00:00:00.000Z" для полей с датами эквивалентно значению пустого поля
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
            published: "1970-01-01T00:00:00.000+00:00", // при значении "1970-01-01T00:00:00.000+00:00" параметр не учитывается
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
};

const tzoffset = (new Date()).getTimezoneOffset() * 60000;
const dateTimeStartTmp = new Date("2022-01-01 00:00:01"),
    dateTimeEndTmp = Date.now();
const defaultDateTime = "0001-01-01T00:00:00.000+00:00";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

export default function CreateSearchElementReport(props){
    let {
        socketIo,
        addNewReport,
        userPermissions,
        handlerSendSearchRequest,
        handlerChangeSendNewSearch,
        handlerChangeAddedNewReport,
    } = props;

    let [ searchField, setSearchField ] = useState("");
    let [ valuesIsInvalideSearchField, setValuesIsInvalideSearchField ] = useState(false);
    let [ dateTimeEnd, setDateTimeEnd ] = useState(dateTimeEndTmp);
    let [ dateTimeStart, setDateTimeStart ] = useState(dateTimeStartTmp);
    let [ selectedSearchItem, setSelectedSearchItem ] = useState("");
    let [ searchParameters, setSearchParameters ] = useState(patternSearchParameters);
    let [ previousSearchParameters, setPreviousSearchParameters ] = useState(patternSearchParameters);
    let [ showBottonClean, setShowBottonClean ] = useState(false);

    useEffect(() => {
        let listener = (data) => {
            if((data.information === null) || (typeof data.information === "undefined")){
                return;
            }
    
            if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                return;
            }
    
            switch(data.section){
            case "send search request, count found elem, table page report":
                if(!_.isEqual(searchParameters, previousSearchParameters)){
                    setShowBottonClean(true);
                }
    
                if(_.isEqual(searchParameters, patternSearchParameters)){
                    setShowBottonClean(false);
                }
    
                break;
            }
        };

        socketIo.on("isems-mrsi response ui", listener);
            
        return () => {
            socketIo.off("isems-mrsi response ui", listener);
        };
    }, [ setShowBottonClean ]);

    const classes = useStyles();

    console.log("func 'CreateSearchElementReport', MOUNT +++ (SEARCH Element Report) +++");

    let supportFuncAddValue = (searchParametersTmp) => {
            let myValue = new Set(searchParametersTmp.specificSearchFields[0].value);
            myValue.add(searchField);

            searchParametersTmp.specificSearchFields[0].value = [];
            for(let v of myValue){
                searchParametersTmp.specificSearchFields[0].value.push(v);
            }

            setSearchField("");
            setSelectedSearchItem("");
            setSearchParameters(searchParametersTmp);
        },
        supportFuncDelValue = (searchParametersTmp, elemNum) => {
            searchParametersTmp.specificSearchFields[0].value.splice(elemNum, 1);
            setSearchParameters(searchParametersTmp);

            return searchParametersTmp;
        };

    const selectedDateTimeElement = [
        "created",
        "modified",
        "firstSeen",
        "lastSeen",
    ];

    const listFunc = {
        "documentId": {
            checkFunc: (value) => (new RegExp("^[a-zA-Z0-9_\\-]{1,}--[a-zA-Z0-9\\-]{1,}$")).test(value),
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

                return searchParametersTmp;
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
                searchParametersTmp.created = { start: defaultDateTime, end: defaultDateTime };
                setSearchParameters(searchParametersTmp);

                return searchParametersTmp;
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
                searchParametersTmp.modified = { start: defaultDateTime, end: defaultDateTime };
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "createdByRef": {
            checkFunc: (value) => (new RegExp("^[a-zA-Z0-9_\\-]{1,}--[a-zA-Z0-9\\-]{1,}$")).test(value),
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.createdByRef = searchField;

                setSearchField("");
                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.createdByRef = "";
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "name": {
            checkFunc: () => true,
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].name = searchField;

                setSearchField("");
                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].name = "";
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "aliases": {
            checkFunc: () => true,
            addFunc: (searchParametersTmp) => {
                let myAliases = new Set(searchParametersTmp.specificSearchFields[0].aliases);
                myAliases.add(searchField);

                searchParametersTmp.specificSearchFields[0].aliases = [];
                for(let v of myAliases){
                    searchParametersTmp.specificSearchFields[0].aliases.push(v);
                }

                setSearchField("");
                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].aliases.splice(elemNum, 1);
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "firstSeen": {
            checkFunc: () => {},
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].firstSeen = { 
                    start: new Date((+new Date(dateTimeStart)) - tzoffset).toISOString(), 
                    end: new Date((+new Date(dateTimeEnd)) - tzoffset).toISOString() 
                };

                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].firstSeen = { start: defaultDateTime, end: defaultDateTime };
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "lastSeen": {
            checkFunc: () => {},
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].lastSeen = { 
                    start: new Date((+new Date(dateTimeStart)) - tzoffset).toISOString(), 
                    end: new Date((+new Date(dateTimeEnd)) - tzoffset).toISOString() 
                };

                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].lastSeen = { start: defaultDateTime, end: defaultDateTime };
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "published": {
            checkFunc: () => {},
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].published = new Date((+new Date(dateTimeStart)) - tzoffset).toISOString();

                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].published = "1970-01-01T00:00:00.000+00:00";
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "roles": {
            checkFunc: () => true,
            addFunc: (searchParametersTmp) => {
                let myRoles = new Set(searchParametersTmp.specificSearchFields[0].roles);
                myRoles.add(searchField);

                searchParametersTmp.specificSearchFields[0].roles = [];
                for(let v of myRoles){
                    searchParametersTmp.specificSearchFields[0].roles.push(v);
                }

                setSearchField("");
                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].roles.splice(elemNum, 1);
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "country": {
            checkFunc: () => true,
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].country = searchField;

                setSearchField("");
                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].country = "";
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "city": {
            checkFunc: () => true,
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].city = searchField;

                setSearchField("");
                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].city = "";
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "numberAutonomousSystem": {
            checkFunc: (value) => validatorjs.isInt(value, { min: 1 }),
            addFunc: (searchParametersTmp) => {
                searchParametersTmp.specificSearchFields[0].numberAutonomousSystem = +searchField;

                setSearchField("");
                setSelectedSearchItem("");
                setSearchParameters(searchParametersTmp);
            },
            delFunc: (searchParametersTmp, elemName, elemNum) => {
                searchParametersTmp.specificSearchFields[0].numberAutonomousSystem = 0;
                setSearchParameters(searchParametersTmp);
            
                return searchParametersTmp;
            },
        },
        "domain-name": {
            checkFunc: (value) => helpers.checkInputValidation({ name: "domanName", value: value }),
            addFunc: (searchParametersTmp) => supportFuncAddValue(searchParametersTmp),
            delFunc: (searchParametersTmp, elemName, elemNum) => supportFuncDelValue(searchParametersTmp, elemNum),
        }, 
        "email-addr": {
            checkFunc: (value) => validatorjs.isEmail(value),
            addFunc: (searchParametersTmp) => supportFuncAddValue(searchParametersTmp),
            delFunc: (searchParametersTmp, elemName, elemNum) => supportFuncDelValue(searchParametersTmp, elemNum),
        }, 
        "ipv4-addr": {
            checkFunc: (value) => validatorjs.isIP(value, 4),
            addFunc: (searchParametersTmp) => supportFuncAddValue(searchParametersTmp),
            delFunc: (searchParametersTmp, elemName, elemNum) => supportFuncDelValue(searchParametersTmp, elemNum),
        }, 
        "ipv6-addr": {
            checkFunc: (value) => validatorjs.isIP(value, 6),
            addFunc: (searchParametersTmp) => supportFuncAddValue(searchParametersTmp),
            delFunc: (searchParametersTmp, elemName, elemNum) => supportFuncDelValue(searchParametersTmp, elemNum),
        },
        "url": {
            checkFunc: (value) => validatorjs.isURL(value, { 
                protocols: ["http","https","ftp"],
            }),
            addFunc: (searchParametersTmp) => supportFuncAddValue(searchParametersTmp),
            delFunc: (searchParametersTmp, elemName, elemNum) => supportFuncDelValue(searchParametersTmp, elemNum),
        },
    };

    let handlerSearchField = (obj) => {
        setSearchField(obj.target.value);
        setValuesIsInvalideSearchField(!listFunc[selectedSearchItem].checkFunc(obj.target.value));
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
    let buttonSearchIsDisabled = _.isEqual(searchParameters, patternSearchParameters);
    buttonSearchIsDisabled = _.isEqual(searchParameters, previousSearchParameters);

    if((selectedDateTimeElement.includes(selectedSearchItem) || (selectedSearchItem === "published"))){
        buttonAddFilterIsDisabled = false;
    }

    let filterAdd = () => {
            if(typeof listFunc[selectedSearchItem] === "undefined"){
                return;
            }
            
            setPreviousSearchParameters(_.cloneDeep(searchParameters));
            listFunc[selectedSearchItem].addFunc(_.cloneDeep(searchParameters));
        },
        filterDelete = (filterType, elemName = "noname", elemNum = 0) => {
            if(typeof listFunc[filterType] === "undefined"){
                return;
            }
                
            let searchParametersTmp = listFunc[filterType].delFunc(_.cloneDeep(searchParameters), elemName, elemNum);

            if(_.isEqual(searchParametersTmp, patternSearchParameters)){
                setShowBottonClean(false);
            }
        };
    let handlerDecisionsMadeComputerThreat = (data) => {
            let searchParametersTmp = _.cloneDeep(searchParameters);
            searchParametersTmp.outsideSpecificationSearchFields.decisionsMadeComputerThreat = data;
            setSearchParameters(searchParametersTmp);
        },
        handlerTypesComputerThreat = (data) => {
            let searchParametersTmp = _.cloneDeep(searchParameters);
            searchParametersTmp.outsideSpecificationSearchFields.computerThreatType = data;
            setSearchParameters(searchParametersTmp);
        };

    if(addNewReport){
        setTimeout(() => {
            handlerSendSearchRequest(searchParameters);
            handlerChangeAddedNewReport();
        }, 1500);
    }

    return (<Paper elevation={3}>
        <Box m={2} pb={2}>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={3}>
                    <TextField
                        id={"select-search-type"}
                        select
                        fullWidth
                        label={"тип искомого значения"}
                        value={selectedSearchItem}
                        onChange={(obj) => setSelectedSearchItem(obj.target.value)} >
                        <MenuItem key="key-search-type-value-empty" value="">пустое значение</MenuItem>
                        {(searchParameters.documentsId.length > 0)?
                            <MenuItem key={"key-search-type-value-documentId"} value="documentId">id документа</MenuItem>:
                            (listSearchTypeElement.map((item, num) => <MenuItem key={`key-search-type-value-${item.name}-${num}`} value={item.name}>
                                {item.description}
                            </MenuItem>))}
                    </TextField>
                </Grid>

                <Grid item container md={5}>
                    {(() => {
                        if(selectedSearchItem === ""){
                            return;
                        } else if(selectedDateTimeElement.includes(selectedSearchItem)){
                            return (<Grid container direction="row" className="mt-1" spacing={3}>
                                <Grid item container md={4} justifyContent="flex-end">
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

                                <Grid item container md={4} justifyContent="flex-start">
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
                                <Grid item container md={4} justifyContent="flex-end">
                                    <Button 
                                        size="small" 
                                        onClick={filterAdd} 
                                        style={{ color: green[400] }}
                                    >
                                        добавить время
                                    </Button>
                                </Grid>
                            </Grid>);
                        } else if(selectedSearchItem === "published") {
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

                                <Grid item container md={6} justifyContent="flex-start">
                                    <Button 
                                        size="small" 
                                        onClick={filterAdd} 
                                        style={{ color: green[400] }}
                                    >
                                        добавить время
                                    </Button>
                                </Grid>
                            </Grid>);
                        } else {
                            return (<Grid container direction="row" className="mt-3">
                                <Grid item container md={12}>
                                    <TextField
                                        className={classes.input}
                                        placeholder="поле поиска"
                                        fullWidth={true}
                                        value={searchField}
                                        error={valuesIsInvalideSearchField}
                                        onChange={handlerSearchField}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton 
                                                    size="small"
                                                    onClick={filterAdd} 
                                                    disabled={buttonAddFilterIsDisabled}
                                                    aria-label="добавить фильтр">
                                                    <AddCircleIcon style={{ color: green[400] }} />
                                                </IconButton>
                                            )}}
                                    />
                                </Grid>
                            </Grid>);
                        }})()}  
                </Grid>
        
                <Grid item container md={2}>
                    <CreateListTypesDecisionsMadeComputerThreat
                        socketIo={socketIo}
                        defaultValue={() => ""}
                        handlerDecisionsMadeComputerThreat={handlerDecisionsMadeComputerThreat}
                    />
                </Grid>
        
                <Grid item container md={2}>
                    <CreateListTypesComputerThreat
                        socketIo={socketIo}
                        defaultValue={() => ""}
                        handlerTypesComputerThreat={handlerTypesComputerThreat}
                    />
                </Grid>
            </Grid>

            <CreatePatternSearchFilters 
                patternFilters={searchParameters} 
                handlerDeleteFilters={filterDelete} 
            />

            <Grid container direction="row" spacing={3}>
                <Grid item container md={12} justifyContent="flex-end">
                    {(showBottonClean)?
                        <span><Button
                            size="small"
                            color="secondary"
                            style={{ color: red[400] }}
                            startIcon={<DeleteOutlineIcon style={{ color: red[400] }} />}
                            onClick={() => {
                                setShowBottonClean(false);
                                setSearchParameters(patternSearchParameters);
                            }}>
                            очистить
                        </Button>&nbsp;</span>:""}
                    <Button
                        size="small"
                        color="secondary"
                        style={{ color: blue[400] }}
                        startIcon={<SearchIcon style={{ color: blue[400] }} />}
                        disabled={buttonSearchIsDisabled}
                        onClick={() => {
                            handlerSendSearchRequest(searchParameters);
                            handlerChangeSendNewSearch();
                            setPreviousSearchParameters(searchParameters);
                        }}>
                        поиск
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </Paper>);
}

CreateSearchElementReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    addNewReport: PropTypes.bool.isRequired, 
    userPermissions: PropTypes.object.isRequired,
    handlerSendSearchRequest: PropTypes.func.isRequired,
    handlerChangeSendNewSearch: PropTypes.func.isRequired,
    handlerChangeAddedNewReport: PropTypes.func.isRequired,
};

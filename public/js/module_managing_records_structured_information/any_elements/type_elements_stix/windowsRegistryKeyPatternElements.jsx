import React, { useState, useReducer } from "react";
import { 
    Button,
    Card,
    CardActions,
    CardContent,
    Typography, 
    TextField,
    Grid,
    IconButton,
    Collapse,
} from "@material-ui/core";
import DateFnsUtils from "dateIoFnsUtils";
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import { grey, green, red } from "@material-ui/core/colors";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";
import { CreateListWindowsRegistryDatatype  } from "../anyElements.jsx";

const defaultData = "0001-01-01T00:00";
const minDefaultData = "1970-01-01T00:00:00.000Z";
//const minDefaultData = new Date();

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

export default function CreateWindowsRegistryKeyPatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement,
        handlerKey,
        handlerModifiedTime,
        handlerAddItemValues,
        handlerButtonShowLink,
        handlerNumberOfSubkeys,
        handlerDeleteItemValues,
    } = props;

    let [ invalidKey, setInvalidKey ] = useState(false);

    let modifiedTime = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.modified_time !== "undefined" && campaignPatterElement.modified_time.slice(0, 16) !== defaultData){
            modifiedTime = new Date(Date.parse(campaignPatterElement.modified_time) + ms);
        }
    } else {
        if(typeof campaignPatterElement.modified_time !== "undefined" && campaignPatterElement.modified_time.slice(0, 16) !== defaultData){
            modifiedTime = new Date(Date.parse(campaignPatterElement.modified_time) - (ms * -1));
        }
    }

    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

    let handleExpandClick = (id) => {
        if(id === refId && expanded){
            setExpanded(false);
            
            return;
        }

        if(id !== refId){
            setExpanded(true); 
            setRefId(id);
        } else {            
            setExpanded(!expanded);
        }

        handlerButtonShowLink(id);
    };

    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Полный путь к разделу реестра:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-key"
                    fullWidth
                    error={invalidKey}
                    size="small"
                    disabled={isDisabled}
                    onChange={(e) => {
                        if(e.target.value.length === 0){
                            setInvalidKey(true);

                            return;
                        } else {
                            setInvalidKey(false);
                        }

                        handlerKey(e);
                    }}
                    value={(campaignPatterElement.key)? campaignPatterElement.key: ""}
                    helperText="обязательное поле"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Время последнего изменения раздела реестра:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(modifiedTime, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={modifiedTime}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerModifiedTime}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        {campaignPatterElement.creator_user_ref && (typeof campaignPatterElement.creator_user_ref !== "undefined") && campaignPatterElement.creator_user_ref.length !== 0?
            <Grid container direction="row" spacing={3} style={{ paddingTop: 1 }}>
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted mt-3">Учетная запись пользователя, из под которой был создан раздел реестра:</span>
                </Grid>
                <Grid item container md={7}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.creator_user_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.creator_user_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.creator_user_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.creator_user_ref && refId === campaignPatterElement.creator_user_ref && expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <CreateShortInformationSTIXObject 
                                    obj={showRefElement.obj}
                                    handlerClick={() => {}} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Количество подразделов, содержащихся в разделе реестра:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-number_of_subkeys"
                    //multiline
                    //minRows={3}
                    //maxRows={8}
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={(e) => {
                        let number = e.target.value;
                        if(!new RegExp("^[0-9]{1,}$").test(number) || number[0] === "0"){
                            return;
                        }

                        handlerNumberOfSubkeys(number);
                    }}
                    value={(campaignPatterElement.number_of_subkeys)? campaignPatterElement.number_of_subkeys: ""}
                    helperText="поле может содержать только цифры"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Значения относящиеся к разделу реестра:</span>
            </Grid>
        </Grid>
        <GetWindowsRegistryValue  
            objectInfo={campaignPatterElement}
            handlerElementAdd={handlerAddItemValues}
            handlerElementDelete={handlerDeleteItemValues}
        />

        {/*(campaignPatterElement !== null && campaignPatterElement.extensions)?
            <Grid container direction="row" spacing={3}>
                <Grid item md={4} className="text-end mt-2">
                    <span className="text-muted">Дополнительные расширения:</span>
                </Grid>
                <Grid item md={8}>
                    <JSONTree 
                        data={campaignPatterElement.extensions} 
                        theme={{
                            base00: "#272822",
                            base01: "#383830",
                            base02: "#49483e",
                            base03: "#75715e",
                            base04: "#a59f85",
                            base05: "#f8f8f2",
                            base06: "#f5f4f1",
                            base07: "#f9f8f5",
                            base08: "#f92672",
                            base09: "#fd971f",
                            base0A: "#f4bf75",
                            base0B: "#a6e22e",
                            base0C: "#a1efe4",
                            base0D: "#66d9ef",
                            base0E: "#ae81ff",
                            base0F: "#cc6633",
                        }}
                        hideRoot
                    />
                </Grid>
            </Grid>:
                    ""*/}
    </React.Fragment>);
}

CreateWindowsRegistryKeyPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerKey: PropTypes.func.isRequired,
    handlerModifiedTime: PropTypes.func.isRequired,
    handlerAddItemValues: PropTypes.func.isRequired,
    handlerButtonShowLink: PropTypes.func.isRequired,
    handlerNumberOfSubkeys: PropTypes.func.isRequired,
    handlerDeleteItemValues: PropTypes.func.isRequired,
};

/**
// WindowsRegistryKeyCyberObservableObjectSTIX объект "Windows Registry Key Object", по терминалогии STIX. Содержит описание значений полей раздела реестра Windows.
//  Key - содержит полный путь к разделу реестра. Значение ключа,должно быть сохранено в регистре. В название ключа все сокращения должны быть раскрыты.
//  Values - содержит значения, найденные в разделе реестра.
//  ModifiedTime - время, в формате "2016-05-12T08:17:27.000Z", последнего изменения раздела реестра.
//  CreatorUserRef - содержит ссылку на учетную запись пользователя, из под которой создан раздел реестра. Объект, на который ссылается это свойство, должен иметь тип user-account.
//  NumberOfSubkeys - Указывает количество подразделов, содержащихся в разделе реестра.
type WindowsRegistryKeyCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Key             string                         `json:"key" bson:"key"`
	Values          []WindowsRegistryValueTypeSTIX `json:"values" bson:"values"`
	ModifiedTime    time.Time                      `json:"modified_time" bson:"modified_time"`
	CreatorUserRef  IdentifierTypeSTIX             `json:"creator_user_ref" bson:"creator_user_ref"`
	NumberOfSubkeys int                            `json:"number_of_subkeys" bson:"number_of_subkeys"`
}
 */

let patternWindowsRegistryValue = {
    name: "",
    data: "",
    data_type: "",
};

function reducerRegValue(state, action){
    switch(action.type) {
    case "name":
        return {...state, name: action.data};
    case "data":
        return {...state, data: action.data};
    case "data_type":
        return {...state, data_type: action.data};
    case "clear":
        return {...state, patternWindowsRegistryValue};
    }
}

function GetWindowsRegistryValue(props){
    let {  
        objectInfo,
        handlerElementAdd,
        handlerElementDelete,
    } = props;

    const classes = useStyles();

    let [ winRegValue, reducerWinRegValue ] = useReducer(reducerRegValue, patternWindowsRegistryValue);
    let [ buttonAddSelectorIsDisabled, setButtonAddSelectorIsDisabled ] = useState(true);

    let handlerCheckWinRegValue = () => {
        let wrvNameIsTrue = winRegValue.name && winRegValue.name !== "";
        let wrvDataIsTrue = winRegValue.data && winRegValue.data !== "";
        let wrvDataTupeIsTrue = winRegValue.data_type && winRegValue.data_type !== "";
        
        if(wrvNameIsTrue || wrvDataIsTrue || wrvDataTupeIsTrue){
            setButtonAddSelectorIsDisabled(false);
        } else {
            setButtonAddSelectorIsDisabled(true);
        }
    };

    return (<Grid container direction="row" key="key_granular_markings_link">
        <Grid container direction="row" spacing={3}>
            <Grid item md={4}>
                <TextField
                    id="windows-registry-value-name"
                    label="наименование параметра реестра"
                    fullWidth={true}
                    value={winRegValue.name}
                    onChange={(e) => { reducerWinRegValue({ type: "name", data: e.target.value }); handlerCheckWinRegValue(); }}
                />
            </Grid>
            <Grid item md={8}>
                <TextField
                    id="windows-registry-value-data"
                    label="данные, содержащиеся в значении реестра"
                    fullWidth={true}
                    value={winRegValue.data}
                    onChange={(e) => { reducerWinRegValue({ type: "data", data: e.target.value }); handlerCheckWinRegValue(); }}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" key="key_input_hash_field">
            <Grid item md={10}>
                <CreateListWindowsRegistryDatatype 
                    isDisabled={false}
                    windowsRegistryDatatype={winRegValue.data_type}
                    handlerWindowsRegistryDatatype={(e) => { reducerWinRegValue({ type: "data_type", data: e.target.value }); handlerCheckWinRegValue(); }}
                />
            </Grid>
            <Grid item md={2} className="text-end mt-3">
                <Button 
                    onClick={handlerElementAdd.bind(null, winRegValue)} 
                    disabled={buttonAddSelectorIsDisabled}
                >
                    добавить
                </Button>
            </Grid>
        </Grid>

        {((typeof objectInfo.values === "undefined") || (objectInfo.values === null) || (objectInfo.values.length === 0))?
            "":
            objectInfo.values.map((item, key) => {
                return (<Card className={classes.customPaper} key={`key_value_${key}_fragment`}>
                    <CardContent>
                        <Grid container direction="row" key={`key_icon_delete_${key}`}>
                            <Grid item container md={12} justifyContent="flex-end">
                                <IconButton aria-label="delete" onClick={()=>{ 
                                    handlerElementDelete(key); 
                                }}>
                                    <IconDeleteOutline style={{ color: red[400] }} />
                                </IconButton>
                            </Grid>
                        </Grid>

                        {((typeof item.name === "undefined") || (item.name === null) || (item.name.length === 0) ? 
                            "": 
                            <Grid container direction="row" key={`key_name_${key}`}>
                                <Grid item md={12}>
                                    <Typography variant="body2" component="p"><span className="text-muted">наименование:</span> {item.name}</Typography>
                                </Grid>
                            </Grid>)}

                        {((typeof item.data === "undefined") || (item.data === null) || (item.data.length === 0) ? 
                            "": 
                            <Grid container direction="row" key={`key_data_${key}`}>
                                <Grid item md={12}>
                                    <Typography variant="body2" component="p"><span className="text-muted">данные:</span> {item.data}</Typography>
                                </Grid>
                            </Grid>)}

                        {((typeof item.data_type === "undefined") || (item.data_type === null) || (item.data_type.length === 0) ? 
                            "": 
                            <Grid container direction="row" key={`key_data_type_${key}`}>
                                <Grid item md={12}>
                                    <Typography variant="body2" component="p"><span className="text-muted">тип данных:</span> {item.data_type}</Typography>
                                </Grid>
                            </Grid>)}
                    </CardContent>
                </Card>);
            })}
    </Grid>);
}

GetWindowsRegistryValue.propTypes = { 
    objectInfo: PropTypes.object.isRequired,
    handlerElementAdd: PropTypes.func.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
};
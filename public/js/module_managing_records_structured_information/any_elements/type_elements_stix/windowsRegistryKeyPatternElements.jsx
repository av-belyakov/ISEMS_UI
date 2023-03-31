import React, { useState } from "react";
import { 
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography, 
    TextField,
    Grid,
    IconButton,
    Collapse,
//    IconButton,
} from "@material-ui/core";
//import { Form } from "react-bootstrap";
//import { red } from "@material-ui/core/colors";
import DateFnsUtils from "dateIoFnsUtils";
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import { grey, green, red, blue } from "@material-ui/core/colors";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { cloneDeep } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";
import { CreateListWindowsRegistryDatatype  } from "../anyElements.jsx";

const defaultData = "0001-01-01T00:00";
const minDefaultData = "1970-01-01T00:00:00.000Z";
//const minDefaultData = new Date();

export default function CreateWindowsRegistryKeyPatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement,
        handlerKey,
        handlerModifiedTime,
        handlerButtonShowLink,
        handlerNumberOfSubkeys,

        /*handlerCWD,
        handlerPID,
        handlerClick,
        handlerIsHidden,
        handlerCreatedTime,
        handlerCommandLine,
        handlerButtonShowLink,
        handlerAddEnvironmentVariables,
        handlerDeleteEnviromentVariableElement,*/
    } = props;

    let [ invalidKey, setInvalidKey ] = useState(false);

    let modifiedTime = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    console.log("_____=== func 'CreateProcessPatternElements', showRefElement:", showRefElement, " campaignPatterElement = ", campaignPatterElement);
    console.log("showRefElement.id = ", showRefElement.id, " campaignPatterElement.creator_user_ref = ", campaignPatterElement.creator_user_ref, " refId = ", refId, " expanded = ", expanded);

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

    let handlerWindowsRegistryDatatype = (item) => {
        console.log("func 'handlerWindowsRegistryDatatype', item = ", item);
    };

    /*const getListEnviromentVariables = (envList) => {
        if(typeof envList === "undefined"){
            return "";
        }

        if(Array.isArray(envList) && envList.length === 0){
            return "";
        }

        let tmpList = [];
        for(let k in envList){
            let objTmp = {};
            objTmp[k] = envList[k];
            tmpList.push(objTmp);
        }

        let key, value = "";
        return (<React.Fragment>
            <Grid container direction="row">
                <Grid item container md={12} justifyContent="flex-start">
                    <span className="text-muted">
                    Список переменных окружения:
                    </span>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item container md={12} justifyContent="flex-start">
                    <ol>
                        {tmpList.map((item, num) => {
                            for(let k in item){
                                key = k;
                                value = item[k];
                            }

                            return (<li key={`key_item_env_${num}`}>
                                {key}:&nbsp;&nbsp;&nbsp;{value}&nbsp;
                                <IconButton aria-label="delete-hash" onClick={handlerDeleteEnviromentVariableElement.bind(null, key)}>
                                    {isDisabled? "": <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />}
                                </IconButton>
                            </li>);
                        })}
                    </ol>
                </Grid>
            </Grid>
        </React.Fragment>);
    };*/

    /**
Key - содержит полный путь к разделу реестра. Значение ключа,должно быть сохранено в регистре. В название ключа все сокращения должны быть раскрыты.
//  Values - содержит значения, найденные в разделе реестра.
//  ModifiedTime - время, в формате "2016-05-12T08:17:27.000Z", последнего изменения раздела реестра.
//  CreatorUserRef - содержит ссылку на учетную запись пользователя, из под которой создан раздел реестра. Объект, на который ссылается это свойство, должен иметь тип user-account.
//  NumberOfSubkeys - Указывает количество подразделов, содержащихся в разделе реестра.
type WindowsRegistryKeyCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	+ Key             string                         `json:"key" bson:"key"`
	Values          []WindowsRegistryValueTypeSTIX `json:"values" bson:"values"`
	+ ModifiedTime    time.Time                      `json:"modified_time" bson:"modified_time"`
	+ CreatorUserRef  IdentifierTypeSTIX             `json:"creator_user_ref" bson:"creator_user_ref"`
	+ NumberOfSubkeys int                            `json:"number_of_subkeys" bson:"number_of_subkeys"`
 */

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
            objectId={""}
            objectInfo={campaignPatterElement}
            handlerElementAdd={() => {}}
            handlerElementDelete={() => {}}
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
    handlerButtonShowLink: PropTypes.func.isRequired,
    handlerNumberOfSubkeys: PropTypes.func.isRequired,
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

/*
<CreateListWindowsRegistryDatatype 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement}
            handlerWindowsRegistryDatatype={handlerWindowsRegistryDatatype}
        />
          
         * "windows-registry-datatype-enum"
         * 
         * 
         * Values          []WindowsRegistryValueTypeSTIX `json:"values" bson:"values"`  
         * 
         * // WindowsRegistryValueTypeSTIX объект "Windows Registry Value Type", по терминалогии STIX. Данный тип фиксирует
//
//	значения свойств находящихся в разделе реестра Windows. Поскольку все свойства этого типа являются необязательными,
//
// по крайней мере одно из свойств, определенных ниже, должно быть инициализировано при использовании этого типа.
// Name - содержит название параметра реестра. Для указания значения ключа реестра по умолчанию необходимо использовать пустую строку.
// Data - содержит данные, содержащиеся в значении реестра.
// DataType - содержит тип данных реестра (REG_*), используемый в значении реестра. Значения этого свойства должны быть получены из перечисления windows-registry-datatype enum.
type WindowsRegistryValueTypeSTIX struct {
	Name     string       `json:"name" bson:"name"`
	Data     string       `json:"data" bson:"data"`
	DataType EnumTypeSTIX  string  `json:"data_type" bson:"data_type"`
}
         * 
         * */

function GetWindowsRegistryValue(props){
    let {  
        objectId,
        objectInfo,
        handlerElementAdd,
        handlerElementDelete,
    } = props;

    console.log("func 'GetWindowsRegistryValue', objectInfo = ", objectInfo);

    /**
 * 
 * надо сделать значения относящиеся к разделу реестра
 * 
 */

    const classes = useStyles();
    let patternWindowsRegistryValue = {
        name: "",
        data: "",
        data_type: "",
    };

    let [ winRegValue, setWinRegValue ] = useState(patternWindowsRegistryValue);
    let [ buttonAddSelectorIsDisabled, setButtonAddSelectorIsDisabled ] = useState(true);

    /*let [ valueTmpSelector, setValueTmpSelector ] = useState("");
    let [ buttonAddNewGMIsDisabled, setButtonAddNewGMIsDisabled ] = useState(true);
    let handlerDelSelector = (num) => {
        let tmp = cloneDeep(valueGM);
        tmp.selectors.splice(num, 1);

        if(tmp.selectors.length === 0){
            setButtonAddNewGMIsDisabled(true);
        }

        setValueGM(tmp);
    };*/

    return (<Grid container direction="row" key="key_granular_markings_link">
        <Grid container direction="row" spacing={3}>
            <Grid item md={4}>
                <TextField
                    id="windows-registry-value-name"
                    label="наименование параметра реестра"
                    fullWidth={true}
                    value={winRegValue.name}
                    onChange={(e) => {
                        /*let valueGMTmp = cloneDeep(valueGM);

                        valueGMTmp.lang = e.target.value.toUpperCase();
                        setValueGM(valueGMTmp);*/
                    }}
                />
            </Grid>
            <Grid item md={8}>
                <TextField
                    id="windows-registry-value-data"
                    label="данные, содержащиеся в значении реестра"
                    fullWidth={true}
                    value={winRegValue.data}
                    onChange={(e) => {
                        /*let valueGMTmp = cloneDeep(valueGM);

                                valueGMTmp.marking_ref = e.target.value;
                                setValueGM(valueGMTmp);*/
                    }}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" key="key_input_hash_field">
            <Grid item md={10}>
                <CreateListWindowsRegistryDatatype 
                    isDisabled={false}
                    campaignPatterElement={/*winRegValue.data_type*/{}}
                    handlerWindowsRegistryDatatype={() => {}}
                />
            </Grid>
            <Grid item md={2} className="text-end mt-3">
                <Button 
                    onClick={() => {
                        /*if(valueTmpSelector === ""){
                            return;
                        }

                        let valueGMTmp = cloneDeep(valueGM);

                        valueGMTmp.selectors.push(valueTmpSelector);
                        setValueGM(valueGMTmp);
                        setValueTmpSelector("");

                        setButtonAddNewGMIsDisabled(false);
                        setButtonAddSelectorIsDisabled(true);*/
                    }} 
                    disabled={buttonAddSelectorIsDisabled}
                >
                        добавить свойства
                </Button>
            </Grid>
        </Grid>

        {(objectInfo.value && objectInfo.value.length !== 0)?  
            <Grid container direction="row" className="mt-3">
                <ol>
                    {objectInfo.value.map((item, num) => {
                        return (<li key={`key_item_wrvalue_${num}`}>
                            {item}&nbsp;
                            <IconButton aria-label="delete-item_wrvalue" onClick={() => handlerElementDelete.call(null, num)}>
                                <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                            </IconButton>
                        </li>);
                    })}
                </ol>
            </Grid>:
            ""}

        {/*<Grid container direction="row" key="key_granular_markings_link">
            <Grid item md={12} className="text-end pt-2 pb-2">
                <Button onClick={() => {
                    let tmpData = cloneDeep(valueGM);
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
            })}*/}
    </Grid>);
}

GetWindowsRegistryValue.propTypes = { 
    objectId: PropTypes.string.isRequired,
    objectInfo: PropTypes.object.isRequired,
    handlerElementAdd: PropTypes.func.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
};
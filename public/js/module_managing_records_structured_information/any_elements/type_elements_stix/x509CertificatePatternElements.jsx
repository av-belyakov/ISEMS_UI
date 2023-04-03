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
import { Form } from "react-bootstrap";
import DateFnsUtils from "dateIoFnsUtils";
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import { grey, green, red } from "@material-ui/core/colors";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";
import { CreateListHashes  } from "../anyElements.jsx";

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

export default function CreateX509CertificatePatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement,
        handlerHashes,
        handlerIssuer,
        handlerSubject,
        handlerVersion,
        handlerIsSelfSigned,
        handlerSerialNumber,
        handlerValidityNotAfter,
        handlerValidityNotBefore,
        handlerSignatureAlgorithm,
        handlerSubjectPublicKeyModulus,
        handlerSubjectPublicKeyExponent,
        handlerSubjectPublicKeyAlgorithm,
    } = props;

    let [ invalidIssuer, setInvalidIssuer ] = useState(false);

    let validityNotBefore = minDefaultData;
    let validityNotAfter = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    console.log("_____=== func 'CreateX509CertificatePatternElements', showRefElement:", showRefElement, " campaignPatterElement = ", campaignPatterElement);
    console.log("showRefElement.id = ", showRefElement.id, " campaignPatterElement.creator_user_ref = ", campaignPatterElement.creator_user_ref, " refId = ", refId, " expanded = ", expanded);

    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.validity_not_before !== "undefined" && campaignPatterElement.validity_not_before.slice(0, 16) !== defaultData){
            validityNotBefore = new Date(Date.parse(campaignPatterElement.validity_not_before) + ms);
        }

        if(typeof campaignPatterElement.validity_not_after !== "undefined" && campaignPatterElement.validity_not_after.slice(0, 16) !== defaultData){
            validityNotAfter = new Date(Date.parse(campaignPatterElement.validity_not_after) + ms);
        }
    } else {
        if(typeof campaignPatterElement.validity_not_before !== "undefined" && campaignPatterElement.validity_not_before.slice(0, 16) !== defaultData){
            validityNotBefore = new Date(Date.parse(campaignPatterElement.validity_not_before) - (ms * -1));
        }

        if(typeof campaignPatterElement.validity_not_after !== "undefined" && campaignPatterElement.validity_not_after.slice(0, 16) !== defaultData){
            validityNotAfter = new Date(Date.parse(campaignPatterElement.validity_not_after) - (ms * -1));
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

    /**
    + IsSelfSigned              bool                     `json:"is_self_signed" bson:"is_self_signed"`
    + Hashes                    HashesTypeSTIX           `json:"hashes" bson:"hashes"`    
    + Version                   string                   `json:"version" bson:"version"`
	+ SerialNumber              string                   `json:"serial_number" bson:"serial_number"`
	+ SignatureAlgorithm        string                   `json:"signature_algorithm" bson:"signature_algorithm"`
	+ Issuer                    string                   `json:"issuer" bson:"issuer"`
	+ ValidityNotBefore         time.Time                `json:"validity_not_before" bson:"validity_not_before"`
	+ ValidityNotAfter          time.Time                `json:"validity_not_after" bson:"validity_not_after"`
	+ Subject                   string                   `json:"subject" bson:"subject"`
	+ SubjectPublicKeyAlgorithm string                   `json:"subject_public_key_algorithm" bson:"subject_public_key_algorithm"`
	+ SubjectPublicKeyModulus   string                   `json:"subject_public_key_modulus" bson:"subject_public_key_modulus"`
	+ SubjectPublicKeyExponent  int                      `json:"subject_public_key_exponent" bson:"subject_public_key_exponent"`
    
    X509V3Extension - указывает любые стандартные расширения X.509 v3, которые могут использоваться в сертификате.
    X509V3Extensions          X509V3ExtensionsTypeSTIX `json:"x509_v3_extensions" bson:"x509_v3_extensions"`
*/

    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Версия закодированного сертификата:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-version"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerVersion}
                    value={(campaignPatterElement.version)? campaignPatterElement.version: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Уникальный идентификатор сертификата, выданного конкретным Центром сертификации:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-serial_number"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerSerialNumber}
                    value={(campaignPatterElement.serial_number)? campaignPatterElement.serial_number: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-1">Индикатор, является ли сертификат самоподписным:</span>
            </Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        as="select" 
                        size="sm" 
                        onChange={handlerIsSelfSigned} 
                        value={campaignPatterElement.is_self_signed} 
                        id="dropdown_list_is_self_signed" >
                        <option key={"key_is_self_signed_true"} value={true}>да</option>
                        <option key={"key_is_self_signed_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Наименование алгоритма, используемого для подписи сертификата:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-signature_algorithm"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerSignatureAlgorithm}
                    value={(campaignPatterElement.signature_algorithm)? campaignPatterElement.signature_algorithm: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Название удостоверяющего центра выдавшего сертификат:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-issuer"
                    fullWidth
                    error={invalidIssuer}
                    size="small"
                    disabled={isDisabled}
                    onChange={(e) => {
                        if(e.target.issuer.length === 0){
                            setInvalidIssuer(true);

                            return;
                        } else {
                            setInvalidIssuer(false);
                        }

                        handlerIssuer(e);
                    }}
                    value={(campaignPatterElement.issuer)? campaignPatterElement.issuer: ""}
                    helperText="обязательное поле"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Начало действия сертификата:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(validityNotBefore, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={validityNotBefore}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerValidityNotBefore}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Окончание действия сертификата:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(validityNotAfter, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={validityNotAfter}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerValidityNotAfter}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>
        
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">{"Имя сущности, связанной с открытым ключом, хранящимся в поле \"subject public key\" открого ключа сертификата:"}</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-subject"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerSubject}
                    value={(campaignPatterElement.subject)? campaignPatterElement.subject: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Название алгоритма применяемого для шифрования данных, отправляемых субъекту:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-subject_public_key_algorithm"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerSubjectPublicKeyAlgorithm}
                    value={(campaignPatterElement.subject_public_key_algorithm)? campaignPatterElement.subject_public_key_algorithm: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Модульная часть открытого ключа RSA:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-subject_public_key_modulus"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerSubjectPublicKeyModulus}
                    value={(campaignPatterElement.subject_public_key_modulus)? campaignPatterElement.subject_public_key_modulus: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Экспоненциальная часть открытого ключа RSA субъекта в виде целого числа:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-subject_public_key_exponent"
                    //multiline
                    //minRows={3}
                    //maxRows={8}
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerSubjectPublicKeyExponent}
                    value={(campaignPatterElement.subject_public_key_exponent)? campaignPatterElement.subject_public_key_exponent: ""}
                    helperText="поле может содержать только цифры"
                />
            </Grid>
        </Grid>
        <CreateListHashes
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement} 
            handlerHashes={handlerHashes}
        />

        {/**
        * 
        * надо сделать     X509V3Extension - указывает любые стандартные расширения X.509 v3, которые могут использоваться в сертификате.
        *   X509V3Extensions          X509V3ExtensionsTypeSTIX `json:"x509_v3_extensions" bson:"x509_v3_extensions"`
        * 
        * 
        * 
        */}



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

CreateX509CertificatePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerHashes: PropTypes.func.isRequired,
    handlerIssuer: PropTypes.func.isRequired,
    handlerSubject: PropTypes.func.isRequired,
    handlerVersion: PropTypes.func.isRequired,
    handlerIsSelfSigned: PropTypes.func.isRequired,
    handlerSerialNumber: PropTypes.func.isRequired,
    handlerValidityNotAfter: PropTypes.func.isRequired,
    handlerValidityNotBefore: PropTypes.func.isRequired,
    handlerSignatureAlgorithm: PropTypes.func.isRequired,
    handlerSubjectPublicKeyModulus: PropTypes.func.isRequired,
    handlerSubjectPublicKeyExponent: PropTypes.func.isRequired,
    handlerSubjectPublicKeyAlgorithm: PropTypes.func.isRequired,
};

/**
//X509CertificateCyberObservableObjectSTIX объект "X.509 Certificate Object", по терминологии STIX, представлет свойства сертификата X.509, определенные в рекомендациях
//  ITU X.509 [X.509]. X.509  Certificate объект должен содержать по крайней мере одно cвойство специфичное для этого объекта (помимо type).
// IsSelfSigned - содержит индикатор, является ли сертификат самоподписным, то есть подписан ли он тем же субъектом, личность которого он удостоверяет.
// Hashes - содержит любые хэши, которые были вычислены для всего содержимого сертификата. Является типом данных словар, значения ключей которого должны
//  быть из открытого словаря hash-algorithm-ov.
// Version- содержит версию закодированного сертификата
// SerialNumber - содержит уникальный идентификатор сертификата, выданного конкретным Центром сертификации.
// SignatureAlgorithm - содержит имя алгоритма, используемого для подписи сертификата.
// Issuer - содержит название удостоверяющего центра выдавшего сертификат
// ValidityNotBefore - время, в формате "2016-05-12T08:17:27.000Z", начала действия сертификата.
// ValidityNotAfter - время, в формате "2016-05-12T08:17:27.000Z", окончания действия сертификата.
// Subject - содержит имя сущности, связанной с открытым ключом, хранящимся в поле "subject public key" открого ключа сертификата.
// SubjectPublicKeyAlgorithm - содержит название алгоритма применяемого для шифрования данных, отправляемых субъекту.
// SubjectPublicKeyModulus - указывает модульную часть открытого ключа RSA.
// SubjectPublicKeyExponent - указывает экспоненциальную часть открытого ключа RSA субъекта в виде целого числа.
// X509V3Extension - указывает любые стандартные расширения X.509 v3, которые могут использоваться в сертификате.
type X509CertificateCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	IsSelfSigned              bool                     `json:"is_self_signed" bson:"is_self_signed"`
	Hashes                    HashesTypeSTIX           `json:"hashes" bson:"hashes"`
	Version                   string                   `json:"version" bson:"version"`
	SerialNumber              string                   `json:"serial_number" bson:"serial_number"`
	SignatureAlgorithm        string                   `json:"signature_algorithm" bson:"signature_algorithm"`
	Issuer                    string                   `json:"issuer" bson:"issuer"`
	ValidityNotBefore         time.Time                `json:"validity_not_before" bson:"validity_not_before"`
	ValidityNotAfter          time.Time                `json:"validity_not_after" bson:"validity_not_after"`
	Subject                   string                   `json:"subject" bson:"subject"`
	SubjectPublicKeyAlgorithm string                   `json:"subject_public_key_algorithm" bson:"subject_public_key_algorithm"`
	SubjectPublicKeyModulus   string                   `json:"subject_public_key_modulus" bson:"subject_public_key_modulus"`
	SubjectPublicKeyExponent  int                      `json:"subject_public_key_exponent" bson:"subject_public_key_exponent"`
	X509V3Extensions          X509V3ExtensionsTypeSTIX `json:"x509_v3_extensions" bson:"x509_v3_extensions"`
}
 */

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
};*/


import React, { useState } from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    Select,
    IconButton,
    InputLabel,
    TextField,
    FormControl,
    MenuItem,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import _ from "lodash";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";

const defaultData = "0001-01-01T00:00:00.000Z";
const minDefaultData = new Date();

export default function CreateFilePatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement, 
        handlerName,
        handlerSize,
        handlerClick,
        handlerNameEnc,
        handlerMimeType,
        handlerAddHashes,
        handlerDelHashes,
        handlerButtonShowLink,
        handlerMagicNumberHex,
        handlerChangeDateTimeMtime,
        handlerChangeDateTimeAtime,
    } = props;

    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

    let [ isInvalidSizeValue, setIsInvalidSizeValue ] = useState(((typeof campaignPatterElement.size !== "undefined") && (campaignPatterElement.size !== 0)));
    let [ isInvalidNameValue, setIsInvalidNameValue ] = useState(((typeof campaignPatterElement.name === "undefined") || (campaignPatterElement.name === "")));
    let [ valueTmpHashSum, setValueTmpHashSum ] = useState({ type: "", description: "" });
    let [ buttonAddHashIsDisabled, setButtonAddHashIsDisabled ] = useState(true);

    console.log("func 'CreateFilePatternElements', isInvalidSizeValue = '", isInvalidSizeValue, "', campaignPatterElement.size === '':", campaignPatterElement.size === "", " typeof campaignPatterElement.size === 'undefined':", typeof campaignPatterElement.size === "undefined");
    console.log("((typeof campaignPatterElement.size === 'undefined') || (campaignPatterElement.size === 0)) : ", ((typeof campaignPatterElement.size === "undefined") || (campaignPatterElement.size === 0)));
    console.log("func 'CreateFilePatternElements', campaignPatterElement:", campaignPatterElement, " showRefElement:", showRefElement);

    let mtime = minDefaultData;
    let atime = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    
    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.mtime !== "undefined" && campaignPatterElement.mtime !== defaultData){
            mtime = new Date(Date.parse(campaignPatterElement.mtime) + ms);
        }

        if(typeof campaignPatterElement.atime !== "undefined" && campaignPatterElement.atime !== defaultData){
            atime = new Date(Date.parse(campaignPatterElement.atime) + ms);
        }
    } else {
        if(typeof campaignPatterElement.mtime !== "undefined" && campaignPatterElement.mtime !== defaultData){
            mtime = new Date(Date.parse(campaignPatterElement.mtime) - (ms * -1));
        }

        if(typeof campaignPatterElement.atime !== "undefined" && campaignPatterElement.atime !== defaultData){
            atime = new Date(Date.parse(campaignPatterElement.atime) - (ms * -1));
        }
    }

    let getListHashes = () => {
        let list = [];
        if((campaignPatterElement.hashes !== null) && (typeof campaignPatterElement.hashes !== "undefined")){
            for(let k in campaignPatterElement.hashes){
                list.push(<li key={`hash_${campaignPatterElement.hashes[k]}`}>
                    {k}: {campaignPatterElement.hashes[k]}&nbsp;
                    <IconButton aria-label="delete-ext_ref-item" onClick={() => { 
                        handlerDelHashes(k); 
                    }}><RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                    </IconButton>
                </li>);
            }    
        }

        return list;
    };

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

    let listHashes = getListHashes();

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Наименование:</span></Grid>
            <Grid item container md={8}>
                {(campaignPatterElement.id && campaignPatterElement.id !== "")? 
                    <span className="mt-2">{campaignPatterElement.name}</span>:
                    <TextField
                        fullWidth
                        disabled={isDisabled}
                        id="name-element"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            let name = e.target.value;

                            if(name.length === 0){
                                setIsInvalidNameValue(true);
                            } else {
                                setIsInvalidNameValue(false);
                            }

                            handlerName(name);
                        }}
                        value={(campaignPatterElement.name)? campaignPatterElement.name: ""}
                        error={isInvalidNameValue}
                    />}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Размер файла в байтах:</span>
            </Grid>
            <Grid item container md={8}>
                <TextField
                    id="size-element"
                    disabled={isDisabled}
                    fullWidth
                    onChange={(e) => {
                        let size = e.target.value;
                        if(helpers.checkInputValidation({
                            "name": "integer", 
                            "value": size, 
                        }) && size[0] !== "0"){
                            setIsInvalidSizeValue(false);
                        } else {
                            setIsInvalidSizeValue(true);
                        }

                        handlerSize(size);
                    }}
                    value={(campaignPatterElement.size)? campaignPatterElement.size: ""}
                    error={isInvalidSizeValue}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Время создания файла:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.ctime, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Время модификации файла:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(mtime, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={mtime}
                            minDate={new Date("2000-01-01")}
                            maxDate={new Date()}
                            onChange={handlerChangeDateTimeMtime}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Время обращения к файлу:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(atime, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={atime}
                            minDate={new Date("2000-01-02")}
                            maxDate={new Date()}
                            onChange={handlerChangeDateTimeAtime}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>        

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Кодировка имени файла:</span>
            </Grid>
            <Grid item container md={8}>
                <TextField
                    id="name-enc-element"
                    disabled={isDisabled}
                    fullWidth
                    onChange={handlerNameEnc}
                    value={(campaignPatterElement.name_enc)? campaignPatterElement.name_enc: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Шестнадцатеричная константа “магическое число”, связанная с определенным форматом файла:</span>
            </Grid>
            <Grid item container md={8}>
                <TextField
                    id="magic-number-hex-element"
                    disabled={isDisabled}
                    fullWidth
                    onChange={handlerMagicNumberHex}
                    value={(campaignPatterElement.magic_number_hex)? campaignPatterElement.magic_number_hex: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">MIME имени файла:</span>
            </Grid>
            <Grid item container md={8}>
                <TextField
                    id="mime-type-element"
                    disabled={isDisabled}
                    fullWidth
                    onChange={handlerMimeType}
                    value={(campaignPatterElement.mime_type)? campaignPatterElement.mime_type: ""}
                />
            </Grid>
        </Grid>

        {campaignPatterElement.parent_directory_ref && campaignPatterElement.parent_directory_ref.length !== 0?
            <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
                <Grid item container md={4} justifyContent="flex-end">
                    <span className="text-muted mt-3">Родительская директория файла:</span>
                </Grid>
                <Grid item container md={8}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.parent_directory_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.parent_directory_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.parent_directory_ref}
                            </Button>
                        </CardActions>
                        <Collapse 
                            in={showRefElement.id === campaignPatterElement.parent_directory_ref && refId === campaignPatterElement.parent_directory_ref && expanded} 
                            timeout="auto" 
                            unmountOnExit
                        >
                            <CardContent>
                                <CreateShortInformationSTIXObject 
                                    obj={showRefElement.obj}
                                    handlerClick={handlerClick} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.content_ref && campaignPatterElement.content_ref.length !== ""?
            <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
                <Grid item container md={4} justifyContent="flex-end">
                    <span className="text-muted mt-3">Контент файла:</span>
                </Grid>
                <Grid item container md={8}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.content_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.content_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.content_ref}
                            </Button>
                        </CardActions>
                        <Collapse 
                            in={showRefElement.id === campaignPatterElement.content_ref && refId === campaignPatterElement.content_ref && expanded} 
                            timeout="auto" 
                            unmountOnExit
                        >
                            <CardContent>
                                <CreateShortInformationSTIXObject 
                                    obj={showRefElement.obj}
                                    handlerClick={handlerClick} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}

        <Grid container direction="row" style={{ marginTop: 2 }}>
            <Grid container direction="row" spacing={3} key="key_input_hash_field">
                <Grid item md={2}>
                    <FormControl style={{ minWidth: 120 }}>
                        <InputLabel id="label-hash-type-change">тип хеша</InputLabel>
                        <Select
                            labelId="chose-hash-select-label"
                            id="chose-hash-select-label"
                            value={valueTmpHashSum.type}
                            fullWidth
                            onChange={(e) => {
                                let tmp = valueTmpHashSum.description,
                                    v = e.target.value;
                                setValueTmpHashSum({ type: v, description: tmp });

                                ((v.length > 0) && (tmp.length > 0))? setButtonAddHashIsDisabled(false): setButtonAddHashIsDisabled(true);
                            }}>
                            {helpers.getListHashType().map((elem, num)=>{
                                return <MenuItem value={elem.type} key={`key_${elem.type}_${num}`}>{elem.description}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={8}>
                    <TextField
                        id="external-references-hash"
                        label="хеш-сумма"
                        fullWidth
                        value={valueTmpHashSum.description}
                        onChange={(e) => {
                            let tmp = valueTmpHashSum.type,
                                v = e.target.value;
                            setValueTmpHashSum({ type: tmp, description: v });

                            ((v.length > 0) && (tmp.length > 0))? setButtonAddHashIsDisabled(false): setButtonAddHashIsDisabled(true);
                        }}
                    />
                </Grid>
                <Grid item md={2} className="text-end mt-4">
                    <Button 
                        onClick={() => {
                            handlerAddHashes(valueTmpHashSum);

                            setValueTmpHashSum({ type: "", description: "" });
                            setButtonAddHashIsDisabled(true);
                        }} 
                        disabled={buttonAddHashIsDisabled}
                    >добавить хеш</Button>
                </Grid>
            </Grid>
        </Grid>

        {(listHashes.length !== 0)? 
            <Grid container direction="row" className="mt-2">
                <Grid item md={12} className="pl-4 pr-4">
                    <span className="text-muted">хеш суммы</span>:<ol>{listHashes}</ol>
                </Grid>
            </Grid>: 
            ""}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Идентификаторы объектов:</span>
            </Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item container md={12} justifyContent="flex-start">
                {campaignPatterElement.contains_refs && campaignPatterElement.contains_refs.length > 0?
                    campaignPatterElement.contains_refs.map((item, key) => {
                        let type = item.split("--");
                        let objectElem = helpers.getLinkImageSTIXObject(type[0]);
    
                        if(typeof objectElem === "undefined" || type[0] === "relationship"){
                            return "";
                        }

                        let disabled = false;
                        if(type[0] === "report"){                    
                            disabled = true;
                        }        

                        return (<Card variant="outlined" style={{ width: "100%" }} key={`key_rf_object_ref_${key}`}>
                            <CardActions>
                                <Button onClick={() => {                                        
                                    handleExpandClick(item);
                                }}
                                disabled={disabled} >
                                    <img 
                                        src={`/images/stix_object/${objectElem.link}`} 
                                        width="25" 
                                        height="25" />
                                        &nbsp;{item}
                                </Button>
                            </CardActions>
                            <Collapse 
                                in={showRefElement.id !== "" && showRefElement.id === refId && showRefElement.id === item && expanded} 
                                timeout="auto" 
                                unmountOnExit
                            >
                                <CardContent>
                                    <CreateShortInformationSTIXObject 
                                        obj={showRefElement.obj}
                                        handlerClick={handlerClick} 
                                    />
                                </CardContent>
                            </Collapse>                            
                        </Card>);
                    }):
                    ""}
            </Grid>
        </Grid>

        {
            /**
             * (e) => handlerMimeType(validatorjs.escape(e.target.value))
            + Name 
            + Size
            + Ctime
            + Mtime
            + Atime 
            + NameEnc
            + MagicNumberHex
            + MimeType
            + ParentDirectoryRef
            + Hashes HashesTypeSTIX         `json:"hashes" bson:"hashes"`
            + ContainsRefs []IdentifierTypeSTIX ([]string)
	        + ContentRef         IdentifierTypeSTIX
             */
        }
    </React.Fragment>);
}

CreateFilePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerSize: PropTypes.func.isRequired,
    handlerClick: PropTypes.func.isRequired,
    handlerNameEnc: PropTypes.func.isRequired,
    handlerMimeType: PropTypes.func.isRequired,
    handlerAddHashes: PropTypes.func.isRequired,
    handlerDelHashes: PropTypes.func.isRequired,
    handlerButtonShowLink: PropTypes.func.isRequired,
    handlerMagicNumberHex: PropTypes.func.isRequired,
    handlerChangeDateTimeMtime: PropTypes.func.isRequired,
    handlerChangeDateTimeAtime: PropTypes.func.isRequired,
};

/**
//FileCyberObservableObjectSTIX объект "File Object", по терминалогии STIX, последекодирования из JSON (основной, рабочий объект)
// Extensions - определяет следующие расширения pdf-ext, archive-ext, ntfs-ext, raster-image-ext, windows-pebinary-ext. В дополнении к ним пользователь может создавать
//  свои расширения. При этом ключ словаря должен однозначно идентифицировать тип расширения.
// Hashes - определяет словарь хешей для файла. При этом ДОЛЖНЫ использоватся ключи из открытого словаря hash-algorithm- ov.
// Size - содержит размер файла в байтах
// Name - содержит имя файла
// NameEnc - определяет кодировку имени файла. Содержимое должно соответствовать ревизии IANA от 2013-12-20.
// MagicNumberHex - указывает шестнадцатеричную константу (“магическое число”), связанную с определенным форматом файла, который соответствует этому файлу, если это применимо.
// MimeType - определяет MIME имени файла, например, application/msword.
// Ctime - время, в формате "2016-05-12T08:17:27.000Z", создания файла
// Mtime - время, в формате "2016-05-12T08:17:27.000Z", модификации файла
// Atime - время, в формате "2016-05-12T08:17:27.000Z", обращения к файлу
// ParentDirectoryRef - определяет родительскую директорию для файла. Объект ссылающийся на это свойство ДОЛЖЕН быть типом directory
// ContainsRefs - содержит ссылки на другие Cyber-observable Objects STIX, содержащиеся в файле, например другой файл, добавленный в конец файла, или IP-адрес, содержащийся где-то в файле.
// ContentRef - определяет контент файла. Данное значение ДОЛЖНО иметь тип artifact, то есть ссылатся на ArtifactCyberObservableObjectSTIX
type FileCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Extensions         map[string]interface{} `json:"extensions" bson:"extensions"`
	Hashes             HashesTypeSTIX         `json:"hashes" bson:"hashes"`
	Size               uint64                 `json:"size" bson:"size"`
	Name               string                 `json:"name" bson:"name"`
	NameEnc            string                 `json:"name_enc" bson:"name_enc"`
	MagicNumberHex     string                 `json:"magic_number_hex" bson:"magic_number_hex"`
	MimeType           string                 `json:"mime_type" bson:"mime_type"`
	Ctime              time.Time              `json:"ctime" bson:"ctime"`
	Mtime              time.Time              `json:"mtime" bson:"mtime"`
	Atime              time.Time              `json:"atime" bson:"atime"`
	ParentDirectoryRef IdentifierTypeSTIX     `json:"parent_directory_ref" bson:"parent_directory_ref"`
	ContainsRefs       []IdentifierTypeSTIX   `json:"contains_refs" bson:"contains_refs"`
	ContentRef         IdentifierTypeSTIX     `json:"content_ref" bson:"content_ref"`
}
*/
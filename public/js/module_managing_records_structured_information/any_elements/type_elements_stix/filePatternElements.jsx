import React, { useState } from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    TextField,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
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
        handlerNameEnc,
        handlerMimeType,
        handlerButtonShowLink,
        handlerMagicNumberHex,
        handlerChangeDateTimeMtime,
        handlerChangeDateTimeAtime,
    } = props;

    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

    let [ isInvalidSizeValue, setIsInvalidSizeValue ] = useState(((typeof campaignPatterElement.size === "undefined") || (campaignPatterElement.size === "")));
    let [ isInvalidNameValue, setIsInvalidNameValue ] = useState(((typeof campaignPatterElement.name === "undefined") || (campaignPatterElement.name === "")));

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

    console.log("func 'CreateFilePatternElements', campaignPatterElement:", campaignPatterElement, " showRefElement:", showRefElement);

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
            <Grid container direction="row" spacing={3}>
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
                                    handlerClick={() => {}} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}
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
            Hashes HashesTypeSTIX         `json:"hashes" bson:"hashes"`
            ContainsRefs []IdentifierTypeSTIX ([]string)
	        ContentRef         IdentifierTypeSTIX
             */
        }

        {
            //ParentDirectoryRef IdentifierTypeSTIX     `json:"parent_directory_ref" bson:"parent_directory_ref"`
        }

        {/*
            //ContainsRefs       []IdentifierTypeSTIX   `json:"contains_refs" bson:"contains_refs"`
        campaignPatterElement.refs && campaignPatterElement.refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start"><span className="text-muted">Список ссылок на файловые объекты или директории содержащиеся внутри данной директории:</span></Grid>
                </Grid>
                {showDirectoryList(campaignPatterElement.refs, campaignPatterElement.id, 0, handlerClick)}
            </React.Fragment>:
    ""*/}

        {
            //ContentRef IdentifierTypeSTIX      `json:"content_ref" bson:"content_ref"`
        }

    </React.Fragment>);
}

CreateFilePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerSize: PropTypes.func.isRequired,
    handlerNameEnc: PropTypes.func.isRequired,
    handlerMimeType: PropTypes.func.isRequired,
    handlerButtonShowLink: PropTypes.func.isRequired,
    handlerMagicNumberHex: PropTypes.func.isRequired,
    handlerChangeDateTimeMtime: PropTypes.func.isRequired,
    handlerChangeDateTimeAtime: PropTypes.func.isRequired,
};

/**
 *                      HASHES
 let listHashes = [];
 {(listHashes.length !== 0) ? 
                            <Grid container direction="row" key={`key_external_references_${key}_5`} className="mt-2">
                                <Grid item md={12} className="pl-4 pr-4">
                                    <span><span className="text-muted">хеш суммы</span>:<ol>{listHashes}</ol></span>
                                </Grid>
                            </Grid>: 
                            ""}
 * 
if((item.hashes !== null) && (typeof item.hashes !== "undefined")){
                    for(let k in item.hashes){
                        listHashes.push(<li key={`hash_${item.hashes[k]}`}>
                            {k}: {item.hashes[k]}&nbsp;
                            <IconButton aria-label="delete-ext_ref-item" onClick={() => { 
                                handlerDialogElementAdditionalThechnicalInfo({ 
                                    actionType: "hashes_delete",
                                    modalType: "external_references", 
                                    objectId: objectId,
                                    orderNumber: key,
                                    hashName: k,
                                }); 
                            }}><RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                            </IconButton>
                        </li>);
                    }    
                }
 */

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
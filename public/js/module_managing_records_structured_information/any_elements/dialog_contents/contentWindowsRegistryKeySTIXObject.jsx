import React, { useState } from "react";
import { 
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    TextField,
    IconButton,
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import { red } from "@material-ui/core/colors";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";

const defaultData = "0001-01-01T00:00:00.000Z";
const minDefaultData = "1970-01-01T00:00:00.000Z";
//const minDefaultData = new Date();

export default function CreateDialogContentWindowsRegistryKeySTIXObject(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement,
        handlerKey,
        handlerClick,
        handlerModifiedTime,

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

    console.log("_____=== func 'CreateProcessPatternElements', showRefElement:", showRefElement);

    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.modified_time !== "undefined" && campaignPatterElement.modified_time !== defaultData){
            modifiedTime = new Date(Date.parse(campaignPatterElement.modified_time) + ms);
        }
    } else {
        if(typeof campaignPatterElement.modified_time !== "undefined" && campaignPatterElement.modified_time !== defaultData){
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
	NumberOfSubkeys int                            `json:"number_of_subkeys" bson:"number_of_subkeys"`
 */

    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Полный путь к разделу реестра:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-pid"
                    fullWidth
                    error={invalidKey}
                    size="small"
                    disabled={isDisabled}
                    onChange={(e) => {
                        let key = e.target.value;

                        if(!new RegExp("^[0-9/_\\-.]{1,}$").test(key) || key === 0){
                            setInvalidKey(true);

                            return;
                        } else {
                            setInvalidKey(false);
                        }

                        handlerKey(key);
                    }}
                    value={(campaignPatterElement.key)? campaignPatterElement.key: ""}
                    helperText="обязательное поле"
                />
            </Grid>
        </Grid>

        {/**  
         * 
         * Values          []WindowsRegistryValueTypeSTIX `json:"values" bson:"values"`  
         * 
         * */}

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
                                    handlerClick={handlerClick} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}


        {/*<Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Время создания процесса:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(createdTime, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={createdTime}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerCreatedTime}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Текущая рабочая директория процесса:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="name-element-cwd"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerCWD}
                    value={(campaignPatterElement.cwd)? campaignPatterElement.cwd: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4, marginBottom: 1 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Определяет полный перечень команд используемых для запуска процесса, включая имя процесса и аргументы:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    id="outlined-command-line"
                    multiline
                    minRows={1}
                    maxRows={8}
                    disabled={isDisabled}
                    fullWidth
                    onChange={handlerCommandLine}
                    value={(campaignPatterElement.command_line)? campaignPatterElement.command_line: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        {campaignPatterElement.creator_user_ref && (typeof campaignPatterElement.creator_user_ref !== "undefined") && campaignPatterElement.creator_user_ref.length !== 0?
            <Grid container direction="row" spacing={3} style={{ paddingTop: 1 }}>
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted mt-3">Информация о пользователе создавшем объект:</span>
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
                                    handlerClick={handlerClick} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.image_ref && (typeof campaignPatterElement.image_ref !== "undefined") && campaignPatterElement.image_ref.length !== 0?
            <Grid container direction="row" spacing={3} style={{ paddingTop: 1 }}>
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted mt-3">Исполняемый двоичный файл выполненный как образ процесса:</span>
                </Grid>
                <Grid item container md={7}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.image_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.image_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.image_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.image_ref && refId === campaignPatterElement.image_ref && expanded} timeout="auto" unmountOnExit>
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

        {campaignPatterElement.parent_ref && (typeof campaignPatterElement.parent_ref !== "undefined") && campaignPatterElement.parent_ref.length !== 0?
            <Grid container direction="row" spacing={3} style={{ paddingTop: 1 }}>
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted mt-3">Родительский процесс породивший текущий процесс:</span>
                </Grid>
                <Grid item container md={7}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.parent_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.parent_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.parent_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.parent_ref && refId === campaignPatterElement.parent_ref && expanded} timeout="auto" unmountOnExit>
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

        <CreateEnvironmentVariables
            handlerAddEnvironmentVariables={handlerAddEnvironmentVariables} />

        {getListEnviromentVariables(campaignPatterElement.environment_variables)}

        {campaignPatterElement.opened_connection_refs && (typeof campaignPatterElement.opened_connection_refs !== "undefined") && campaignPatterElement.opened_connection_refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <span className="text-muted">Список открытых процессом сетевых соединений:</span>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.opened_connection_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Card variant="outlined" style={{ width: "100%", paddingTop: 1 }} key={`key_opened_connection_ref_${key}`}>
                                <CardActions>
                                    <Button onClick={() => { 
                                        handleExpandClick(item);
                                    }}>
                                        <img 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                        &nbsp;{item}
                                    </Button>
                                </CardActions>
                                <Collapse in={showRefElement.id === item && refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <CreateShortInformationSTIXObject 
                                            obj={showRefElement.obj}
                                            handlerClick={handlerClick} 
                                        />
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

        {campaignPatterElement.child_refs && (typeof campaignPatterElement.child_refs !== "undefined") && campaignPatterElement.child_refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <span className="text-muted">Дочерние процессы порожденные текущим процессом:</span>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.child_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Card variant="outlined" style={{ width: "100%", paddingTop: 1 }} key={`key_child_ref_${key}`}>
                                <CardActions>
                                    <Button onClick={() => { 
                                        handleExpandClick(item);
                                    }}>
                                        <img 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                        &nbsp;{item}
                                    </Button>
                                </CardActions>
                                <Collapse in={showRefElement.id === item && refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <CreateShortInformationSTIXObject 
                                            obj={showRefElement.obj}
                                            handlerClick={handlerClick} 
                                        />
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

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

CreateDialogContentWindowsRegistryKeySTIXObject.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerCWD: PropTypes.func.isRequired,
    handlerPID: PropTypes.func.isRequired,
    handlerClick: PropTypes.func.isRequired,
    handlerIsHidden: PropTypes.func.isRequired,
    handlerCreatedTime: PropTypes.func.isRequired,
    handlerCommandLine: PropTypes.func.isRequired,
    handlerButtonShowLink: PropTypes.func.isRequired,
    handlerAddEnvironmentVariables: PropTypes.func.isRequired,
    handlerDeleteEnviromentVariableElement: PropTypes.func.isRequired,
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
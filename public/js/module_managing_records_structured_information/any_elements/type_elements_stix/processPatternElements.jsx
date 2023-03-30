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
//import TokenInput from "react-customize-token-input";
//import { JSONTree } from "reactjsontree";
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

export default function CreateProcessPatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement,
        handlerCWD,
        handlerPID,
        handlerClick,
        handlerIsHidden,
        handlerCreatedTime,
        handlerCommandLine,
        handlerButtonShowLink,
        handlerAddEnvironmentVariables,
        handlerDeleteEnviromentVariableElement,
    } = props;

    let [ invalidPID, setInvalidPID ] = useState(false);

    let createdTime = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    console.log("_____=== func 'CreateProcessPatternElements', showRefElement:", showRefElement);

    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.created_time !== "undefined" && campaignPatterElement.created_time !== defaultData){
            createdTime = new Date(Date.parse(campaignPatterElement.created_time) + ms);
        }
    } else {
        if(typeof campaignPatterElement.created_time !== "undefined" && campaignPatterElement.created_time !== defaultData){
            createdTime = new Date(Date.parse(campaignPatterElement.created_time) - (ms * -1));
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

    const getListEnviromentVariables = (envList) => {
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
    };

    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Униальный идентификатор процесса (PID):</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-pid"
                    fullWidth
                    error={invalidPID}
                    size="small"
                    disabled={isDisabled}
                    onChange={(e) => {
                        let pid = e.target.value;

                        if(!new RegExp("^[0-9]{1,}$").test(pid) || pid === 0){
                            setInvalidPID(true);

                            return;
                        } else {
                            setInvalidPID(false);
                        }

                        handlerPID(pid);
                    }}
                    value={(campaignPatterElement.pid)? campaignPatterElement.pid: ""}
                    helperText="поле может содержать только цифры"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} className="pl-4">
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-1">Является ли процесс скрытым:</span></Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        as="select" 
                        size="sm" 
                        onChange={handlerIsHidden} 
                        value={campaignPatterElement.is_hidden} 
                        id="dropdown_list_is_hidden" >
                        <option key={"key_is_hidden_true"} value={true}>да</option>
                        <option key={"key_is_hidden_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
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

CreateProcessPatternElements.propTypes = {
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
//ProcessCyberObservableObjectSTIX объект "Process Object", по терминологии STIX, содержит общие свойства экземпляра компьютерной программы,
//  выполняемой в операционной системе. Объект процесса ДОЛЖЕН содержать хотя бы одно свойство (отличное от типа) этого объекта (или одного из его расширений).
// Extensions - определяет расширения windows-process-exit или windows-service-ext. В дополнение к ним производители МОГУТ создавать свои собственные. ключи словаря windows-process-exit,
//  windows-service-ext ДОЛЖНЫ идентифицировать тип расширения по имени. Соответствующие значения словаря ДОЛЖНЫ содержать содержимое экземпляра расширения.
// IsHidden - определяет является ли процесс скрытым.
// PID - униальный идентификатор процесса.
// CreatedTime - время, в формате "2016-05-12T08:17:27.000Z", создания процесса.
// Cwd - текущая рабочая директория процесса.
// CommandLine - поределяет полный перечень команд используемых для запуска процесса, включая имя процесса и аргументы.
// EnvironmentVariables - определяет список переменных окружения, в виде словаря, ассоциируемых с приложением.
// OpenedConnectionRefs - определяет список открытых, процессом, сетевых соединений ка одну или более ссылку на объект типа network-traffic.
// CreatorUserRef - определяет что за пользователь создал объект, ссылка ДОЛЖНА ссылатся на объект типа user-account.
// ImageRef - указывает исполняемый двоичный файл, который был выполнен как образ процесса, как ссылка на файловый объект. Объект, на который ссылается
//  это свойство, ДОЛЖЕН иметь тип file.
// ParentRef - указывает другой процесс, который породил (т. е. является родителем) этот процесс, как ссылку на объект процесса. Объект, на который
//  ссылается это свойство, ДОЛЖЕН иметь тип process.
// ChildRefs - указывает другие процессы, которые были порождены (т. е. дочерние) этим процессом, в качестве ссылки на один или несколько других
//  объектов процесса. Объекты, на которые ссылается этот список, ДОЛЖНЫ иметь тип process.
type ProcessCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Extensions           map[string]interface{}        `json:"extensions" bson:"extensions"`
	IsHidden             bool                          `json:"is_hidden" bson:"is_hidden"`
	PID                  int                           `json:"pid" bson:"pid"`
	CreatedTime          time.Time                     `json:"created_time" bson:"created_time"`
	Cwd                  string                        `json:"cwd" bson:"cwd"`
	CommandLine          string                        `json:"command_line" bson:"command_line"`
	EnvironmentVariables map[string]string             `json:"environment_variables" bson:"environment_variables"`
	OpenedConnectionRefs []IdentifierTypeSTIX          `json:"opened_connection_refs" bson:"opened_connection_refs"`
	CreatorUserRef       IdentifierTypeSTIX            `json:"creator_user_ref" bson:"creator_user_ref"`
	ImageRef             IdentifierTypeSTIX            `json:"image_ref" bson:"image_ref"`
	ParentRef            IdentifierTypeSTIX            `json:"parent_ref" bson:"parent_ref"`
	ChildRefs            []IdentifierTypeSTIX          `json:"child_refs" bson:"child_refs"`
}
 */

export function CreateEnvironmentVariables(props){
    let { handlerAddEnvironmentVariables } = props;

    let [ environmentVariablesEnv, setEnvironmentVariablesEnv ] = useState("");
    let [ environmentVariablesValue, setEnvironmentVariablesValue ] = useState("");
    let [ invalidEnv, setInvalidEnv ] = useState(true);
    let [ invalidValue, setInvalidValue ] = useState(true);
    let [ buttonAddEnvVariabIsDisable, setButtonAddEnvVariabIsDisable ] = useState(true);

    console.log("------- func 'CreateEnvironmentVariables', environmentVariablesEnv = ", environmentVariablesEnv, ", environmentVariablesValue = ", environmentVariablesValue, "  **********");

    return (<Grid container direction="row" spacing={3} key="key_input_hash_field">
        <Grid item md={3}>
            <TextField
                id="environment-variables-env"
                label="переменная окружения"
                fullWidth
                value={environmentVariablesEnv}
                error={invalidEnv}
                onChange={(e) => {
                    setEnvironmentVariablesEnv(e.target.value);

                    if(!new RegExp("^[a-zA-Z0-9_-]{2,}$").test(e.target.value)){
                        setInvalidEnv(true);
                        setButtonAddEnvVariabIsDisable(true);
        
                        return;
                    }
        
                    setInvalidEnv(false);
        
                    if(!invalidValue){
                        setButtonAddEnvVariabIsDisable(false);
                    }
                }}
            />
        </Grid>
        <Grid item md={7}>
            <TextField
                id="environment-variables-value"
                label="параметры переменной окружения"
                fullWidth
                value={environmentVariablesValue}
                error={invalidValue}
                onChange={(e) => {
                    setEnvironmentVariablesValue(e.target.value);

                    if(!new RegExp("^[a-zA-Z0-9._/-]{3,}$").test(e.target.value)){
                        setInvalidValue(true);
                        setButtonAddEnvVariabIsDisable(true);
        
                        return;
                    }
        
                    setInvalidValue(false);
        
                    if(!invalidEnv){
                        setButtonAddEnvVariabIsDisable(false);
                    }
                }}
            />
        </Grid>
        <Grid item md={2} className="text-end mt-4">
            <Button 
                onClick={() => {
                    handlerAddEnvironmentVariables({ env: environmentVariablesEnv, value: environmentVariablesValue });

                    setEnvironmentVariablesEnv("");
                    setEnvironmentVariablesValue("");
                }} 
                disabled={buttonAddEnvVariabIsDisable}
            >добавить</Button>
        </Grid>
    </Grid>);
}

CreateEnvironmentVariables.propTypes = {
    handlerAddEnvironmentVariables: PropTypes.func.isRequired,
};

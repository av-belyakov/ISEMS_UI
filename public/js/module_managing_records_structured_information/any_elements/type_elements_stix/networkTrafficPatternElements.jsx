import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    TextField,
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import { red } from "@material-ui/core/colors";
import { isString } from "lodash";
import { JSONTree } from "reactjsontree";
import PropTypes from "prop-types";
import TokenInput from "react-customize-token-input";
//import validatorjs from "validatorjs";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";

import { helpers } from "../../../common_helpers/helpers";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";

const defaultData = "0001-01-01T00:00";
//const minDefaultData = new Date();
const minDefaultData = "1970-01-01T00:00:00.000Z";

let getLinkImage = (elem) => {
    if(!isString(elem)){
        return;
    }

    let tmp = [""];
    if(typeof elem !== "undefined" && elem.includes("--")){
        tmp = elem.split("--");
    }

    return helpers.getLinkImageSTIXObject(tmp[0]);
};

export default function CreateNetworkTrafficPatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement,
        handlerClick,
        handlerEndDate,
        handlerSrcPort,
        handlerDstPort,
        handlerIsActive,
        handlerStartDate,
        handlerDstPackets,
        handlerSrcPackets,
        handlerDstByteCount,
        handlerSrcByteCount,
        handlerListProtocols,
        // это обработчик для ссылок на объекты содержащие ТОЛЬКО одну строчку, подходит только для свойств src_ref и dst_ref которые после 
        //просмотра будет содержать только свойство value STIX объектов: ipv4-addr, ipv6-addr, mac-addr, domain-name
        handlerClickShortRef,
        // это обработчик для ссылок на объекты содержащие полную информацию (для визуализации используется CreateShortInformationSTIXObject), 
        //подходит для свойств src_payload_ref и dst_payload_ref содержащие ссылки на STIX объект artifact 
        handlerButtonShowLink,
    } = props;

    let dateTimeStart = minDefaultData;
    let dateTimeEnd = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.start !== "undefined" && campaignPatterElement.start.slice(0, 16) !== defaultData){
            dateTimeStart = new Date(Date.parse(campaignPatterElement.start) + ms);
        }

        if(typeof campaignPatterElement.end !== "undefined" && campaignPatterElement.end.slice(0, 16) !== defaultData){
            dateTimeEnd = new Date(Date.parse(campaignPatterElement.end) + ms);
        }
    } else {
        if(typeof campaignPatterElement.start !== "undefined" && campaignPatterElement.start.slice(0, 16) !== defaultData){
            dateTimeStart = new Date(Date.parse(campaignPatterElement.start) - (ms * -1));
        }

        if(typeof campaignPatterElement.end !== "undefined" && campaignPatterElement.end.slice(0, 16) !== defaultData){
            dateTimeEnd = new Date(Date.parse(campaignPatterElement.end) - (ms * -1));
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
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Начало инициирования сетевого трафика:</span></Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(dateTimeStart, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={dateTimeStart}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerStartDate}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Окончание сетевого трафика:</span></Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(dateTimeEnd, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={dateTimeEnd}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerEndDate}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} className="pl-4 mt-1">
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-1">Продолжается ли сетевой трафик:</span></Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        as="select" 
                        size="sm" 
                        onChange={handlerIsActive} 
                        value={campaignPatterElement.is_active} 
                        id="dropdown_list_defanged" >
                        <option key={"key_defanged_true"} value={true}>да</option>
                        <option key={"key_defanged_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        {campaignPatterElement.src_ref && campaignPatterElement.src_ref.length !== 0?
            <Grid container direction="row" spacing={3} className="mt-2">
                <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">IP адрес или доменное имя источника:</span></Grid>
                <Grid item container md={7}>
                    {(typeof campaignPatterElement.source_ref !== "undefined")?
                        <TextField
                            fullWidth
                            disabled
                            InputLabelProps={{ shrink: true }}
                            onChange={() => {}}
                            value={campaignPatterElement.source_ref}
                        />:
                        (typeof getLinkImage(campaignPatterElement.src_ref) !== "undefined")?
                            <Button onClick={() => {                                        
                                handlerClickShortRef(campaignPatterElement.src_ref, "source_ref");
                            }}>
                                <img src={`/images/stix_object/${getLinkImage(campaignPatterElement.src_ref).link}`} width="25" height="25" />
                        &nbsp;{campaignPatterElement.src_ref}
                            </Button>:
                            <TextField
                                fullWidth
                                disabled
                                InputLabelProps={{ shrink: true }}
                                onChange={() => {}}
                                value={campaignPatterElement.src_ref}
                            />}
                </Grid>
            </Grid>:
            ""}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Порт источник:</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerSrcPort}
                    value={(campaignPatterElement.src_port)? campaignPatterElement.src_port: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Байты отправленные от источника к месту назначения:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerSrcByteCount}
                    value={(campaignPatterElement.src_byte_count)? campaignPatterElement.src_byte_count: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Пакеты отправленные от источника к месту назначения:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerSrcPackets}
                    value={(campaignPatterElement.src_packets)? campaignPatterElement.src_packets: ""}
                />
            </Grid>
        </Grid>

        {campaignPatterElement.dst_ref && campaignPatterElement.dst_ref.length !== 0?
            <Grid container direction="row" spacing={3} className="mt-2">
                <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">IP адрес или доменное имя источника:</span></Grid>
                <Grid item container md={7}>
                    {(typeof campaignPatterElement.destination_ref !== "undefined")?
                        <TextField
                            fullWidth
                            disabled
                            InputLabelProps={{ shrink: true }}
                            onChange={() => {}}
                            value={campaignPatterElement.destination_ref}
                        />:
                        (typeof getLinkImage(campaignPatterElement.dst_ref) !== "undefined")?
                            <Button onClick={() => {                                        
                                handlerClickShortRef(campaignPatterElement.dst_ref, "destination_ref");
                            }}>
                                <img src={`/images/stix_object/${getLinkImage(campaignPatterElement.dst_ref).link}`} width="25" height="25" />
                        &nbsp;{campaignPatterElement.dst_ref}
                            </Button>:
                            <TextField
                                fullWidth
                                disabled
                                InputLabelProps={{ shrink: true }}
                                onChange={() => {}}
                                value={campaignPatterElement.dst_ref}
                            />}
                </Grid>
            </Grid>:
            ""}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Порт назначения:</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerDstPort}
                    value={(campaignPatterElement.dst_port)? campaignPatterElement.dst_port: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Байты отправленные из пункта назначения в источник:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerDstByteCount}
                    value={(campaignPatterElement.dst_byte_count)? campaignPatterElement.dst_byte_count: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Пакеты отправленные от пункта назначения к источнику:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerDstPackets}
                    value={(campaignPatterElement.dst_packets)? campaignPatterElement.dst_packets: ""}
                />
            </Grid>
        </Grid>

        {campaignPatterElement.src_payload_ref && (typeof campaignPatterElement.src_payload_ref !== "undefined") && campaignPatterElement.src_payload_ref.length !== 0?
            <Grid container direction="row" spacing={3} className="pt-1">
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted mt-3">Ссылка на STIX объект с полезной нагрузкой отправляемой источником:</span>
                </Grid>
                <Grid item container md={7}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.src_payload_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.src_payload_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.src_payload_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.src_payload_ref && refId === campaignPatterElement.src_payload_ref && expanded} timeout="auto" unmountOnExit>
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

        {campaignPatterElement.dst_payload_ref && (typeof campaignPatterElement.dst_payload_ref !== "undefined") && campaignPatterElement.dst_payload_ref.length !== 0?
            <Grid container direction="row" spacing={3} className="pt-1">
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted mt-3">Ссылка на STIX объект связанный с полезной нагрузкой получаемой из пункта назначения:</span>
                </Grid>
                <Grid item container md={7}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.dst_payload_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.dst_payload_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.dst_payload_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.dst_payload_ref && refId === campaignPatterElement.dst_payload_ref && expanded} timeout="auto" unmountOnExit>
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

        <Grid container direction="row" spacing={3} className="pt-1">
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Перечень протоколов, наблюдаемых в сетевом трафике:</span>
            </Grid>
            <Grid item md={7}>
                <TokenInput
                    readOnly={isDisabled}
                    style={{ height: "40px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.protocols) ? []: campaignPatterElement.protocols}
                    onTokenValuesChange={handlerListProtocols} />
            </Grid>
        </Grid>

        {campaignPatterElement.protocols && campaignPatterElement.protocols.length === 0? 
            <Grid container direction="row" spacing={3}>
                <Grid item container md={5} justifyContent="flex-end"></Grid>
                <Grid item container md={7} justifyContent="flex-start">
                    <span style={{ color: red[400], paddingLeft: "4px" }}>* перечень протоколов обязателен к заполнению</span>
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.encapsulated_by_ref && (typeof campaignPatterElement.encapsulated_by_ref !== "undefined") && campaignPatterElement.encapsulated_by_ref.length !== 0?
            <Grid container direction="row" spacing={3} className="pt-1">
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted  mt-3">Ссылка на другой STIX объект типа Сетевой трафик:</span>
                </Grid>
                <Grid item container md={7}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.encapsulated_by_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.encapsulated_by_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.encapsulated_by_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.encapsulated_by_ref && refId === campaignPatterElement.encapsulated_by_ref && expanded} timeout="auto" unmountOnExit>
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

        {campaignPatterElement.encapsulates_refs && (typeof campaignPatterElement.encapsulates_refs !== "undefined") && campaignPatterElement.encapsulates_refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <span className="text-muted">Список ссылок на другие STIX объекты типа Сетевой трафик:</span>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.encapsulates_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Card variant="outlined" style={{ width: "100%", paddingTop: 1 }} key={`key_encapsulates_ref_${key}`}>
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

        {(campaignPatterElement !== null && campaignPatterElement.ipfix)?
            Object.keys(campaignPatterElement.ipfix).length === 0?
                "":
                <React.Fragment>
                    <Grid container direction="row" className="mt-2">
                        <Grid item md={12}><span className="text-muted">Любые данные Экспорта информации IP-потока [IPFIX] для объекта:</span></Grid>
                    </Grid>
                    <Grid container direction="row" className="mt-2">
                        <Grid item md={12}>
                            {(campaignPatterElement !== null && campaignPatterElement.ipfix)?
                                <JSONTree 
                                    data={campaignPatterElement.ipfix} 
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
                                />:
                                ""}    
                        </Grid>
                    </Grid>
                </React.Fragment>:
            ""}
    </React.Fragment>);
}

CreateNetworkTrafficPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerClick: PropTypes.func.isRequired,
    handlerEndDate: PropTypes.func.isRequired,
    handlerSrcPort: PropTypes.func.isRequired,
    handlerDstPort: PropTypes.func.isRequired,
    handlerIsActive: PropTypes.func.isRequired,
    handlerStartDate: PropTypes.func.isRequired,
    handlerDstPackets: PropTypes.func.isRequired,
    handlerSrcPackets: PropTypes.func.isRequired,
    handlerDstByteCount: PropTypes.func.isRequired,
    handlerSrcByteCount: PropTypes.func.isRequired,
    handlerListProtocols: PropTypes.func.isRequired,
    // это обработчик для ссылок на объекты содержащие ТОЛЬКО одну строчку, подходит только для свойств src_ref и dst_ref которые после 
    //просмотра будет содержать только свойство value STIX объектов: ipv4-addr, ipv6-addr, mac-addr, domain-name
    handlerClickShortRef: PropTypes.func.isRequired,
    // это обработчик для ссылок на объекты содержащие полную информацию (для визуализации используется CreateShortInformationSTIXObject), 
    //подходит для свойств src_payload_ref и dst_payload_ref содержащие ссылки на STIX объект artifact 
    handlerButtonShowLink: PropTypes.func.isRequired,
};

/**
//NetworkTrafficCyberObservableObjectSTIX объект "Network Traffic Object", по терминалогии STIX, содержит объект Сетевого трафика представляющий собой произвольный сетевой трафик,
//  который исходит из источника и адресуется адресату.
 + // Extensions - объект Сетевого трафика определяет следующие расширения. В дополнение к ним производители МОГУТ создавать свои собственные. ключи словаря http-request-ext, cp-ext,
 + // Start - время, в формате "2016-05-12T08:17:27.000Z", инициирования сетевого трафика, если он известен.
 + // End - время, в формате "2016-05-12T08:17:27.000Z", окончания сетевого трафика, если он известен.
 + // IsActive - указывает, продолжается ли сетевой трафик. Если задано свойство end, то это свойство ДОЛЖНО быть false.
 + // SrcRef - указывает источник сетевого трафика в качестве ссылки на кибернаблюдаемый объект. Объект, на который ссылается ссылка, ДОЛЖЕН быть типа ipv4-addr, ipv6 - addr, mac-addr
//  или domain-name (для случаев, когда IP-адрес для доменного имени неизвестен).
 + // DstRef - указывает место назначения сетевого трафика в качестве ссылки на кибернаблюдаемый объект. Объект, на который ссылается ссылка, ДОЛЖЕН быть типа ipv4-addr, ipv6 - addr,
//  mac-addr или domain-name (для случаев, когда IP-адрес для доменного имени неизвестен).
 + // SrcPort - задает исходный порт, используемый в сетевом трафике, в виде целого числа. Значение порта ДОЛЖНО находиться в диапазоне от 0 до 65535.
 + // DstPort - задает порт назначения, используемый в сетевом трафике, в виде целого числа. Значение порта ДОЛЖНО находиться в диапазоне от 0 до 65535.
 + // Protocols - указывает протоколы, наблюдаемые в сетевом трафике, а также их соответствующее состояние.
 + // SrcByteCount - задает число байтов в виде положительного целого числа, отправленных от источника к месту назначения.
 + // DstByteCount - задает число байтов в виде положительного целого числа, отправленных из пункта назначения в источник.
 + // SrcPackets - задает количество пакетов в виде положительного целого числа, отправленных от источника к месту назначения.
 + // DstPackets - задает количество пакетов в виде положительного целого числа, отправленных от пункта назначения к источнику
 + // IPFix - указывает любые данные Экспорта информации IP-потока [IPFIX] для трафика в виде словаря. Каждая пара ключ/значение в словаре представляет имя/значение одного элемента IPFIX.
//  Соответственно, каждый ключ словаря ДОЛЖЕН быть сохраненной в регистре версией имени элемента IPFIX.
 + // SrcPayloadRef - указывает байты, отправленные из источника в пункт назначения. Объект, на который ссылается это свойство, ДОЛЖЕН иметь тип artifact.
 + // DstPayloadRef - указывает байты, отправленные из пункта назначения в источник. Объект, на который ссылается это свойство, ДОЛЖЕН иметь тип artifact.
 + // EncapsulatesRefs - ссылки на другие объекты, инкапсулированные этим объектом. Объекты, на которые ссылается это свойство, ДОЛЖНЫ иметь тип network-traffic.
 + // EncapsulatedByRef - ссылки на другой объект сетевого трафика, который инкапсулирует этот объект. Объекты, на которые ссылается это свойство, ДОЛЖНЫ иметь тип network-traffic.
type NetworkTrafficCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Extensions        map[string]interface{}        `json:"extensions" bson:"extensions"`
	Start             time.Time                     `json:"start" bson:"start"`
	End               time.Time                     `json:"end" bson:"end"`
	IsActive          bool                          `json:"is_active" bson:"is_active"`
	SrcRef            IdentifierTypeSTIX            `json:"src_ref" bson:"src_ref"`
	DstRef            IdentifierTypeSTIX            `json:"dst_ref" bson:"dst_ref"`
	SrcPort           int                           `json:"src_port" bson:"src_port"`
	DstPort           int                           `json:"dst_port" bson:"dst_port"`
	Protocols         []string                      `json:"protocols" bson:"protocols"`
	SrcByteCount      uint64                        `json:"src_byte_count" bson:"src_byte_count"`
	DstByteCount      uint64                        `json:"dst_byte_count" bson:"dst_byte_count"`
	SrcPackets        int                           `json:"src_packets" bson:"src_packets"`
	DstPackets        int                           `json:"dst_packets" bson:"dst_packets"`
	IPFix             map[string]DictionaryTypeSTIX `json:"ipfix" bson:"ipfix"`
	SrcPayloadRef     IdentifierTypeSTIX            `json:"src_payload_ref" bson:"src_payload_ref"`
	DstPayloadRef     IdentifierTypeSTIX            `json:"dst_payload_ref" bson:"dst_payload_ref"`
	EncapsulatesRefs  []IdentifierTypeSTIX          `json:"encapsulates_refs" bson:"encapsulates_refs"`
	EncapsulatedByRef IdentifierTypeSTIX            `json:"encapsulated_by_ref" bson:"encapsulated_by_ref"`
}
 */
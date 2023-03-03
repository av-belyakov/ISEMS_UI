import React from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import _, { isString } from "lodash";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";
import dictionaryLists from "../../common_helpers/dictionaryLists.js";
import { CreateListInfrastructureTypes } from "./anyElements.jsx";

let sortId = (a, b) => {
    const idA = a.id.toUpperCase();
    const idB = b.id.toUpperCase(); 
    if(idA < idB){
        return -1;
    }
    if(idA > idB){
        return 1;
    }

    return 0;
};

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

let patternName = (name) => {
    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Наименование:</span></Grid>
        <Grid item container md={7}>
            <TextField
                fullWidth
                disabled
                InputLabelProps={{ shrink: true }}
                onChange={() => {}}
                value={(name)? name: ""}
            />
        </Grid>
    </Grid>;
};

let patternDescription = (description) => {
    return <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Подробное описание:</span></Grid>
        <Grid item container md={7}>
            <TextField
                multiline
                fullWidth
                disabled
                onChange={() => {}}
                value={(description)? description: ""}
                variant="outlined"
                size="small"
            />
        </Grid>
    </Grid>;
};

let patternAliases = (aliases) => {
    if((typeof aliases === "undefined") || (aliases === null) || (aliases.length === 0)){
        return "";
    }

    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Альтернативные имена:</span></Grid>
        <Grid item container md={7} >
            <TokenInput
                readOnly
                style={{ height: "40px", width: "auto" }}
                tokenValues={(!aliases)? []: aliases}
                onTokenValuesChange={() => {}} />
        </Grid>
    </Grid>;
};

const defaultData = "0001-01-01T00:00:00.000Z";
const minDefaultData = new Date();

//export default function CreateShortInformationSTIXObject(props){
export function CreateShortInformationSTIXObject(props){
    let { obj, handlerClick } = props;

    let objectList = {
        "artifact": artifactFunc,
        "attack-pattern": attackPatternFunc,
        "autonomous-system": autonomousSystemFunc, 
        "campaign": campaignFunc,
        "course-of-action": courseOfActionFunc,
        "domain-name": domainNameFunc,
        "directory": directoryFunc,
        "email-addr": emailAddrFunc,
        "email-message": emailMessageFunc,
        "file": fileFunc,
        "identity": identityFunc,
        "indicator": indicatorFunc,
        "infrastructure": infrastructureFunc,
        "intrusion-set": intrusionSetFunc,
        "ipv4-addr": ipv4AddrFunc,
        "ipv6-addr": ipv6AddrFunc,
        "grouping": groupingFunc,
        "observed-data": observedDataFunc,
        "opinion": opinionFunc,
        "mac-addr": macAddrFunc,
        "malware": malwareFunc,
        "malware-analysis": malwareAnalysisFunc,
        "mutex": mutexFunc,
        "note": noteFunc,
        "network-traffic": networkTrafficFunc,
        "process": processFunc,
        "location": locationFunc,
        "software": softwareFunc,
        "tool": toolFunc,
        "threat-actor": threatActorFunc,
        "vulnerability": vulnerabilityFunc,
        "url": urlFunc,
        "user-account": userAccountFunc,
        "windows-registry-key": windowsRegistryKeyFunc,
        "x509-certificate": x509CertificateFunc,
    };

    if(typeof objectList[obj.type] !== "undefined"){
        return objectList[obj.type](obj, handlerClick);
    } else {
        return (<Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">не найден соответствующий объект</span></Grid>
        </Grid>);
    }
}

CreateShortInformationSTIXObject.propTypes = {
    obj: PropTypes.object.isRequired,
    handlerClick: PropTypes.func.isRequired,
};

let attackPatternFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
        {patternAliases(obj.aliases)}
    </React.Fragment>);
};

let autonomousSystemFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Номер присвоенный Автономной системе:</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    size="small"
                    disabled
                    onChange={() => {}}
                    value={(obj.number)? obj.number: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Название регионального Интернет-реестра (Regional Internet Registry):</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    size="small"
                    disabled
                    onChange={() => {}}
                    value={(obj.rir)? obj.rir: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let artifactFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Тип файлов IANA:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.mime_type)? obj.mime_type: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={5} justifyContent="flex-end" className="mt-2"><span className="text-muted">Бинарные данные в base64:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.payload_bin)? obj.payload_bin: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Унифицированный указатель ресурса (URL):</span></Grid>
            <Grid item container md={7} >
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.url)? obj.url: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 1 }}>
            <Grid item container md={5} justifyContent="flex-end" className="mt-2 mb-2"><span className="text-muted">Ключ для дешифрования зашифрованных данных:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.decryption_key)? obj.decryption_key: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let campaignFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
        {patternAliases(obj.aliases)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Основная цель или желаемый результат:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    multiline
                    fullWidth
                    disabled
                    onChange={() => {}}
                    value={(obj.objective)? obj.objective: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let courseOfActionFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
    </React.Fragment>);
};

let domainNameFunc = (obj, handlerClick) => {
    /**
     * obj.resolves_to_refs может быть только
     * - ipv4-addr
     * - ipv6-addr
     * - domain-name
     */

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Сетевое доменное имя:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.value)? obj.value: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Ссылки на один или несколько IP-адресов или доменных имен, на которые разрешается доменное имя:</span>
            </Grid>
        </Grid>

        {obj.resolves_to_refs && (() => {
            return <Grid container direction="row" spacing={3}>
                <Grid item container md={12}>
                    <ol>
                        {obj.resolves_to_refs.map((item, key) => {
                            let elem = item;
                            if(!isString(item)){
                                elem = item.value;
                            }

                            return (<ul key={`key_resolves_to_ref_button_${key}`}>
                                {(typeof getLinkImage(elem) !== "undefined")?
                                    <Button onClick={() => {                                        
                                        handlerClick(obj.id, elem);
                                    }}>
                                        <img src={`/images/stix_object/${getLinkImage(elem).link}`} width="25" height="25" />
                                        &nbsp;{elem}
                                    </Button>:
                                    <TextField
                                        fullWidth
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                        onChange={() => {}}
                                        value={elem}
                                    />}
                            </ul>);
                        })}
                    </ol>
                </Grid>
            </Grid>;
        })()}
    </React.Fragment>);
};

let directoryFunc = (obj, handlerClick) => {
    let containsRefsIsExist = (typeof obj.refs === "undefined" || obj.refs === null || obj.refs.length === 0);

    if(!containsRefsIsExist){
        obj.refs.sort(sortId);
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-start">
                <span className="text-muted">mtime:</span>&nbsp;{(obj.mtime)? obj.mtime: ""}
            </Grid>
            <Grid item container md={4} justifyContent="flex-start">
                <span className="text-muted">atime:</span>&nbsp;{(obj.atime)? obj.atime: ""}
            </Grid>
            <Grid item container md={4} justifyContent="flex-start">
                <span className="text-muted">ctime:</span>&nbsp;{(obj.ctime)? obj.ctime: ""}
            </Grid>
        </Grid>
        <Grid container direction="row" className="mt-2">
            <Grid item container md={12} justifyContent="flex-start">
                <Typography variant="h6" gutterBottom>{(obj.path)? obj.path: ""}</Typography>
            </Grid>
        </Grid>
        {showDirectoryList(obj.refs, obj.id, 0, handlerClick)}
    </React.Fragment>);
};

export function showDirectoryList(element, parentId, num, handlerClick){
    if(!_.isArray(element)){
        return "";
    }

    element.sort(sortId);

    return (<ol key={`key_ol_directory_${num}`} style={{ marginBottom: "-2px", width: "100%" }}>
        {element.map((item, key) => {
            if(typeof item.value.refs !== "undefined" && _.isArray(item.value.refs)){
                return (<ul key={`key_ul_directory_${key}_${num}`} style={{ paddingLeft: "40px" }}>
                    <div style={{"display": "flex" }}>
                        <img src={`/images/stix_object/${getLinkImage(item.id).link}`} width="25" height="25"/>
                            &nbsp;
                        <span style={{marginTop: "-3px"}}>
                            <Typography variant="h6" gutterBottom>
                                {item.value.path}
                            </Typography>
                        </span>
                    </div>
                    {showDirectoryList(item.value.refs, item.value.id, ++num, handlerClick)}
                </ul>);
            } else if(_.isString(item.value)){
                return (<ul key={`key_ul_directory_${key}_${num}`}>
                    {(typeof getLinkImage(item.id) !== "undefined")?
                        <Button onClick={() => {                                        
                            handlerClick(parentId, item.id);
                        }}>
                            <img src={`/images/stix_object/${getLinkImage(item.id).link}`} width="25" height="25"/>
                            &nbsp;{item.value}
                        </Button>:
                        item.value}
                </ul>);
            } else {
                let e = helpers.changeByteSize(item.value.size);

                return (<ul key={`key_paper_directory_${key}_${num}`} style={{ paddingLeft: "42px" }}>
                    <Paper elevation={3} style={{ width: "100%" }}>
                        <Box m={2}>
                            <Grid container direction="row" spacing={3}>
                                <Grid item container md={12} justifyContent="flex-start">
                                    <img src={`/images/stix_object/${getLinkImage(item.id).link}`} width="25" height="25"/>
                                    &nbsp;
                                    <span style={{ marginTop: "-3px" }}>
                                        <Typography variant="overline" gutterBottom>
                                            {item.id}
                                        </Typography>
                                    </span>
                                </Grid>
                            </Grid>
                            <Grid container direction="row" spacing={3}>
                                <Grid item container md={4} justifyContent="flex-start">
                                    <span className="text-muted">имя:</span>&nbsp;
                                    <strong>{item.value.name}</strong>
                                </Grid>
                                <Grid item container md={4} justifyContent="flex-start">
                                    <span className="text-muted">размер:</span>&nbsp;{e.size}&nbsp;{e.name}
                                </Grid>
                                <Grid item container md={4} justifyContent="flex-start">
                                    <span className="text-muted">MIME тип:</span>&nbsp;{item.value.mime_type}
                                </Grid>
                            </Grid>
                            <Grid container direction="row" spacing={3}>
                                <Grid item container md={4} justifyContent="center">
                                    <span className="text-muted">mtime:</span>&nbsp;{(item.value.mtime)? item.value.mtime: ""}
                                </Grid>
                                <Grid item container md={4} justifyContent="center">
                                    <span className="text-muted">atime:</span>&nbsp;{(item.value.atime)? item.value.atime: ""}
                                </Grid>
                                <Grid item container md={4} justifyContent="center">
                                    <span className="text-muted">ctime:</span>&nbsp;{(item.value.ctime)? item.value.ctime: ""}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </ul>);
            }
        })}
    </ol>);
}

let emailAddrFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Адрес электронной почты:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.value)? obj.value: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Почтовое имя которое видит человек при просмотре письма:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.display_name)? obj.display_name: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let emailMessageFunc = (obj, handlerClick) => {
    /**
     * from_ref может быть только
     * - email-address
     * sender_ref может быть только
     * - email-address
     * to_refs может быть только
     * - email-address
     * cc_refs может быть только
     * - email-address
     * bcc_refs может быть только
     * - email-address
     * raw_email_ref может быть только
     * - artifact
     */

    console.log("func 'emailMessageFunc', obj:", obj);

    let fromRef = isString(obj.from_ref)? obj.from_ref: obj.from_ref.value;
    let senderRef = isString(obj.sender_ref)? obj.sender_ref: obj.sender_ref.value;

    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Содержит ли email сообщение множественные MIME части:</span>
            </Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        disabled
                        as="select" 
                        size="sm" 
                        onChange={() => {}} 
                        value={obj.is_multipart} 
                    >
                        <option key={"key_defanged_true"} value={true}>да</option>
                        <option key={"key_defanged_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Содержимое поля <strong><i>Content-Type</i></strong> заголовка email сообщения:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.content_type)? obj.content_type: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Содержимое поля <strong><i>From</i></strong> заголовка email сообщения:</span>
            </Grid>
            <Grid item container md={7}>
                {(typeof getLinkImage(fromRef) !== "undefined")?
                    <Button onClick={() => {                                        
                        handlerClick(obj.id, fromRef);
                    }}>
                        <img src={`/images/stix_object/${getLinkImage(fromRef).link}`} width="25" height="25" />
                        &nbsp;{fromRef}
                    </Button>:
                    <TextField
                        fullWidth
                        disabled
                        InputLabelProps={{ shrink: true }}
                        onChange={() => {}}
                        value={fromRef}
                    />}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Содержимое поля <strong><i>Sender</i></strong> заголовка email сообщения:</span>
            </Grid>
            <Grid item container md={7}>
                {(typeof getLinkImage(senderRef) !== "undefined")?
                    <Button onClick={() => {                                        
                        handlerClick(obj.id, senderRef);
                    }}>
                        <img src={`/images/stix_object/${getLinkImage(senderRef).link}`} width="25" height="25" />
                        &nbsp;{senderRef}
                    </Button>:
                    <TextField
                        fullWidth
                        disabled
                        InputLabelProps={{ shrink: true }}
                        onChange={() => {}}
                        value={senderRef}
                    />}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted mt-2">Список почтовых ящиков, которые являются получателями сообщения электронной почты (содержимое поля <strong><i>To</i></strong>):</span>
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={12}>
                {(obj.to_refs && (typeof obj.to_refs !== "undefined") && (Array.isArray(obj.to_refs)))?
                    <ol>
                        {obj.to_refs.map((item, key) => {
                            let elem = isString(item)? item: item.value;

                            return (<ul key={`key_email_message_${key}`}>
                                {(typeof getLinkImage(elem) !== "undefined")?
                                    <Button onClick={() => {                                        
                                        handlerClick(obj.id, elem);
                                    }}>
                                        <img src={`/images/stix_object/${getLinkImage(elem).link}`} width="25" height="25" />
                                        &nbsp;{elem}
                                    </Button>:
                                    <TextField
                                        fullWidth
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                        onChange={() => {}}
                                        value={elem}
                                    />}
                            </ul>);
                        })}
                    </ol>:
                    ""}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted mt-2">Список почтовых ящиков, которые являются получателями сообщения электронной почты (содержимое поля <strong><i>CC</i></strong>):</span>
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={12}>
                {(obj.cc_refs && (typeof obj.cc_refs !== "undefined") && (Array.isArray(obj.cc_refs)))? 
                    <ol>
                        {obj.cc_refs.map((item, key) => {
                            let elem = isString(item)? item: item.value;

                            return (<ul key={`key_email_message_${key}`}>
                                {(typeof getLinkImage(elem) !== "undefined")?
                                    <Button onClick={() => {                                        
                                        handlerClick(obj.id, elem);
                                    }}>
                                        <img src={`/images/stix_object/${getLinkImage(elem).link}`} width="25" height="25" />
                                        &nbsp;{elem}
                                    </Button>:
                                    <TextField
                                        fullWidth
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                        onChange={() => {}}
                                        value={elem}
                                    />}
                            </ul>);
                        })}
                    </ol>:
                    ""}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted mt-2">Список почтовых ящиков, которые являются получателями сообщения электронной почты (содержимое поля <strong><i>BCC</i></strong>):</span>
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={12}>
                {(obj.bcc_refs && (typeof obj.bcc_refs !== "undefined") && (Array.isArray(obj.bcc_refs)))? 
                    <ol>
                        {obj.bcc_refs.map((item, key) => {
                            let elem = isString(item)? item: item.value;

                            return (<ul key={`key_email_message_${key}`}>
                                {(typeof getLinkImage(elem) !== "undefined")?
                                    <Button onClick={() => {                                        
                                        handlerClick(obj.id, elem);
                                    }}>
                                        <img src={`/images/stix_object/${getLinkImage(elem).link}`} width="25" height="25" />
                                        &nbsp;{elem}
                                    </Button>:
                                    <TextField
                                        fullWidth
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                        onChange={() => {}}
                                        value={elem}
                                    />}
                            </ul>);
                        })}
                    </ol>:
                    ""}
            </Grid>
        </Grid>
    </React.Fragment>);
};

let fileFunc = (obj, handlerClick) => {
    let hashList = [];

    for(let item in obj.hashes){
        hashList.push({ type: item, hash: obj.hashes[item] });
    }
                
    console.log("func 'fileFunc' obj: ", obj);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Имя файла:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.name)? obj.name: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Размер:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.size)? helpers.intConvert(obj.size)+" байт": ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Словарь хешей для файла:</span></Grid>
            <Grid item container md={7} justifyContent="flex-end"></Grid>
        </Grid>
        
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Ссылка на объект Артифакт:</span></Grid>
            <Grid item container md={7}>
                {_.isString(obj.content_ref)?
                    ((typeof getLinkImage(obj.content_ref) !== "undefined")?
                        <Button onClick={() => {                                        
                            handlerClick(obj.id, obj.content_ref);
                        }}>
                            <img src={`/images/stix_object/${getLinkImage(obj.content_ref).link}`} width="25" height="25" />
                                &nbsp;{obj.content_ref}
                        </Button>:
                        <span className="text-muted mt-2"><i>информация не найдена</i></span>):
                    <React.Fragment>
                        <Grid container direction="row">
                            <Grid item container md={12} justifyContent="flex-start" className="text-muted mt-2">
                                {obj.content_ref.id}
                            </Grid>

                        </Grid>
                        <Grid container direction="row">
                            <Grid item container md={12} justifyContent="flex-start">
                                {artifactFunc(obj.content_ref)}
                            </Grid>
                        </Grid>
                    </React.Fragment>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Хеш суммы:</span></Grid>
            <Grid item container md={7} justifyContent="flex-start"></Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={3} justifyContent="flex-end"></Grid>
            <Grid item container md={9} justifyContent="flex-start">
                <ol>
                    {hashList.map((item, num) => {
                        return (<li key={`key_hash_${num}`}>{`${item.type}:${item.hash}`}</li>);
                    })}
                </ol>
            </Grid>
        </Grid>
    </React.Fragment>);
};

let identityFunc = (obj) => {
    const getContentText = (elem, dicListType) => {
        if(elem === "" || !elem){
            return "";
        }

        for(let i = 0; i < dictionaryLists[dicListType].content.length; i++){
            if(elem === dictionaryLists[dicListType].content[i].name){
                return dictionaryLists[dicListType].content[i].summary;
            }
        }

        return "";
    };

    let textIdentityClass = getContentText(obj.identity_class, "identity-class-ov");
    if(typeof textIdentityClass === "undefined"){
        textIdentityClass = obj.identity_class;
    }

    let listSectors = obj.sectors.map((item) => {
        let sector = getContentText(item, "industry-sector-ov");

        return sector === "undefined"? item: sector;
    });

    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Роли для идентификации действий:</span>
            </Grid>
            <Grid item md={7}>
                <TokenInput
                    readOnly
                    style={{ height: "40px", width: "auto" }}
                    tokenValues={(!obj.roles) ? []: obj.roles}
                    onTokenValuesChange={() => {}} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Тип физического лица или организации:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(textIdentityClass)? textIdentityClass: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Тип промышленного сектора:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(listSectors.length > 0)? listSectors.join(", "): ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Любая контактная информация (email, тел. номера и т.д.):</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(obj.contact_information)? obj.contact_information: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let infrastructureFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
        {patternAliases(obj.aliases)}

        <CreateListInfrastructureTypes
            isDisabled={true}
            campaignPatterElement={obj}
            handlerInfrastructureTypes={() => {}}
        />
    </React.Fragment>);
};

let intrusionSetFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
        {patternAliases(obj.aliases)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Высокоуровневые цели этого набора вторжения:</span>
            </Grid>
            <Grid item md={7}>
                <TokenInput
                    readOnly
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!obj.goals) ? []: obj.goals}
                    onTokenValuesChange={() => {}} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Уровень ресурсов атаки:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    disabled
                    fullWidth
                    value={obj.resource_level? obj.resource_level: "" }
                    onChange={() => {}} 
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let groupingFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
    </React.Fragment>);
};

let observedDataFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Количество фиксации наблюдаемого кибер объекта:</span>
            </Grid>
            <Grid item container md={7} justifyContent="flex-end">
                <TextField
                    type="number"
                    disabled
                    InputLabelProps={{ shrink: true }}
                    value={(obj.number_observed)? obj.number_observed: 1}
                    onChange={() => {}}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let opinionFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Объяснение обработчика почему он оставил это мнение:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(obj.explanation)? obj.explanation: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Мнение обо всех STIX объектах на которые ссылается данный объект:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(obj.opinion)? obj.opinion: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Список авторов этого мнения:</span>
            </Grid>
            <Grid item md={7}>
                <TokenInput
                    readOnly
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!obj.authors) ? []: obj.authors}
                    onTokenValuesChange={() => {}} />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let mutexFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
    </React.Fragment>); 
};

let malwareFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
        {patternAliases(obj.aliases)}

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Перечень вредоносного програмного обеспечения:</span>
            </Grid>
            <Grid item container md={7}>
                <Select
                    multiple
                    value={obj.malware_types? obj.malware_types: []}
                    onChange={() => {}}
                >
                </Select>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Список содержащий распространенные архитектуры процессоров:</span>
            </Grid>
            <Grid item container md={7}>
                <Select
                    multiple
                    value={obj.architecture_execution_envs? obj.architecture_execution_envs: []}
                    onChange={() => {}}
                >
                </Select>
            </Grid>
        </Grid>
    </React.Fragment>);
};

let noteFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Краткое изложение содержания:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    fullWidth
                    disabled
                    onChange={() => {}}
                    value={(obj.abstract)? obj.abstract: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Основное содержание:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    fullWidth
                    disabled
                    onChange={() => {}}
                    value={(obj.content)? obj.content: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>

        {patternAliases(obj.aliases)}
    </React.Fragment>);
};

let processFunc = (obj) => {
    let createdTime = obj.created_time;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    let ct = Date.parse(obj.created_time);
    
    if(currentTimeZoneOffsetInHours > 0){
        createdTime = new Date(ct + ms);
    } else {
        createdTime = new Date(ct - (ms * -1));
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Уникальный идентификатор процесса:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    disabled
                    fullWidth
                    value={obj.pid? obj.pid: "" }
                    onChange={() => {}} 
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Время создания процесса:</span>
            </Grid>
            <Grid item md={7}>
                {helpers.convertDateFromString(createdTime, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>
    </React.Fragment>);
};

let locationFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={3} justifyContent="flex-start">
                <TextField
                    label="Страна (на латинице)"
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={(obj.country)? obj.country: ""}
                    onChange={() => {}}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    label="Административный округ"
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={(obj.administrative_area)? obj.administrative_area: ""}
                    onChange={() => {}}
                />
            </Grid>
            <Grid item container md={3} justifyContent="flex-start">
                <TextField
                    label="Город"
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={(obj.city)? obj.city: ""}
                    onChange={() => {}}
                />
            </Grid>
            <Grid item container md={3} justifyContent="flex-end">
                <TextField
                    label="Почтовый код"
                    type="number"
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={(obj.postal_code)? obj.postal_code: ""}
                    onChange={() => {}}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <TextField
                    label="Адрес"
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={(obj.street_address)? obj.street_address: ""}
                    onChange={() => {}}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let threatActorFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Тип субъектов угроз:</span>
            </Grid>
            <Grid item container md={7}>
                <Select
                    multiple
                    value={obj.threat_actor_types? obj.threat_actor_types: []}
                    onChange={() => {}}
                >
                </Select>
            </Grid>
        </Grid>

        {patternAliases(obj.aliases)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Роль субъектов угроз:</span>
            </Grid>
            <Grid item container md={7}>
                <Select
                    multiple
                    value={obj.roles? obj.roles: []}
                    onChange={() => {}}
                >
                </Select>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Высокоуровневые цели субъекта угроз:</span></Grid>
            <Grid item md={7}>
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    readOnly
                    tokenValues={(!obj.goals) ? []: obj.goals}
                    onTokenValuesChange={() => {}} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Перечень причин, мотиваций или целей стоящих за этим субъектом угрозы:</span></Grid>
            <Grid item md={7}>
                <TextField
                    disabled
                    fullWidth
                    multiline
                    value={obj.primary_motivation? obj.primary_motivation: "" }
                    onChange={() => {}}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let softwareFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Производитель:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.vendor)? obj.vendor: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Версия:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.version)? obj.version: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let toolFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Тип субъектов угроз:</span>
            </Grid>
            <Grid item container md={7}>
                <Select
                    multiple
                    value={obj.tool_types? obj.tool_types: []}
                    onChange={() => {}}
                >
                </Select>
            </Grid>
        </Grid>

        {patternAliases(obj.aliases)}
    </React.Fragment>);
};

let vulnerabilityFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
    </React.Fragment>);
};

let urlFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Уникальный идентификатор ресурса (URL):</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.value)? obj.value: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let malwareAnalysisFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Наименование продукта:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.product)? obj.product: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Версия:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.version)? obj.version: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let userAccountFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">ID пользователя:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.user_id)? obj.user_id: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Логин аккаунта:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.account_login)? obj.account_login: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Отображаемое имя:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.display_name)? obj.display_name: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let networkTrafficFunc = (obj, handlerClick) => {
    let startTime = minDefaultData;
    let endTime = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    
    if(currentTimeZoneOffsetInHours > 0){
        if(typeof obj.start !== "undefined" && obj.start !== defaultData){           
            startTime = new Date(Date.parse(obj.start) + ms);
        }

        if(typeof obj.end !== "undefined" && obj.end !== defaultData){
            endTime = new Date(Date.parse(obj.end) + ms);
        }
    } else {
        if(typeof obj.start !== "undefined" && obj.start !== defaultData){
            startTime = new Date(Date.parse(obj.start) - (ms * -1));
        }

        if(typeof obj.end !== "undefined" && obj.end !== defaultData){
            endTime = new Date(Date.parse(obj.end) - (ms * -1));
        }
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Время начала отрезка сетевого трафика:</span></Grid>
            <Grid item md={7}>
                {helpers.convertDateFromString(startTime, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Время окончания отрезка сетевого трафика:</span></Grid>
            <Grid item md={7}>
                {helpers.convertDateFromString(endTime, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">IP адрес или доменное имя источника:</span></Grid>
            <Grid item container md={7}>
                {(typeof getLinkImage(obj.src_ref) !== "undefined")?
                    <Button onClick={() => {
                        handlerClick(obj.id, obj.src_ref);
                    }}>
                        <img src={`/images/stix_object/${getLinkImage(obj.src_ref).link}`} width="25" height="25" />
                        &nbsp;{obj.src_ref}
                    </Button>:
                    <TextField
                        fullWidth
                        disabled
                        InputLabelProps={{ shrink: true }}
                        onChange={() => {}}
                        value={obj.src_ref}
                    />}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">IP адрес или доменное имя назначения:</span></Grid>
            <Grid item md={7}>
                {(typeof getLinkImage(obj.dst_ref) !== "undefined")?
                    <Button onClick={() => {                                        
                        handlerClick(obj.id, obj.dst_ref);
                    }}>
                        <img src={`/images/stix_object/${getLinkImage(obj.dst_ref).link}`} width="25" height="25" />
                        &nbsp;{obj.dst_ref}
                    </Button>:
                    <TextField
                        fullWidth
                        disabled
                        InputLabelProps={{ shrink: true }}
                        onChange={() => {}}
                        value={obj.dst_ref}
                    />}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Порт источник:</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.src_port)? obj.src_port: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Порт назначения:</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.dst_port)? obj.dst_port: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Сетевые протоколы:</span></Grid>
            <Grid item md={7}>
                <Grid item md={7}>
                    <TokenInput
                        readOnly
                        style={{ height: "80px", width: "auto" }}
                        tokenValues={(!obj.protocols) ? []: obj.protocols}
                        onTokenValuesChange={() => {}} />
                </Grid>
            </Grid>
        </Grid>
    </React.Fragment>);
};

let ipv4AddrFunc = (obj) => {
    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">IP адрес:</span></Grid>
        <Grid item md={7}>
            <TextField
                disabled
                fullWidth
                value={obj.value? obj.value: "" }
                onChange={() => {}} 
            />
        </Grid>
    </Grid>;
};

let ipv6AddrFunc = (obj) => {
    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">IP адрес:</span></Grid>
        <Grid item md={7}>
            <TextField
                disabled
                fullWidth
                value={obj.value? obj.value: "" }
                onChange={() => {}} 
            />
        </Grid>
    </Grid>;
};

let macAddrFunc = (obj) => {
    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">MAC адрес:</span></Grid>
        <Grid item md={7}>
            <TextField
                disabled
                fullWidth
                value={obj.value? obj.value: "" }
                onChange={() => {}} 
            />
        </Grid>
    </Grid>;
};

let indicatorFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Шаблон:</span></Grid>
            <Grid item md={7}>
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.pattern)? obj.pattern: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let windowsRegistryKeyFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Ключ:</span></Grid>
            <Grid item md={7}>
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.key)? obj.key: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let x509CertificateFunc = (obj) => {
    let beforeTime = obj.validity_not_before;
    let afterTime = obj.validity_not_after;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    let vbt = Date.parse(obj.validity_not_before);
    let vat = Date.parse(obj.validity_not_after);
    
    if(currentTimeZoneOffsetInHours > 0){
        beforeTime = new Date(vbt + ms);
        afterTime = new Date(vat + ms);
    } else {
        beforeTime = new Date(vbt - (ms * -1));
        afterTime = new Date(vat - (ms * -1));
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Эмитент:</span></Grid>
            <Grid item md={7}>
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.issuer)? obj.issuer: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Время начала отрезка сетевого трафика:</span></Grid>
            <Grid item md={7}>
                {helpers.convertDateFromString(beforeTime, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Время окончания отрезка сетевого трафика:</span></Grid>
            <Grid item md={7}>
                {helpers.convertDateFromString(afterTime, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Субъект:</span></Grid>
            <Grid item md={7}>
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.subject)? obj.subject: ""}
                    variant="outlined"
                    size="small"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Серийный номер:</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.serial_number)? obj.serial_number: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

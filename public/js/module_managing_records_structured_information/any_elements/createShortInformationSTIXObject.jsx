import React from "react";
import {
    Button,
    Grid,
    Select,
    TextField,
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";
import { CreateListInfrastructureTypes } from "./anyElements.jsx";

let getLinkImage = (elem) => {
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
                variant="outlined"/>
        </Grid>
    </Grid>;
};

let patternAliases = (aliases) => {
    if((aliases === null) || (aliases.length === 0)){
        return "";
    }

    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end" className="mt-2"><span className="text-muted">Альтернативные имена:</span></Grid>
        <Grid item container md={7} >
            <TokenInput
                readOnly
                style={{ height: "40px", width: "auto" }}
                tokenValues={(!aliases)? []: aliases}
                onTokenValuesChange={() => {}} />
        </Grid>
    </Grid>;
};

export default function CreateShortInformationSTIXObject(props){
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
        return <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">не найден соответствующий объект</span></Grid>
        </Grid>;
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
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Номер присвоенный Автономной системе:</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    size="small"
                    disabled
                    onChange={() => {}}
                    value={(obj.number)? obj.number: ""}
                    variant="outlined" />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Название регионального Интернет-реестра (Regional Internet Registry):</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    size="small"
                    disabled
                    onChange={() => {}}
                    value={(obj.rir)? obj.rir: ""}
                    variant="outlined" />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let artifactFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end" className="mt-2"><span className="text-muted">Тип файлов IANA:</span></Grid>
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

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end" className="mt-2"><span className="text-muted">Бинарные данные в base64:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.payload_bin)? obj.payload_bin: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end" className="mt-2"><span className="text-muted">Унифицированный указатель ресурса (URL):</span></Grid>
            <Grid item container md={7} >
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.url)? obj.url: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end" className="mt-2 mb-2"><span className="text-muted">Ключ для дешифрования зашифрованных данных:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    multiline
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.decryption_key)? obj.decryption_key: ""}
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
            <Grid item container md={5} justifyContent="flex-end" className="mt-2"><span className="text-muted">Основная цель или желаемый результат:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    multiline
                    fullWidth
                    disabled
                    onChange={() => {}}
                    value={(obj.objective)? obj.objective: ""}
                    variant="outlined"/>
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

let domainNameFunc = (obj) => {
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
    </React.Fragment>);
};

let directoryFunc = (obj, handlerClick) => {
    //let [ expanded, setExpanded ] = React.useState(false);
    //let [ refId, setRefId ] = React.useState("");            

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Директория файловой системы:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.path)? obj.path: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start"><span className="text-muted mt-2"> Список ссылок на объекты файлов или директорий:</span></Grid>
            <Grid item container md={12} justifyContent="flex-start" className="mt-2">
                {/*(typeof objectElemSrc !== "undefined")?
                    <Button onClick={() => {                                        
                        handlerClick(obj.id, obj.src_ref);
                    }}>
                        <img src={`/images/stix_object/${objectElemSrc.link}`} width="25" height="25" />
                        &nbsp;{obj.src_ref}
                    </Button>:
                    <TextField
                        fullWidth
                        disabled
                        InputLabelProps={{ shrink: true }}
                        onChange={() => {}}
                        value={obj.src_ref}
                />*/
                    /*campaignPatterElement.contains_refs.map((item, key) => {
                        let type = item.split("--");
                        let objectElem = helpers.getLinkImageSTIXObject(type[0]);

                        if(typeof objectElem === "undefined" ){
                            return "";
                        }

                        /*if(type[0] === "file"){
return (<React.Fragment>
    <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Директория файловой системы:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.path)? obj.path: ""}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Директория файловой системы:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.path)? obj.path: ""}
                />
            </Grid>
        </Grid>
</React.Fragment>)
                    }*/

                    /*if(type[0] === "file"){

                        }

                        return (<Card variant="outlined" style={{ width: "100%" }} key={`key_contains_ref_${key}`}>
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
                            <Collapse in={refId === item && expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    {(showRefId !== "" && showRefId === item)?  
                                        <CreateShortInformationSTIXObject  
                                            obj={showRefObj}
                                            handlerClick={handlerClick} />: 
                                        ""}
                                </CardContent>
                            </Collapse>
                        </Card>);
                    })*/}
            </Grid>
        </Grid>
    </React.Fragment>);
};

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
    console.log("func 'emailMessageFunc', obj:", obj);

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
                {(typeof getLinkImage(obj.from_ref) !== "undefined")?
                    <Button onClick={() => {                                        
                        handlerClick(obj.id, obj.from_ref);
                    }}>
                        <img src={`/images/stix_object/${getLinkImage(obj.from_ref).link}`} width="25" height="25" />
                        &nbsp;{obj.from_ref}
                    </Button>:
                    <TextField
                        fullWidth
                        disabled
                        InputLabelProps={{ shrink: true }}
                        onChange={() => {}}
                        value={obj.from_ref}
                    />}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Содержимое поля <strong><i>Sender</i></strong> заголовка email сообщения:</span>
            </Grid>
            <Grid item container md={7}>
                {(typeof getLinkImage(obj.sender_ref) !== "undefined")?
                    <Button onClick={() => {                                        
                        handlerClick(obj.id, obj.sender_ref);
                    }}>
                        <img src={`/images/stix_object/${getLinkImage(obj.sender_ref).link}`} width="25" height="25" />
                        &nbsp;{obj.sender_ref}
                    </Button>:
                    <TextField
                        fullWidth
                        disabled
                        InputLabelProps={{ shrink: true }}
                        onChange={() => {}}
                        value={obj.sender_ref}
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
                {(obj.to_refs && (typeof obj.to_refs !== "undefined") && (obj.to_refs.length > 0))? 
                    <ol>
                        {obj.to_refs.map((item, key) => {
                            return (<ul key={`key_email_message_${key}`}>
                                {(typeof getLinkImage(item) !== "undefined")?
                                    <Button onClick={() => {                                        
                                        handlerClick(obj.id, item);
                                    }}>
                                        <img src={`/images/stix_object/${getLinkImage(item).link}`} width="25" height="25" />
                                        &nbsp;{item}
                                    </Button>:
                                    <TextField
                                        fullWidth
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                        onChange={() => {}}
                                        value={item}
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
                {(obj.cc_refs && (typeof obj.cc_refs !== "undefined") && (obj.cc_refs.length > 0))? 
                    <ol>
                        {obj.cc_refs.map((item, key) => {
                            return (<ul key={`key_email_message_${key}`}>
                                {(typeof getLinkImage(item) !== "undefined")?
                                    <Button onClick={() => {                                        
                                        handlerClick(obj.id, item);
                                    }}>
                                        <img src={`/images/stix_object/${getLinkImage(item).link}`} width="25" height="25" />
                                        &nbsp;{item}
                                    </Button>:
                                    <TextField
                                        fullWidth
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                        onChange={() => {}}
                                        value={item}
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
                {(obj.bcc_refs && (typeof obj.bcc_refs !== "undefined") && (obj.bcc_refs.length > 0))? 
                    <ol>
                        {obj.bcc_refs.map((item, key) => {
                            return (<ul key={`key_email_message_${key}`}>
                                {(typeof getLinkImage(item) !== "undefined")?
                                    <Button onClick={() => {                                        
                                        handlerClick(obj.id, item);
                                    }}>
                                        <img src={`/images/stix_object/${getLinkImage(item).link}`} width="25" height="25" />
                                        &nbsp;{item}
                                    </Button>:
                                    <TextField
                                        fullWidth
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                        onChange={() => {}}
                                        value={item}
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
                {(_.isString(obj.content_ref) && typeof getLinkImage(obj.content_ref) !== "undefined")?
                    <Button onClick={() => {                                        
                        handlerClick(obj.id, obj.content_ref);
                    }}>
                        <img src={`/images/stix_object/${getLinkImage(obj.content_ref).link}`} width="25" height="25" />
                            &nbsp;{obj.content_ref}
                    </Button>:
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
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Роли для идентификации действий:</span></Grid>
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
                <span className="text-muted">Тип физического лица или организации:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    //minRows={3}
                    //maxRows={8}
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(obj.identity_class)? obj.identity_class: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Тип промышленного сектора:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    //minRows={3}
                    //maxRows={8}
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(obj.sectors)? obj.sectors: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Любая контактная информация (email, телефонные номера и т.д.):</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    //minRows={3}
                    //maxRows={8}
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(obj.contact_information)? obj.contact_information: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>
    </React.Fragment>);
};

let infrastructureFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
        {patternAliases(obj.aliases)}

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Тип инфраструктуры:</span>
            </Grid>
            <Grid item container md={7}>
                <CreateListInfrastructureTypes
                    isDisabled={true}
                    campaignPatterElement={obj}
                    handlerInfrastructureTypes={() => {}}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let intrusionSetFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}
        {patternAliases(obj.aliases)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Высокоуровневые цели этого набора вторжения:</span></Grid>
            <Grid item md={7}>
                <TokenInput
                    readOnly
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!obj.goals) ? []: obj.goals}
                    onTokenValuesChange={() => {}} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Уровень ресурсов атаки:</span></Grid>
            <Grid item md={7}>
                <TextField
                    select
                    disabled
                    fullWidth
                    value={obj.resource_level? obj.resource_level: "" }
                    onChange={() => {}} >
                </TextField>
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
                <span className="text-muted">Объяснение обработчика почему он оставил это мнение:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(obj.explanation)? obj.explanation: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Мнение обо всех STIX объектах на которые ссылается данный объект:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    disabled
                    fullWidth
                    onChange={() => {}}
                    value={(obj.opinion)? obj.opinion: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Список авторов этого мнения:</span></Grid>
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
                    variant="outlined"/>
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
                    variant="outlined"/>
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
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор процесса:</span></Grid>
            <Grid item md={7}>
                <TextField
                    select
                    disabled
                    fullWidth
                    value={obj.pid? obj.pid: "" }
                    onChange={() => {}} >
                </TextField>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Время создания процесса:</span></Grid>
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
                    InputLabelProps={{ shrink: true }}
                    value={(obj.country)? obj.country: ""}
                    onChange={() => {}}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    label="Административный округ"
                    disabled
                    InputLabelProps={{ shrink: true }}
                    value={(obj.administrative_area)? obj.administrative_area: ""}
                    onChange={() => {}}
                />
            </Grid>
            <Grid item container md={3} justifyContent="flex-start">
                <TextField
                    label="Город"
                    disabled
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
                    InputLabelProps={{ shrink: true }}
                    value={(obj.postal_code)? obj.postal_code: ""}
                    onChange={() => {}}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <TextField
                    fullWidth
                    label="Адрес"
                    disabled
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
                    select
                    disabled
                    fullWidth
                    value={obj.primary_motivation? obj.primary_motivation: "" }
                    onChange={() => {}} 
                >
                </TextField>
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
    let startTime = obj.start;
    let endTime = obj.end;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    let st = Date.parse(obj.start);
    let et = Date.parse(obj.end);
    
    if(currentTimeZoneOffsetInHours > 0){
        startTime = new Date(st + ms);
        endTime = new Date(et + ms);
    } else {
        startTime = new Date(st - (ms * -1));
        endTime = new Date(et - (ms * -1));
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
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">IP адрес:</span></Grid>
        <Grid item md={7}>
            <TextField
                select
                disabled
                fullWidth
                value={obj.value? obj.value: "" }
                onChange={() => {}} >
            </TextField>
        </Grid>
    </Grid>;
};

let ipv6AddrFunc = (obj) => {
    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">IP адрес:</span></Grid>
        <Grid item md={7}>
            <TextField
                select
                disabled
                fullWidth
                value={obj.value? obj.value: "" }
                onChange={() => {}} >
            </TextField>
        </Grid>
    </Grid>;
};

let macAddrFunc = (obj) => {
    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">MAC адрес:</span></Grid>
        <Grid item md={7}>
            <TextField
                select
                disabled
                fullWidth
                value={obj.value? obj.value: "" }
                onChange={() => {}} >
            </TextField>
        </Grid>
    </Grid>;
};

let indicatorFunc = (obj) => {
    return (<React.Fragment>
        {patternName(obj.name)}
        {patternDescription(obj.description)}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Порт назначения:</span></Grid>
            <Grid item md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.pattern)? obj.pattern: ""}
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
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.key)? obj.key: ""}
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
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.issuer)? obj.issuer: ""}
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
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.subject)? obj.subject: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Серийный номер:</span></Grid>
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
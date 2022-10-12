import React from "react";
import {
    Grid,
    Select,
    TextField,
} from "@material-ui/core";
import { Form, FormControl, } from "react-bootstrap";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";

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
    return <Grid container direction="row" spacing={3}>
        <Grid item container md={5} justifyContent="flex-end" className="mt-2"><span className="text-muted">Альтернативные имена:</span></Grid>
        <Grid item container md={7} >
            <TextField
                fullWidth
                disabled
                InputLabelProps={{ shrink: true }}
                onChange={() => {}}
                value={(aliases)? aliases.join(", "): ""}
            />
        </Grid>
    </Grid>;
};

export default function CreateShortInformationSTIXObject(props){
    let { obj } = props;

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
        "infrastructure": infrastructureFunc,
        "intrusion-set": intrusionSetFunc,
        "grouping": groupingFunc,
        "observed-data": observedDataFunc,
        "opinion": opinionFunc,
        "mutex": mutexFunc,
        "malware": malwareFunc,
        "note": noteFunc,
        "process": processFunc,
    };

    /**
        "software": ContentSoftwareSTIXObject,
        "url": ContentURLSTIXObject,
        "windows-registry-key": ContentWindowsRegistryKeySTIXObject,
        "x509-certificate": ContentX509CertificateSTIXObject,
        "ipv4-addr": ContentIPv4AddrSTIXObject,
        "ipv6-addr": ContentIPv6AddrSTIXObject,
        "location": ContentLocationSTIXObject,
        "mac-addr": ContentMacAddrSTIXObject,
        "network-traffic": ContentNetworkTrafficSTIXObject,
        "threat-actor": ContentThreatActorSTIXObject,
        "tool": ContentToolSTIXObject,
        "user-account": ContentUserAccountSTIXObject,
        "vulnerability": ContentVulnerabilitySTIXObject,
        "indicator": ContentAuxiliarySTIXObject,
        "malware-analysis": ContentAuxiliarySTIXObject,

        "relationship": ContentAuxiliarySTIXObject,
        "sighting": ContentAuxiliarySTIXObject,
     */

    if(typeof objectList[obj.type] !== "undefined"){
        return objectList[obj.type](obj);
    } else {
        return <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Не найден соответствующий объект</span></Grid>
        </Grid>;
    }
}

CreateShortInformationSTIXObject.propTypes = {
    obj: PropTypes.object.isRequired,
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
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.objective)? obj.objective: ""}
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

let directoryFunc = (obj) => {
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

let emailMessageFunc = (obj) => {
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
                <span className="text-muted mt-3">Содержимое поля <strong><i>From</i></strong> заголовка email сообщения:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.from_ref)? obj.from_ref: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-3">Содержимое поля <strong><i>Sender</i></strong> заголовка email сообщения:</span>
            </Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.sender_ref)? obj.sender_ref: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Список почтовых ящиков, которые являются получателями сообщения электронной почты (содержимое поля <strong><i>To</i></strong>):</span>
            </Grid>
            <Grid item container md={7} >
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.to_refs)? obj.to_refs.join(", "): ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let fileFunc = (obj) => {
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
            <Grid item container md={3} justifyContent="flex-end"></Grid>
            <Grid item container md={9} justifyContent="flex-start">
                <ol>
                    {hashList.map((item, num) => {
                        return (<li key={`key_hash_${num}`}>
                            {`${item.type}:${item.hash}`}
                        </li>);
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
                <FormControl disabled>
                    <Select
                        multiple
                        value={obj.infrastructure_types? obj.infrastructure_types: []}
                        onChange={() => {}}
                    >
                    </Select>
                </FormControl>
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
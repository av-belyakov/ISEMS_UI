import React from "react";
import {
    Grid,
    TextField, 
} from "@material-ui/core";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";

export default function CreateShortInformationSTIXObject(props){
    let { obj } = props;

    let objectList = {
        "artifact": artifactFunc,
        "attack-pattern": attackPatternFunc,
        "autonomous-system": autonomousSystemFunc, 
        "domain-name": domainNameFunc,
        "directory": directoryFunc,
        "email-addr": emailAddrFunc,
        "file": fileFunc,
    };

    /**
        "mutex": ContentMutexSTIXObject,
        "process": ContentProcessSTIXObject, 
        "software": ContentSoftwareSTIXObject,
        "url": ContentURLSTIXObject,
        "windows-registry-key": ContentWindowsRegistryKeySTIXObject,
        "x509-certificate": ContentX509CertificateSTIXObject,
        "campaign": ContentCampaignSTIXObject,
        "course-of-action": ContentCourseOfActionSTIXObject, 
        "email-message": ContentEmailMessageSTIXObject,
        "grouping": ContentGroupingSTIXObject,
        "identity": ContentIdentitySTIXObject,
        "incident": ContentIncidentSTIXObject,
        "infrastructure": ContentInfrastructureSTIXObject,
        "intrusion-set": ContentIntrusionSetSTIXObject,
        "ipv4-addr": ContentIPv4AddrSTIXObject,
        "ipv6-addr": ContentIPv6AddrSTIXObject,
        "location": ContentLocationSTIXObject,
        "mac-addr": ContentMacAddrSTIXObject,
        "malware": ContentMalwareSTIXObject,//"malware-analysis": "", напрямую относится к "malware"
        "network-traffic": ContentNetworkTrafficSTIXObject,
        "note": ContentNoteSTIXObject,
        "observed-data": ContentObservedDataSTIXObject,//"indicator": "",зависит от "observed-data"
        "opinion": ContentOpinionSTIXObject,
        "threat-actor": ContentThreatActorSTIXObject,
        "tool": ContentToolSTIXObject,
        "user-account": ContentUserAccountSTIXObject,
        "vulnerability": ContentVulnerabilitySTIXObject,
        "indicator": ContentAuxiliarySTIXObject,
        //"email-message": ContentAuxiliarySTIXObject,
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
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Наименование:</span></Grid>
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

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Подробное описание:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    multiline
                    fullWidth
                    disabled
                    onChange={() => {}}
                    value={(obj.description)? obj.description: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end" className="mt-2"><span className="text-muted">Альтернативные имена:</span></Grid>
            <Grid item container md={7} >
                <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    onChange={() => {}}
                    value={(obj.aliases)? obj.aliases.join(", "): ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
};

let autonomousSystemFunc = (obj) => {
    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Наименование:</span></Grid>
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
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Наименование:</span></Grid>
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
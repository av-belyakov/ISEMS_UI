import React, { useState } from "react";
import { 
    TextField,
    Grid,
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateListHashes  } from "../anyElements.jsx";

const defaultData = "0001-01-01T00:00";
const minDefaultData = "1970-01-01T00:00:00.000Z";
//const minDefaultData = new Date();

export default function CreateX509CertificatePatternElements(props){
    let { 
        isDisabled,
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
        handlerExtensions,
    } = props;

    let [ invalidIssuer, setInvalidIssuer ] = useState(false);

    let validityNotBefore = minDefaultData;
    let validityNotAfter = minDefaultData;
    let privateKeyUsagePeriodNotBefore = minDefaultData;
    let privateKeyUsagePeriodNotAfter = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    console.log("_____=== func 'CreateX509CertificatePatternElements', campaignPatterElement = ", campaignPatterElement);
    console.log("campaignPatterElement.x509_v3_extensions = ", campaignPatterElement.x509_v3_extensions);

    if(currentTimeZoneOffsetInHours > 0){
        if(campaignPatterElement.validity_not_before && campaignPatterElement.validity_not_before.slice(0, 16) !== defaultData){
            validityNotBefore = new Date(Date.parse(campaignPatterElement.validity_not_before) + ms);
        }

        if(campaignPatterElement.validity_not_after && campaignPatterElement.validity_not_after.slice(0, 16) !== defaultData){
            validityNotAfter = new Date(Date.parse(campaignPatterElement.validity_not_after) + ms);
        }

        if(campaignPatterElement.x509_v3_extensions){
            if(campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_before && campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_before.slice(0, 16) !== defaultData){
                privateKeyUsagePeriodNotBefore = new Date(Date.parse(campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_before) + ms);
            }

            if(campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_after && campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_after.slice(0, 16) !== defaultData){
                privateKeyUsagePeriodNotAfter = new Date(Date.parse(campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_after) + ms);
            }
        }
    } else {
        if(campaignPatterElement.validity_not_before && campaignPatterElement.validity_not_before.slice(0, 16) !== defaultData){
            validityNotBefore = new Date(Date.parse(campaignPatterElement.validity_not_before) - (ms * -1));
        }

        if(campaignPatterElement.validity_not_after && campaignPatterElement.validity_not_after.slice(0, 16) !== defaultData){
            validityNotAfter = new Date(Date.parse(campaignPatterElement.validity_not_after) - (ms * -1));
        }

        if(campaignPatterElement.x509_v3_extensions){
            if(campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_before && campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_before.slice(0, 16) !== defaultData){
                privateKeyUsagePeriodNotBefore = new Date(Date.parse(campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_before) + ms);
            }

            if(campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_after && campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_after.slice(0, 16) !== defaultData){
                privateKeyUsagePeriodNotAfter = new Date(Date.parse(campaignPatterElement.x509_v3_extensions.private_key_usage_period_not_after) + ms);
            }
        }
    }

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
                        if(e.target.value.length === 0){
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

        {campaignPatterElement.x509_v3_extensions? 
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 6 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <strong className="text-muted mt-2">Любые стандартные расширения X.509 v3, которые могут использоваться в сертификате</strong>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Является ли сертификат сертификатом Удостоверяющего центра (CA):</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-basic_constraints"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "basic_constraints", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.basic_constraints)? campaignPatterElement.x509_v3_extensions.basic_constraints: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Пространство имен, где располагаюся все имена применяемые в сертификатах:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-name_constraints"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "name_constraints", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.name_constraints)? campaignPatterElement.x509_v3_extensions.name_constraints: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Любые ограничения на проверку сертификатов, выданных Удостоверяющим центром:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-policy_contraints"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "policy_contraints", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.policy_contraints)? campaignPatterElement.x509_v3_extensions.policy_contraints: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Многозначное расширение, состоящее из списка имен разрешенных для использования ключей:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-key_usage"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "key_usage", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.key_usage)? campaignPatterElement.x509_v3_extensions.key_usage: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Список целей, для которых может использоваться открытый ключ сертификата:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-extended_key_usage"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "extended_key_usage", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.extended_key_usage)? campaignPatterElement.x509_v3_extensions.extended_key_usage: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Идентификатор, который обеспечивает средство идентификации сертификатов, содержащих определенный открытый ключ:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-subject_key_identifier"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "subject_key_identifier", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.subject_key_identifier)? campaignPatterElement.x509_v3_extensions.subject_key_identifier: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Идентификатор, который обеспечивает средство идентификации открытого ключа, соответствующего закрытому ключу, используемому для подписи сертификата:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-authority_key_identifier"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "authority_key_identifier", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.authority_key_identifier)? campaignPatterElement.x509_v3_extensions.authority_key_identifier: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Дополнительные идентификаторы, которые должны быть привязаны к субъекту сертификата:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-subject_alternative_name"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "subject_alternative_name", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.subject_alternative_name)? campaignPatterElement.x509_v3_extensions.subject_alternative_name: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Дополнительные идентификаторы, которые должны быть привязаны к эмитенту сертификата:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-issuer_alternative_name"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "issuer_alternative_name", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.issuer_alternative_name)? campaignPatterElement.x509_v3_extensions.issuer_alternative_name: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Идентификационные признаки субъекта:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-subject_directory_attributes"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "subject_directory_attributes", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.subject_directory_attributes)? campaignPatterElement.x509_v3_extensions.subject_directory_attributes: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Способ получения информации CRL:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-crl_distribution_points"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "crl_distribution_points", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.crl_distribution_points)? campaignPatterElement.x509_v3_extensions.crl_distribution_points: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Дополнительные идентификаторы, которые должны быть привязаны к эмитенту сертификата:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-inhibit_any_policy"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "inhibit_any_policy", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.inhibit_any_policy)? campaignPatterElement.x509_v3_extensions.inhibit_any_policy: ""}
                        />
                    </Grid>
                </Grid>

                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted mt-2">Начало срока действия закрытого ключа:</span>
                    </Grid>
                    <Grid item container md={7}>
                        {isDisabled?
                            helpers.convertDateFromString(privateKeyUsagePeriodNotBefore, { monthDescription: "long", dayDescription: "numeric" })
                            :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    variant="inline"
                                    ampm={false}
                                    value={privateKeyUsagePeriodNotBefore}
                                    minDate={new Date("1970-01-01")}
                                    maxDate={new Date()}
                                    onChange={(e) => handlerExtensions({type: "private_key_usage_period_not_before", elem: e})}
                                    format="dd.MM.yyyy HH:mm"
                                />
                            </MuiPickersUtilsProvider>}
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted mt-2">Окончание срока действия закрытого ключа:</span>
                    </Grid>
                    <Grid item container md={7}>
                        {isDisabled?
                            helpers.convertDateFromString(privateKeyUsagePeriodNotAfter, { monthDescription: "long", dayDescription: "numeric" })
                            :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    variant="inline"
                                    ampm={false}
                                    value={privateKeyUsagePeriodNotAfter}
                                    minDate={new Date("1970-01-01")}
                                    maxDate={new Date()}
                                    onChange={(e) => handlerExtensions({type: "private_key_usage_period_not_after", elem: e})}
                                    format="dd.MM.yyyy HH:mm"
                                />
                            </MuiPickersUtilsProvider>}
                    </Grid>
                </Grid>

                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Последовательность из одного или нескольких терминов информации о политике:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-certificate_policies"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "certificate_policies", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.certificate_policies)? campaignPatterElement.x509_v3_extensions.certificate_policies: ""}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item container md={5} justifyContent="flex-end">
                        <span className="text-muted">Одна или несколько пар идентификаторов:</span>
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            id="outlined-ext-policy_mappings"
                            fullWidth
                            size="small"
                            disabled={isDisabled}
                            onChange={(e) => handlerExtensions({type: "policy_mappings", elem: e})}
                            value={(campaignPatterElement.x509_v3_extensions.policy_mappings)? campaignPatterElement.x509_v3_extensions.policy_mappings: ""}
                        />
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

CreateX509CertificatePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
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
    handlerExtensions: PropTypes.func.isRequired,
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

type X509V3ExtensionsTypeSTIX struct {
	BasicConstraints               string    `json:"basic_constraints" bson:"basic_constraints"`
	NameConstraints                string    `json:"name_constraints" bson:"name_constraints"`
	PolicyContraints               string    `json:"policy_contraints" bson:"policy_contraints"`
	KeyUsage                       string    `json:"key_usage" bson:"key_usage"`
	ExtendedKeyUsage               string    `json:"extended_key_usage" bson:"extended_key_usage"`
	SubjectKeyIdentifier           string    `json:"subject_key_identifier" bson:"subject_key_identifier"`
	AuthorityKeyIdentifier         string    `json:"authority_key_identifier" bson:"authority_key_identifier"`
	SubjectAlternativeName         string    `json:"subject_alternative_name" bson:"subject_alternative_name"`
	IssuerAlternativeName          string    `json:"issuer_alternative_name" bson:"issuer_alternative_name"`
	SubjectDirectoryAttributes     string    `json:"subject_directory_attributes" bson:"subject_directory_attributes"`
	CrlDistributionPoints          string    `json:"crl_distribution_points" bson:"crl_distribution_points"`
	InhibitAnyPolicy               string    `json:"inhibit_any_policy" bson:"inhibit_any_policy"`
	PrivateKeyUsagePeriodNotBefore time.Time `json:"private_key_usage_period_not_before" bson:"private_key_usage_period_not_before"`
	PrivateKeyUsagePeriodNotAfter  time.Time `json:"private_key_usage_period_not_after" bson:"private_key_usage_period_not_after"`
	CertificatePolicies            string    `json:"certificate_policies" bson:"certificate_policies"`
	PolicyMappings                 string    `json:"policy_mappings" bson:"policy_mappings"`
} 
 */

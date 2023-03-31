import React from "react";
import { 
    Grid,
    TextField,
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateListAccountType } from "../anyElements.jsx";

const defaultData = "0001-01-01T00:00";
const minDefaultData = "1970-01-01T00:00:00.000Z";

export default function CreateUserAccountPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerUserId,
        handlerCredential,
        handlerIsDisabled,
        handlerAccountType,
        handlerDisplayName,
        handlerAccountLogin,
        handlerIsPrivileged,
        handlerAccountCreated,
        handlerAccountExpires,
        handlerAccountLastLogin,
        handlerCanEscalatePrivs,
        handlerIsServiceAccount,
        handlerAccountFirstLogin,
        handlerCredentialLastChanged,
    } = props;

    let accountCreated = minDefaultData;
    let accountExpires = minDefaultData;
    let credentialLastChanged = minDefaultData;
    let accountFirstLogin = minDefaultData;
    let accountLastLogin = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.account_created !== "undefined" && campaignPatterElement.account_created.slice(0, 16) !== defaultData){
            accountCreated = new Date(Date.parse(campaignPatterElement.account_created) + ms);
        }

        if(typeof campaignPatterElement.account_expires !== "undefined" && campaignPatterElement.account_expires.slice(0, 16) !== defaultData){
            accountExpires = new Date(Date.parse(campaignPatterElement.account_expires) + ms);
        }

        if(typeof campaignPatterElement.credential_last_changed !== "undefined" && campaignPatterElement.credential_last_changed.slice(0, 16) !== defaultData){
            credentialLastChanged = new Date(Date.parse(campaignPatterElement.credential_last_changed) + ms);
        }

        if(typeof campaignPatterElement.account_first_login !== "undefined" && campaignPatterElement.account_first_login.slice(0, 16) !== defaultData){
            accountFirstLogin = new Date(Date.parse(campaignPatterElement.account_first_login) + ms);
        }

        if(typeof campaignPatterElement.account_last_login !== "undefined" && campaignPatterElement.account_last_login.slice(0, 16) !== defaultData){
            accountLastLogin = new Date(Date.parse(campaignPatterElement.account_last_login) + ms);
        }
    } else {
        if(typeof campaignPatterElement.account_created !== "undefined" && campaignPatterElement.account_created.slice(0, 16) !== defaultData){
            accountCreated = new Date(Date.parse(campaignPatterElement.account_created) - (ms * -1));
        }

        if(typeof campaignPatterElement.account_expires !== "undefined" && campaignPatterElement.account_expires.slice(0, 16) !== defaultData){
            accountExpires = new Date(Date.parse(campaignPatterElement.account_expires) + ms);
        }

        if(typeof campaignPatterElement.credential_last_changed !== "undefined" && campaignPatterElement.credential_last_changed.slice(0, 16) !== defaultData){
            credentialLastChanged = new Date(Date.parse(campaignPatterElement.credential_last_changed) + ms);
        }

        if(typeof campaignPatterElement.account_first_login !== "undefined" && campaignPatterElement.account_first_login.slice(0, 16) !== defaultData){
            accountFirstLogin = new Date(Date.parse(campaignPatterElement.account_first_login) + ms);
        }

        if(typeof campaignPatterElement.account_last_login !== "undefined" && campaignPatterElement.account_last_login.slice(0, 16) !== defaultData){
            accountLastLogin = new Date(Date.parse(campaignPatterElement.account_last_login) + ms);
        }
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Идентификатор учетной записи (userID):</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-user_id"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerUserId}
                    value={(campaignPatterElement.user_id)? campaignPatterElement.user_id: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Учетные данные пользователя в открытом виде:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-credential"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerCredential}
                    value={(campaignPatterElement.credential)? campaignPatterElement.credential: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Логин пользователя:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-account_login"
                    fullWidth
                    error={campaignPatterElement.account_login === ""}
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerAccountLogin}
                    value={(campaignPatterElement.account_login)? campaignPatterElement.account_login: ""}
                    helperText="поле обязательно для заполнение"
                />
            </Grid>
        </Grid>

        <CreateListAccountType 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement}
            handlerAccountType={handlerAccountType}
        />

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted">Имя учетной записи, которое будет отображаться в пользовательских интерфейсах:</span>
            </Grid>
            <Grid item md={7}>
                <TextField
                    id="outlined-display_name"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerDisplayName}
                    value={(campaignPatterElement.display_name)? campaignPatterElement.display_name: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-1">Учетная запись связана с сетевой службой или системным процессом (демоном):</span>
            </Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        as="select" 
                        size="sm" 
                        onChange={handlerIsServiceAccount} 
                        value={campaignPatterElement.is_service_account} 
                        id="dropdown_list_is_service_account" >
                        <option key={"key_is_service_account_true"} value={true}>да</option>
                        <option key={"key_is_service_account_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ paddingTop: 2 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-1">Учетная запись имеет повышенные привилегии:</span></Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        as="select" 
                        size="sm" 
                        onChange={handlerIsPrivileged} 
                        value={campaignPatterElement.is_privileged} 
                        id="dropdown_list_is_privileged" >
                        <option key={"key_is_privileged_true"} value={true}>да</option>
                        <option key={"key_is_privileged_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ paddingTop: 2 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-1">Учетная запись имеет возможность повышать привилегии:</span></Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        as="select" 
                        size="sm" 
                        onChange={handlerCanEscalatePrivs} 
                        value={campaignPatterElement.can_escalate_privs} 
                        id="dropdown_list_can_escalate_privs" >
                        <option key={"key_can_escalate_privs_true"} value={true}>да</option>
                        <option key={"key_can_escalate_privs_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ paddingTop: 2 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-1">Учетная запись отключена:</span></Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        as="select" 
                        size="sm" 
                        onChange={handlerIsDisabled} 
                        value={campaignPatterElement.is_disabled} 
                        id="dropdown_list_is_disabled" >
                        <option key={"key_is_disabled_true"} value={true}>да</option>
                        <option key={"key_is_disabled_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Аккаунт создан:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(accountCreated, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={accountCreated}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerAccountCreated}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Первый доступ к учетной записи:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(accountFirstLogin, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={accountFirstLogin}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerAccountFirstLogin}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Последний доступ к учетной записи:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(accountLastLogin, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={accountLastLogin}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerAccountLastLogin}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Учетная запись была изменена в последний раз:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(credentialLastChanged, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={credentialLastChanged}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerCredentialLastChanged}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Истечение срока действия учетной записи:</span>
            </Grid>
            <Grid item container md={7}>
                {isDisabled?
                    helpers.convertDateFromString(accountExpires, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={accountExpires}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date("2049-12-31")}
                            onChange={handlerAccountExpires}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        {/** 
         в CreateElementAdditionalTechnicalInformationCO должно быть
        Extensions            map[string]UNIXAccountExtensionSTIX `json:"extensions" bson:"extensions"`      

        (campaignPatterElement !== null && campaignPatterElement.extensions)?
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

CreateUserAccountPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerUserId: PropTypes.func.isRequired,
    handlerCredential: PropTypes.func.isRequired,
    handlerIsDisabled: PropTypes.func.isRequired,
    handlerAccountType: PropTypes.func.isRequired,
    handlerDisplayName: PropTypes.func.isRequired,
    handlerAccountLogin: PropTypes.func.isRequired,
    handlerIsPrivileged: PropTypes.func.isRequired,
    handlerAccountCreated: PropTypes.func.isRequired,
    handlerAccountExpires: PropTypes.func.isRequired,
    handlerAccountLastLogin: PropTypes.func.isRequired,
    handlerCanEscalatePrivs: PropTypes.func.isRequired,
    handlerIsServiceAccount: PropTypes.func.isRequired,
    handlerAccountFirstLogin: PropTypes.func.isRequired,
    handlerCredentialLastChanged: PropTypes.func.isRequired,
};

/**
//UserAccountCyberObservableObjectSTIX объект "User Account Object", по терминалогии STIX, содержит экземпляр любого типа учетной записи пользователя, включая,
// учетные записи операционной системы, устройства, службы обмена сообщениями и платформы социальных сетей и других прочих учетных записей
// Поскольку все свойства этого объекта являются необязательными, по крайней мере одно из свойств, определенных ниже, ДОЛЖНО быть инициализировано
// при использовании этого объекта
// Extensions - содержит словарь расширяющий тип "User Account Object" одно из расширений "unix-account-ext", реализуется описанным ниже типом, UNIXAccountExtensionSTIX
//  кроме этого производитель может созавать свои собственные типы расширений
//  Ключи данного словаря идентифицируют тип расширения по имени, значения являются содержимым экземпляра расширения
// UserID - содержит идентификатор учетной записи. Формат идентификатора зависит от системы в которой находится данная учетная запись пользователя,
//  и может быть числовым идентификатором, идентификатором GUID, именем учетной записи, адресом электронной почты и т.д. Свойство  UserId должно
//  быть заполнено любым значанием, являющимся уникальным идентификатором системы, членом которой является учетная запись. Например, в системах UNIX он
//  будет заполнено значением UID
// Credential - содержит учетные данные пользователя в открытом виде. Предназначено только для закрытого применения при изучении метаданных вредоносных программ
//  при их исследовании (например, жестко закодированный пароль администратора домена, который вредоносная программа пытается использовать реализации тактики для
//	бокового (латерального) перемещения) и не должно применяться для совместного пользования PII
// AccountLogin - содержит логин пользователя. Используется в тех случаях,когда свойство UserId указывает другие данные, чем то, что пользователь вводит
//  при входе в систему
// AccountType - содержит одно, из заранее определенных (предложенных) значений. Является типом аккаунта. Значения этого свойства берутся из множества
//  закрепленного в открытом словаре, account-type-ov
// DisplayName - содержит отображаемое имя учетной записи, которое будет отображаться в пользовательских интерфейсах. В Unix, это равносильно полю gecos
//  (gecos это поле учётной записи пользователя в файле /etc/passwd )
// IsServiceAccount - содержит индикатор, сигнализирующий что, учетная запись связана с сетевой службой или системным процессом (демоном), а не с конкретным человеком. (системный пользователь)
// IsPrivileged - содержит индикатор, сигнализирующий что, учетная запись имеет повышенные привилегии (например, в случае root в Unix или учетной записи администратора
//  Windows)
// CanEscalatePrivs  - содержит индикатор, сигнализирующий что, учетная запись имеет возможность повышать привилегии (например, в случае sudo в Unix или учетной
//  записи администратора домена Windows)
// IsDisabled  - содержит индикатор, сигнализирующий что, учетная запись отключена
// AccountCreated - время, в формате "2016-05-12T08:17:27.000Z", создания аккаунта
// AccountExpires - время, в формате "2016-05-12T08:17:27.000Z", истечения срока действия учетной записи.
// CredentialLastChanged - время, в формате "2016-05-12T08:17:27.000Z", когда учетные данные учетной записи были изменены в последний раз.
// AccountFirstLogin - время, в формате "2016-05-12T08:17:27.000Z", первого доступа к учетной записи
// AccountLastLogin - время, в формате "2016-05-12T08:17:27.000Z", когда к учетной записи был последний доступ.
type UserAccountCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Extensions            map[string]UNIXAccountExtensionSTIX `json:"extensions" bson:"extensions"`
	UserID                string                              `json:"user_id" bson:"user_id"`
	Credential            string                              `json:"credential" bson:"credential"`
	AccountLogin          string                              `json:"account_login" bson:"account_login"`
	AccountType           OpenVocabTypeSTIX                   `json:"account_type" bson:"account_type"`
	DisplayName           string                              `json:"display_name" bson:"display_name"`
	IsServiceAccount      bool                                `json:"is_service_account" bson:"is_service_account"`
	IsPrivileged          bool                                `json:"is_privileged" bson:"is_privileged"`
	CanEscalatePrivs      bool                                `json:"can_escalate_privs" bson:"can_escalate_privs"`
	IsDisabled            bool                                `json:"is_disabled" bson:"is_disabled"`
	AccountCreated        time.Time                           `json:"account_created" bson:"account_created"`
	AccountExpires        time.Time                           `json:"account_expires" bson:"account_expires"`
	CredentialLastChanged time.Time                           `json:"credential_last_changed" bson:"credential_last_changed"`
	AccountFirstLogin     time.Time                           `json:"account_first_login" bson:"account_first_login"`
	AccountLastLogin      time.Time                           `json:"account_last_login" bson:"account_last_login"`
}

// UNIXAccountExtensionSTIX тип "unix-account-ext", по терминалогии STIX, содержит рассширения 'по умолчанию' захваченной дополнительной информации
// предназначенной для аккаунтов UNIX систем.
// GID - содержит первичный групповой ID аккаунта
// Groups - содержит список имен групп которые являются членами аккаунта
// HomeDir - содержит домашную директорию аккаунта
// Shell - содержит командную оболочку аккаунта
type UNIXAccountExtensionSTIX struct {
	GID     int      `json:"gid" bson:"gid"`
	Groups  []string `json:"group" bson:"group"`
	HomeDir string   `json:"home_dir" bson:"home_dir"`
	Shell   string   `json:"shell" bson:"shell"`
}
 */

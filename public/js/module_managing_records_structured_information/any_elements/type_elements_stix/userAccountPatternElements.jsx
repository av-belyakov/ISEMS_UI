import React from "react";
import {
    Button,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";

export default function CreateUserAccountPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerAuthors,
        handlerOpinion, 
        handlerExplanation,
    } = props;

    return (<React.Fragment>

    </React.Fragment>);
}

CreateUserAccountPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerAuthors: PropTypes.func.isRequired,
    handlerOpinion: PropTypes.func.isRequired, 
    handlerExplanation: PropTypes.func.isRequired,
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
 */
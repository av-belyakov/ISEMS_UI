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

export default function CreateProcessPatternElements(props){
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

CreateProcessPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerAuthors: PropTypes.func.isRequired,
    handlerOpinion: PropTypes.func.isRequired, 
    handlerExplanation: PropTypes.func.isRequired,
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
	EnvironmentVariables map[string]DictionaryTypeSTIX `json:"environment_variables" bson:"environment_variables"`
	OpenedConnectionRefs []IdentifierTypeSTIX          `json:"opened_connection_refs" bson:"opened_connection_refs"`
	CreatorUserRef       IdentifierTypeSTIX            `json:"creator_user_ref" bson:"creator_user_ref"`
	ImageRef             IdentifierTypeSTIX            `json:"image_ref" bson:"image_ref"`
	ParentRef            IdentifierTypeSTIX            `json:"parent_ref" bson:"parent_ref"`
	ChildRefs            []IdentifierTypeSTIX          `json:"child_refs" bson:"child_refs"`
}
 */
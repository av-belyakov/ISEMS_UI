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

export default function CreateNetworkTrafficPatternElements(props){
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

CreateNetworkTrafficPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerAuthors: PropTypes.func.isRequired,
    handlerOpinion: PropTypes.func.isRequired, 
    handlerExplanation: PropTypes.func.isRequired,
};

/**
//NetworkTrafficCyberObservableObjectSTIX объект "Network Traffic Object", по терминалогии STIX, содержит объект Сетевого трафика представляющий собой произвольный сетевой трафик,
//  который исходит из источника и адресуется адресату.
// Extensions - объект Сетевого трафика определяет следующие расширения. В дополнение к ним производители МОГУТ создавать свои собственные. ключи словаря http-request-ext, cp-ext,
// Start - время, в формате "2016-05-12T08:17:27.000Z", инициирования сетевого трафика, если он известен.
// End - время, в формате "2016-05-12T08:17:27.000Z", окончания сетевого трафика, если он известен.
// IsActive - указывает, продолжается ли сетевой трафик. Если задано свойство end, то это свойство ДОЛЖНО быть false.
// SrcRef - указывает источник сетевого трафика в качестве ссылки на кибернаблюдаемый объект. Объект, на который ссылается ссылка, ДОЛЖЕН быть типа ipv4-addr, ipv6 - addr, mac-addr
//  или domain-name (для случаев, когда IP-адрес для доменного имени неизвестен).
// DstRef - указывает место назначения сетевого трафика в качестве ссылки на кибернаблюдаемый объект. Объект, на который ссылается ссылка, ДОЛЖЕН быть типа ipv4-addr, ipv6 - addr,
//  mac-addr или domain-name (для случаев, когда IP-адрес для доменного имени неизвестен).
// SrcPort - задает исходный порт, используемый в сетевом трафике, в виде целого числа. Значение порта ДОЛЖНО находиться в диапазоне от 0 до 65535.
// DstPort - задает порт назначения, используемый в сетевом трафике, в виде целого числа. Значение порта ДОЛЖНО находиться в диапазоне от 0 до 65535.
// Protocols - указывает протоколы, наблюдаемые в сетевом трафике, а также их соответствующее состояние.
// SrcByteCount - задает число байтов в виде положительного целого числа, отправленных от источника к месту назначения.
// DstByteCount - задает число байтов в виде положительного целого числа, отправленных из пункта назначения в источник.
// SrcPackets - задает количество пакетов в виде положительного целого числа, отправленных от источника к месту назначения.
// DstPackets - задает количество пакетов в виде положительного целого числа, отправленных от пункта назначения к источнику
// IPFix - указывает любые данные Экспорта информации IP-потока [IPFIX] для трафика в виде словаря. Каждая пара ключ/значение в словаре представляет имя/значение одного элемента IPFIX.
//  Соответственно, каждый ключ словаря ДОЛЖЕН быть сохраненной в регистре версией имени элемента IPFIX.
// SrcPayloadRef - указывает байты, отправленные из источника в пункт назначения. Объект, на который ссылается это свойство, ДОЛЖЕН иметь тип artifact.
// DstPayloadRef - указывает байты, отправленные из пункта назначения в источник. Объект, на который ссылается это свойство, ДОЛЖЕН иметь тип artifact.
// EncapsulatesRefs - ссылки на другие объекты, инкапсулированные этим объектом. Объекты, на которые ссылается это свойство, ДОЛЖНЫ иметь тип network-traffic.
// EncapsulatedByRef - ссылки на другой объект сетевого трафика, который инкапсулирует этот объект. Объекты, на которые ссылается это свойство, ДОЛЖНЫ иметь тип network-traffic.
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
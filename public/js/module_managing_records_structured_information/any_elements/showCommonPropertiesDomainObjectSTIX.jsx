import React from "react";
import { Col, Row } from "react-bootstrap";
import { Chip } from "@material-ui/core";
import PropTypes from "prop-types";

export default class ShowCommonPropertiesDomainObjectSTIX extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        let reportInfo = this.props.commonData;

        let getExternalReferences = () => {
            // *** для теста START ***
            let lister = [
                {
                    source_name: "external references 1",
                    description: "common description external references 1 to read people",
                    url: "html://external-references-example-1.net/watch?v=BSoHDCWze7E",
                    hashes: {"md5": "dvyw7f37fggug8fg88g84fg8877e7fe", "sha256": "bcu48gc7g7848f48g88g85g8rfgh8rh84h8h8r8rh8rh8r"},
                    external_id: "ex-ref--vueueuf8egfurggrg7gd7fe",
                },
                {
                    source_name: "external references 2",
                    description: "common description external references 2 to read people",
                    url: "html://external-references-example-2222.net/watch?v=BSoHDCWze7E",
                    hashes: {"md5": "dvyw7f37fggug8fg88g84fg8877e7fe", "sha128": "nbeiuu37fg7g4f7g84g8gd8fg8eg8egf8e", "sha256": "bcu48gc7g7848f48g88g85g8rfgh8rh84h8h8r8rh8rh8r"},
                    external_id: "ex-ref--beg77e7fd3f377gr7eg7efg7",
                },
                {
                    source_name: "external references 3",
                    url: "html://external-references-example-2222.net/watch?v=BSoHDCWze7E",
                    external_id: "ex-ref--cbscvsvcvdvucvduvduvcduvbduv",
                },
            ];
            reportInfo.external_references = lister;
            // *** для теста END ***

            if((typeof reportInfo.external_references === "undefined") || (reportInfo.external_references === null) || (reportInfo.external_references.length === 0)){
                return;
            }

            let externalReferences = () => {
                return reportInfo.external_references.map((item, key) => {
                    let listHashes = [];

                    if((item.hashes !== null) && (typeof item.hashes !== "undefined")){
                        for(let k in item.hashes){
                            listHashes.push(<li key={`hash_${item.hashes[k]}`}>{k}: {item.hashes[k]}</li>);
                        }    
                    }

                    return (<Row key={`external_references_${key}`} className="mb-2">
                        <Col md={12}>
                            {((typeof item.source_name === "undefined") || (item.source_name === null) || (item.source_name.length === 0) ? "": <Row><Col>наименование: {item.source_name}</Col></Row>)}
                            {((typeof item.external_id === "undefined") || (item.external_id === null) || (item.external_id.length === 0) ? "": <Row><Col>внешний ID: {item.external_id}</Col></Row>)}
                            {((typeof item.description === "undefined") || (item.description === null) || (item.description.length === 0) ? "": <Row><Col>описание: {item.description}</Col></Row>)}
                            {((typeof item.url === "undefined") ||  (item.url === null) || (item.url.length === 0) ? "": <Row><Col><a href={item.url}>{item.url}</a></Col></Row>)}
                            {(listHashes.length !== 0) ? <Row><Col>хеш суммы:<ol>{listHashes.map((elem) => {
                                return elem;
                            })}</ol></Col></Row> : ""}
                        </Col>
                    </Row>);
                });
            };

            return (
                <Row>
                    <Col md={4} className="text-left"><span className="text-muted">дополнительные, внешние ссылки</span>:</Col>
                    <Col md={8}>{externalReferences()}</Col>
                </Row>
            );
        };
        let getGranularMarkings = () => {
            // *** для теста START ***
            let lister = [
                {
                    lang: "CH",
                    marking_ref: "marking--bubdu8eeugfuegfe8fefhefe",
                    selectors: ["selectors_suvnid_1", "selectors_cvbi_2"],
                },
                {
                    lang: "US",
                    marking_ref: "marking-- cscusuudbsfubdufbudbfueubue",
                },
                {
                    lang: "RU",
                    selectors: ["selectors-bdufbdubudfud", "selectors-sufuwu3fueuef", "selectors-dufveufueufuefu"],
                },
            ];
            reportInfo.granular_markings = lister;
            // *** для теста END ***

            if((typeof reportInfo.granular_markings === "undefined") || (reportInfo.granular_markings === null) || (reportInfo.granular_markings.length === 0)){
                return;
            }

            let granularMarkings = () => {
                return reportInfo.granular_markings.map((item, key) => {
                    let listSelectors = [];

                    if((item.selectors !== null) && (typeof item.selectors !== "undefined")){
                        for(let k in item.selectors){
                            listSelectors.push(<li key={`hash_${item.selectors[k]}`}>{k}: {item.selectors[k]}</li>);
                        }    
                    }

                    return (<Row key={`granular_markings_${key}`} className="mb-2">
                        <Col md={12}>
                            {((typeof item.lang === "undefined") || (item.lang === null) || (item.lang.length === 0) ? "": <Row><Col>текстовый код языка: {item.lang}</Col></Row>)}
                            {((typeof item.marking_ref === "undefined") || (item.marking_ref === null) || (item.marking_ref.length === 0) ? "": <Row><Col>маркер ссылки: {item.marking_ref}</Col></Row>)}
                            {(listSelectors.length !== 0) ? <Row><Col>хеш суммы:<ol>{listSelectors.map((elem) => {
                                return elem;
                            })}</ol></Col></Row> : ""}
                        </Col>
                    </Row>);
                });
            };

            return (
                <Row>
                    <Col md={4} className="text-left"><span className="text-muted">дополнительные, "гранулярные метки"</span>:</Col>
                    <Col md={8}>{granularMarkings()}</Col>
                </Row>
            );
        };

        return (<React.Fragment>
            <Row className="mt-2 mb-2">
                <Col md={12} className="text-center">Дополнительная техническая информация</Col>                                
            </Row>
            <Row>
                <Col md={6} className="text-left"><span className="text-muted">версия спецификации STIX</span>:</Col>
                <Col md={6} className="text-center">{(reportInfo.spec_version.length === 0) ? <span className="text-dark">версия не определена</span> : <i>{reportInfo.spec_version}</i>}</Col>
            </Row>
            {((typeof reportInfo.lang !== "undefined") && (reportInfo.lang !== null) && (reportInfo.lang.length !== 0)) ? 
                <Row>
                    <Col md={6} className="text-left"><span className="text-muted">текстовый код языка</span>:</Col>
                    <Col md={6} className="text-center"><i>{reportInfo.lang.toUpperCase()}</i></Col>
                </Row> : ""}
            <Row>
                <Col md={6} className="text-left"><span className="text-muted">уверенность создателя в правильности своих данных от 0 до 100</span>&sup1;:</Col>
                <Col md={6} className="text-center"><i>{reportInfo.confidence}</i></Col>
            </Row>
            {((typeof reportInfo.created_by_ref !== "undefined") && (reportInfo.created_by_ref !== null) && (reportInfo.created_by_ref.length !== 0)) ? 
                <Row>
                    <Col md={6} className="text-left"><span className="text-muted">идентификатор источника создавшего доклад</span>:</Col>
                    <Col md={6} className="text-center"><i>{reportInfo.created_by_ref}</i></Col>
                </Row> : ""}
            {((typeof reportInfo.labels !== "undefined") && (reportInfo.labels !== null) && (reportInfo.labels.length !== 0)) ? 
                <Row className="pt-1 pb-1">
                    <Col md={6} className="text-left"><span className="text-muted">набор терминов, используемых для описания данного объекта</span>:</Col>
                    <Col md={6} className="text-center">{reportInfo.labels.map((item, key) => {
                        return <span key={`span_labels_${key}`}><Chip variant="outlined" size="small" label={item} key={`labels_${key}`}/>&nbsp;</span>;
                    })}</Col>
                </Row> : ""}
            <Row>
                <Col md={6} className="text-left"><span className="text-muted">определены ли данные содержащиеся в объекте</span>:</Col>
                <Col md={6} className="text-center">{(reportInfo.defanged) ? <span className="text-success"><i>ДА</i></span> : <span className="text-danger"><i>НЕТ</i></span>}</Col>
            </Row>
            {/** 
             * в getExternalReferences переформатировать в какие нибудь карточки красивые
             * !!! после УБРАТЬ тестовые данные !!!
            */}
            {getExternalReferences()}
            {((typeof reportInfo.object_marking_refs !== "undefined") && (reportInfo.object_marking_refs !== null) && (reportInfo.object_marking_refs.length !== 0)) ? 
                <Row>
                    <Col md={6} className="text-left"><span className="text-muted">ссылки на дополнительные метки</span>:</Col>
                    <Col md={6} className="text-center">{reportInfo.object_marking_refs.map((item, key) => {
                        return <li key={`marking_ref_${key}`}>{item}</li>;
                    })}</Col>
                </Row> : ""}
            {/** 
             * в getGranularMarkings переформатировать в какие нибудь карточки красивые
             * !!! после УБРАТЬ тестовые данные !!!
            */}
            {getGranularMarkings()}
            {/** 
             * не забыть сделать Extensions 
             * СДЕЛАТЬ АККОРДИОН
            */}

        </React.Fragment>);
    }
}

/**
// Y +SpecVersion - версия спецификации STIX используемая для представления текущего объекта (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Y Created - время создания объекта, в формате "2016-05-12T08:17:27.000Z" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Y Modified - время модификации объекта, в формате "2016-05-12T08:17:27.000Z" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Y +CreatedByRef - содержит идентификатор источника создавшего данный объект
// Revoked - вернуть к текущему состоянию
// Y +Labels [] - определяет набор терминов, используемых для описания данного объекта
// Y +Сonfidence - определяет уверенность создателя в правильности своих данных. Доверительное значение ДОЛЖНО быть числом
//  в диапазоне 0-100. Если 0 - значение не определено.
// Y +Lang - содержит текстовый код языка, на котором написан контент объекта. Для английского это "en" для русского "ru"
// Y +ExternalReferences []{
	SourceName  string         `json:"source_name" bson:"source_name" required:"true"`
	Description string         `json:"description" bson:"description"`
	URL         string         `json:"url" bson:"url"`
	Hashes      HashesTypeSTIX map[string]string `json:"hashes" bson:"hashes"`
	ExternalID  string         `json:"external_id" bson:"external_id"`
} - список внешних ссылок не относящихся к STIX информации
// Y +ObjectMarkingRefs []string - определяет список ID ссылающиеся на объект "marking-definition", по терминалогии STIX, в котором содержатся значения применяющиеся к этому объекту
// +GranularMarkings []{
	Lang       string             `json:"lang" bson:"lang"`
	MarkingRef STRING IdentifierTypeSTIX  `json:"marking_ref" bson:"marking_ref"`
	Selectors  []string           `json:"selectors" bson:"selectors"`
} - определяет список "гранулярных меток" (granular_markings) относящихся к этому объекту
// Y +Defanged - определяет были ли определены данные содержащиеся в объекте
// +Extensions map[string]string - может содержать дополнительную информацию, относящуюся к объекту
 */

ShowCommonPropertiesDomainObjectSTIX.propTypes = {
    commonData: PropTypes.object.isRequired,
}; 

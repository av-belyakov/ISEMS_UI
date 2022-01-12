import React from "react";
import { Col, Row } from "react-bootstrap";
//import {  } from "@material-ui/core";
import PropTypes from "prop-types";

/**
this.state = {
            showSpinner: true,
            showModalWindowAddReport: false,
            showModalWindowInformationReport: false,
            showReportId: "",
            addNewReport: false,
            requestDetails: {
                paginateParameters: {
                    maxPartSize: 30,
                    currentPartNumber: 1,
                },
                sortableField: "data_created",
                //
                // между параметрами "id_documents", "type_documents", "created", "modified", "created_by_ref", "specific_search_fields" и 
                // "outside_specification_search_fields" используется логика "И"
                //
                 searchParameters: {            
                    documentsId: [],
                    documentsType: ["report"],
                    //  
                    // если заполнены оба поля 'created' и 'modified' то тогда для поиска по данным из обоих полей работает логика "ИЛИ"
                    // значение "0001-01-01T00:00:00.000+00:00" для полей с датами эквивалентно значению пустого поля
                    //
                    created: {
                        start: "0001-01-01T00:00:00.000+00:00",
                        end: "0001-01-01T00:00:00.000+00:00",
                    },
                    modified: {
                        start: "0001-01-01T00:00:00.000+00:00",
                        end: "0001-01-01T00:00:00.000+00:00",
                    }, 
                    createdByRef: "",
                    // 
                    // specific_search_fields содержит специфичные поля объектов STIX (если для поиска используются НЕСКОЛЬКО таких объектов 
                    // то срабатывает логика "ИЛИ").
                    // Если в объекте заполнены несколько полей то между ними работает логика "И", со всеми полями кроме полей даты.
                    // Для поля "Value" выполняется проверка на соответствия одному из следующих типов значений: "domain-name", "email-addr", "ipv4-addr", 
                    // "ipv6-addr" или "url" 
                    //
                    specificSearchFields: [
                        {
                            name: "",
                            aliases: "",
                            // интервал времени когда информация была обнаружена впервые 
                            firstSeen: {
                                start: "0001-01-01T00:00:00.000+00:00",
                                end: "0001-01-01T00:00:00.000+00:00",
                            },
                            // интервал времени когда информация была обнаружена в последний раз 
                            lastSeen: {
                                start: "0001-01-01T00:00:00.000+00:00",
                                end: "0001-01-01T00:00:00.000+00:00",
                            },
                            // равно или больше чем заданное пользователем время, когда отчет был опубликован 
                            published: "0001-01-01T00:00:00.000+00:00",
                            roles: [],
                            country: "",
                            city: "",
                            numberAutonomousSystem: 0,
                            //
                            // может содержать какое либо из следующих типов значений: "domain-name", "email-addr", "ipv4-addr", 
                            // "ipv6-addr" или "url". Или все эти значения в перемешку. Между значениями в поле 'Value' используется
                            // логика "ИЛИ".
                            //
                            value: [],
                        }
                    ],
                    // 
                    // содержит поля не входящие в основную спецификацию STIX 2.0 и расширяющие набор некоторых свойств 
                    // объектов STIX. Логика между ними это "ИЛИ", пустое содержимое полей не учитывается 
                    //
                    outsideSpecificationSearchFields: {
                        decisionsMadeComputerThreat: "", // принятые решения по компьютерной угрозе
                        computerThreatType: "", // тип компьютерной угрозы
                    },
                },
            },
        };
 */

export default class CreateSearchElementReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {};

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("", (data) => {
            console.log(data);
        });
    }

    requestEmitter(){
        this.props.socketIo.emit("", { arguments: {}});
    }

    /**
 * Может быть сделать елементы поиска в виде выбора из списка типов requestDetails, 
 * особенно из specificSearchFields.
 * При выборе одного из элемента списка, появляется поле вывода или используется одно и тоже поле вывода (кроме поска по дате и времени).
 * Когда выполняется добавление фильтра, например после ввода параметров поиска нужно нажать кнопку 'добавить фильтр' или клавишу энтер на клавиатуре.
 * Чуть ниже будет перечисление параметров фильтров в виде, подобном тому, что перечисляет группы которым доступен для просмотра объект Доклад
 */

    render(){
        return (
            <React.Fragment>
                <hr/>
                <Row><Col md={12} className="pt-4 text-center"><h3>Область основного набора элементов поиска страницы Report</h3></Col></Row>
                <Row><Col md={12} className="text-center">{(this.props.userPermissions.privileged_group.status)? 
                    <span className="text-success">привилегированная группа</span>: 
                    <span className="text-danger">непривилегированная группа</span>}</Col></Row>
            </React.Fragment>
        );
    }
}

CreateSearchElementReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
};
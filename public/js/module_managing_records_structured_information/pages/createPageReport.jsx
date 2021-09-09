import React from "react";
import { Col, Row } from "react-bootstrap";
//import { Button } from "@material-ui/core";
//import lodash from "lodash";
import PropTypes from "prop-types";

import CreateMainTableReport from "../tables/createMainTableForReport.jsx";
import CreateWidgetsPageReport from "../widgets/createWidgetsPageReport.jsx";
import CreateSearchElementReport from "../any_elements/createSearchElementForReport.jsx";
import ModalWindowAddReportSTIX from "../../modal_windows/modalWindowAddReportSTIX.jsx";
import ModalWindowShowInformationReportSTIX from "../../modal_windows/modalWindowShowInformationReportSTIX.jsx";

import { CreateButtonNewReport } from "../buttons/createButtonNewReport.jsx";

export default class CreatePageReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showSpinner: true,
            showModalWindowAddReport: false,
            showModalWindowInformationReport: false,
            showReportId: "",
            requestDetails: {
                paginateParameters: {
                    maxPartSize: 30,
                    currentPartNumber: 1,
                },
                sortableField: "data_created",
                /**
                 * между параметрами "id_documents", "type_documents", "created", "modified", "created_by_ref", "specific_search_fields" и 
                 * "outside_specification_search_fields" используется логика "И"
                 */
                searchParameters: {            
                    documentsId: [],
                    documentsType: ["report"],
                    /**  
                     * если заполнены оба поля 'created' и 'modified' то тогда для поиска по данным из обоих полей работает логика "ИЛИ"
                     * значение "0001-01-01T00:00:00.000+00:00" для полей с датами эквивалентно значению пустого поля
                     */
                    created: {
                        start: "0001-01-01T00:00:00.000+00:00",
                        end: "0001-01-01T00:00:00.000+00:00",
                    },
                    modified: {
                        start: "0001-01-01T00:00:00.000+00:00",
                        end: "0001-01-01T00:00:00.000+00:00",
                    }, 
                    createdByRef: "",
                    /** 
                     * specific_search_fields содержит специфичные поля объектов STIX (если для поиска используются НЕСКОЛЬКО таких объектов 
                     * то срабатывает логика "ИЛИ").
                     * Если в объекте заполнены несколько полей то между ними работает логика "И", со всеми полями кроме полей даты.
                     * Для поля "Value" выполняется проверка на соответствия одному из следующих типов значений: "domain-name", "email-addr", "ipv4-addr", 
                     * "ipv6-addr" или "url" 
                     */
                    specificSearchFields: [
                        {
                            name: "",
                            aliases: "",
                            /* интервал времени когда информация была обнаружена впервые */
                            firstSeen: {
                                start: "0001-01-01T00:00:00.000+00:00",
                                end: "0001-01-01T00:00:00.000+00:00",
                            },
                            /* интервал времени когда информация была обнаружена в последний раз */
                            lastSeen: {
                                start: "0001-01-01T00:00:00.000+00:00",
                                end: "0001-01-01T00:00:00.000+00:00",
                            },
                            /* равно или больше чем заданное пользователем время, когда отчет был опубликован */
                            published: "0001-01-01T00:00:00.000+00:00",
                            roles: [],
                            country: "",
                            city: "",
                            numberAutonomousSystem: 0,
                            /**
                             * может содержать какое либо из следующих типов значений: "domain-name", "email-addr", "ipv4-addr", 
                             * "ipv6-addr" или "url". Или все эти значения в перемешку. Между значениями в поле 'Value' используется
                             * логика "ИЛИ".
                             */
                            value: [],
                        }
                    ],
                    /** 
                     * содержит поля не входящие в основную спецификацию STIX 2.0 и расширяющие набор некоторых свойств 
                     * объектов STIX. Логика между ними это "ИЛИ", пустое содержимое полей не учитывается 
                     */
                    outsideSpecificationSearchFields: {
                        decisionsMadeComputerThreat: "", // принятые решения по компьютерной угрозе
                        computerThreatType: "", // тип компьютерной угрозы
                    },
                },
            },
        };

        console.log("------ данные с сервера полученные при загрузки страницы ------");
        console.log(this.props.receivedData);
        console.log("---------------------------------------------------------------");

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);

        this.handlerRequestNextPageOfTable = this.handlerRequestNextPageOfTable.bind(this);
        this.handlerShowModalWindowAddReport = this.handlerShowModalWindowAddReport.bind(this);
        this.handlerCloseModalWindowAddReport = this.handlerCloseModalWindowAddReport.bind(this);
        this.handlerShowModalWindowInformationReport = this.handlerShowModalWindowInformationReport.bind(this);
        this.handlerCloseModalWindowInformationReport = this.handlerCloseModalWindowInformationReport.bind(this);
    }

    handlerEvents(){}

    requestEmitter(){
        //запрос краткой информации (количество) по заданным параметрам
        this.props.socketIo.emit("isems-mrsi ui request: send search request, cound found elem, table page report", { arguments: this.state.requestDetails });

        //запрос полной информации по заданным параметрам
        this.props.socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: this.state.requestDetails });
    }

    handlerShowModalWindowAddReport(){
        this.setState({ showModalWindowAddReport: true });
    }

    handlerCloseModalWindowAddReport(){
        this.setState({ showModalWindowAddReport: false });
    }

    handlerShowModalWindowInformationReport(elemId){
        //запрос информации об STIX объекте типа 'report' (доклад) по его ID
        this.props.socketIo.emit("isems-mrsi ui request: send search request, get report for id", { arguments: elemId });
        this.props.socketIo.emit("isems-mrsi ui request: get a list of groups to which the report is available", { arguments: elemId });

        this.setState({ 
            showReportId: elemId,
            showModalWindowInformationReport: true, 
        });
    }

    handlerCloseModalWindowInformationReport(){
        this.setState({ showModalWindowInformationReport: false });
    }

    handlerRequestNextPageOfTable(numPagination){
        let requestDetailsTmp = _.cloneDeep(this.state.requestDetails);
        requestDetailsTmp.paginateParameters.currentPartNumber = numPagination;

        this.setState({ requestDetails: requestDetailsTmp });

        //запрос полной информации по заданным параметрам
        this.props.socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: requestDetailsTmp });
    }

    isDisabledNewReport(){
        return !this.props.receivedData.userPermissions.create.status;
    }

    render(){
        return (
            <React.Fragment>
                <CreateWidgetsPageReport socketIo={this.props.socketIo}/>

                <Row>
                    <Col md={12} className="text-right pt-2">
                        <CreateButtonNewReport 
                            buttonIsDisabled={this.isDisabledNewReport.call(this)}
                            handlerShowModalWindow={this.handlerShowModalWindowAddReport}/>
                    </Col>
                </Row>

                {/** элементы поиска информации */}
                <CreateSearchElementReport socketIo={this.props.socketIo} userPermissions={this.props.receivedData.userPermissions}/>

                {/** основная таблица страницы */}
                <CreateMainTableReport 
                    socketIo={this.props.socketIo} 
                    handlerRequestNextPageOfTable={this.handlerRequestNextPageOfTable}
                    handlerShowModalWindowInformationReport={this.handlerShowModalWindowInformationReport} />

                <ModalWindowAddReportSTIX
                    show={this.state.showModalWindowAddReport}
                    onHide={this.handlerCloseModalWindowAddReport}
                    socketIo={this.props.socketIo} />

                <ModalWindowShowInformationReportSTIX 
                    show={this.state.showModalWindowInformationReport}
                    onHide={this.handlerCloseModalWindowInformationReport}
                    showReportId={this.state.showReportId}
                    groupList={this.props.receivedData.groupList}
                    userPermissions={this.props.receivedData.userPermissions}
                    socketIo={this.props.socketIo} />
            </React.Fragment>
        );
    }
}

CreatePageReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};

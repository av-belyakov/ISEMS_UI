import React from "react";
import PropTypes from "prop-types";

import CreateWidgetsPageReport from "../widgets/createWidgetsPageReport.jsx";
import CreateSearchAreaOutputReports from "../any_elements/createSearchAreaOutputReports.jsx";
import ModalWindowAddReportSTIX from "../../modal_windows/modalWindowAddReportSTIX.jsx";
import ModalWindowShowInformationReport from "../../modal_windows/modalWindowShowInformationReport.jsx";
import ModalWindowShowInformationReportSTIX from "../../modal_windows/modalWindowShowInformationReportSTIX.jsx";

export default function CreatePageReport(props) {
    let { socketIo, receivedData } = props;

    console.log("class 'CreatePageReport', START...");

    let [ addedNewReport, setAddedNewReport ] = React.useState(false);
    let [ objectId, setObjectId ] = React.useState("");
    let [ showModalWindowAddNewReport, setShowModalWindowAddNewReport ] = React.useState(false);
    let [ showModalWindowInformationReport, setShowModalWindowInformationReport ] = React.useState(false);

    let handlerShowModalWindowAddNewReport = () => {
            setShowModalWindowAddNewReport(true);
        },
        handlerCloseModalWindowAddReport = () => {
            setShowModalWindowAddNewReport(false);
        },
        handlerShowModalWindowInformationReport = (elemId) => {
            setObjectId(elemId);
            setShowModalWindowInformationReport(true);
        },
        handlerCloseModalWindowInformationReport = () => {
            setObjectId("");
            setShowModalWindowInformationReport(false);
        },
        handlerChangeAddedNewReport = () => {
            setAddedNewReport((prevStatus) => {
                return !prevStatus;
            });
        },
        handlerButtonSaveModalWindowAddReportSTIX = (obj) => {
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [obj] });

            setAddedNewReport(true);
        };

    return (<React.Fragment>
        <CreateWidgetsPageReport socketIo={socketIo}/>

        {/** элементы поиска информации */}
        {/*<CreateSearchElementReport 
            socketIo={socketIo} 
            userPermissions={receivedData.userPermissions}
            handlerSendSearchRequest={handlerSendSearchRequest}
            listTypesComputerThreat={listTypesComputerThreat}
        listTypesDecisionsMadeComputerThreat={listTypesDecisionsMadeComputerThreat} />*/}

        {/** область поиска и вывода информации по Отчётам */}
        <CreateSearchAreaOutputReports 
            socketIo={socketIo} 
            userPermissions={receivedData.userPermissions}
            addNewReport={addedNewReport}
            handlerChangeAddedNewReport={handlerChangeAddedNewReport}
            handlerShowModalWindowAddNewReport={handlerShowModalWindowAddNewReport}
            handlerShowModalWindowInformationReport={handlerShowModalWindowInformationReport}
        />

        {/** основная таблица страницы */}
        {/*<CreateMainTableReport 
            socketIo={socketIo}
            addNewReport={addedNewReport}
            paginateParameters={paginateParameters}
            changeValueAddNewReport={changeValueAddNewReport}
            buttonAddNewReportIsDisabled={!receivedData.userPermissions.create.status}
            handlerRequestNextPageOfTable={handlerRequestNextPageOfTable}
            handlerShowModalWindowAddNewReport={handlerShowModalWindowAddReport}
        handlerShowModalWindowInformationReport={handlerShowModalWindowInformationReport} />*/}

        <ModalWindowAddReportSTIX
            show={showModalWindowAddNewReport}
            onHide={handlerCloseModalWindowAddReport}
            socketIo={socketIo}
            userPermissions={receivedData.userPermissions}
            //changeValueAddNewReport={changeValueAddNewReport}
            handlerButtonSave={handlerButtonSaveModalWindowAddReportSTIX} />

        <ModalWindowShowInformationReport
            show={showModalWindowInformationReport}
            onHide={handlerCloseModalWindowInformationReport}
            showReportId={objectId}
            groupList={receivedData.groupList}
            userPermissions={receivedData.userPermissions}
            socketIo={socketIo} />

        {/*<ModalWindowShowInformationReportSTIX 
                show={this.state.showModalWindowInformationReport}
                onHide={this.handlerCloseModalWindowInformationReport}
                showReportId={this.state.showReportId}
                groupList={this.props.receivedData.groupList}
                userPermissions={this.props.receivedData.userPermissions}
                listTypesComputerThreat={this.props.listTypesComputerThreat}
                listTypesDecisionsMadeComputerThreat={this.props.listTypesDecisionsMadeComputerThreat}
            socketIo={this.props.socketIo} />*/}
    </React.Fragment>);
}

CreatePageReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};



/*export default class CreatePageReport extends React.Component {
    constructor(props){
        super(props);

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
                            aliases: [],
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
                            published: "1970-01-01T00:00:00.000+00:00",
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

        console.log("class 'CreatePageReport', START...");
        
        this.handlerEvents.call(this);
        this.requestEmitter.call(this);

        this.changeValueAddNewReport = this.changeValueAddNewReport.bind(this);
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
        //запрос информации об STIX объекте типа 'report' (Отчёт) по его ID
        this.props.socketIo.emit("isems-mrsi ui request: send search request, get report for id", { arguments: elemId });
        this.props.socketIo.emit("isems-mrsi ui request: get a list of groups to which the report is available", { arguments: elemId });

        this.setState({ 
            showReportId: elemId,
            showModalWindowInformationReport: true, 
        });

        if(elemId === ""){
            return;
        }
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

    handlerButtonSaveModalWindowAddReportSTIX(obj){
        this.props.socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [obj] });

        setTimeout(() => {
        //запрос краткой информации (количество) по заданным параметрам
            this.props.socketIo.emit("isems-mrsi ui request: send search request, cound found elem, table page report", { arguments: this.state.requestDetails });

            //запрос полной информации по заданным параметрам
            this.props.socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: this.state.requestDetails });
        
            console.log("запрос полной информации по заданным параметрам...");
        }, 1500);
    }

    handlerSendSearchRequest(searchParameters){
        let searchReguest = {
            paginateParameters: {
                maxPartSize: 30,
                currentPartNumber: 1,
            },
            sortableField: "data_created",
            searchParameters: searchParameters,
        };

        //запрос краткой информации (количество) по заданным параметрам
        this.props.socketIo.emit("isems-mrsi ui request: send search request, cound found elem, table page report", { arguments: searchReguest });

        //запрос полной информации по заданным параметрам
        this.props.socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: searchReguest });

        this.setState({ requestDetails: searchReguest });
    }

    isDisabledNewReport(){
        return !this.props.receivedData.userPermissions.create.status;
    }

    changeValueAddNewReport(value){
        this.setState({ addNewReport: value });
    }

    render(){
        return (<React.Fragment>
            <CreateWidgetsPageReport socketIo={this.props.socketIo}/>

            <CreateSearchElementReport 
                socketIo={this.props.socketIo} 
                userPermissions={this.props.receivedData.userPermissions}
                handlerSendSearchRequest={this.handlerSendSearchRequest.bind(this)}
                listTypesComputerThreat={this.props.listTypesComputerThreat}
                listTypesDecisionsMadeComputerThreat={this.props.listTypesDecisionsMadeComputerThreat} />

            <CreateMainTableReport 
                socketIo={this.props.socketIo}
                addNewReport={this.state.addNewReport}
                paginateParameters={this.state.requestDetails.paginateParameters}
                changeValueAddNewReport={this.changeValueAddNewReport}
                buttonAddNewReportIsDisabled={this.isDisabledNewReport.call(this)}
                handlerRequestNextPageOfTable={this.handlerRequestNextPageOfTable}
                handlerShowModalWindowAddNewReport={this.handlerShowModalWindowAddReport}
                handlerShowModalWindowInformationReport={this.handlerShowModalWindowInformationReport} />

            <ModalWindowAddReportSTIX
                show={this.state.showModalWindowAddReport}
                onHide={this.handlerCloseModalWindowAddReport}
                changeValueAddNewReport={this.changeValueAddNewReport}
                listTypesComputerThreat={this.props.listTypesComputerThreat}
                listTypesDecisionsMadeComputerThreat={this.props.listTypesDecisionsMadeComputerThreat}
                userPermissions={this.props.receivedData.userPermissions}
                handlerButtonSave={this.handlerButtonSaveModalWindowAddReportSTIX.bind(this)}
                socketIo={this.props.socketIo} />

            <ModalWindowShowInformationReport
                show={this.state.showModalWindowInformationReport}
                onHide={this.handlerCloseModalWindowInformationReport}
                showReportId={this.state.showReportId}
                groupList={this.props.receivedData.groupList}
                userPermissions={this.props.receivedData.userPermissions}
                listTypesComputerThreat={this.props.listTypesComputerThreat}
                listTypesDecisionsMadeComputerThreat={this.props.listTypesDecisionsMadeComputerThreat}
                socketIo={this.props.socketIo} />

            {/*<ModalWindowShowInformationReportSTIX 
                show={this.state.showModalWindowInformationReport}
                onHide={this.handlerCloseModalWindowInformationReport}
                showReportId={this.state.showReportId}
                groupList={this.props.receivedData.groupList}
                userPermissions={this.props.receivedData.userPermissions}
                listTypesComputerThreat={this.props.listTypesComputerThreat}
                listTypesDecisionsMadeComputerThreat={this.props.listTypesDecisionsMadeComputerThreat}
            socketIo={this.props.socketIo} />*//*}
        </React.Fragment>);
    }
}*/
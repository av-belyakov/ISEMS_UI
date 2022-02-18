import React from "react";
import PropTypes from "prop-types";

import patternSearchParameters from "../patterns/patternSearchParameters.js";
import CreateMainTableForReport from "../tables/createMainTableForReport.jsx";
import CreateSearchElementReport from "./createSearchElementReport.jsx";

export default function CreateSearchAreaOutputReports(props){
    let {
        socketIo,
        userPermissions,
        addNewReport,
        //            paginateParameters={paginateParameters}
        handlerChangeAddedNewReport,
        //            buttonAddNewReportIsDisabled={!receivedData.userPermissions.create.status}
        handlerShowModalWindowAddNewReport,
        handlerShowModalWindowInformationReport,
    } = props;

    let [ searchPattern, setSearchPattern ] = React.useState(patternSearchParameters);
    let [ paginateParameters, setPaginateParameters ] = React.useState({
        maxPartSize: 30,
        currentPartNumber: 1,
    });

    console.log("func 'CreateSearchAreaOutputReports' MOUNT --- (SearchAreaOutputReports) ---");

    //для пагинатора таблицы
    let handlerRequestNextPageOfTable = (numPagination) => {
            setPaginateParameters((prevState) => {
                prevState.currentPartNumber = numPagination;
            });

            socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: {
                paginateParameters: {
                    maxPartSize: 30,
                    currentPartNumber: numPagination,
                },
                sortableField: "data_created",
                searchParameters: searchPattern,
            }});        
        },
        //для поискового запроса
        handlerSendSearchRequest = (searchParameters) => {
            setSearchPattern(searchParameters);

            let searchReguest = {
                paginateParameters: paginateParameters,
                sortableField: "data_created",
                searchParameters: searchParameters,
            };
            //запрос краткой информации (количество) по заданным параметрам
            socketIo.emit("isems-mrsi ui request: send search request, cound found elem, table page report", { arguments: searchReguest });
            //запрос полной информации по заданным параметрам
            socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: searchReguest });
        };

    return (<React.Fragment>
        {/** элементы поиска информации */}
        <CreateSearchElementReport 
            socketIo={socketIo}
            addNewReport={addNewReport} 
            userPermissions={userPermissions}
            handlerSendSearchRequest={handlerSendSearchRequest}
            handlerChangeAddedNewReport={handlerChangeAddedNewReport} />

        {/** основная таблица страницы */}
        <CreateMainTableForReport 
            socketIo={socketIo}
            paginateParameters={paginateParameters}
            //changeValueAddNewReport={changeValueAddNewReport}
            buttonAddNewReportIsDisabled={!userPermissions.create.status}
            handlerRequestNextPageOfTable={handlerRequestNextPageOfTable}
            handlerShowModalWindowAddNewReport={handlerShowModalWindowAddNewReport}
            handlerShowModalWindowInformationReport={handlerShowModalWindowInformationReport} />
    </React.Fragment>);
}

CreateSearchAreaOutputReports.propTypes = {
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
    addNewReport: PropTypes.bool.isRequired,
    handlerChangeAddedNewReport: PropTypes.func.isRequired,
    handlerShowModalWindowAddNewReport: PropTypes.func.isRequired,
    handlerShowModalWindowInformationReport: PropTypes.func.isRequired,
};
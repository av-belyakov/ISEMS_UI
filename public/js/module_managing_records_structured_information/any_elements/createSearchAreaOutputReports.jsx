import React from "react";
import PropTypes from "prop-types";

import patternSearchParameters from "../patterns/patternSearchParameters.js";
import CreateMainTableForReport from "../tables/createMainTableForReport.jsx";
import CreateSearchElementReport from "./createSearchElementReport.jsx";

const paginatePattern = {
    maxPartSize: 30,
    currentPartNumber: 1,
};

export default function CreateSearchAreaOutputReports(props){
    let {
        socketIo,
        userPermissions,
        addNewReport,
        handlerChangeAddedNewReport,
        handlerShowModalWindowAddNewReport,
        handlerShowModalWindowInformationReport,
    } = props;

    let [ searchPattern, setSearchPattern ] = React.useState(patternSearchParameters);
    let [ sendNewSearch, setSendNewSearch ] = React.useState(false);

    console.log("func 'CreateSearchAreaOutputReports' MOUNT --- (SearchAreaOutputReports) ---");

    //для поискового запроса
    let handlerSendSearchRequest = (searchParameters) => {
        setSearchPattern(searchParameters);

        let searchReguest = {
            paginateParameters: paginatePattern,
            sortableField: "data_created",
            searchParameters: searchParameters,
        };

        //запрос краткой информации (количество) по заданным параметрам
        socketIo.emit("isems-mrsi ui request: send search request, cound found elem, table page report", { arguments: searchReguest });
        //запрос полной информации по заданным параметрам
        socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: searchReguest });
    };
    let handlerChangeSendNewSearch = () => {
        setSendNewSearch((prevSend) => !prevSend);
    };

    return (<React.Fragment>
        {/** элементы поиска информации */}
        <CreateSearchElementReport 
            socketIo={socketIo}
            addNewReport={addNewReport} 
            userPermissions={userPermissions}
            handlerSendSearchRequest={handlerSendSearchRequest}
            handlerChangeSendNewSearch={handlerChangeSendNewSearch}
            handlerChangeAddedNewReport={handlerChangeAddedNewReport} 
        />

        {/** основная таблица страницы */}
        <CreateMainTableForReport 
            socketIo={socketIo}
            sendNewSearch={sendNewSearch}
            searchPattern={searchPattern}
            buttonAddNewReportIsDisabled={!userPermissions.create.status}
            handlerChangeSendNewSearch={handlerChangeSendNewSearch}
            handlerShowModalWindowAddNewReport={handlerShowModalWindowAddNewReport}
            handlerShowModalWindowInformationReport={handlerShowModalWindowInformationReport} 
        />
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

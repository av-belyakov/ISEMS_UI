import React from "react";
import PropTypes from "prop-types";

import CreateMainTableReport from "../tables/createMainTableForReport.jsx";
import CreateSearchElementReport from "./createSearchElementReport";

export default function CreateSearchAreaOutputReports(props){
    let {
        socketIo,
        userPermissions,
        receivedData,
        listTypesComputerThreat,
        listTypesDecisionsMadeComputerThreat,
        addNewReport,
        //            paginateParameters={paginateParameters}
        changeValueAddNewReport,
        //            buttonAddNewReportIsDisabled={!receivedData.userPermissions.create.status}
        handlerSendSearchRequest,
        handlerRequestNextPageOfTable,
        handlerShowModalWindowAddNewReport,
        handlerShowModalWindowInformationReport,
    } = props;

    /**
 *          !!!!!!
 * Надо перенести CreateSearchElementReport и CreateMainTableReport
 * а как же все обработчики и use State
 *          !!!!!!
 */

    return (<React.Fragment>
        {/** элементы поиска информации */}
        <CreateSearchElementReport 
            socketIo={socketIo} 
            userPermissions={receivedData.userPermissions}
            handlerSendSearchRequest={handlerSendSearchRequest}
            listTypesComputerThreat={listTypesComputerThreat}
            listTypesDecisionsMadeComputerThreat={listTypesDecisionsMadeComputerThreat} />

        {/** основная таблица страницы */}
        <CreateMainTableReport 
            socketIo={socketIo}
            addNewReport={addedNewReport}
            paginateParameters={paginateParameters}
            changeValueAddNewReport={changeValueAddNewReport}
            buttonAddNewReportIsDisabled={!receivedData.userPermissions.create.status}
            handlerRequestNextPageOfTable={handlerRequestNextPageOfTable}
            handlerShowModalWindowAddNewReport={handlerShowModalWindowAddReport}
            handlerShowModalWindowInformationReport={handlerShowModalWindowInformationReport} />
    </React.Fragment>);
}

CreateSearchAreaOutputReports.propTypes = {
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
    listTypesComputerThreat: PropTypes.object.isRequired,
    listTypesDecisionsMadeComputerThreat: PropTypes.object.isRequired,
    addNewReport: PropTypes.bool.isRequired,
    //            paginateParameters={paginateParameters}
    changeValueAddNewReport: PropTypes.func.isRequired,
    //            buttonAddNewReportIsDisabled={!receivedData.userPermissions.create.status}
    handlerSendSearchRequest: PropTypes.func.isRequired,
    handlerRequestNextPageOfTable: PropTypes.func.isRequired,
    handlerShowModalWindowAddNewReport: PropTypes.func.isRequired,
    handlerShowModalWindowInformationReport: PropTypes.func.isRequired,
};
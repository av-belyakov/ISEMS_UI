import React from "react";
import PropTypes from "prop-types";

import CreateWidgetsPageReport from "../widgets/createWidgetsPageReport.jsx";
import CreateSearchAreaOutputReports from "../any_elements/createSearchAreaOutputReports.jsx";
import ModalWindowAddReportSTIX from "../../modal_windows/modalWindowAddReportSTIX.jsx";
import ModalWindowShowInformationReport from "../../modal_windows/modalWindowShowInformationReport.jsx";
import ModalWindowAnySTIXObject from "../../modal_windows/modalWindowAnySTIXObject.jsx";

export default function CreatePageReport(props) {
    let { socketIo, receivedData } = props;

    console.log("class 'CreatePageReport', START...");

    let [ addedNewReport, setAddedNewReport ] = React.useState(false);
    let [ objectId, setObjectId ] = React.useState("");
    let [ currentAdditionalIdSTIXObject, setCurrentAdditionalIdSTIXObject ] = React.useState("");
    let [ showModalWindowSTIXObject, setShowModalWindowSTIXObject ] = React.useState(false);
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
            console.log("func 'handlerChangeAddedNewReport' &&&&&&&&&&&&&");

            setAddedNewReport((prevStatus) => !prevStatus);
        },
        handlerShowObjectRefSTIXObject = (objectId) => {
            console.log("func 'handlerShowObjectRefSTIXObject', object ID = ", objectId);

            setCurrentAdditionalIdSTIXObject(objectId);
            setShowModalWindowSTIXObject(true);
        },
        handlerButtonSaveModalWindowReportSTIX = (obj) => {
           
            console.log("func 'handlerButtonSaveModalWindowAddReportSTIX', START --------");
            console.log("this will be send to backend --->", obj);
            
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [obj] });

            setAddedNewReport(true);
            handlerCloseModalWindowInformationReport();
        },
        handelrDialogCloseModalWindowSTIXObject = (obj) => {
            console.log("func 'handelrDialogCloseModalWindowSTIXObject', obj = ", obj);
            console.log("------------------------------------------------------");

            setCurrentAdditionalIdSTIXObject("");
            setShowModalWindowSTIXObject(false);
        };

    return (<React.Fragment>
        <CreateWidgetsPageReport socketIo={socketIo}/>

        {/** область поиска и вывода информации по Отчётам */}
        <CreateSearchAreaOutputReports 
            socketIo={socketIo} 
            userPermissions={receivedData.userPermissions}
            addNewReport={addedNewReport}
            handlerChangeAddedNewReport={handlerChangeAddedNewReport}
            handlerShowModalWindowAddNewReport={handlerShowModalWindowAddNewReport}
            handlerShowModalWindowInformationReport={handlerShowModalWindowInformationReport}
        />

        {showModalWindowAddNewReport && <ModalWindowAddReportSTIX
            show={showModalWindowAddNewReport}
            onHide={handlerCloseModalWindowAddReport}
            socketIo={socketIo}
            userPermissions={receivedData.userPermissions}
            handlerButtonSave={handlerButtonSaveModalWindowReportSTIX} 
            handlerShowObjectRefSTIXObject={handlerShowObjectRefSTIXObject}
        />}

        {showModalWindowInformationReport && <ModalWindowShowInformationReport
            show={showModalWindowInformationReport}
            onHide={handlerCloseModalWindowInformationReport}
            showReportId={objectId}
            groupList={receivedData.groupList}
            userPermissions={receivedData.userPermissions}
            socketIo={socketIo}
            handlerButtonSave={handlerButtonSaveModalWindowReportSTIX} 
            handlerShowObjectRefSTIXObject={handlerShowObjectRefSTIXObject}
        />}

        {showModalWindowSTIXObject && <ModalWindowAnySTIXObject
            socketIo={socketIo}
            showModalWindow={showModalWindowSTIXObject}
            parentIdSTIXObject={objectId}
            currentAdditionalIdSTIXObject={currentAdditionalIdSTIXObject}
            handelrDialogClose={handelrDialogCloseModalWindowSTIXObject}
            isNotDisabled={receivedData.userPermissions.editing_information.status} 
        />}
    </React.Fragment>);
}

CreatePageReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};

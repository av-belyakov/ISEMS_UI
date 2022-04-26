import React, { Suspense } from "react";
import { 
    Dialog,
    DialogTitle,
    IconButton,
    Grid,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";

import CreateWidgetsPageReport from "../widgets/createWidgetsPageReport.jsx";
import ContentCreateNewSTIXObject from "../../module_managing_records_structured_information/any_elements/dialog_contents/contentCreateNewSTIXObject.jsx";
import CreateSearchAreaOutputReports from "../any_elements/createSearchAreaOutputReports.jsx";
import ModalWindowAddReportSTIX from "../../modal_windows/modalWindowAddReportSTIX.jsx";
import ModalWindowAnySTIXObject from "../../modal_windows/modalWindowAnySTIXObject.jsx";
import ModalWindowShowInformationReport from "../../modal_windows/modalWindowShowInformationReport.jsx";
import ModalWindowConfirmDeleteLinkFromObjRefs from "../../modal_windows/ModalWindowConfirmDeleteLinkFromObjRefs.jsx";

export default function CreatePageReport(props) {
    let { socketIo, receivedData } = props;

    console.log("class 'CreatePageReport', START...");

    let [ addedNewReport, setAddedNewReport ] = React.useState(false);
    let [ objectId, setObjectId ] = React.useState("");
    let [ currentAdditionalIdSTIXObject, setCurrentAdditionalIdSTIXObject ] = React.useState("");
    let [ objectsIdModalWindowConfirmDeleteLinkFromObjRefs, setObjectsIdModalWindowConfirmDeleteLinkFromObjRefs ] = React.useState([]);
    let [ showModalWindowSTIXObject, setShowModalWindowSTIXObject ] = React.useState(false);
    let [ showModalWindowAddNewReport, setShowModalWindowAddNewReport ] = React.useState(false);
    let [ showModalWindowInformationReport, setShowModalWindowInformationReport ] = React.useState(false);
    let [ showModalWindowCreateNewSTIXObject, setShowModalWindowCreateNewSTIXObject ] = React.useState(false);
    let [ showModalWindowConfirmDeleteLinkFromObjRefs, setShowModalWindowConfirmDeleteLinkFromObjRefs ] = React.useState(false);

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
        handlerDialogCloseModalWindowSTIXObject = (obj) => {
            console.log("func 'handlerDialogCloseModalWindowSTIXObject', obj = ", obj);
            console.log("------------------------------------------------------");

            setCurrentAdditionalIdSTIXObject("");
            setShowModalWindowSTIXObject(false);
        },
        handlerShowModalWindowCreateNewSTIXObject = (elemId) => {
            setObjectId(elemId);
            setShowModalWindowCreateNewSTIXObject(true);
        },
        handlerCloseModalWindowCreateNewSTIXObject = () => {
            setObjectId("");
            setShowModalWindowCreateNewSTIXObject(false);
        },
        handlerDialogSaveNewSTIXObject = () => {
            console.log("func 'handlerDialogSaveNewSTIXObject', START");
            /**
             * после нажатия кнопки Сохранить модального окна в котором создается любой STIX объект, кроме Отчета, происходит
             * добавление ссылки на вновь созданный STIX объект в поле object_ref Отчета. При этом нужно сделать следующее:
             * 1. Создать в отдельном окне ModalWindowCreateNewSTIXObject новый STIX объект или найти уже существующий, подходящий
             *   по каким либо параметрам.
             * 2. Сохранить информацию о нем во временной переменной типа useState
             * 3. Добавить ID созданного или уже существующего STIX объекта в поле object_ref Отчета с которым в данный момент идет работа
             * 4. При нажатии кнопки Сохранить Отчета отправить серверу информацию как о самом Отчете, так и об STIX объекте который
             *   теперь связан с Отчетом
             */
        },
        handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs = (parentId, deleteId) => {
            console.log("func 'handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs', START... DATA: ", parentId, deleteId);

            setShowModalWindowConfirmDeleteLinkFromObjRefs(true);
            setObjectsIdModalWindowConfirmDeleteLinkFromObjRefs([ parentId, deleteId ]);
        },
        handlerDialogCloseModalWindowConfirmDeleteLinkFromObjRefs = () => {
            setShowModalWindowConfirmDeleteLinkFromObjRefs(false);
            setObjectsIdModalWindowConfirmDeleteLinkFromObjRefs([]);
        },
        handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs = (data) => {
            console.log("func 'handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs', START... data = ", data);


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
            handlerShowModalWindowCreateNewSTIXObject={handlerShowModalWindowCreateNewSTIXObject}
        />}

        {showModalWindowInformationReport && <ModalWindowShowInformationReport
            show={showModalWindowInformationReport}
            onHide={handlerCloseModalWindowInformationReport}
            socketIo={socketIo}
            groupList={receivedData.groupList}
            showReportId={objectId}
            userPermissions={receivedData.userPermissions}
            handlerButtonSave={handlerButtonSaveModalWindowReportSTIX} 
            handlerShowObjectRefSTIXObject={handlerShowObjectRefSTIXObject}
            handlerShowModalWindowCreateNewSTIXObject={handlerShowModalWindowCreateNewSTIXObject}
            handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs={handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs}
        />}

        {showModalWindowSTIXObject && <ModalWindowAnySTIXObject
            socketIo={socketIo}
            isNotDisabled={receivedData.userPermissions.editing_information.status} 
            showModalWindow={showModalWindowSTIXObject}
            parentIdSTIXObject={objectId}
            currentAdditionalIdSTIXObject={currentAdditionalIdSTIXObject}
            handlerDialogClose={handlerDialogCloseModalWindowSTIXObject}
        />}

        {/** модальное окно для подтверждения удаления ссылки на STIX объект из свойства obj_refs Отчета */}
        {showModalWindowConfirmDeleteLinkFromObjRefs && <ModalWindowConfirmDeleteLinkFromObjRefs
            objectsId={objectsIdModalWindowConfirmDeleteLinkFromObjRefs}
            showModalWindow={showModalWindowConfirmDeleteLinkFromObjRefs}
            handlerDialogClose={handlerDialogCloseModalWindowConfirmDeleteLinkFromObjRefs}
            handlerDialogConfirm={handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs}
        />}

        {/** показать модальное окно в котором будут создаваться любые виды STIX объектов кроме Отчетов */}
        {showModalWindowCreateNewSTIXObject && <Dialog 
            fullWidth
            maxWidth="xl"
            scroll="paper"
            open={showModalWindowCreateNewSTIXObject}>
            <DialogTitle>
                <Grid item container md={12} justifyContent="flex-end">
                    <IconButton edge="start" color="inherit" onClick={handlerCloseModalWindowCreateNewSTIXObject} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <Suspense fallback={<div style={{ textAlign: "center", marginBottom: 22 }}>Загрузка...</div>}>
                <ContentCreateNewSTIXObject 
                    socketIo={socketIo}
                    isNotDisabled={true}
                    currentIdSTIXObject={objectId} 
                    handlerDialog={handlerDialogSaveNewSTIXObject}
                    handlerDialogClose={handlerCloseModalWindowCreateNewSTIXObject}
                />
            </Suspense>
        </Dialog>}
    </React.Fragment>);
}

CreatePageReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};

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
import ModalWindowConfirmDeleteLinkFromObjRefs from "../../modal_windows/modalWindowConfirmDeleteLinkFromObjRefs.jsx";

export default function CreatePageReport(props) {
    let { socketIo, receivedData } = props;
    let [ addedNewReport, setAddedNewReport ] = React.useState(false);
    let [ buttonDelModalWindowConfirmDeleteLinkFromObjRefs, setButtonDelModalWindowConfirmDeleteLinkFromObjRefs ] = React.useState(false);
    let [ objectId, setObjectId ] = React.useState("");
    let [ parentSTIXObject, setParentSTIXObject ] = React.useState({});
    let [ fieldNameForChange, setFieldNameForChange ] = React.useState([]);
    let [ listRefsForObjectSTIX, setListRefsForObjectSTIX ] = React.useState([]);
    let [ listNewOrModifySTIXObject, setListNewOrModifySTIXObject ] = React.useState([]);
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
            setCurrentAdditionalIdSTIXObject(objectId);
            setShowModalWindowSTIXObject(true);
        },
        handlerButtonSaveModalWindowReportSTIX = (obj) => {            
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [obj] });

            setAddedNewReport(true);
            handlerCloseModalWindowInformationReport();
        },
        handlerDialogCloseModalWindowSTIXObject = (obj) => {
            setCurrentAdditionalIdSTIXObject("");
            setShowModalWindowSTIXObject(false);
        },
        handlerShowModalWindowCreateNewSTIXObject = (elemId, listRefsForObjectSTIX, parentSTIXObject) => {            

            console.log("func '=== HANDLERShowModalWindowCreateNewSTIXObject ===', elemId: ", elemId, ", listRefsForObjectSTIX: ", listRefsForObjectSTIX, ", parentSTIXObject: ", parentSTIXObject);

            setObjectId(elemId);

            if(typeof parentSTIXObject === "undefined"){

                console.log("func '=== HANDLERShowModalWindowCreateNewSTIXObject ===', listNewOrModifySTIXObject:", listNewOrModifySTIXObject);

                for(let item of listNewOrModifySTIXObject){
                    if(elemId === item.id ){
                        setParentSTIXObject(item);

                        break;
                    }
                }

                setParentSTIXObject({});
            } else {
                setParentSTIXObject(parentSTIXObject);
            }

            setListRefsForObjectSTIX(listRefsForObjectSTIX);
            setShowModalWindowCreateNewSTIXObject(true);
        },
        handlerCloseModalWindowCreateNewSTIXObject = () => {
            setObjectId("");
            setShowModalWindowCreateNewSTIXObject(false);
        },
        handlerDialogSaveNewSTIXObject = (fieldName, listSTIXObject) => {

            console.log("func '===== HANDLERDialogSaveNewSTIXObject =====', fieldName: ", fieldName, ", listSTIXObject: ", listSTIXObject);

            setFieldNameForChange(fieldName);
            setListNewOrModifySTIXObject((prevState) => {
                for(let item of listSTIXObject){
                    let index = prevState.findIndex((elem) => elem.id === item.id);
                    if(index === -1){
                        prevState.push(item);

                        continue;
                    }

                    prevState[index] = item;
                }

                return prevState;
            });

            setShowModalWindowCreateNewSTIXObject(false);
        },
        handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs = (parentId, deleteId) => {
            setShowModalWindowConfirmDeleteLinkFromObjRefs(true);
            setObjectsIdModalWindowConfirmDeleteLinkFromObjRefs([ parentId, deleteId ]);
        },
        handlerDialogCloseModalWindowConfirmDeleteLinkFromObjRefs = () => {
            setShowModalWindowConfirmDeleteLinkFromObjRefs(false);
            setObjectsIdModalWindowConfirmDeleteLinkFromObjRefs([]);
            //setButtonDelModalWindowConfirmDeleteLinkFromObjRefs(false);
        },
        handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs = (data) => {
            setButtonDelModalWindowConfirmDeleteLinkFromObjRefs((prevState) => !prevState);
            handlerDialogCloseModalWindowConfirmDeleteLinkFromObjRefs();
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
            parentSTIXObject={parentSTIXObject}
            confirmDeleteLink={buttonDelModalWindowConfirmDeleteLinkFromObjRefs}
            fieldNameForChange={fieldNameForChange}
            listNewOrModifySTIXObject={listNewOrModifySTIXObject}
            handlerButtonSave={handlerButtonSaveModalWindowReportSTIX} 
            handlerDialogConfirm={handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs}
            handlerShowObjectRefSTIXObject={handlerShowObjectRefSTIXObject}
            handlerShowModalWindowCreateNewSTIXObject={handlerShowModalWindowCreateNewSTIXObject}
            handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs={handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs}
        />}

        {showModalWindowSTIXObject && <ModalWindowAnySTIXObject
            socketIo={socketIo}
            isNotDisabled={receivedData.userPermissions.editing_information.status} 
            showModalWindow={showModalWindowSTIXObject}
            parentIdSTIXObject={objectId}
            listNewOrModifySTIXObject={listNewOrModifySTIXObject}
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
                <Grid container direction="row">
                    <Grid item container md={11} justifyContent="flex-start">
                        Создание ссылки на новый объект или уже существующий
                    </Grid>
                    <Grid item container md={1} justifyContent="flex-end">
                        <IconButton edge="start" color="inherit" onClick={handlerCloseModalWindowCreateNewSTIXObject} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <Suspense fallback={<div style={{ textAlign: "center", marginBottom: 22 }}>Загрузка...</div>}>
                <ContentCreateNewSTIXObject 
                    socketIo={socketIo}
                    isNotDisabled={true}
                    parentSTIXObject={parentSTIXObject}
                    currentIdSTIXObject={objectId} 
                    listRefsForObjectSTIX={listRefsForObjectSTIX}
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

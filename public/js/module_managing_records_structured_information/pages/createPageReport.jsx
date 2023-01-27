import React, { useState, Suspense } from "react";
import { 
    Dialog,
    DialogTitle,
    IconButton,
    Grid,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";

import listExtendedObject from "../../common_helpers/listExtendedObject.js";
import CreateWidgetsPageReport from "../widgets/createWidgetsPageReport.jsx";
import ContentCreateNewSTIXObject from "../../module_managing_records_structured_information/any_elements/dialog_contents/contentCreateNewSTIXObject.jsx";
import CreateSearchAreaOutputReports from "../any_elements/createSearchAreaOutputReports.jsx";
import ModalWindowAddReportSTIX from "../../modal_windows/modalWindowAddReportSTIX.jsx";
import ModalWindowAnySTIXObject from "../../modal_windows/modalWindowAnySTIXObject.jsx";
import ModalWindowShowInformationReport from "../../modal_windows/modalWindowShowInformationReport.jsx";
import ModalWindowConfirmDeleteLinkFromObjRefs from "../../modal_windows/modalWindowConfirmDeleteLinkFromObjRefs.jsx";

export default function CreatePageReport(props) {
    const { socketIo, receivedData } = props;

    let [ addedNewReport, setAddedNewReport ] = useState(false);
    let [ buttonDelModalWindowConfirmDeleteLinkFromObjRefs, setButtonDelModalWindowConfirmDeleteLinkFromObjRefs ] = useState(false);
    let [ currentReportId, setCurrentReportId ] = useState("");
    let [ currentObjectId, setCurrentObjectId ] = useState("");
    let [ parentSTIXObject, setParentSTIXObject ] = useState({});
    let [ listRefsForObjectSTIX, setListRefsForObjectSTIX ] = useState([]);
    let [ idForCreateListObjectRefs, setIdForCreateListObjectRefs ] = useState({ "parentId": "", "addId": [] }); //вот это нужно пробросить через 
    //ModalWindowShowInformationReport в CreateListObjectRefsReport для обновления списка ссылок на объекты
    let [ currentAdditionalIdSTIXObject, setCurrentAdditionalIdSTIXObject ] = useState("");
    let [ objectsIdModalWindowConfirmDeleteLinkFromObjRefs, setObjectsIdModalWindowConfirmDeleteLinkFromObjRefs ] = useState([]);
    let [ showModalWindowSTIXObject, setShowModalWindowSTIXObject ] = useState(false);
    let [ showModalWindowAddNewReport, setShowModalWindowAddNewReport ] = useState(false);
    let [ showModalWindowInformationReport, setShowModalWindowInformationReport ] = useState(false);
    let [ showModalWindowCreateNewSTIXObject, setShowModalWindowCreateNewSTIXObject ] = useState(false);
    let [ showModalWindowConfirmDeleteLinkFromObjRefs, setShowModalWindowConfirmDeleteLinkFromObjRefs ] = useState(false);

    let handlerShowModalWindowAddNewReport = () => {
            setShowModalWindowAddNewReport(true);
        },
        handlerCloseModalWindowAddReport = () => {
            setShowModalWindowAddNewReport(false);
        },
        handlerShowModalWindowInformationReport = (elemId) => {
            //setCurrentObjectId(elemId);
            setCurrentReportId(elemId);
            setShowModalWindowInformationReport(true);
        },
        handlerCloseModalWindowInformationReport = () => {
            //setCurrentObjectId("");
            setCurrentReportId("");
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
        handlerDialogCloseModalWindowSTIXObject = () => {
            setCurrentAdditionalIdSTIXObject("");
            setShowModalWindowSTIXObject(false);
        },
        handlerShowModalWindowCreateNewSTIXObject = (elemId, listRefsForObjectSTIX, reportObject) => {            
            /** 
             * срабатывает при открытии окна создания новых или поиска уже существующих STIX объектов
             */
            console.log("000000 func '=== HANDLERShowModalWindowCreateNewSTIXObject ===', elemId: ", elemId, ", listRefsForObjectSTIX: ", listRefsForObjectSTIX, ", reportObject: ", reportObject);

            setCurrentObjectId(elemId);
            //setObjectId(parentSTIXObject);
            //setParentSTIXObject(parentSTIXObject);

            if(typeof reportObject !== "undefined"){
                setParentSTIXObject(reportObject);
            }

            setListRefsForObjectSTIX(listRefsForObjectSTIX);
            setShowModalWindowCreateNewSTIXObject(true);
        },
        handlerCloseModalWindowCreateNewSTIXObject = () => {
            setCurrentObjectId("");
            setShowModalWindowCreateNewSTIXObject(false);
        },
        // срабатывает при нажатии кнопки "добавить ссылки" в окне создания новых или поиска уже существующих STIX объектов
        handlerDialogSaveNewSTIXObject = (currentIdSTIXObject, listSTIXObject) => { 
            setShowModalWindowCreateNewSTIXObject(false);
            setIdForCreateListObjectRefs({ "parentId": currentIdSTIXObject, "addId": listSTIXObject });

            console.log("func 'handlerDialogSaveNewSTIXObject', parentId:", currentIdSTIXObject, " addId:", listSTIXObject);

            //здесь запрашиваем родительский объект в котором модифицируем свойство со сылками на другие объекты
            // и выполняем модификацию этих свойств, затем отправляем модифицированный родительский объект и 
            // объект который мы добавили или модифицировали
            socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {           
                if((data.information === null) || (typeof data.information === "undefined")){
                    return;
                }
        
                if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                    return;
                }
        
                if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
                    return;
                }
        
                if(data.information.additional_parameters.transmitted_data.length === 0){
                    return;
                }
        
                let listObjectUpdate = [];
                for(let obj of data.information.additional_parameters.transmitted_data){   
                    for(let item of listSTIXObject){
                        if(item.ref.includes("refs")){
                            if(Array.isArray(obj[item.ref])){
                                obj[item.ref].push(item.obj.id);
                            } else {
                                obj[item.ref] = [item.obj.id];
                            }
                        } else {
                            obj[item.ref] = item.obj.id;
                        }

                        //добавляем созданные объекты
                        listObjectUpdate.push(item.obj);
                    }

                    //добавляем модифицированный родительский объект
                    listObjectUpdate.push(obj);
                }

                console.log("func 'handlerDialogSaveNewSTIXObject' ---------------------- listObjectUpdate ===== ", listObjectUpdate);

                socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: listObjectUpdate });

                /**

                Надо проверить ДОБАВЛЕНИЕ в MRSICT ВСЕХ уже реализованных объектов, что ты небыло ошибок
                АРТЕФАКТ (ARTIFACT СO STIX) проверил но не полностью

                Нужно сделать (с использованием хуков возможно useRef) сохранение сгенерированного впервые UUID объекта
                а то он при изменении в полях ввода постоянно генерируется вновь

                 */
            });

            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: currentObjectId,
            }});
        },
        handlerDialogShowModalWindowConfirmDeleteLinkFromObjRefs = (parentId, deleteId) => {
            setShowModalWindowConfirmDeleteLinkFromObjRefs(true);
            setObjectsIdModalWindowConfirmDeleteLinkFromObjRefs([ parentId, deleteId ]);
        },
        handlerDialogCloseModalWindowConfirmDeleteLinkFromObjRefs = () => {
            setShowModalWindowConfirmDeleteLinkFromObjRefs(false);
            setObjectsIdModalWindowConfirmDeleteLinkFromObjRefs([]);
        },
        handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs = (currentParentId, currentDeleteId) => {
            let getListRefsForObject = (objType) => {
                for(let item of listExtendedObject){
                    if(objType === item.name){
                        return item.listProperties;
                    }
                }

                return [];
            };

            console.log("--------------- func 'handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs' currentParentId:", currentParentId, " currentDeleteId:", currentDeleteId, " -----------");

            socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
                console.log("func ||||'===== handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs ====='|||||, recived 'isems-mrsi response ui: send search request, get STIX object for id' DATA:", data, " =====");

                if((data.information === null) || (typeof data.information === "undefined")){
                    return;
                }
        
                if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                    return;
                }
        
                if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
                    return;
                }
        
                if(data.information.additional_parameters.transmitted_data.length === 0){
                    return;
                }
        
                let isUpdate = false;
                let listObjectUpdate = [];
                for(let obj of data.information.additional_parameters.transmitted_data){   
                    let listElementRef = getListRefsForObject(obj.type);

                    console.log("listExtendedObject = ", listExtendedObject, " obj:", obj, " GET LIST REFS from listExtendedObject: ", listElementRef);

                    for(let item of listElementRef){
                        if(typeof obj[item] === "undefined"){
                            continue;
                        }

                        isUpdate = true;
                        if(Array.isArray(obj[item])){
                            obj[item].splice(obj[item].findIndex((id) => id === currentDeleteId), 1);
                        } else {
                            if(currentDeleteId === obj[item]){
                                obj[item] = "";
                            }
                        }
                    }

                    listObjectUpdate.push(obj);
                }

                console.log("==== listSTIXObject: listObjectUpdate:", listObjectUpdate);

                if(isUpdate){
                    socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: listObjectUpdate });
                }
            });

            setButtonDelModalWindowConfirmDeleteLinkFromObjRefs((prevState) => !prevState);
            handlerDialogCloseModalWindowConfirmDeleteLinkFromObjRefs();

            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentParentId,
                parentObjectId: "",
            }});
            /*socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentDeleteId,
                parentObjectId: currentParentId,
            }});*/
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
            showReportId={currentReportId}
            userPermissions={receivedData.userPermissions}
            confirmDeleteLink={buttonDelModalWindowConfirmDeleteLinkFromObjRefs}
            idForCreateListObjectRefs={idForCreateListObjectRefs}
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
            parentIdSTIXObject={currentObjectId}
            currentAdditionalIdSTIXObject={currentAdditionalIdSTIXObject}
            handlerDialogClose={handlerDialogCloseModalWindowSTIXObject}
        />}

        {/** модальное окно для подтверждения удаления ссылки на STIX объект из свойства obj_refs Отчета */}
        {showModalWindowConfirmDeleteLinkFromObjRefs && <ModalWindowConfirmDeleteLinkFromObjRefs
            objectsId={objectsIdModalWindowConfirmDeleteLinkFromObjRefs}
            showModalWindow={showModalWindowConfirmDeleteLinkFromObjRefs}
            handlerDialogClose={handlerDialogCloseModalWindowConfirmDeleteLinkFromObjRefs}
            handlerDialogConfirm={() => {
                setButtonDelModalWindowConfirmDeleteLinkFromObjRefs((prevState) => !prevState);
                handlerDialogCloseModalWindowConfirmDeleteLinkFromObjRefs();
            }}
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
                    currentIdSTIXObject={currentObjectId} 
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

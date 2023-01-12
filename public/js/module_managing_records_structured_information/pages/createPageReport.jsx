import React, { useState, Suspense } from "react";
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
    const { socketIo, receivedData } = props;

    let [ addedNewReport, setAddedNewReport ] = useState(false);
    let [ buttonDelModalWindowConfirmDeleteLinkFromObjRefs, setButtonDelModalWindowConfirmDeleteLinkFromObjRefs ] = useState(false);
    let [ currentReportId, setCurrentReportId ] = useState("");
    let [ currentObjectId, setCurrentObjectId ] = useState("");
    let [ parentSTIXObject, setParentSTIXObject ] = useState({});
    //let [ fieldNameForChange, setFieldNameForChange ] = useState([]);
    let [ listRefsForObjectSTIX, setListRefsForObjectSTIX ] = useState([]);
    let [ listNewOrModifySTIXObject, setListNewOrModifySTIXObject ] = useState([]);
    let [ idForCreateListObjectRefs, setIdForCreateListObjectRefs ] = useState({ "parentId": "", "addId": "" }); //вот это нужно пробросить через 
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

            /*if(typeof parentObject === "undefined"){

                console.log("func '=== HANDLERShowModalWindowCreateNewSTIXObject ===', listNewOrModifySTIXObject:", listNewOrModifySTIXObject);

                for(let item of listNewOrModifySTIXObject){
                    console.log("func '=== HANDLERShowModalWindowCreateNewSTIXObject ===', elemId: ", elemId, " item.id = ", item.id);

                    if(elemId === item.id ){
                        setParentSTIXObject(item);

                        break;
                    }
                }

                //setParentSTIXObject({});
            } else {
                setParentSTIXObject(reportObject);
            }*/

            setListRefsForObjectSTIX(listRefsForObjectSTIX);
            setShowModalWindowCreateNewSTIXObject(true);
        },
        handlerCloseModalWindowCreateNewSTIXObject = () => {
            setCurrentObjectId("");
            setShowModalWindowCreateNewSTIXObject(false);
        },
        handlerDialogSaveNewSTIXObject = (currentIdSTIXObject, listSTIXObject) => { 
            /**
             * срабатывает при нажатии кнопки "добавить ссылки" в окне создания новых или поиска уже существующих STIX объектов
             */

            /**
             * при добавлении нового объекта выполняется сразу после нажатии кнопки "добавить новый объект" в окне добавления объектов
             * по идее parentSTIXObject должен содержать модифицируемый объект (но возможно кроме Report). Значит, возможно надо будет 
             * в CreateListObjectRefsReport хранить все запрашиваемые в строке 311, функции CreateListObjectRefsReport, объекты и если
             * это не Report искать и выбирать из них объект который подвергся модификации (добавили в какое либо поле новую ссылку). А
             * затем возвращать этот объект сюда и сохранять его в listNewOrModifySTIXObject наряду с вновь созданным объектом для их
             * последующей отправки в MRSICT
             * 
             * Кстати с удалением ссылки из объекта тоже надо проверить
             */
            
            console.log("func '===== HANDLERDialogSaveNewSTIXObject =====', currentIdSTIXObject: ", currentIdSTIXObject, ", listSTIXObject: ", listSTIXObject);

            //setFieldNameForChange(fieldName);
            setShowModalWindowCreateNewSTIXObject(false);

            if(currentIdSTIXObject.includes("report")){

                console.log("---=======++++++ ADD ref to REPORT BEFORE", parentSTIXObject, " ++++++=======-----");

                setParentSTIXObject((prevState) => {
                    for(let item of listSTIXObject){
                        console.log("==== listSTIXObject: ITEM:", item);

                        prevState.object_refs.push(item.obj.id);
                    }

                    return prevState;
                });

                console.log("---=======++++++ ADD ref to REPORT AFTER", parentSTIXObject, " ++++++=======-----");

                return;
            }

            socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
                console.log("------------------------------------");
                console.log("func '===== HANDLERDialogSaveNewSTIXObject =====', recived 'isems-mrsi response ui: send search request, get STIX object for id' DATA:", data);
            
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
        
                for(let obj of data.information.additional_parameters.transmitted_data){   
                    for(let item of listSTIXObject){
                        console.log("==== listSTIXObject: ITEM:", item);

                        if(item.ref.includes("refs")){
                            if(Array.isArray(obj[item.ref])){
                                obj[item.ref].push(item.obj.id);
                            } else {
                                obj[item.ref] = [item.obj.id];
                            }
                        } else {
                            obj[item.ref] = item.obj.id;
                        }
                    }

                    //за место добавлении модифицированных объектов в ListNewOrModifySTIXObject стоит отправлять данные объекты 
                    // прямиком в MRSICT

                    /**
                     * к сожалению не получится сразу отправлять данные в MRSICT так как некоторые из создаваемых объектов должны ОБЯЗАТЕЛЬНО
                     * хранить ссылки на другие объекты (в функции CreateListObjectRefsReport есть переменная isAddAlarmProblems информирующая пользователя 
                     * о наличии таких объектов)
                     */
                    setListNewOrModifySTIXObject((prevState) => {
                        console.log("func 'setListNewOrModifySTIXObject', 000 obj:", obj);

                        prevState.push(obj);
        
                        return prevState;
                    });
                }

                console.log("==== listNewOrModifySTIXObject: ", listNewOrModifySTIXObject);
                console.log("------------------------------------");
            });

            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: currentObjectId,
            }});

            /*if(listSTIXObject.length === 0){
                return;
            }

            setListNewOrModifySTIXObject((prevState) => {
                //console.log("func 'setListNewOrModifySTIXObject', 000 listSTIXObject:", listSTIXObject);

                for(let object of listSTIXObject){
                    let index = prevState.findIndex((elem) => elem.id === object.id);
                    //console.log("func 'setListNewOrModifySTIXObject', 001 INDEX:", index);

                    if(index === -1){
                        prevState.push(object);
                    } else {
                    //setListNewOrModifySTIXObject[index] = object;
                        prevState[index] = object;
                    }
                }

                //console.log("func 'setListNewOrModifySTIXObject', 111 setListNewOrModifySTIXObject (prevState):", prevState);

                for(let i = 0; i < prevState.length; i++){
                    if(parentSTIXObject.id !== prevState[i].id){
                        //console.log("func 'setListNewOrModifySTIXObject', parentSTIXObject.id:", parentSTIXObject.id, prevState[i].id, ":prevState[i].id 111 ERROR");

                        continue;
                    }                    

                    for(let fn of fieldName){
                        if(typeof prevState[i][fn] === "undefined"){
                            //console.log("func 'setListNewOrModifySTIXObject', 222 ERROR");

                            continue;
                        }                    

                        if(Array.isArray(prevState[i][fn])){
                            //console.log("func 'setListNewOrModifySTIXObject', 222-111");

                            for(let obj of listSTIXObject){
                                if(!prevState[i][fn].find((value) => value === obj.id)){
                                    prevState[i][fn].push(obj.id);
                                }
                            }
                        } else {
                            //console.log("func 'setListNewOrModifySTIXObject', 222-222");

                            prevState[i][fn] = listSTIXObject[0];
                        }
                    }
                }

                return prevState;
            });*/

            console.log("func '===== HANDLERDialogSaveNewSTIXObject =====', listNewOrModifySTIXObject: ", listNewOrModifySTIXObject);
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
        handlerDialogConfirmModalWindowConfirmDeleteLinkFromObjRefs = () => {
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
            showReportId={currentReportId}
            userPermissions={receivedData.userPermissions}
            parentSTIXObject={parentSTIXObject}
            confirmDeleteLink={buttonDelModalWindowConfirmDeleteLinkFromObjRefs}fieldNameForChange
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
            parentIdSTIXObject={currentObjectId}
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

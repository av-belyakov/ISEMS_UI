import React, { useState, useEffect, useReducer } from "react";
import { Col, Row } from "react-bootstrap";
import {
    Button,
    Collapse,
    Tooltip,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import { green, red, orange, grey } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";
import { CreateButtonNewReport } from "../buttons/createButtonNewReport.jsx";
import listExtendedObject from "../../common_helpers/listExtendedObject";

const listObjectRequiredLinks = new Set([
    "report",
    "grouping",
    "note",
    "observed-data",
    "opinion",
]);

const getListPropertiesExtendedObject = (objName) => {
    for(let elem of listExtendedObject){
        if(elem.name === objName){
            return elem.listProperties;
        }
    } 

    return [];
};

const addElemToChildId = (listData, stateTmp) => {
    let newArr = [];

    if(Array.isArray(listData)){
        for(let ce of listData){
            if(stateTmp.childId.find((e) => e.currentId === ce)){
                continue;
            }           

            newArr.push({ currentId: ce, childId: [] });
        }
    } else {
        if((listData !== null) && (listData !== "")){
            if(!stateTmp.childId.find((e) => e.currentId === listData)){
                newArr.push({ currentId: listData, childId: [] });
            }
        }
    }

    return newArr;
};

const loreducer = (state, action) => {
    let changeListIdResult = {};
    let deleteIdFromListId = (stateList, currentParentId, currentDeleteId, deleteIdDepthAndKey, currentDepth) => {
        if(deleteIdDepthAndKey.length < 1){
            return stateList;
        }
    
        let [ depth, key ] = deleteIdDepthAndKey;
    
        for(let i = 0; i < stateList.length; i++){
            if(depth === currentDepth){
                if((key === i) && (stateList[i].currentId === currentDeleteId)){
                    stateList.splice(i, 1);

                    return stateList;        
                }
            } else {
                if(stateList[i].childId.length === 0){
                    continue;
                }

                stateList[i].childId = deleteIdFromListId(stateList[i].childId, currentParentId, currentDeleteId, deleteIdDepthAndKey, currentDepth+1);
            }
        }
    
        return stateList;
    };

    let updateState = (data, stateTmp, num) => {
        if(data.length === 0){
            return stateTmp;
        }

        for(let item = 0; item < data.length; item++){
            if(data[item].type !== "report" || num != 0){
                continue;
            }

            for(let elem of data[item].object_refs){
                if(stateTmp.find((e) => elem === e.currentId)){
                    continue;
                }

                stateTmp.push({ currentId: elem, childId: [] });
            }

            data.splice(data[item], 1);
        }

        for(let i = 0; i < stateTmp.length; i++){
            for(let item of data){
                if(stateTmp[i].currentId !== item.id){
                    continue;
                }
                
                let name = stateTmp[i].currentId.split("--")[0];
                let listProperties =  getListPropertiesExtendedObject(name);

                if(listProperties.length === 0){
                    continue;
                }

                for(let value of listProperties){
                    if(!item[value]){
                        continue;
                    }

                    stateTmp[i].childId = stateTmp[i].childId.concat(addElemToChildId(item[value], stateTmp[i]));
                }
            }

            if(stateTmp[i].childId.length > 0){
                stateTmp[i].childId = updateState(data, stateTmp[i].childId, num+1);
            }
        }

        return stateTmp;
    };

    let forEachListId = (parentId, refsId, stateTmp) => {
        for(let i = 0; i < stateTmp.length; i++){
            if(stateTmp[i].currentId === parentId){
                for(let refId of refsId){
                    if(stateTmp[i].childId.find((item) => item.currentId === refId)){
                        continue;
                    }

                    stateTmp[i].childId.push({ currentId: refId, childId: [] });
                }

                continue;
            }

            if(stateTmp[i].childId.length === 0){
                continue;
            }

            stateTmp[i].childId = forEachListId(parentId, refsId, stateTmp[i].childId);
        }

        return stateTmp;
    };
    let changeListId = (parentObj, listModify, stateTmp) => {
        let type = parentObj.split("--")[0];
        if(type === "report"){
            for(let elem of listModify){
                if(elem.id.split("--")[0] === "report"){
                    continue;
                }

                if(!stateTmp.find((item) => item.currentId === elem.id)){
                    stateTmp.push({ currentId: elem.id, childId: [] });
                }
            }
            
            return stateTmp;
        }

        let listTmp = [];
        for(let obj of listModify){
            if(obj.id !== parentObj){
                continue;
            }

            let listProperties =  getListPropertiesExtendedObject(obj.type);

            if(listProperties.length === 0){
                continue;
            }

            for(let value of listProperties){
                if(!obj[value]){
                    continue;
                }

                if(Array.isArray(obj[value])){
                    for(let l of obj[value]){
                        listTmp.push(l);
                    }
                } else {
                    listTmp.push(obj[value]);
                }
            }

            break;
        }
        
        return forEachListId(parentObj, listTmp, stateTmp);
    };

    let addListId = (addList, currentList) => {
        for(let i = 0; i < currentList.length; i++){
            if(currentList[i].currentId === addList.parentId){
                currentList[i].childId = currentList[i].childId.concat(addList.addId.map((item) => { return { currentId: item.obj.id, childId: [] };}));

                break;
            }

            if(currentList[i].childId.length > 0){
                currentList[i].childId = addListId(addList, currentList[i].childId);
            }
        }

        return currentList;
    };

    let newList = [];

    switch(action.type){
    case "updateList":
        newList = action.data.current.concat(action.data.parent);

        for(let item of newList){
            let searchIndex = state.list.findIndex((elem) => elem.id === item.id);

            if(searchIndex === -1){
                state.list.push(item);

                continue;
            }

            state.list[searchIndex] = item;
        }

        return {...state, list: state.list};
    case "addList":
        //console.log("**************============== func 'loreducer' action.type = ", action.type, " action.data = ", action.data);

        for(let item of action.data.addId){
            for(let i = 0; i < state.list.length; i++){
                if(state.list[i].id !== action.data.parentId){
                    continue;
                }

                if(typeof state.list[i][item.ref] === "undefined" && item.ref.includes("refs")){
                    state.list[i][item.ref] = [];
                }

                if(Array.isArray(state.list[i][item.ref])){
                    state.list[i][item.ref].push(item.obj.id);
                } else {
                    state.list[i][item.ref] = item.obj.id;
                }
            }

            state.list.push(item.obj);
        }

        return {...state};
    case "addListId":
        if(action.data.parentId.includes("report")){
            for(let item of action.data.addId){
                state.listId.push({ currentId: item.obj.id, childId: [] });
            }
        } else {
            state.listId = addListId(action.data, state.listId);
        }

        return {...state};
    case "updateListId":
        return {...state, listId: updateState(action.data.listObject, state.listId, 0)};
    case "changeListId":
        changeListIdResult = changeListId(action.data.parentSTIXObject, action.data.listModifySTIXObject, state.listId);

        if(typeof changeListIdResult === "undefined"){
            return {...state};
        }

        return {...state, listId: changeListIdResult};
    case "deleteIdFromListId":
        return {...state, listId: deleteIdFromListId(state.listId, action.data.currentParentId, action.data.currentDeleteId, action.data.deleteIdDepthAndKey, 0)};
    case "getObject":

        break;
    }
};

/*
 * Формирует список из свойства object_refs, а также элементы его управления
 * @param {*} props 
 * @returns 
 */
export default function CreateListObjectRefsReport(props){
    let {
        socketIo,
        stateReport,
        majorParentId,
        confirmDeleteLink,
        idForCreateListObjectRefs,
        handlerDialogConfirm,
        handlerDeleteObjectRef,
        handlerShowObjectRefSTIXObject,
        handlerShowModalWindowCreateNewSTIXObject,
    } = props;

    let objListBegin = stateReport.object_refs.map((item) => {
        return { currentId: item, childId: [] };
    });

    const [ listObjReducer, setListObjReducer ] = useReducer(loreducer, { list: [], listId: objListBegin});
    const [ currentParentId, setCurrentParentId ] = useState("");
    const [ currentDeleteId, setCurrentDeleteId ] = useState("");
    const [ deleteIdDepthAndKey, setDeleteIdDepthAndKey ] = useState([]);
    const [ listActivatedObjectNumbers, setListActivatedObjectNumbers ] = React.useState([]);

    let addId = (idForCreateListObjectRefs.addId.length === 0)? 0: idForCreateListObjectRefs.addId[0].obj.id;

    //console.log("(*)(*) ____ func 'CreateListObjectRefsReport', majorParentId: ", majorParentId, ", stateReport:", stateReport, " listObjReducer ======= ", listObjReducer, " (*)(*)");

    useEffect(() => {
        let listener = (data) => {

            //console.log("(*)(*) ____ func 'CreateListObjectRefsReport', majorParentId: ", majorParentId, ", useEffect(():", data, " (*)(*)");

            let listObj = data.information.additional_parameters.transmitted_data.filter((item) => {
                return item.type !== "relationship" && item.type !== "sighting"; 
            });

            setListObjReducer({ type: "updateListId", data: { listObject: listObj }});
            setListObjReducer({ type: "updateList", data: { current: listObj /*data.information.additional_parameters.transmitted_data*/, parent: stateReport }});
        };

        let searchList = stateReport.object_refs.filter((item) => {
            let type = item.split("--");

            return listExtendedObject.find((item) => item.name === type[0]);
        });

        if(searchList.length === 0){
            searchList.push(stateReport.id);
        }

        socketIo.on("isems-mrsi response ui: send search request, get STIX object for list id", listener);
        socketIo.emit("isems-mrsi ui request: send search request, get STIX object for list id", { 
            arguments: { 
                searchListObjectId: searchList,
                parentObjectId: stateReport.id,
            }});

        return () => {
            socketIo.off("isems-mrsi response ui: send search request, get STIX object for list id", listener);
            setListActivatedObjectNumbers([]);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if(!confirmDeleteLink){
            return;
        }        
        
        setListObjReducer({ type: "deleteIdFromListId", data: { 
            currentParentId: currentParentId, 
            currentDeleteId: currentDeleteId,
            deleteIdDepthAndKey: deleteIdDepthAndKey, 
        }});
        setListActivatedObjectNumbers([]);

        //фактически закрывает окно
        handlerDialogConfirm(currentParentId, currentDeleteId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ confirmDeleteLink ]),
    useEffect(() => {

        //console.log("**) ____ func 'CreateListObjectRefsReport', useEffect ----- idForCreateListObjectRefs.parentId: ", idForCreateListObjectRefs.parentId, " idForCreateListObjectRefs.addId:", idForCreateListObjectRefs.addId);

        //для изменения содержимого списка listObjReducer.listId типа { currentId: item, childId: [] }
        setListObjReducer({ type: "addListId", data: idForCreateListObjectRefs });

        //для изменения списка listObjReducer.list, при этом надо добавить не только новые объекты в список но и ссылки на эти новые объекты
        // в родительском объекте
        setListObjReducer({ type: "addList", data: idForCreateListObjectRefs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ idForCreateListObjectRefs.parentId, addId ]);
    
    const findObjectId = (list, id) => {
            let listTmp = new Set([]);

            for(let i = 0; i < list.length; i++){
                if(!Array.isArray(list[i].childId)){
                    continue;
                }

                if(list[i].currentId === id){                
                    for(let value of list[i].childId){
                        listTmp.add(value.currentId);
                    }
                } else {
                    let tmp = findObjectId(list[i].childId, id);                
                    for(let value of tmp){
                        listTmp.add(value);
                    }
                }
            }

            return listTmp;
        },
        handleClick = (num, currentId, depth) => {  
            
            //console.log("func 'handleClick' __________ num: '", num, "' currentId: '", currentId, "' depth: '", depth, "', listActivatedObjectNumbers: ", listActivatedObjectNumbers);
            //console.log("func 'handleClick' __________ listActivatedObjectNumbers[depth]: '", listActivatedObjectNumbers[depth], " typeof listActivatedObjectNumbers[depth] = ", listActivatedObjectNumbers[depth]);

            let tmp = listActivatedObjectNumbers.slice();
            if(typeof listActivatedObjectNumbers[depth] !== "undefined" && listActivatedObjectNumbers[depth] === num){        

                //console.log("func 'handleClick' __________ 111");

                tmp.splice(depth, 10);
            } else if (typeof listActivatedObjectNumbers[depth] !== "undefined" && listActivatedObjectNumbers[depth] !== num) {

                //console.log("func 'handleClick' __________ 222 num = ", num, " listActivatedObjectNumbers[depth] = ", listActivatedObjectNumbers[depth], " listActivatedObjectNumbers[depth] !== num:", listActivatedObjectNumbers[depth] !== num);

                tmp[depth] = num;
            } else {        

                //console.log("func 'handleClick' __________ 333");

                tmp.push(num);
            }

            setListActivatedObjectNumbers(tmp);
        
            if(currentId !== ""){
                let searchListObjectId = findObjectId(listObjReducer.listId, currentId);
                let listSearchId = [];
                for(let value of searchListObjectId){
                    listSearchId.push(value);
                }

                if(searchListObjectId.size === 0){
                    return;
                }

                socketIo.emit("isems-mrsi ui request: send search request, get STIX object for list id", { 
                    arguments: { 
                        searchListObjectId: listSearchId,
                        parentObjectId: currentId,
                    }});
            }
        },
        handlerDeleteObjRef = (parentId, currentId, depth, key) => {
            setCurrentParentId(parentId);
            setCurrentDeleteId(currentId);
            setDeleteIdDepthAndKey([ depth, key ]);

            handlerDeleteObjectRef(parentId, currentId);                
        };

    let getObjectRefs = (objectId) => {
        for(let item of listObjReducer.list){
            if(item.id !== objectId){
                continue;
            }

            return item.object_refs;
        }

        return [];
    };

    let getListId = (list, parentId, depth) => {
        let parentName = parentId.split("--")[0];
        let isRemoveDisabled = false;

        if(listObjectRequiredLinks.has(parentName) && list.length <= 1){
            isRemoveDisabled = true;
        }

        return list.map((item, key) => {
            let isAddAlarmProblems = false;
            let type = item.currentId.split("--");
            let objectElem = helpers.getLinkImageSTIXObject(type[0]);

            if(typeof objectElem === "undefined"){
                return "";
            }

            if(type[0] === "grouping" || type[0] === "note" || type[0] === "observed-data" || type[0] === "opinion"){
                let objRefs = getObjectRefs(item.currentId);

                if((typeof objRefs === "undefined") || (objRefs === null) || (objRefs.length === 0)){
                    isAddAlarmProblems = true;
                }
            }

            let elemIsExist = listExtendedObject.find((item) => item.name === type[0]);
            let isExist = listExtendedObject.filter((item) => item.name === type[0]);
            let open = (typeof listActivatedObjectNumbers[depth] !== "undefined")? (listActivatedObjectNumbers[depth] === key): false;
            let listProperties = getListPropertiesExtendedObject(type[0]);

            let titleWarning = "Не заполнено ключевое поле, являющееся обязательным для данного объекта. Вероятнее всего отсутствуют ссылки на другой STIX объект, например в поле object_refs.";
            //titleWarning += " При сохранении Отчета даны объект не будет добавлен в базу данных. Для того чтобы исправить это необходимо добавить в текущий объект ссылку на какой либо другой объект STIX.";

            //console.log("*********************** open = ", open, " key = ", key, " listActivatedObjectNumbers[depth] = ", listActivatedObjectNumbers[depth]);

            return (<React.Fragment key={`rf_${key}`}>
                <ListItem 
                    button 
                    key={`key_list_item_button_ref_${key}`} 
                    onClick={() => {
                        if(!elemIsExist){
                            return;
                        }

                        handleClick.call(null, key, isExist.length > 0? item.currentId: "", depth);
                    }}
                >
                    <Button onClick={handlerShowObjectRefSTIXObject.bind(null, item.currentId)}>
                        <img 
                            key={`key_object_ref_type_${key}`} 
                            src={`/images/stix_object/${objectElem.link}`} 
                            width="27" 
                            height="27" />&nbsp;
                        <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                            <ListItemText primary={item.currentId}/>
                        </Tooltip>
                    </Button>
                    {((item.childId.length > 0) || ((isExist.length > 0)))?
                        (listActivatedObjectNumbers[depth] && (listActivatedObjectNumbers[depth] === key)? 
                            <ExpandLess />: 
                            <ExpandMore />):
                        ""}
                    {listProperties.length > 0? 
                        <IconButton size="small" aria-label="create" onClick={() => {
                            let parentSTIXObject = stateReport;

                            if(item.currentId.split("--")[0] !== "report"){
                                parentSTIXObject = listObjReducer.list[item.currentId];
                            }

                            handlerShowModalWindowCreateNewSTIXObject(item.currentId, listProperties, parentSTIXObject);
                        }}>
                            <AddCircleOutlineIcon style={{ color: green[400] }} />
                        </IconButton>: 
                        ""}
                    <IconButton 
                        size="small"  
                        aria-label="delete" 
                        disabled={isRemoveDisabled}
                        onClick={handlerDeleteObjRef.bind(null, parentId, item.currentId, depth, key)}
                    >
                        {isRemoveDisabled? 
                            <RemoveCircleOutlineOutlinedIcon style={{ color: grey[400] }} />:
                            <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />}
                    </IconButton>
                    {isAddAlarmProblems? 
                        <Tooltip title={titleWarning} key={`key_tooltip_warning_object_ref_${key}`}>
                            <ReportProblemOutlinedIcon style={{ color: orange[400] }} />
                        </Tooltip>: ""}
                </ListItem>
                {item.childId.length > 0 && ((typeof listActivatedObjectNumbers[depth] !== "undefined") && (listActivatedObjectNumbers[depth] === key))?
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button >
                                <ListItemText primary={getListId(item.childId, item.currentId, depth+1)} />
                            </ListItem>
                        </List>
                    </Collapse>:
                    ""}
            </React.Fragment>);
        });
    };

    //directory--9b77ec55-ab31-4b54-ac28-13aa8c95cea5
    //domain-name--0af940f8-35ce-46e7-918b-66078773e48d
    //directory--8e462c0b-bd93-4e7a-824d-163f9ccc47b4
    // {"commonpropertiesobjectstix.id": "report--5e251d2d-6967-42e5-a800-1728c56cc9ba"}

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с данным Отчётом</span></Col>
        </Row>
        <Row>
            <Col md={12} className="text-end">
                <CreateButtonNewReport 
                    message="прикрепить доп. объект"
                    buttonIsDisabled={false}
                    handlerShowModalWindow={() => {
                        handlerShowModalWindowCreateNewSTIXObject(majorParentId, ["object_refs"], stateReport);
                    }}/>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
                {(listObjReducer.listId.length === 0)? 
                    <Typography variant="caption">
                        <span  style={{ color: red[800] }}>
                            * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                        </span>
                    </Typography>:
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        //subheader={}
                    >
                        {getListId(listObjReducer.listId, majorParentId, 0)}
                    </List>
                }
            </Col>
        </Row>
    </React.Fragment>);
}

CreateListObjectRefsReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    stateReport: PropTypes.object.isRequired,
    majorParentId: PropTypes.string.isRequired,
    confirmDeleteLink: PropTypes.bool.isRequired,
    idForCreateListObjectRefs: PropTypes.object.isRequired,
    handlerDialogConfirm: PropTypes.func.isRequired,
    handlerDeleteObjectRef: PropTypes.func.isRequired,
    //handlerReportUpdateObjectRefs: PropTypes.func.isRequired, 
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
    handlerShowModalWindowCreateNewSTIXObject: PropTypes.func.isRequired,
};
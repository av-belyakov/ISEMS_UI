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
import { green, red, orange } from "@material-ui/core/colors";
import lodash from "lodash";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";
import listExtendedObject from "../../common_helpers/listExtendedObject";
//import { CollectionsBookmarkSharp } from "@material-ui/icons";

const getListPropertiesExtendedObject = (objName) => {
    for(let elem of listExtendedObject){
        if(elem.name === objName){
            return elem.listProperties;
        }
    } 

    return [];
};

const addElemToChildId = (listData /** item[value] */, stateTmp /** stateTmp[i] */) => {
    let newArr = [];

    //console.log("|||||||||||||||| ------ func 'addElemToChildId', num: ", num, " ----------- ||||||||||||||||||||");
    //if(num === 0){
    //    console.log("fun addElemToChildId, listData:", listData, " stateTmp:", stateTmp);
    //}

    if(Array.isArray(listData)){

        //if(num === 0){
        //    console.log("fun addElemToChildId, Array.isArray");
        //}

        for(let ce of listData){
            //if(num === 0){
            //    console.log("func 'updateState' 10000, ce:", ce);
            //}

            if(stateTmp.childId.find((e) => e.currentId === ce)){
                continue;
            }           

            newArr.push({ currentId: ce, childId: [] });
        }
    } else {
        if((listData !== null) && (listData !== "")){
            if(!stateTmp.childId.find((e) => e.currentId === listData)){
                //if(num === 0){
                //    console.log("func 'updateState' 10000, ce:", listData);
                //}        

                newArr.push({ currentId: listData, childId: [] });

                //console.log("func 'updateState' 20000, stateTmp[i].currentId ", stateTmp[i].currentId, " stateTmp[i].childId: ", stateTmp[i].childId);
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

        //        console.log("---------------------- func 'updateState', data:", data);
        //        console.log("---------------------- func 'updateState', BEFORE 1111 NUM: ", num);

        for(let item = 0; item < data.length; item++){
            let nameItem = data[item].id.split("--")[0];

            if(nameItem !== "report" || num !== 0){
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

                //                console.log("func 'updateState', item.id: 1111111", item.id);
                
                let name = stateTmp[i].currentId.split("--")[0];
                let listProperties =  getListPropertiesExtendedObject(name);

                if(listProperties.length === 0){
                    continue;
                }

                for(let value of listProperties){
                    if(!item[value]){
                        //if(num === 0){
                        //    console.log("&&&&&&&& NNNN &&&&&&&& ============ 7777777 num === 0:", num);
                        //}

                        continue;
                    }

                    //                    console.log("func 'updateState', item[value]:", item[value], " addElemToChildId(item[value], stateTmp[i]):", addElemToChildId(item[value], stateTmp[i]), " stateTmp[i]:", stateTmp[i]);

                    //if(num === 0){
                    //    console.log("&&&&&&&& YYYY &&&&&&&& ============ 7777777 num === 0:", num);
                    //}

                    stateTmp[i].childId = stateTmp[i].childId.concat(addElemToChildId(item[value], stateTmp[i]));
                }
            }

            if(stateTmp[i].childId.length > 0){
                stateTmp[i].childId = updateState(data, stateTmp[i].childId, num+1);
            }
        }

        //console.log("func 'updateState', AFTER num=", num," stateTmp: ", stateTmp);
        //arr.splice(delnum, delcount)

        return stateTmp;
    };

    let changeListId = (parentObj, listModify, stateTmp) => {

        //console.log("func _________ 'changeListId' ===========, stateTmp: ", stateTmp);

        for(let elem of listModify){
            for(let i = 0; i < stateTmp.length; i++){
                if(stateTmp[i].currentId === parentObj.id){
                    if(typeof stateTmp[i].childId.find((item) => item === elem.id) === "undefined"){
                        stateTmp[i].childId.push({ currentId: elem.id, childId: [] });

                        break;
                    }
                }

                //console.log("FUNC 'changeListId', @@@!!!$$$%%%^^^ stateTmp[i]:", stateTmp[i]);

                if(stateTmp[i].childId.length > 0){
                    stateTmp[i].childId = changeListId(parentObj, listModify, stateTmp[i]);
                }
            }
        }

        return stateTmp;
    };

    /** 
 * Формирование списка listObjectRefsReport при добавлении новых объектов вроде сделал корректно.
 * 
 * Надо проверять те вновь добавленные объекты которые содержат ссылки (например object_refs), на другие объекты
 * и которые при создании должны ОБЯЗАТЕЛЬНО, по спецификации, иметь заполненные эти поля. Если вновь созданный 
 * объект не имеет заполненного подобного поля, то помечать его в списке listObjectRefsReport каким либо значком,
 * например ! в треугольнике красного цвета, как некорректный для добавления объект. Если в данный объект не будет
 * добавлена ни одна ссылка, то такой объект исключить из списка вновь созданных объектов которые отправляются в 
 * MRSICT вместе с объектом Report при сохранении объекта Report
 */

    switch(action.type){
    case "updateList":
        state.list[action.data.parent.id] = action.data.parent;

        for(let item of action.data.current){
            state.list[item.id] = item; 
        }

        return {...state};
    case "updateListId":
        return {...state, listId: updateState(action.data.listObject, state.listId, 0)};
    case "changeListId":
        //data: { parentSTIXObject: parentSTIXObject, listModifySTIXObject: listNewOrModifySTIXObject }});
        //{ currentId: elem, childId: [] }
        console.log(" func 'loreducer', cation.type: ", action.type, " data.parentSTIXObject: ", action.data.parentSTIXObject, " data.listModifySTIXObject: ", action.data.listModifySTIXObject);

        changeListIdResult = changeListId(action.data.parentSTIXObject, action.data.listModifySTIXObject, state.listId);

        console.log("((((((", changeListIdResult,"))))))))");

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
        parentSTIXObject,
        confirmDeleteLink,
        listNewOrModifySTIXObject,
        handlerDialogConfirm,
        handlerDeleteObjectRef,
        handlerReportUpdateObjectRefs,
        handlerShowObjectRefSTIXObject,
        handlerShowModalWindowCreateNewSTIXObject,
    } = props;

    let objListBegin = stateReport.object_refs.map((item) => {
        return { currentId: item, childId: [] };
    });

    console.log("func 'CreateListObjectRefsReport' ---------------");
    console.log("majorParentId: ", majorParentId, " stateReport: ", stateReport);

    const [ listObjReducer, setListObjReducer ] = useReducer(loreducer, { list: {}, listId: objListBegin});
    const [ currentParentId, setCurrentParentId ] = useState("");
    const [ currentDeleteId, setCurrentDeleteId ] = useState("");
    const [ deleteIdDepthAndKey, setDeleteIdDepthAndKey ] = useState([]);
    const [ listActivatedObjectNumbers, setListActivatedObjectNumbers ] = React.useState([]);

    let listener = (data) => {

        console.log("LISTENER SEARCH SEND REQUEST,  data: ", data);
        console.log("LISTENER SEARCH SEND REQUEST, stateTmp BEFORE: ", listObjReducer);

        console.log("data.parentObjectId: ", data.parentObjectId, ", data.information.additional_parameters.transmitted_data: ", data.information.additional_parameters.transmitted_data);

        setListObjReducer({ type: "updateListId", data: { listObject: data.information.additional_parameters.transmitted_data }});
        setListObjReducer({ type: "updateList", data: { current: data.information.additional_parameters.transmitted_data, parent: stateReport }});
    };
    useEffect(() => {
        console.log("%%$$%^&&&&&&& useEffect, SEND message 'isems-mrsi response ui: send search request, get STIX object for list id' -->");   

        socketIo.on("isems-mrsi response ui: send search request, get STIX object for list id", listener);
        socketIo.emit("isems-mrsi ui request: send search request, get STIX object for list id", { 
            arguments: { 
                searchListObjectId: stateReport.object_refs.filter((item) => {
                    let type = item.split("--");
                
                    return listExtendedObject.find((item) => item.name === type[0]);
                }),
                parentObjectId: stateReport.id,
            }});

        return () => {
            socketIo.off("isems-mrsi response ui: send search request, get STIX object for list id", listener);
            setListActivatedObjectNumbers([]);
        };
    }, []);
    useEffect(() => {
        console.log("-------======== START DELETE ELEMENT REFS ======--------");
        //        console.log("Здесь отрабатывает тригер который информирует функцию CreateListObjectRefsReport о нажатии кнопки УДАЛИТ модального окна подтверждения удаления ссылки");

        if(!confirmDeleteLink){
            return;
        }

        //if(listObjReducer.listId.length === 0){
        //    return;
        //}

        console.log("Здесь отрабатывает тригер который информирует функцию CreateListObjectRefsReport о нажатии кнопки УДАЛИТ модального окна подтверждения удаления ссылки");

        //let stateTmp = state.slice();
        //setState(deleteIDFromState(stateTmp, 0));
        //let stateTmp = lodash.cloneDeep(listObjReducer);
        //let newState = deleteIDFromState(stateTmp.listId, 0);
        //console.log("REsult delete func 'deleteIDFromState' = ", newState);
        //setListObjReducer({ type: "deleteElementListId", data: newState });

        setListObjReducer({ type: "deleteIdFromListId", data: { 
            currentParentId: currentParentId, 
            currentDeleteId: currentDeleteId,
            deleteIdDepthAndKey: deleteIdDepthAndKey, 
        }});

        deleteIdFromSTIXObject();
        setListActivatedObjectNumbers([]);
        handlerDialogConfirm();
    }, [ confirmDeleteLink ]),
    useEffect(() => {

        console.log("##@@@@!!!!! 11111111111111111 func 'useEffect', add new report, stateReport:", stateReport);

        setListObjReducer({ type: "updateListId", data: { listObject: [ stateReport ]}});
        setListObjReducer({ type: "updateList", data: { current: [ stateReport ], parent: stateReport }});
    }, [ stateReport ]),
    useEffect(() => {

        console.log("##@@@@!!!!! 22222222222222222 func 'useEffect', add new report, parentSTIXObject:", parentSTIXObject, ", listNewOrModifySTIXObject:", listNewOrModifySTIXObject);

        setListObjReducer({ type: "changeListId", data: { parentSTIXObject: parentSTIXObject, listModifySTIXObject: listNewOrModifySTIXObject }});
    }, [ parentSTIXObject, listNewOrModifySTIXObject ]);

    let deleteIdFromSTIXObject = () => {
        let parrentObject = lodash.cloneDeep(listObjReducer.list[currentParentId]);

        if(!parrentObject){
            return;
        }

        //        let parrentObject = listObjReducer.list[currentParentId];
        let id = currentParentId.split("--")[0];
        let listSaveRefs = [];

        for(let value of listExtendedObject){
            if(value.name === id){
                listSaveRefs = value.listProperties;

                break;
            }
        }

        for(let value of listSaveRefs){
            if(Array.isArray(parrentObject[value])){
                let tmp = parrentObject[value].filter((item) => item !== currentDeleteId);

                parrentObject[value] = tmp;
            } else {
                if(parrentObject[value] === currentDeleteId){
                    parrentObject[value] = "";
                }
            }
        }

        //console.log("currentParentId: ", currentParentId, " ID: ", id); 
        console.log("NEW PARRENT Object from who was DELETED element: ", parrentObject);
        console.log("LIST settings with somethings elements: ",  listSaveRefs);

        if(parrentObject.type === "report"){
            handlerReportUpdateObjectRefs(parrentObject.object_refs);  
        }
        
        socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ parrentObject ] });
    };
    
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
            
            console.log("func 'handleClick' ......................");

            let tmp = listActivatedObjectNumbers.slice();
            if(listActivatedObjectNumbers[depth] && listActivatedObjectNumbers[depth] === num){        
                tmp.splice(depth, 10);
            } else if(listActivatedObjectNumbers[depth] && listActivatedObjectNumbers[depth] !== num && depth === 0) {
                tmp = [];
                tmp.push(num);
            } else {        
                tmp.push(num);
            }

            setListActivatedObjectNumbers(tmp);
        
            if(currentId !== ""){
                let searchListObjectId = findObjectId(listObjReducer.listId, currentId);
                let listSearchId = [];
                for(let value of searchListObjectId){
                    listSearchId.push(value);
                }

                if(searchListObjectId.length === 0){
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

    let getListId = (list, parentId, depth) => {
        return list.map((item, key) => {
            let isAddAlarmProblems = false;
            let type = item.currentId.split("--");
            let objectElem = helpers.getLinkImageSTIXObject(type[0]);

            if(typeof objectElem === "undefined"){
                return "";
            }

            if(type[0] === "grouping" || type[0] === "note" || type[0] === "opinion"){
                console.log("11111 STIX object id:", item.currentId, " listObjReducer ", listObjReducer.list, " listObjReducer.list[item.currentId]: ", listObjReducer.list[item.currentId]);
                if(typeof listObjReducer.list[item.currentId] !== "undefined"){
                    if(listObjReducer.list[item.currentId].object_refs.length === 0){
                        isAddAlarmProblems = true;
                        console.log("22222 STIX object id:", item.currentId, " listObjReducer.list[item.currentId] ", listObjReducer.list[item.currentId].object_refs);
                    }
                }
            }

            let elemIsExist = listExtendedObject.find((item) => item.name === type[0]);
            let isExist = listExtendedObject.filter((item) => item.name === type[0]);
            let open = (typeof listActivatedObjectNumbers[depth] !== "undefined")? (listActivatedObjectNumbers[depth] === key): false;
            let listProperties = getListPropertiesExtendedObject(type[0]);

            //console.log("func 'getListId', parentId = ", item.currentId, " _________ listProperties _________:", listProperties);

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
                            width="30" 
                            height="30" />&nbsp;
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
                    <IconButton size="small" aria-label="delete" onClick={handlerDeleteObjRef.bind(null, parentId, item.currentId, depth, key)}>
                        <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                    </IconButton>
                    {isAddAlarmProblems? <ReportProblemOutlinedIcon style={{ color: orange[400] }} />: ""}
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

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с данным Отчётом</span></Col>
        </Row>
        <Row>
            <Col md={12} className="text-end">
                <Button
                    //size="small"
                    startIcon={<AddCircleOutlineIcon style={{ color: green[400] }} />}
                    onClick={() => {
                        let parentSTIXObject = stateReport;

                        if(majorParentId.split("--")[0] !== "report"){
                            parentSTIXObject = listObjReducer.list[majorParentId];
                        }

                        handlerShowModalWindowCreateNewSTIXObject(majorParentId, ["object_refs"], parentSTIXObject);
                    }}>
                    <span style={{ paddingTop: "3px" }}>прикрепить доп. объект</span>
                </Button>
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
    parentSTIXObject: PropTypes.object.isRequired,
    confirmDeleteLink: PropTypes.bool.isRequired,
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    handlerDialogConfirm: PropTypes.func.isRequired,
    handlerDeleteObjectRef: PropTypes.func.isRequired,
    handlerReportUpdateObjectRefs: PropTypes.func.isRequired, 
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
    handlerShowModalWindowCreateNewSTIXObject: PropTypes.func.isRequired,
};
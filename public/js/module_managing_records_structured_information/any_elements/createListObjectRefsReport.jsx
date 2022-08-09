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

    let newList = [];

    switch(action.type){
    case "updateList":

        //console.log("^^^^^^^^ func 'changeListId' action.type:", action.type, " action.data.parent: ", action.data.parent, " action.data.current: ", action.data.current);
        newList = action.data.current.concat(action.data.parent);

        //console.log("^^^^^^__^__^_^_^__^_^ newLIst: ", newList);

        //for(let i = 0; i < state.length; i++){
        for(let item of newList){
            let searchIndex = state.list.findIndex((elem) => elem.id === item.id);

            if(searchIndex === -1){

                //console.log(")))____)))))____ item if === -1:", item.id);

                state.list.push(item);

                continue;
            }

            state.list[searchIndex] = item;
        }

        //console.log("&&&&&_________&&&&&&&________ state.list: ", state.list);

        return {...state, list: state.list};
    case "updateListId":
        changeListIdResult = updateState(action.data.listObject, state.listId, 0);

        console.log("||||||||||||| loreducer, action.type: UPDATE ListId, action.data.listObject:", action.data.listObject, " changeListIdResult = ", changeListIdResult);

        return {...state, listId: changeListIdResult};
    case "changeListId":
        changeListIdResult = changeListId(action.data.parentSTIXObject, action.data.listModifySTIXObject, state.listId);

        console.log("||||||||||||+++++++++++++| loreducer, action.type: CHANGE ListId, action.data.parentSTIXObject: ", action.data.parentSTIXObject, ", action.data.listModifySTIXObject: ", action.data.listModifySTIXObject, " changeListIdResult = ", changeListIdResult);

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

    console.log("func '(((( --------- CreateListObjectRefsReport ------------ ))))' majorParentId: ", majorParentId, " stateReport: ", stateReport, " listNewOrModifySTIXObject: ", listNewOrModifySTIXObject);

    const [ listObjReducer, setListObjReducer ] = useReducer(loreducer, { /*list: {}*/ list: listNewOrModifySTIXObject, listId: objListBegin});
    const [ currentParentId, setCurrentParentId ] = useState("");
    const [ currentDeleteId, setCurrentDeleteId ] = useState("");
    const [ deleteIdDepthAndKey, setDeleteIdDepthAndKey ] = useState([]);
    const [ listActivatedObjectNumbers, setListActivatedObjectNumbers ] = React.useState([]);

    let listener = (data) => {

        console.log("+++++++++++++++ data.information.additional_parameters.transmitted_data:", data.information.additional_parameters.transmitted_data, " listObjReducer:", listObjReducer, " +++++++++++++++++");

        setListObjReducer({ type: "updateListId", data: { listObject: data.information.additional_parameters.transmitted_data }});
        setListObjReducer({ type: "updateList", data: { current: data.information.additional_parameters.transmitted_data, parent: stateReport }});
    };
    useEffect(() => {
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
        if(!confirmDeleteLink){
            return;
        }

        setListObjReducer({ type: "deleteIdFromListId", data: { 
            currentParentId: currentParentId, 
            currentDeleteId: currentDeleteId,
            deleteIdDepthAndKey: deleteIdDepthAndKey, 
        }});

        deleteIdFromSTIXObject();
        setListActivatedObjectNumbers([]);
        handlerDialogConfirm();
    }, [ confirmDeleteLink ]),
    /*useEffect(() => {

        console.log("++++ useEffect 11111111 setListObjReducer({ type: updateListId,  listNewOrModifySTIXObject = ", listNewOrModifySTIXObject, " stateReport:", stateReport, " parentSTIXObject:", parentSTIXObject);

        setListObjReducer({ type: "updateListId", data: { listObject: [ stateReport ]}});
        setListObjReducer({ type: "updateList", data: { current: [ stateReport ], parent: stateReport }});

        //setListObjReducer({ type: "changeListId", data: { parentSTIXObject: majorParentId, listModifySTIXObject: listNewOrModifySTIXObject }});
    }, [ stateReport ]),*/
    /*useEffect(() => {
        
        console.log("++++ useEffect 2222222 setListObjReducer({ type: changeListId }),  listNewOrModifySTIXObject:", listNewOrModifySTIXObject, " listObjReducer.listId:", listObjReducer.listId, " majorParentId:", majorParentId);
      
        setListObjReducer({ type: "changeListId", data: { parentSTIXObject: majorParentId, listModifySTIXObject: listNewOrModifySTIXObject }});
        //setListObjReducer({ type: "changeListId", data: { parentSTIXObject: parentSTIXObject, listModifySTIXObject: listNewOrModifySTIXObject }});
    }, [ majorParentId, stateReport, listNewOrModifySTIXObject ]);*/

    useEffect(() => {
        
        console.log("++++ useEffect 3333333333 setListObjReducer({ type: changeListId })"); 
        setListObjReducer({ type: "changeListId", data: { parentSTIXObject: majorParentId, listModifySTIXObject: listNewOrModifySTIXObject }});
    }, [ listNewOrModifySTIXObject.length ]);

    let deleteIdFromSTIXObject = () => {
        let parrentObject = lodash.cloneDeep(listObjReducer.list[currentParentId]);

        if(!parrentObject){
            return;
        }

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

    let getListId = (list, parentId, depth) => {
        return list.map((item, key) => {
            let isAddAlarmProblems = false;
            let type = item.currentId.split("--");
            let objectElem = helpers.getLinkImageSTIXObject(type[0]);

            if(typeof objectElem === "undefined"){
                return "";
            }

            if(type[0] === "grouping" || type[0] === "note" || type[0] === "opinion"){
                for(let v of listNewOrModifySTIXObject){
                    if((v.id === item.currentId) && ((typeof v.object_refs === "undefined") || (v.object_refs.length === 0))){
                        isAddAlarmProblems = true;
                    }
                }
            }

            let elemIsExist = listExtendedObject.find((item) => item.name === type[0]);
            let isExist = listExtendedObject.filter((item) => item.name === type[0]);
            let open = (typeof listActivatedObjectNumbers[depth] !== "undefined")? (listActivatedObjectNumbers[depth] === key): false;
            let listProperties = getListPropertiesExtendedObject(type[0]);

            let titleWarning = "Не заполнено ключевое поле, являющееся обязательным для данного объекта. Вероятнее всего отсутствуют ссылки на другой STIX объект, например в поле object_refs.";
            titleWarning += " При сохранении Отчета даны объект не будет добавлен в базу данных. Для того чтобы исправить это необходимо добавить в текущий объект ссылку на какой либо другой объект STIX.";

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
                            //parentSTIXObject = listNewOrModifySTIXObject[item.currentId];
                            }

                            handlerShowModalWindowCreateNewSTIXObject(item.currentId, listProperties, parentSTIXObject);
                        }}>
                            <AddCircleOutlineIcon style={{ color: green[400] }} />
                        </IconButton>: 
                        ""}
                    <IconButton size="small" aria-label="delete" onClick={handlerDeleteObjRef.bind(null, parentId, item.currentId, depth, key)}>
                        <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
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

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с данным Отчётом</span></Col>
        </Row>
        <Row>
            <Col md={12} className="text-end">
                <Button
                    startIcon={<AddCircleOutlineIcon style={{ color: green[400] }} />}
                    onClick={() => {
                        handlerShowModalWindowCreateNewSTIXObject(majorParentId, ["object_refs"], stateReport /*parentSTIXObject*/);
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
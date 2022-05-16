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
import AddIcon from "@material-ui/icons/Add";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { green, red } from "@material-ui/core/colors";
import lodash from "lodash";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";
import listExtendedObject from "../../common_helpers/listExtendedObject";

const loreducer = (state, action) => {
    let deleteIDFromState = (stateList, currentDepth) => {
        if(deleteIdDepthAndKey.length < 1){
            return stateList;
        }
    
        let [ depth, key ] = deleteIdDepthAndKey;
    
        //console.log("func 'deleteIDFromState' ======= deleteIdDepthAndKey: ", deleteIdDepthAndKey, " depth = ", depth, " key = ", key);
    
        for(let i = 0; i < stateList.length; i++){
            if((depth !== currentDepth) && (stateList[i].childId.length > 0)){
                //stateList[i].childId = deleteIDFromState(state[i].childId, currentDepth+1);
                stateList[i].childId = deleteIDFromState(listObjReducer.listId[i].childId, currentDepth+1);
    
                return stateList;
            }
    
            if((key === i) && (stateList[i].currentId === currentDeleteId)){
                let tmpd = stateList.splice(i, 1);
    
                //console.log("func 'deleteIDFromState' ======= DELETED currentId: ", tmpd);
    
                return stateList;
            }
        }
    
        //        return state;
        return stateList;
    };

    let updateState = (parentId, data, stateTmp) => {
        if(data.length === 0){
            return stateTmp;
        }
    
        let parentType = parentId.split("--")[0];
    
        for(let i = 0; i < stateTmp.length; i++){
            //            console.log("func 'updateState' parentId: ", parentId, " stateTmp[i].currentId: ", stateTmp[i].currentId, " parentId === stateTmp[i].currentId ", parentId === stateTmp[i].currentId);
                
            if((parentType !== "report") && (parentId !== stateTmp[i].currentId)){
                continue;
            }
    
            if(stateTmp[i].childId.length > 0){
                stateTmp[i].childId = updateState(parentId, data, stateTmp[i].childId);
            }
    
            console.log("func 'updateState' 11111 ADD NEW ELEMENT,  stateTmp[i].currentId: ", stateTmp[i].currentId);
    
            //
            for(let item of data){
                if(parentType === "report"){
                    let name = stateTmp[i].currentId.split("--")[0];
    
                    for(let elem of listExtendedObject){
                        if(elem.name !== name){
                            continue;
                        }
                        


                        for(let value of elem.listProperties){
                            if(!item[value] || stateTmp[i].currentId !== item.id){
                                continue;
                            }

                            if(Array.isArray(item[value])){
                                for(let ce of item[value]){
                                    if(stateTmp[i].childId.find((e) => e.currentId === ce)){
                                        continue;
                                    }           
    
                                    stateTmp[i].childId.push({ currentId: ce, childId: [] });

                                    console.log("func 'updateState' 10000 stateTmp[i].childId: ", stateTmp[i].childId);
                                }
                            } else {
                                if((item[value] !== null) && (item[value] !== "")){
                                    if(!stateTmp[i].childId.find((e) => e.currentId === item[value])){
                                        stateTmp[i].childId.push({ currentId: item[value], childId: [] });

                                        console.log("func 'updateState' 20000 stateTmp[i].childId: ", stateTmp[i].childId);
                                    }
                                }
                            }
                        }
                    }

                    //                    return stateTmp;
                } else {
                    if(parentId === stateTmp[i].currentId){
                        console.log("func 'updateState' &&&&&&&& parentId: (", parentId, "), stateTmp[i].currentId: ", stateTmp[i].currentId, " stateTmp[i].childId: ", stateTmp[i].childId);
    
                        continue;
                    }                    
                }


                /**
 * if(parentType === "report"){
                    let name = stateTmp[i].currentId.split("--")[0];
    
                    for(let elem of listExtendedObject){
                        if(elem.name !== name){
                            continue;
                        }
                        

                        
                        for(let value of elem.listProperties){
                            if(!item[value] || stateTmp[i].currentId !== item.id){
                                continue;
                            }

                            if(Array.isArray(item[value])){
                                for(let ce of item[value]){
                                    if(stateTmp[i].childId.find((e) => e.currentId === ce)){
                                        continue;
                                    }           
    
                                    stateTmp[i].childId.push({ currentId: ce, childId: [] });

                                    console.log("func 'updateState' 10000 stateTmp[i].childId: ", stateTmp[i].childId);
                                }
                            } else {
                                if((item[value] !== null) && (item[value] !== "")){
                                    if(!stateTmp[i].childId.find((e) => e.currentId === item[value])){
                                        stateTmp[i].childId.push({ currentId: item[value], childId: [] });

                                        console.log("func 'updateState' 20000 stateTmp[i].childId: ", stateTmp[i].childId);
                                    }
                                }
                            }
                        }
                    }

                    //                    return stateTmp;
                } else {
                    if(parentId === stateTmp[i].currentId){
                        console.log("func 'updateState' &&&&&&&& parentId: (", parentId, "), stateTmp[i].currentId: ", stateTmp[i].currentId, " stateTmp[i].childId: ", stateTmp[i].childId);
    
                        continue;
                    }                    
                }
 */


                /*if(parentId !== stateTmp[i].currentId){
                    console.log("func 'updateState' ERROR item.id !== stateTmp[i].currentId: ", item.id, " !== ", stateTmp[i].currentId, " parentId: (", parentId, ")");

                    continue;
                }

                /*
                let name = stateTmp[i].currentId.split("--")[0];
    
                for(let elem of listExtendedObject){
                    if(elem.name !== name){
                        continue;
                    }
                        
                    //                    elem.listProperties.forEach((value) => {
                    for(let value of elem.listProperties){
                        if(Array.isArray(item[value])){
                            for(let ce of item[value]){
                                if(stateTmp[i].childId.find((e) => e.currentId === ce)){
                                    continue;
                                }           
    
                                stateTmp[i].childId.push({ currentId: ce, childId: [] });

                                console.log("func 'updateState' 10000 stateTmp[i].childId: ", stateTmp[i].childId);
                            }
                        } else {
                            if((item[value] !== null) && (item[value] !== "")){
                                if(!stateTmp[i].childId.find((e) => e.currentId === item[value])){
                                    stateTmp[i].childId.push({ currentId: item[value], childId: [] });

                                    console.log("func 'updateState' 20000 stateTmp[i].childId: ", stateTmp[i].childId);
                                }
                            }
                        }
                    }//);
                }*/
            }
        }
    
        return stateTmp;
    };

    switch(action.type){
    case "updateList":
        state.list[action.data.parent.id] = action.data.parent;

        //        console.log("loreducer, 'updateList' - action.data.current:", action.data.current);

        for(let item of action.data.current){
            state.list[item.id] = item; 
        }

        return {...state};
    case "updateListId":
        //{ parentObjectId: data.parentObjectId, listObject: data.information.additional_parameters.transmitted_data }
        console.log("loreducer, 'updateListId' - action.data:", action.data);

        //        state.listId = action.data;

        return {...state, listId: updateState(action.data.parentObjectId, action.data.listObject, state.listId)};

        //return {...state, listId: action.data};
        //case "deleteElementListId":


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
        showReportId,
        confirmDeleteLink,
        handlerDialogConfirm,
        handlerDeleteObjectRef,
        handlerReportUpdateObjectRefs,
        handlerShowObjectRefSTIXObject,
        handlerChangeCurrentSTIXObject,
    } = props;

    let objListBegin = stateReport.object_refs.map((item) => {
        return { currentId: item, childId: [] };
    });

    console.log("func 'CreateListObjectRefsReport' ---------------");
    console.log("stateReport: ", stateReport, " objListBegin: ", objListBegin);
    console.log("confirmDeleteLink = ", confirmDeleteLink);

    //const [ state, setState ] = useState(objListBegin);
    const [ listObjReducer, setListObjReducer ] = useReducer(loreducer, { list: {}, listId: objListBegin});
    const [ currentParentId, setCurrentParentId ] = useState("");
    const [ currentDeleteId, setCurrentDeleteId ] = useState("");
    const [ deleteIdDepthAndKey, setDeleteIdDepthAndKey ] = useState([]);
    const [ listActivatedObjectNumbers, setListActivatedObjectNumbers ] = React.useState([]);

    let listener = (data) => {

        //
        // Не пойму, но похоже что после удаления из listObjReducer.listId какого либо элемента
        // при изменении setListObjReducer в следствии получения новых данных этот элемент остается на месте,
        // хотя не отображается в списке на странице
        // 
        //

        console.log("LISTENER SEARCH SEND REQUEST,  data: ", data);
        console.log("LISTENER SEARCH SEND REQUEST, stateTmp BEFORE: ", listObjReducer);
        console.log("data.parentObjectId: ", data.parentObjectId, ", data.information.additional_parameters.transmitted_data: ", data.information.additional_parameters.transmitted_data);

        setListObjReducer({ 
            type: "updateListId", 
            data: { 
                parentObjectId: data.parentObjectId, 
                listObject: data.information.additional_parameters.transmitted_data,
                //listActivatedObjectNumbers: listActivatedObjectNumbers,
            }});
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
    //    
    //        ЭТО ТОЛЬКО ВЕРЕМЕННО закоменчено
    //
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
        let stateTmp = lodash.cloneDeep(listObjReducer);
        let newState = deleteIDFromState(stateTmp.listId, 0);

        console.log("REsult delete func 'deleteIDFromState' = ", newState);

        setListObjReducer({ type: "deleteElementListId", data: newState });
        deleteIdFromSTIXObject();
        handlerDialogConfirm();

        //        console.log("stateTmp = ", stateTmp);
    }, [confirmDeleteLink]);

    let deleteIDFromState = (stateList, currentDepth) => {
        if(deleteIdDepthAndKey.length < 1){
            return stateList;
        }

        let [ depth, key ] = deleteIdDepthAndKey;

        //console.log("func 'deleteIDFromState' ======= deleteIdDepthAndKey: ", deleteIdDepthAndKey, " depth = ", depth, " key = ", key);

        for(let i = 0; i < stateList.length; i++){
            if((depth !== currentDepth) && (stateList[i].childId.length > 0)){
                //stateList[i].childId = deleteIDFromState(state[i].childId, currentDepth+1);
                stateList[i].childId = deleteIDFromState(listObjReducer.listId[i].childId, currentDepth+1);

                return stateList;
            }

            if((key === i) && (stateList[i].currentId === currentDeleteId)){
                let tmpd = stateList.splice(i, 1);

                //console.log("func 'deleteIDFromState' ======= DELETED currentId: ", tmpd);

                return stateList;
            }
        }

        //        return state;
        return stateList;
    };
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
        

        //socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ parrentObject ] });
    };
    
    const findObjectId = (list, id) => {
        for(let i = 0; i < list.length; i++){
            if(list[i].currentId === id){
                return list[i];
            }

            if(list[i].childId.length > 0){
                findObjectId(list[i], id);
            }
        }

        return [];
    };
    const handleClick = (id, num, currentId, depth) => { 
        
        console.log("func 'handleClick', START... num:", num, " currentId:", currentId, " depth:", depth);
        
        let tmp = listActivatedObjectNumbers.slice();
        
        console.log("func 'handleClick', tmp Before = ", tmp);

        if(listActivatedObjectNumbers[depth] && listActivatedObjectNumbers[depth] === num){        
            tmp.splice(depth, 10);
        } else if(listActivatedObjectNumbers[depth] && listActivatedObjectNumbers[depth] !== num && depth === 0) {
            tmp = [];
            tmp.push(num);
        } else {        
            tmp.push(num);
        }

        console.log("func 'handleClick', tmp After = ", tmp);

        setListActivatedObjectNumbers(tmp);
        
        if(currentId !== ""){
            let searchListObjectId = findObjectId(listObjReducer.listId, currentId);
            let listId = [];

            console.log("func 'handleClick', searchListObjectId = ", searchListObjectId);

            if(!Array.isArray(searchListObjectId.childId)){
                return;
            }

            searchListObjectId.childId.forEach((item) => {
                listId.push(item.currentId);
            });

            console.log("func 'handleClick', send REGUEST 'isems-mrsi ui request: send search request, get STIX object for list id' searchListObjectId: ", listId, " parentObjectId: ", currentId);

            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for list id", { 
                arguments: { 
                    searchListObjectId: listId,
                    parentObjectId: currentId,
                }});
        }
    };

    const handlerDeleteObjRef = (parentId, currentId, depth, key) => {

        console.log("func handlerDeleteObjectRef, parentId:", parentId, " currentId:", currentId);
        console.log("STATE:", listObjReducer.listId);

        setCurrentParentId(parentId);
        setCurrentDeleteId(currentId);
        setDeleteIdDepthAndKey([ depth, key ]);

        handlerDeleteObjectRef(parentId, currentId);                
    };

    let getListId = (list, parentId, depth) => {

        console.log("func 'getListId' depth:", depth, " list: ", list);

        return list.map((item, key) => {
            let type = item.currentId.split("--");
            let objectElem = helpers.getLinkImageSTIXObject(type[0]);

            if(typeof objectElem === "undefined"){
                return "";
            }

            let elemIsExist = listExtendedObject.find((item) => item.name === type[0]);
            let isExist = listExtendedObject.filter((item) => item.name === type[0]);
            let open = listActivatedObjectNumbers[depth] && (listActivatedObjectNumbers[depth] === key);

            return (<React.Fragment key={`rf_${key}`}>
                <ListItem 
                    button 
                    key={`key_list_item_button_ref_${key}`} 
                    onClick={() => {

                        console.log("onClick OPEN LIST, key = ", key, " depth = ", depth);

                        if(!elemIsExist){
                            return;
                        }

                        handleClick.call(null, item.currentId, key, isExist.length > 0? item.currentId: "", depth);
                    }}
                >
                    <Button onClick={handlerShowObjectRefSTIXObject.bind(null, item.currentId)}>
                        <img 
                            key={`key_object_ref_type_${key}`} 
                            src={`/images/stix_object/${objectElem.link}`} 
                            width="35" 
                            height="35" />&nbsp;
                        <Tooltip title={objectElem.description} key={`key_tooltip_object_ref_${key}`}>
                            <ListItemText primary={item.currentId}/>
                        </Tooltip>
                    </Button>
                    <IconButton aria-label="delete" onClick={handlerDeleteObjRef.bind(null, parentId, item.currentId, depth, key)}>
                        <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                    </IconButton>
                    {((item.childId.length > 0) || ((isExist.length > 0)))?
                        (listActivatedObjectNumbers[depth] && (listActivatedObjectNumbers[depth] === key)? 
                            <ExpandLess />: 
                            <ExpandMore />):
                        ""}
                </ListItem>
                {item.childId.length > 0 && (listActivatedObjectNumbers[depth] && (listActivatedObjectNumbers[depth] === key))?
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

    console.log("func 'CreateListObjectRefsReport' --------------- listObjReducer.listId: ", listObjReducer.listId);

    return (<React.Fragment>
        <Row className="mt-4">
            <Col md={12}><span className="text-muted">Идентификаторы объектов связанных с данным Отчётом</span></Col>
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
                        {getListId(listObjReducer.listId, showReportId, 0)}
                    </List>
                }
            </Col>
        </Row>
        <Row>
            <Col md={12} className="text-end">
                <Button
                    size="small"
                    startIcon={<AddIcon style={{ color: green[500] }} />}
                    onClick={handlerChangeCurrentSTIXObject}>
                        прикрепить дополнительный объект
                </Button>
            </Col>
        </Row>
    </React.Fragment>);
}

CreateListObjectRefsReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    stateReport: PropTypes.object.isRequired,
    showReportId: PropTypes.string.isRequired,
    confirmDeleteLink: PropTypes.bool.isRequired,
    handlerDialogConfirm: PropTypes.func.isRequired,
    handlerDeleteObjectRef: PropTypes.func.isRequired,
    handlerReportUpdateObjectRefs: PropTypes.func.isRequired, 
    handlerShowObjectRefSTIXObject: PropTypes.func.isRequired,
    handlerChangeCurrentSTIXObject: PropTypes.func.isRequired,
};
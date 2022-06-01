import React, { useState, useEffect, useReducer } from "react";
import {
    //TypeIcon,
    ImageList,
    Typography,
    ThemeProvider, 
    CssBaseline,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { makeStyles } from "@material-ui/core/styles";
//import { ThemeProvider, CssBaseline } from "@mui/material";
import { DndProvider } from "react-dnd";
import {
    Tree,
    MultiBackend,
    getBackendOptions
} from "@minoru/react-dnd-treeview";
//import { theme } from "./theme";
//import styles from "./App.module.css";

import { createTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers.js";
import listExtendedObject from "../../common_helpers/listExtendedObject";

const useStyles = makeStyles({
    app: {
        height: "100%",
    },
    treeRoot: {
        height: "100%",
    },
    draggingSource: {
        opacity: ".3",
    },
    dropTarget: {
        backgroundColor: "#e8f0fe",
    },
    root: {
        alignItems: "center",
        display: "grid",
        gridTemplateColumns: "auto auto 1fr auto",
        height: "32px",
        paddingInlineEnd: "8px",
    },
    expandIconWrapper: {
        alignItems: "center",
        fontSize: 0,
        cursor: "pointer",
        display: "flex",
        height: "24px",
        justifyContent: "center",
        width: "24px",
        transition: "transform linear .1s",
        //transform: rotate("0deg"),
    },
    expandIconWrapperIsOpen: {
        //transform: rotate("90deg"),
    },
    labelGridItem: {
        paddingInlineStart: "8px",
    },
});

export const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*": {
                    margin: 0,
                    padding: 0
                },
                "html, body, #root": {
                    height: "100%"
                },
                ul: {
                    listStyle: "none"
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: { verticalAlign: "middle" }
            }
        }
    }
});

function CustomNode(props){
    const classes = useStyles();

    const { droppable, data } = props.node;
    const indent = props.depth * 24;
  
    const handleToggle = (e) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };
  
    return (
        <div
            className={classes.treeViewRoot}
            //className={`tree-node ${styles.treeViewRoot}`}
            style={{ paddingInlineStart: indent }}
        >
            <div
                /*className={`${styles.treeViewExpandIconWrapper} ${
                    props.isOpen ? styles.isOpen : ""
                }`}*/
                className={`${classes.treeViewExpandIconWrapper} ${props.isOpen ? classes.isOpen : ""}`}
            >
                {props.node.droppable && (
                    <div onClick={handleToggle}>
                        <ArrowRightIcon />
                    </div>
                )}
            </div>
            <div>
                
                <ImageList droppable={droppable} fileType={data.fileType} />
                {/*<TypeIcon droppable={droppable} fileType={data?.fileType} />*/}
            </div>
            <div /* className={styles.treeViewLabelGridItem} */ className={classes.treeViewLabelGridItem}>
                <Typography variant="body2">{props.node.text}</Typography>
            </div>
        </div>
    );
}
  
CustomNode.propTypes = {
    node: PropTypes.object.isRequired,
    depth: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

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

            //console.log("func 'updateState' 10000, stateTmp[i].currentId ", stateTmp[i].currentId, " stateTmp[i].childId: ", stateTmp[i].childId);
        }
    } else {
        if((listData !== null) && (listData !== "")){
            if(!stateTmp.childId.find((e) => e.currentId === listData)){
                newArr.push({ currentId: listData, childId: [] });

                //console.log("func 'updateState' 20000, stateTmp[i].currentId ", stateTmp[i].currentId, " stateTmp[i].childId: ", stateTmp[i].childId);
            }
        }
    }

    return newArr;
};

const loreducer = (state, action) => {
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

    let updateState = (data, stateTmp) => {
        if(data.length === 0){
            return stateTmp;
        }

        for(let i = 0; i < stateTmp.length; i++){
            for(let item of data){
                if(stateTmp[i].currentId !== item.id){
                    continue;
                }

                let name = stateTmp[i].currentId.split("--")[0];
                let listProperties = getListPropertiesExtendedObject(name);

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
                stateTmp[i].childId = updateState(data, stateTmp[i].childId);
            }
        }

        return stateTmp;
    };

    switch(action.type){
    case "updateList":
        state.list[action.data.parent.id] = action.data.parent;

        for(let item of action.data.current){
            state.list[item.id] = item; 
        }

        return {...state};
    case "updateListId":
        return {...state, listId: updateState(action.data.listObject, state.listId)};
    case "deleteIdFromListId":
        return {...state, listId: deleteIdFromListId(state.listId, action.data.currentParentId, action.data.currentDeleteId, action.data.deleteIdDepthAndKey, 0)};
    case "getObject":

        break;
    }
};

export default function CreateListObjectRefsReportTreeView(props){
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

    const classes = useStyles();
    let objListBegin = stateReport.object_refs.map((item) => {
        return { currentId: item, childId: [] };
    });

    console.log("func 'CreateListObjectRefsReportTreeViwe' ---------------");

    const [ listObjReducer, setListObjReducer ] = useReducer(loreducer, { list: {}, listId: objListBegin});

    console.log("func 'CreateListObjectRefsReportTreeViwe', listObjReducer: ", listObjReducer, " =============");

    const [treeData, setTreeData] = useState([
        {
            "id": 1,
            "parent": 0,
            "droppable": "true",
            "text": "Folder 1"
        },
        {
            "id": 2,
            "parent": 1,
            "droppable": "false",
            "text": "File 1-1",
            "data": {
                "fileType": "csv",
                "fileSize": "0.5MB"
            }
        },
        {
            "id": 3,
            "parent": 1,
            "droppable": "false",
            "text": "File 1-2",
            "data": {
                "fileType": "text",
                "fileSize": "4.8MB"
            }
        },
        {
            "id": 4,
            "parent": 0,
            "droppable": "true",
            "text": "Folder 2"
        },
        {
            "id": 5,
            "parent": 4,
            "droppable": "true",
            "text": "Folder 2-1"
        },
        {
            "id": 6,
            "parent": 5,
            "droppable": "false",
            "text": "File 2-1-1",
            "data": {
                "fileType": "image",
                "fileSize": "2.1MB"
            }
        },
        {
            "id": 7,
            "parent": 0,
            "droppable": "false",
            "text": "File 3",
            "data": {
                "fileType": "image",
                "fileSize": "0.8MB"
            }
        }
    ]);
    const handleDrop = (newTree) => setTreeData(newTree);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <div className={classes.app}>
                    <Tree
                        tree={treeData}
                        rootId={0}
                        render={(node, { depth, isOpen, onToggle }) => (
                            <CustomNode
                                node={node}
                                depth={depth}
                                isOpen={isOpen}
                                onToggle={onToggle}
                            />
                        )}
                        onDrop={handleDrop}
                        classes={{
                            root: classes.treeRoot,
                            draggingSource: classes.draggingSource,
                            dropTarget: classes.dropTarget
                        }}
                    />
                </div>
            </DndProvider>
        </ThemeProvider>
    );
}

CreateListObjectRefsReportTreeView.propTypes = {
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
import React, { useState, useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import PropTypes from "prop-types";

import reducerGroupingSTIXObject from "../reducer_handlers/reducerGroupingSTIXObject.js";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateGroupingPatternElements from "../type_elements_stix/groupingPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

function reducerShowRef(state, action){
    switch(action.type){
    case "addObject":
        /*if(action.data.date && action.data.date){
                action.data.date = new Date(Date.parse(action.data.date)).toISOString();
            }*/

        return {...state, obj: action.data};
    case "addId":
        return {...state, id: action.data};
    }
}

export default function CreateDialogContentGroupingSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentIdSTIXObject,
        listNewOrModifySTIXObject,
        currentAdditionalIdSTIXObject,
        handlerDialogClose,
    } = props;

    let [ buttonIsDisabled, setButtonIsDisabled ] = React.useState(true);
    let [ buttonSaveChangeTrigger, setButtonSaveChangeTrigger ] = React.useState(false);

    const handlerButtonIsDisabled = (valueButton) => {
            setButtonIsDisabled(valueButton);
        },
        handlerButtonSaveChangeTrigger = () => {
            setButtonSaveChangeTrigger((prevState) => !prevState);
        };

    return (<React.Fragment>
        <DialogContent>
            <Grid container direction="row" spacing={3}>
                <CreateMajorContent 
                    socketIo={socketIo}
                    parentIdSTIXObject={parentIdSTIXObject}
                    currentIdSTIXObject={currentAdditionalIdSTIXObject}
                    listNewOrModifySTIXObject={listNewOrModifySTIXObject}
                    buttonSaveChangeTrigger={buttonSaveChangeTrigger}
                    isNotDisabled={isNotDisabled}
                    handlerDialogClose={handlerDialogClose}
                    handlerButtonIsDisabled={handlerButtonIsDisabled}
                    handlerButtonSaveChangeTrigger={handlerButtonSaveChangeTrigger}
                />

                <Grid item container md={4} style={{ display: "block" }}>
                    <CreateListPreviousStateSTIX 
                        socketIo={socketIo} 
                        searchObjectId={currentAdditionalIdSTIXObject} 
                    />
                </Grid>
            </Grid>            
        </DialogContent>
        <DialogActions>
            <Button onClick={handlerDialogClose} color="primary">закрыть</Button>            
            {isNotDisabled && <Button
                disabled={buttonIsDisabled} 
                onClick={() => setButtonSaveChangeTrigger(true)}
                color="primary">
                сохранить
            </Button>}
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentGroupingSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

function CreateMajorContent(props){
    let {
        socketIo,
        parentIdSTIXObject,
        currentIdSTIXObject,
        listNewOrModifySTIXObject,
        buttonSaveChangeTrigger,
        isNotDisabled,
        handlerDialogClose,
        handlerButtonIsDisabled,
        handlerButtonSaveChangeTrigger,
    } = props;

    let beginDataObject = {};
    for(let i = 0; i < listNewOrModifySTIXObject.length; i++){
        if(listNewOrModifySTIXObject[i].id === currentIdSTIXObject){
            beginDataObject = listNewOrModifySTIXObject[i];
        }
    }

    console.log("func 'CreateDialogContentGroupingSTIXObject', START...");

    const [ state, dispatch ] = useReducer(reducerGroupingSTIXObject, { mainObj: beginDataObject, refObj: {}, refId: "" });

    //const [ state, dispatch ] = useReducer(reducerGroupingSTIXObject, beginDataObject);
    //const [ stateShowRef, dispatchShowRef ] = useReducer(reducerShowRef, { id: "", obj: {} });

    const listener = (data) => {
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

        console.log("+++++++ =++++++++ state.mainObj:", state.mainObj);

        for(let obj of data.information.additional_parameters.transmitted_data){
            console.log("func 'CreateDialogContentGroupingSTIXObject', LISTENER OBJ:", obj, " state.refId: ", state.refId, " ======== state.refObj:", state.refObj);
            console.log("func 'CreateDialogContentGroupingSTIXObject', LISTENER state.mainObj:", state.mainObj);

            if(state.type !== obj.type){
                console.log("func 'CreateDialogContentGroupingSTIXObject', LISTENER ADD OBJECT:", obj);

                dispatch({ type: "updateRefObj", data: obj });

                continue;
            }

            console.log("func 'CreateDialogContentGroupingSTIXObject', LISTENER NEW ALL:", obj);

            dispatch({ type: "newAll", data: obj });
        }
    };
    useEffect(() => {
        socketIo.on("isems-mrsi response ui: send search request, get STIX object for id", listener);

        return () => {
            socketIo.off("isems-mrsi response ui: send search request, get STIX object for id", listener);
            dispatch({ type: "newAll", data: {} });
        };
    }, []);
    useEffect(() => {
        if(currentIdSTIXObject !== ""){
            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: parentIdSTIXObject,
            }});
        }
    }, [ socketIo, currentIdSTIXObject, parentIdSTIXObject ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state.mainObj ] });
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    }, [ buttonSaveChangeTrigger, handlerButtonSaveChangeTrigger ]);

    const checkRequiredValue = (content, objectRefs) => {
        if(content !== "" && objectRefs.length > 0){
            return true;
        }

        return false;
    };

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});
                
                if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }

                break;
            case "hashes_delete":
                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
               
                if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }

                break;
            default:
                dispatch({ type: "updateExternalReferences", data: obj.data });

                if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }
            }
        }
    
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });

            if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                handlerButtonIsDisabled(false);
            } else {
                handlerButtonIsDisabled(true);
            }
        }
    
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });

            if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                handlerButtonIsDisabled(false);
            } else {
                handlerButtonIsDisabled(true);
            }
        }
    };
    
    const handlerButtonShowLink = (refId) => {
        console.log("_____________________ func 'handlerButtonShowLink', refId:'", refId, "'________________");
        
        //handlerCurrentRefId(refId);
        //dispatchShowRef({ type: "addId", data: refId });
        dispatch({ type: "updateRefId", data: refId });
        dispatch({ type: "updateRefObj", data: {} });
        //setShowRefId(refId);

        //if(stateShowRef.id === refId){     
        if(state.refId === refId){  
            return;
        }

        console.log("_____________________ func 'handlerButtonShowLink', refId:'", refId, "'_______ SEND ---> _________");

        socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
            searchObjectId: refId,
            parentObjectId: state.mainObj.id,
        }});
    };

    return (<Grid item container md={8}>
        <Grid container direction="row" className="pt-3">
            <CreateGroupingPatternElements 
                socketIo={socketIo}
                isDisabled={false}
                //showRefElement={stateShowRef}
                showRefId={state.refId}
                showRefObj={state.refObj}
                campaignPatterElement={state.mainObj}
                handlerName={() => {}}
                handlerClick={(parentId, refId) => {
                    console.log("======= PARENTID: ", parentId, " REFID: ", refId, " =======");

                    socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                        searchObjectId: refId,
                        parentObjectId: parentId,
                    }});
                }}
                handlerContext={(e) => { 
                    dispatch({ type: "updateContex", data: e.target.value });

                    if(checkRequiredValue(e.target.value, state.mainObj.object_refs)){
                        handlerButtonIsDisabled(false);
                    } else {
                        handlerButtonIsDisabled(true);
                    }
                }}
                handlerDescription={(e) => { 
                    dispatch({ type: "updateDescription", data: e.target.value }); 

                    if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                        handlerButtonIsDisabled(false);
                    } else {
                        handlerButtonIsDisabled(true);
                    }
                }}
                handlerButtonShowLink={handlerButtonShowLink}
            />
        </Grid> 

        <CreateElementAdditionalTechnicalInformationDO
            objectId={currentIdSTIXObject}
            reportInfo={state.mainObj}
            isNotDisabled={isNotDisabled}
            handlerName={() => {}}
            handlerElementConfidence={(e) => { 
                dispatch({ type: "updateConfidence", data: e }); 
                
                if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                } 
            }}
            handlerElementDefanged={(e) => { 
                dispatch({ type: "updateDefanged", data: e }); 

                if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }
            }}
            handlerElementLabels={(e) => { 
                dispatch({ type: "updateLabels", data: e }); 
                if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }
            }}
            handlerElementDelete={(e) => { 
                dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); 
                if(checkRequiredValue(state.mainObj.context, state.mainObj.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                } 
            }}
            handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo} 
        />
    </Grid>);
}

CreateMajorContent.propTypes = {
    socketIo: PropTypes.object.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

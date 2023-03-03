import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";

//import reducerEmailMessagePatternSTIXObjects from "../reducer_handlers/reducerEmailMessageSTIXObject.js";
import reducerNetworkTrafficPatternSTIXObjects from "../reducer_handlers/reducerNetworkTrafficSTIXObject.js";
import CreateNetworkTrafficPatternElements from "../type_elements_stix/networkTrafficPatternElements.jsx";
//import CreateEmailMessagePatternElements from "../type_elements_stix/emailMessagePatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

function isExistTransmittedData(data){
    if((data.information === null) || (typeof data.information === "undefined")){
        return false;
    }

    if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
        return false;
    }

    if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
        return false;
    }

    if(data.information.additional_parameters.transmitted_data.length === 0){
        return false;
    }

    return true;
}

function reducerShowRef(state, action){
    switch(action.type){
    case "addObject":
        return {...state, obj: action.data};
    case "addId":
        return {...state, id: action.data};
    case "cleanObj":
        return {...state, obj: {}};
    }
}

export default function CreateDialogContentNetworkTrafficSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentIdSTIXObject,
        currentAdditionalIdSTIXObject,
        handlerDialogClose,
    } = props;

    let [ buttonIsDisabled, setButtonIsDisabled ] = React.useState(true);
    let [ buttonSaveChangeTrigger, setButtonSaveChangeTrigger ] = React.useState(false);

    const handlerButtonIsDisabled = (status) => {
            setButtonIsDisabled(status);
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
                    buttonSaveChangeTrigger={buttonSaveChangeTrigger}
                    isNotDisabled={isNotDisabled}
                    handlerDialogClose={handlerDialogClose}
                    handlerButtonIsDisabled={handlerButtonIsDisabled}
                    handlerButtonSaveChangeTrigger={handlerButtonSaveChangeTrigger}
                />
            </Grid>            
        </DialogContent>
        <DialogActions>
            <Button 
                onClick={handlerDialogClose} 
                style={{ color: blue[500] }}
                color="primary">закрыть</Button>            
            {isNotDisabled && <Button
                disabled={buttonIsDisabled} 
                onClick={() => setButtonSaveChangeTrigger(true)}
                style={{ color: blue[500] }} 
                color="primary">
                    сохранить
            </Button>}
        </DialogActions>
    </React.Fragment>);
}
     
CreateDialogContentNetworkTrafficSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

function CreateMajorContent(props){
    let {
        socketIo,
        parentIdSTIXObject,
        currentIdSTIXObject,
        buttonSaveChangeTrigger,
        isNotDisabled,
        handlerDialogClose,
        handlerButtonIsDisabled,
        handlerButtonSaveChangeTrigger,
    } = props;

    const [ state, dispatch ] = useReducer(reducerNetworkTrafficPatternSTIXObjects, {});
    const [ stateShowRef, dispatchShowRef ] = useReducer(reducerShowRef, { id: "", obj: {} });
    
    console.log("____ func 'CreateDialogContentNetworkTrafficSTIXObject', state network traffic: ", state, " ____");

    useEffect(() => {
        socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
            if(!isExistTransmittedData(data)){
                return;
            }

            for(let obj of data.information.additional_parameters.transmitted_data){     
                dispatch({ type: "newAll", data: obj });
            }
        });

        if(currentIdSTIXObject !== ""){
            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: parentIdSTIXObject,
            }});
        }

        return () => {
            dispatch({ type: "newAll", data: {} });
        };
    }, [ socketIo, currentIdSTIXObject, parentIdSTIXObject ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
            
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonSaveChangeTrigger, handlerButtonSaveChangeTrigger ]);

    const handlerCheckStateButtonIsDisabled = () => {
        handlerButtonIsDisabled(false);
    };

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {    
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    };

    return (<Grid item container md={12}>
        <Grid container direction="row" className="pt-3">
            <CreateNetworkTrafficPatternElements 
                isDisabled={false}
                showRefElement={stateShowRef}
                campaignPatterElement={state}
                handlerClick={(parentId, refId) => {
                    console.log(".__________. func 'handlerClick' parentId:", parentId, " refId:", refId, ".______.");

                    /**
                     * 
                     * Сделать что бы был просмотр ссылки во вложенном объекте 
                     *  Ссылка на другой STIX объект типа Сетевой трафик или
                     *  Список ссылок на другие STIX объекты типа Сетевой трафик
                     *  где в этих объектах есть свойства src_ref и dst_ref ссылающиеся на
                     *  объекты типа ipv4-addr, ipv6-addr, mac, domain-name
                     * 
                     * Сделать модальное окно для создания объека networkTraffic
                     * 
                     */

                    socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
                            
                        console.log(".......... func 'handlerClick' data:", data, "............");


                        if(!isExistTransmittedData(data)){
                            return;
                        }

                        for(let obj of data.information.additional_parameters.transmitted_data){
                            
                            console.log(".......... func 'handlerClick' parentId:", parentId, " refId:", refId, " obj:", obj, "............");
                            
                            //updateRefObj(parentId, obj);                           
                        }
                    });

                    socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                        searchObjectId: refId,
                        parentObjectId: parentId,
                    }});
                }}            
                handlerEndDate={(e) => { dispatch({ type: "updateEndDate", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerSrcPort={(e) => { dispatch({ type: "updateSrcPort", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerDstPort={(e) => { dispatch({ type: "updateDstPort", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerIsActive={(e) => { dispatch({ type: "updateIsActive", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerStartDate={(e) => { dispatch({ type: "updateStartDate", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerDstPackets={(e) => { dispatch({ type: "updateDstPackets", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSrcPackets={(e) => { dispatch({ type: "updateSrcPackets", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerDstByteCount={(e) => { dispatch({ type: "updateDstByteCount", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSrcByteCount={(e) => { dispatch({ type: "updateSrcByteCount", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerListProtocols={(e) => { dispatch({ type: "updateProtocols", data: e }); handlerCheckStateButtonIsDisabled(); }}
                // это обработчик для ссылок на объекты содержащие ТОЛЬКО одну строчку, подходит только для свойств src_ref и dst_ref которые после 
                //просмотра будет содержать только свойство value STIX объектов: ipv4-addr, ipv6-addr, mac-addr, domain-name
                handlerClickShortRef={(refId, propertyName) => {
                    console.log("func 'CreateDialogContentNetworkTrafficSTIXObject', function 'handlerClickShortRef', ref = ", refId, " propertyName = ", propertyName);

                    socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
                        if(!isExistTransmittedData(data)){
                            return;
                        }

                        for(let obj of data.information.additional_parameters.transmitted_data){ 
                            console.log("func 'CreateDialogContentNetworkTrafficSTIXObject', function 'handlerClickShortRef', obj = ", obj, " propertyName = ", propertyName);

                            if(obj.type === "ipv4-addr" || obj.type === "ipv6-addr" || obj.type === "mac-addr" || obj.type === "domain-name"){
                                dispatch({ type: "addShortRef", data: { value: obj.value, propName: propertyName } });        
                            }
                        }
                    });

                    socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                        searchObjectId: refId,
                        parentObjectId: state.id,
                    }});
                }}
                // это обработчик для ссылок на объекты содержащие полную информацию (для визуализации используется CreateShortInformationSTIXObject), 
                //подходит для свойств src_payload_ref и dst_payload_ref содержащие ссылки на STIX объект artifact 
                handlerButtonShowLink={(refId) => {
                    console.log("func 'CreateDialogContentNetworkTrafficSTIXObject', function 'handlerButtonShowLink'");

                    dispatchShowRef({ type: "addId", data: refId });
                    dispatchShowRef({ type: "cleanObj", data: {} });
    
                    socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
                        if(!isExistTransmittedData(data)){
                            return;
                        }

                        for(let obj of data.information.additional_parameters.transmitted_data){ 
                            dispatchShowRef({ type: "addObject", data: obj });        
                        }
                    });

                    socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                        searchObjectId: refId,
                        parentObjectId: state.id,
                    }});
                }}
            />
        </Grid>

        <CreateElementAdditionalTechnicalInformationCO 
            objectId={currentIdSTIXObject}
            reportInfo={state}
            isNotDisabled={isNotDisabled}
            handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerCheckStateButtonIsDisabled(); }}
            handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerCheckStateButtonIsDisabled(); }}
            handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}             
        />
    </Grid>);
}

CreateMajorContent.propTypes = {
    socketIo: PropTypes.object.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

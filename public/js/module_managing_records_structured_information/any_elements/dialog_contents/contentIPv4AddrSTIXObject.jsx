import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";
import validatorjs from "validatorjs";

import reducerIPv4AddrSTIXObject from "../reducer_handlers/reducerIPv4AddrSTIXObject.js";
import CreateIpv4AddrPatternElements from "../type_elements_stix/ipv4AddrPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

const regPattern = /(([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2})/;

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
    case "addId":
        return {...state, id: action.data};
    case "addObject":
        if(action.data.type === "directory" && action.data.contains_refs && Array.isArray(action.data.contains_refs)){
            action.data.refs = action.data.contains_refs.map((item) => {
                return { id: item, value: item };
            });
        }

        state.obj = action.data;

        return {...state};
    case "cleanObj":
        return {...state, obj: {}};
    }
}

export default function CreateDialogContentIPv4AddrSTIXObject(props){
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
                    listNewOrModifySTIXObject={listNewOrModifySTIXObject}
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

CreateDialogContentIPv4AddrSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerIPv4AddrSTIXObject, beginDataObject);
    const [ stateShowRef, dispatchShowRef ] = useReducer(reducerShowRef, { id: "", obj: {} });

    useEffect(() => {
        let listener = (data) => {
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
                dispatch({ type: "newAll", data: obj });
            }
        };

        if(currentIdSTIXObject !== ""){
            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: parentIdSTIXObject,
            }});
        }

        socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", listener);

        return () => {
            dispatch({ type: "newAll", data: {} });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentIdSTIXObject, parentIdSTIXObject ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){

            console.log("func 'CreateDialogContentIPv4AddrSTIXObject', useEffect, buttonSaveChangeTrigger ------- ");
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });

            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonSaveChangeTrigger ]);

    const handlerCheckStateButtonIsDisabled = (value) => {
        if(typeof value !== "undefined"){
            if(!value.includes("/")){
                if(validatorjs.isIP(value, 4)){
                    return handlerButtonIsDisabled(false);  
                }
            } else {
                let b = value.split("/")[1];
                if(regPattern.test(value) && (b && +b <= 32)){   
                    return handlerButtonIsDisabled(false);
                }
            }

            return handlerButtonIsDisabled(true);
        }

        if(!state || !state.value){
            return handlerButtonIsDisabled(true);            
        }

        if(!state.value.includes("/")){
            if(validatorjs.isIP(state.value, 4)){
                return handlerButtonIsDisabled(false);  
            }
        } else {
            let b = state.value.split("/")[1];
            if(regPattern.test(state.value) && (b && +b <= 32)){   
                return handlerButtonIsDisabled(false);
            }
        }

        return handlerButtonIsDisabled(true);
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
            <CreateIpv4AddrPatternElements
                isDisabled={false}
                showRefElement={stateShowRef}
                campaignPatterElement={state}
                handlerValue={(e) => { let value = e.target.value; dispatch({ type: "updateValue", data: value }); handlerCheckStateButtonIsDisabled(value); }}
                handlerButtonShowLink={(refId) => {
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
    listNewOrModifySTIXObject: PropTypes.array.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

/**
//IPv4AddressCyberObservableObjectSTIX объект "IPv4 Address Object", по терминалогии STIX, содержит один или более IPv4 адресов, выраженных с помощью нотации CIDR.
// Value - указывает значения одного или нескольких IPv4-адресов, выраженные с помощью нотации CIDR. Если данный объект IPv4-адреса представляет собой один IPv4-адрес,
//  суффикс CIDR /32 МОЖЕТ быть опущен. (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ResolvesToRefs - указывает список ссылок на один или несколько MAC-адресов управления доступом к носителям уровня 2, на которые разрешается IPv6-адрес. Объекты,
//  на которые ссылается этот список, ДОЛЖНЫ иметь тип macaddr.
// BelongsToRefs - указывает список ссылок на одну или несколько автономных систем (AS), к которым принадлежит IPv6-адрес. Объекты, на которые ссылается этот список,
//  ДОЛЖНЫ быть типа autonomous-system.
type IPv4AddressCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Value          string               `json:"value" bson:"value"`
	ResolvesToRefs []IdentifierTypeSTIX `json:"resolves_to_refs" bson:"resolves_to_refs"`
	BelongsToRefs  []IdentifierTypeSTIX `json:"belongs_to_refs" bson:"belongs_to_refs"`
}
*/
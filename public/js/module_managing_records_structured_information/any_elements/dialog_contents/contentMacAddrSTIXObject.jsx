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

import reducerMacAddrSTIXObject from "../reducer_handlers/reducerMacAddrSTIXObject.js";
import CreateMacAddrPatternElements from "../type_elements_stix/macAddrPatternElements.jsx";
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

    const [ state, dispatch ] = useReducer(reducerMacAddrSTIXObject, beginDataObject);

    useEffect(() => {
        let listener = (data) => {
            if(!isExistTransmittedData(data)){
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
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });

            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonSaveChangeTrigger ]);

    const handlerCheckStateButtonIsDisabled = (value) => {
        if(typeof value !== "undefined"){            
            if(validatorjs.isMACAddress(value)){
                return handlerButtonIsDisabled(false);  
            }

            return handlerButtonIsDisabled(true);
        }

        if(!state || !state.value){
            return handlerButtonIsDisabled(true);            
        }

        if(validatorjs.isMACAddress(state.value)){
            return handlerButtonIsDisabled(false);  
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
            <CreateMacAddrPatternElements
                isDisabled={false}
                campaignPatterElement={state}
                handlerValue={(e) => { let value = e.target.value; dispatch({ type: "updateValue", data: value }); handlerCheckStateButtonIsDisabled(value); }}
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
//MACAddressCyberObservableObjectSTIX объект "MAC Address Object", по терминалогии STIX, содержит объект MAC-адрес, представляющий собой один адрес управления доступом к среде (MAC).
// Value - Задает значение одного MAC-адреса. Значение MAC - адреса ДОЛЖНО быть представлено в виде одного строчного MAC-48 address, разделенного двоеточием,
//  который ДОЛЖЕН включать начальные нули для каждого октета. Пример: 00:00:ab:cd:ef:01. (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
type MACAddressCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Value string `json:"value" bson:"value"`
}
*/
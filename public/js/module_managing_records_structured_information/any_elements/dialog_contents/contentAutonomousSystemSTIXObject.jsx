import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import reducerAutonomousSystemSTIXObject from "../reducer_handlers/reducerAutonomousSystemSTIXObject.js";
import CreateAutonomousSystemPatternElements from "../type_elements_stix/autonomousSystemPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

let currentTime = helpers.getToISODatetime();

export default function CreateDialogContentAutonomousSystemSTIXObject(props){
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

    const handlerButtonIsDisabled = () => {
            if(!buttonIsDisabled){
                return;
            }

            setButtonIsDisabled();
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

CreateDialogContentAutonomousSystemSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerAutonomousSystemSTIXObject, beginDataObject);

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

        for(let obj of data.information.additional_parameters.transmitted_data){
            
            console.log("func 'CreateDialogContentAutonomousSystemSTIXObject', listener data:", obj.extensions);
            
            if(!obj.created){
                obj.created = currentTime;
            }
        
            if(!obj.modified){
                obj.modified = currentTime;
            }

            //{ "commonpropertiesobjectstix.id": "autonomous-system--f14fcb7b-f7eb-4d89-b6d5-b06b30f4523d" }
            //obj.extensions = {};

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

        console.log("func 'CreateDialogContentAutonomousSystemSTIXObject', insert STIX object ---> state:", state);

        /*let info = {
            id: "autonomous-system--f14fcb7b-f7eb-4d89-b6d5-b06b30f4523d",
            type: "autonomous-system",
            spec_version: "2.1",
            created: "2021-07-16T11:16:48Z",
            modified: "2022-08-11T09:32:20.047Z",
            number: 342,
            name: "Gema Task Industries",
            rir: "ARIN",
            defanged: true,
            granular_markings: [
                {lang: "CH", marking_ref: "marking--1f9a76d1-7dde-462e-bd60-36ff19bebe68", selectors: ["selectors_home_1", "selectors_home_2"]},
                {lang: "US", marking_ref: "marking-- 8581df34-d1ed-4733-ac09-1618ae30666f", selectors: ["selectors-news-01", "selectors-news-02", "selectors-news-03"]}
            ],
            object_marking_refs: ["EN", "FD"],
        };

        let info = {
            id: state.id,
            type: state.type,
            spec_version: state.spec_version,
            created: "2021-07-16T11:16:48Z",
            modified: "2022-08-11T09:32:20.047Z",
            number: state.number,
            name: state.name,
            rir: state.rir,
            defanged: state.defanged,
            extensions: state.extensions,
            granular_markings: state.granular_markings,
            object_marking_refs: state.object_marking_refs,
        };

        console.log("func 'CreateDialogContentAutonomousSystemSTIXObject', insert STIX object ---> info:", info);*/

        if(buttonSaveChangeTrigger){
            //socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    }, [ buttonSaveChangeTrigger, handlerButtonSaveChangeTrigger ]);

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {    
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerButtonIsDisabled();
        }
    
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerButtonIsDisabled();
        }
    };

    return (
        <Grid item container md={12}>
            <Grid container direction="row" className="pt-3">
                <CreateAutonomousSystemPatternElements 
                    isDisabled={false}
                    campaignPatterElement={state}
                    handlerRIR={(e) => { dispatch({ type: "updateRIR", data: e.target.value }); handlerButtonIsDisabled(); }}
                    handlerName={(e) => {}}
                    handlerNumber={(e) => { dispatch({ type: "updateNumber", data: e.target.value }); handlerButtonIsDisabled(/*e.target.value*/); }}
                />
            </Grid> 

            {/**
             Доделать autonomousSystem!!!
    */}

            <CreateElementAdditionalTechnicalInformationCO 
                objectId={currentIdSTIXObject}
                reportInfo={state}
                isNotDisabled={isNotDisabled}
                handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerButtonIsDisabled(); }}
                handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerButtonIsDisabled(); }}
                handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}             
            />
        </Grid>
    );
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
//AutonomousSystemCyberObservableObjectSTIX объект "Autonomous System", по терминалогии STIX, содержит параметры Автономной системы
// Number - содержит номер присвоенный Автономной системе (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Name - название Автономной системы
// RIR - содержит название регионального Интернет-реестра (Regional Internet Registry) которым было дано имя Автономной системы
type AutonomousSystemCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Number int    `json:"number" bson:"number" required:"true"`
	Name   string `json:"name" bson:"name"`
	RIR    string `json:"rir" bson:"rir"`
}
 */
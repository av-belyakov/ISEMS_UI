import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import reducerIndicatorSTIXObjects from "../reducer_handlers/reducerIndicatorSTIXObject.js";
import CreateIndicatorPatternElements from "../type_elements_stix/indicatorPatternElements.jsx";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";
    
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

export default function CreateIndicatorSTIXObject(props){
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
    
                <Grid item container md={4} style={{ display: "block" }}>
                    <CreateListPreviousStateSTIX 
                        socketIo={socketIo} 
                        searchObjectId={currentAdditionalIdSTIXObject} 
                    />
                </Grid>
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
    
CreateIndicatorSTIXObject.propTypes = {
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
    
    const [ state, dispatch ] = useReducer(reducerIndicatorSTIXObjects, {});    

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
    
    const handlerCheckStateButtonIsDisabled = (type, elem) => {
        console.log("func 'handlerCheckStateButtonIsDisabled' type:", type, " elem:", elem);

        if(typeof type !== "undefined" && (type === "pattern" || type === "pattern_type")){
            if(typeof elem === "undefined" || elem === ""){

                console.log("func 'handlerCheckStateButtonIsDisabled' aaa111111");

                handlerButtonIsDisabled(true);
            } else {

                console.log("func 'handlerCheckStateButtonIsDisabled' aaa222222");

                handlerButtonIsDisabled(false);
            }

            return;
        }

        /*
        if(typeof type !== "undefined" && type === "pattern_type"){
            if(typeof elem === "undefined" || !Array.isArray(elem) || elem.length === 0){

                console.log("func 'handlerCheckStateButtonIsDisabled' bbb111111");

                handlerButtonIsDisabled(true);
            } else {

                console.log("func 'handlerCheckStateButtonIsDisabled' bbb222222");

                handlerButtonIsDisabled(false);
            }

            return;
        }
        */

        console.log("func 'handlerCheckStateButtonIsDisabled' state.pattern_type:", state.pattern_type, " state.pattern:", state.pattern);

        if(state.pattern === "" || state.pattern_type === ""){
            console.log("func 'handlerCheckStateButtonIsDisabled' ccc111111");

            handlerButtonIsDisabled(true);
        
            return;
        }

        console.log("func 'handlerCheckStateButtonIsDisabled' eee-----");

        handlerButtonIsDisabled(false);
        /*if(typeof protocols !== "undefined" && Array.isArray(protocols)){
            if(protocols.length === 0){
                handlerButtonIsDisabled(true);
            } else {
                handlerButtonIsDisabled(false);
            }
        } else {
            if(state.protocols.length === 0){
                handlerButtonIsDisabled(true);
            } else {
                handlerButtonIsDisabled(false);
            }
        }*/
    };

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});
                handlerCheckStateButtonIsDisabled();
    
                break;
            case "hashes_delete":
                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
                handlerCheckStateButtonIsDisabled();
    
                break;
            default:
                dispatch({ type: "updateExternalReferences", data: obj.data });
                handlerCheckStateButtonIsDisabled();
            }
        }
        
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    };
    
    return (<Grid item container md={8} style={{ display: "block" }}>
        <Grid container direction="row" className="pt-3 pb-3">
            <CreateIndicatorPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerPattern={(e) => { dispatch({ type: "updatePattern", data: e.target.value }); handlerCheckStateButtonIsDisabled("pattern", e.target.value); }}
                handlerIndicator={(e) => { dispatch({ type: "updateIndicator", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerValidFrom={(e) => { dispatch({ type: "updateValidFrom", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerValidUntil={(e) => { dispatch({ type: "updateValidUntil", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerPatternType={(e) => { dispatch({ type: "updatePatternType", data: e.target.value }); handlerCheckStateButtonIsDisabled("pattern_type", e.target.value); }}
                handlerPatternVersion={(e) => { dispatch({ type: "updatePatternVersion", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerDeleteKillChain={(e) => { dispatch({ type: "deleteKillChainPhases", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerAddKillChainPhases={(e) => { dispatch({ type: "updateAddKillChainPhases", data: e }); handlerCheckStateButtonIsDisabled(); }}
            />
            
            {/*<CreateMalwarePatternElements 
                isDisabled={false}
                showRefElement={stateShowRef}
                campaignPatterElement={state}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerButtonIsDisabled(e.target.value); }}
                handlerAliases={(e) => { dispatch({ type: "updateAliases", data: e }); handlerButtonIsDisabled(); }}
                // Aliases - альтернативные имена используемые для этого субъекта угроз
                handlerIsFamily={(e) => { dispatch({ type: "updateIsFamily", data: e.target.value }); handlerButtonIsDisabled(e.target.value); }}
                // IsFamily - представляет ли объект семейство вредоносных программ (если true) или экземпляр вредоносного ПО (если false) (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
                handlerLastSeen={(e) => { dispatch({ type: "updateLastSeenTime", data: e }); handlerButtonIsDisabled(); }}
                // LastSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был зафиксирован в последний раз
                handlerFirstSeen={(e) => { dispatch({ type: "updateFirstSeenTime", data: e }); handlerButtonIsDisabled(); }}
                // FirstSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был впервые зафиксирован
                //handlerSampleRefs={(e) => { dispatch({ type: "updateSampleRefs", data: e }); handlerButtonIsDisabled(); }}        
                // SampleRefs - определяет список идентификаторов файлов или артифактов ассоциируемых с вредоносным ПО или семейством вредоносных программ.
                //  По факту данное поле может содержать только SCO объекты file, artifact.
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerCapabilities={(e) => { dispatch({ type: "updateCapabilities", data: e.target.value }); handlerButtonIsDisabled(); }}
                // Capabilities - заранее определенный (предложенный) перечень возможных идентификаторов используемых для обнаружения вредоносного ПО или семейства вредоносных программ
                handlerMalwareTypes={(e) => { dispatch({ type: "updateMalwareTypes", data: e.target.value }); handlerButtonIsDisabled(e.target.value); }}
                // MalwareTypes - заранее определенный (предложенный) перечень вредоносного ПО 
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
                handlerDeleteKillChain={(e) => { dispatch({ type: "deleteKillChainPhases", data: e }); handlerButtonIsDisabled(); }}
                handlerAddKillChainPhases={(e) => { dispatch({ type: "updateAddKillChainPhases", data: e }); handlerButtonIsDisabled(); }}
                // KillChainPhases - список цепочки фактов, к которым может быть отнесено это вредоносное ПО
                //handlerOperatingSystemRefs={(e) => { dispatch({ type: "OperatingSystemRefs", data: e }); handlerButtonIsDisabled(); }}
                // OperatingSystemRefs - перечень идентификаторов ОС в которых может быть выполнено вредоносное ПО или семейство вредоносных программ
                handlerImplementationLanguages={(e) => { dispatch({ type: "updateImplementationLanguages", data: e.target.value }); handlerButtonIsDisabled(); }}
                // ImplementationLanguages - заранее определенный (предложенный) перечень языков программирования, используемых для реализации вредоносного ПО или семейства вредоносных программ
                handlerArchitectureExecutionEnvs={(e) => { dispatch({ type: "updateArchitectureExecutionEnvs", data: e.target.value }); handlerButtonIsDisabled(); }}
                // ArchitectureExecutionEnvs - заранее определенный (предложенный) перечень архитектур в которых может быть выполнено вредоносное ПО или семейство вредоносных программ
            />*/}
        </Grid> 
    
        <CreateElementAdditionalTechnicalInformationDO
            objectId={currentIdSTIXObject}
            reportInfo={state}
            isNotDisabled={isNotDisabled}
            handlerElementConfidence={(e) => { dispatch({ type: "updateConfidence", data: e }); handlerButtonIsDisabled(); }}
            handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerButtonIsDisabled(); }}
            handlerElementLabels={(e) => { dispatch({ type: "updateLabels", data: e }); handlerButtonIsDisabled(); }}
            handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerButtonIsDisabled(); }}
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

/*
//IndicatorDomainObjectsSTIX объект "Indicator", по терминалогии STIX, содержит шаблон который может быть использован для
//  обнаружения подозрительной или вредоносной киберактивности
// Name - имя используемое для идентификации "Indicator" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// IndicatorTypes - заранее определенный (предложенный) перечень категорий индикаторов
// Pattern - шаблон для обнаружения индикаторов (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// PatternType - одно, из заранее определенных (предложенных) значений языкового шаблона, используемого в этом индикаторе (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// PatternVersion - версия языка шаблонов
// ValidFrom - время с которого этот индикатор считается валидным, в формате "2016-05-12T08:17:27.000Z" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ValidUntil - время начиная с которого этот индикатор не может считаться валидным, в формате "2016-05-12T08:17:27.000Z"
// KillChainPhases - список цепочки фактов, к которым можно отнести соответствующте индикаторы
type IndicatorDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name            string                  `json:"name" bson:"name" required:"true"`
	Description     string                  `json:"description" bson:"description"`
	IndicatorTypes  []OpenVocabTypeSTIX     `json:"indicator_types" bson:"indicator_types"`
	Pattern         string                  `json:"pattern" bson:"pattern" required:"true"`
	PatternType     OpenVocabTypeSTIX       `json:"pattern_type" bson:"pattern_type" required:"true"`
	PatternVersion  string                  `json:"pattern_version" bson:"pattern_version"`
	ValidFrom       time.Time               `json:"valid_from" bson:"valid_from" required:"true"`
	ValidUntil      time.Time               `json:"valid_until" bson:"valid_until"`
	KillChainPhases KillChainPhasesTypeSTIX `json:"kill_chain_phases" bson:"kill_chain_phases"`
}
*/
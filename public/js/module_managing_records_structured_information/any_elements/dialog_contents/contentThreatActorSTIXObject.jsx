import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import PropTypes from "prop-types";

import reducerThreatActorsSTIXObject from "../reducer_handlers/reducerThreatActorsSTIXObject.js";
import CreateThreatActorElements from "../type_elements_stix/threatActorPatternElements.jsx";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateDialogContentThreatActorSTIXObject(props){
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

CreateDialogContentThreatActorSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerThreatActorsSTIXObject, beginDataObject);

    //    console.log("func 'CreateMajorContent', state:", state);

    const listener = (data) => {

        //        console.log("func 'CreateDialogContentThreatActorSTIXObject' listener data:", data);

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

        console.log("----====== INSERT -> state:", state);

        if(buttonSaveChangeTrigger){
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    }, [ buttonSaveChangeTrigger, handlerButtonSaveChangeTrigger ]);

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();

                break;
            case "hashes_delete":
                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();

                break;
            default:
                dispatch({ type: "updateExternalReferences", data: obj.data });
                handlerButtonIsDisabled();
            }
        }
    
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
        <Grid item container md={8}>
            <Grid container direction="row" className="pt-3">
                <CreateThreatActorElements 
                    isDisabled={false}
                    campaignPatterElement={state}
                    handlerName={(e) => {}}
                    handlerRoles={(e) => { console.log("_-=-==-=-== handler roles e.target.value:", e.target.value); dispatch({ type: "updateRoles", data: e.target.value }); handlerButtonIsDisabled(); }}
                    // Roles - заранее определенный (предложенный) перечень возможных ролей субъекта угроз
                    handlerGoals={(e) => { dispatch({ type: "updateGoals", data: e }); handlerButtonIsDisabled(); }}
                    // Goals - высокоуровневые цели субъекта угроз.
                    handlerAliases={(e) => { dispatch({ type: "updateAliases", data: e }); handlerButtonIsDisabled(); }}
                    // Aliases - альтернативные имена используемые для этого субъекта угроз
                    handlerLastSeen={(e) => { dispatch({ type: "updateLastSeen", data: e }); handlerButtonIsDisabled(); }}
                    // LastSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был зафиксирован в последний раз
                    handlerFirstSeen={(e) => { dispatch({ type: "updateFirstSeen", data: e }); handlerButtonIsDisabled(); }}
                    // FirstSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был впервые зафиксирован
                    handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                    handlerResourceLevel={(e) => { dispatch({ type: "updateResourceLevel", data: e.target.value }); handlerButtonIsDisabled(); }}
                    // ResourceLevel - один, из заранее определенного (предложенного) перечня организационных уровней, на котором обычно работает этот субъект угрозы,
                    //  который, в свою очередь, определяет ресурсы, доступные этому субъекту угрозы для использования в атаке.
                    handlerSophistication={(e) => { dispatch({ type: "updateSophistication", data: e.target.value }); handlerButtonIsDisabled(); }}
                    // Sophistication - один, из заранее определенного (предложенного) перечня навыков, специальных знания, специальной подготовки или опыта,
                    //  которыми должен обладать субъект угрозы, чтобы осуществить атаку
                    handlerThreatActorTypes={(e) => { dispatch({ type: "updateThreatActorTypes", data: e.target.value }); handlerButtonIsDisabled(); }} 
                    // ThreatActorTypes - заранее определенный (предложенный) перечень типов субъектов угрозы                    
                    handlerPrimaryMotivation={(e) => { console.log("_-=-==-=-== handler Primary Motivation e.target.value:", e.target.value); dispatch({ type: "updatePrimaryMotivation", data: e.target.value }); handlerButtonIsDisabled(); }}
                    // PrimaryMotivation - одна, из заранее определенного (предложенного) перечня причин, мотиваций или целей стоящих за этим субъектом угроз
                    handlerPersonalMotivations={(e) => { dispatch({ type: "updatePersonalMotivations", data: e.target.value }); handlerButtonIsDisabled(); }}
                    // PersonalMotivations - заранее определенный (предложенный) перечень возможных персональных причин, мотиваций или целей стоящих за этим субъектом угрозы
                    handlerSecondaryMotivations={(e) => { dispatch({ type: "updateSecondaryMotivations", data: e.target.value }); handlerButtonIsDisabled(); }}
                    // SecondaryMotivations - заранее определенный (предложенный) перечень возможных вторичных причин, мотиваций или целей стоящих за этим субъектом угрозы
                />
            </Grid> 

            <Grid container direction="row" className="pt-3">
                <Grid item container md={12} justifyContent="center">
                    <h3>
                        Здесь нужно разместить область с ссылками на объекты Report с которыми может быть связан данный объект. 
                        При чем нужно ограничить переходы по этим ссылка для непривелегированных пользователей. Это надо доделать.
                    </h3>
                </Grid>
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
//ThreatActorDomainObjectsSTIX объект "Threat Actor", по терминалогии STIX, содержит информацию о физических лицах или их группах и организациях
//  которые могут действовать со злым умыслом.
// Name - имя используемое для идентификации "Threat Actor" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// ThreatActorTypes - заранее определенный (предложенный) перечень типов субъектов угрозы
// Aliases - альтернативные имена используемые для этого субъекта угроз
// FirstSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был впервые зафиксирован
// LastSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был зафиксирован в последний раз
// Roles - заранее определенный (предложенный) перечень возможных ролей субъекта угроз
// Goals - высокоуровневые цели субъекта угроз.
// Sophistication - один, из заранее определенного (предложенного) перечня навыков, специальных знания, специальной подготовки или опыта,
//  которыми должен обладать субъект угрозы, чтобы осуществить атаку
// ResourceLevel - один, из заранее определенного (предложенного) перечня организационных уровней, на котором обычно работает этот субъект угрозы,
//  который, в свою очередь, определяет ресурсы, доступные этому субъекту угрозы для использования в атаке.
// PrimaryMotivation - одна, из заранее определенного (предложенного) перечня причин, мотиваций или целей стоящих за этим субъектом угрозы
// SecondaryMotivations - заранее определенный (предложенный) перечень возможных вторичных причин, мотиваций или целей стоящих за этим субъектом угрозы
// PersonalMotivations - заранее определенный (предложенный) перечень возможных персональных причин, мотиваций или целей стоящих за этим субъектом угрозы
type ThreatActorDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name                 string              `json:"name" bson:"name" required:"true"`
	Description          string              `json:"description" bson:"description"`
	ThreatActorTypes     []OpenVocabTypeSTIX `json:"threat_actor_types" bson:"threat_actor_types"`
	Aliases              []string            `json:"aliases" bson:"aliases"`
	FirstSeen            time.Time           `json:"first_seen" bson:"first_seen"`
	LastSeen             time.Time           `json:"last_seen" bson:"last_seen"`
	Roles                []OpenVocabTypeSTIX `json:"roles" bson:"roles"`
	Goals                []string            `json:"goals" bson:"goals"`
	Sophistication       OpenVocabTypeSTIX   `json:"sophistication" bson:"sophistication"`
	ResourceLevel        OpenVocabTypeSTIX   `json:"resource_level" bson:"resource_level"`
	PrimaryMotivation    OpenVocabTypeSTIX   `json:"primary_motivation" bson:"primary_motivation"`
	SecondaryMotivations []OpenVocabTypeSTIX `json:"secondary_motivations" bson:"secondary_motivations"`
	PersonalMotivations  []OpenVocabTypeSTIX `json:"personal_motivations" bson:"personal_motivations"`
}
 */
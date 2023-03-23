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

import reducerArtifactPatternSTIXObjects from "../reducer_handlers/reducerArtifactSTIXObject.js";
import CreateArtifactPatternElements from "../type_elements_stix/artifactPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

export default function CreateDialogContentArtifactSTIXObject(props){
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

                {/** 
                 * 
                 * В MRSIC предусмотрен учет предыдущих состояний ТОЛЬКО для DOMAIN STIX Object
                 * 
                 */}

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

CreateDialogContentArtifactSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerArtifactPatternSTIXObjects, {});
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

        socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", listener);

        return () => {
            dispatch({ type: "newAll", data: {} });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonSaveChangeTrigger/*, handlerButtonSaveChangeTrigger*/ ]);

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

    const handlerCheckStateButtonIsDisabled = (typeElem, value) => {
        if(typeElem === "url"){
            //console.log("func handlerCheckStateButtonIsDisabled validatorjs.isURL(value):", validatorjs.isURL(value));

            if(validatorjs.isURL(value)){
                return handlerButtonIsDisabled(false);
            }

            return handlerButtonIsDisabled(true);
        } else if(typeElem === "payload_bin"){
            //console.log("func handlerCheckStateButtonIsDisabled validatorjs.isBase64(value):", validatorjs.isBase64(value));

            if(validatorjs.isBase64(value)){
                return handlerButtonIsDisabled(false);  
            }

            return handlerButtonIsDisabled(true);
        } else {
            //console.log("func handlerCheckStateButtonIsDisabled validatorjs.isBase64(value):", validatorjs.isBase64(state.payload_bin), " validatorjs.isURL(state.url):", validatorjs.isURL(state.url));

            if((state.url && state.url !== "" && !validatorjs.isURL(state.url)) || (state.payload_bin && state.payload_bin !== "" && !validatorjs.isBase64(state.payload_bin))){                
                return handlerButtonIsDisabled(true);  
            }

            handlerButtonIsDisabled(false);
        }
    };

    return (<React.Fragment>
        <Grid item container md={12}>
            <Grid container direction="row" className="pt-3">
                <CreateArtifactPatternElements 
                    isDisabled={false}
                    campaignPatterElement={state}
                    handlerURL={(e) => { dispatch({ type: "updateURL", data: e.target.value }); handlerCheckStateButtonIsDisabled("url", e.target.value); }}
                    handlerMimeType={(e) => { dispatch({ type: "updateMimeType", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                    handlerAddHashes={(e) => { dispatch({ type: "updateAddHashes", data: e }); handlerCheckStateButtonIsDisabled(); }}
                    handlerPayloadBin={(e) => { dispatch({ type: "updatePayloadBin", data: e.target.value }); handlerCheckStateButtonIsDisabled("payload_bin", e.target.value); }}
                    handlerDeleteHashe={(e) => { dispatch({ type: "updateDeleteHashes", data: e }); handlerCheckStateButtonIsDisabled(); }}
                    handlerDecryptionKey={(e) => { dispatch({ type: "updateDecryptionKey", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                    handlerEncryptionAlgorithm={(e) => { dispatch({ type: "updateEncryptionAlgorithm", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
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
        </Grid>
    </React.Fragment>);
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

/**
//ArtifactCyberObservableObjectSTIX объект "Artifact", по терминалогии STIX, позволяет захватывать массив байтов (8 бит) в виде строки в кодировке base64
//  или связывать его с полезной нагрузкой, подобной файлу. Обязательно должен быть заполнено одно из полей PayloadBin или URL
// MimeType - по возможности это значение ДОЛЖНО быть одним из значений, определенных в реестре типов носителей IANA. В универсальном каталоге
//  всех существующих типов файлов.
// PayloadBin - бинарные данные в base64
// URL - унифицированный указатель ресурса (URL)
// Hashes - словарь хешей для URL или PayloadBin
// EncryptionAlgorithm - тип алгоритма шифрования для бинарных данных
// DecryptionKey - определяет ключ для дешифрования зашифрованных данных
type ArtifactCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	MimeType            string         `json:"mime_type" bson:"mime_type"`
	PayloadBin          string         `json:"payload_bin" bson:"payload_bin"`
	URL                 string         `json:"url" bson:"url"`
	Hashes              HashesTypeSTIX `json:"hashes" bson:"hashes"`
	EncryptionAlgorithm EnumTypeSTIX   `json:"encryption_algorithm" bson:"encryption_algorithm"`
	DecryptionKey       string         `json:"decryption_key" bson:"decryption_key"`
}
 */
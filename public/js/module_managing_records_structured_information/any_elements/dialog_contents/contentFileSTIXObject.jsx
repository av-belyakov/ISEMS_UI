import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import _ from "lodash";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import reducerFilePatternSTIXObjects from "../reducer_handlers/reducerFileSTIXObject.js";
import CreateFilePatternElements from "../type_elements_stix/filePatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

/**
            * Надо рассмотреть все CO STIX объекты ссылки на которые могут содержатся в свойстве contains_refs!!!!!!!
             * 
                Доделать здесь и обратить внимание на доделки в contentFileSTIXObject.jsx
             *
            */
let listObjRefs = {
    "file": {
        "artifact": [
            { elemName: "content_ref", elemType: "string" }, 
            { elemName: "contains_refs", elemType: "array" },
        ]
    },
    "domain-name": {
        "ipv4-addr": [
            { elemName: "resolves_to_refs", elemType: "array" },
        ],
        "ipv6-addr": [
            { elemName: "resolves_to_refs", elemType: "array" },
        ],
        "domain-name": [
            { elemName: "resolves_to_refs", elemType: "array" },
        ],
    },
    "email-message": {
        "artifact": [
            { elemName: "raw_email_ref", elemType: "string" },
        ],
        "email-addr": [
            { elemName: "from_ref", elemType: "string" },
            { elemName: "sender_ref", elemType: "string" },
            { elemName: "to_refs", elemType: "array" },
            { elemName: "cc_refs", elemType: "array" },
            { elemName: "bcc_refs", elemType: "array" },
        ],
    },
};

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
    let searchElemRef = (state, data) => {
        if(typeof state.refs !== "undefined" && _.isArray(state.refs)){
            for(let i = 0; i < state.refs.length; i++){
                if(state.refs[i].id === data.id){
                    state.refs[i].value = data;

                    continue;
                }

                state.refs[i].value = searchElemRef(state.refs[i].value, data);
            }
        }

        return state;
    };

    let type;

    switch(action.type){
    case "addObject":

        //        console.log("func 'reducerShowRef', action.type:", action.type, " action.data:", action.data);

        if(action.data.type === "directory" && action.data.contains_refs && Array.isArray(action.data.contains_refs)){
            action.data.refs = action.data.contains_refs.map((item) => {
                return { id: item, value: item };
            });
        }

        state.obj = action.data;

        return {...state};
    case "updateRefObj":
        console.log("func |||'reducerShowRef'|||, action.type:", action.type, " action.data:", action.data, "state.id = ", state.id, " state.obj = ", state.obj);
        
        //file--fa4c163f-e7e2-42a2-a93e-d44f26f522ff
        //email-message--cf9b4b7f-14c8-5955-8065-020e0316b559

        type = state.id.split("--")[0];
        if((typeof listObjRefs[type] !== "undefined") && (typeof listObjRefs[type][action.data.type] !== "undefined") && Array.isArray(listObjRefs[type][action.data.type])){
            for(let obj of listObjRefs[type][action.data.type]){
                console.log("======= state.obj:", state.obj, " obj.elemName:", obj.elemName, " state.obj[obj.elemName]:", state.obj[obj.elemName]);
                
                switch(obj.elemType){
                case "string":

                    console.log("OBJ NAME = ", obj.elemName);

                    if(state.obj[obj.elemName] === action.data.id){
                        state.obj[obj.elemName] = action.data;
                    }
                    break;
                case "array":
                    if(!Array.isArray(state.obj[obj.elemName])){
                        break;
                    }

                    for(let i = 0; i < state.obj[obj.elemName].length; i++){
                        if(state.obj[obj.elemName][i] !== action.data.id){
                            continue;
                        }

                        state.obj[obj.elemName][i] = action.data;
                    }

                    break;
                }
            }
        }

        return {...state};
    case "updateRefObjDirectory":

        console.log("func 'reducerShowRef', action.type:", action.type, " action.data:", action.data);

        if(action.data.type === "directory"){
            action.data.refs = action.data.contains_refs.map((item) => {
                return { id: item, value: item };
            });
        }

        state.obj = searchElemRef(state.obj, action.data);

        return {...state};
    case "addId":
        return {...state, id: action.data};
    case "cleanObj":
        return {...state, obj: {}};
    }
}

export default function CreateDialogContentFileSTIXObject(props){
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

CreateDialogContentFileSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerFilePatternSTIXObjects, {});
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

            state.mtime = new Date(state.mtime).toISOString();
            state.atime = new Date(state.atime).toISOString();
            state.size = Number(state.size);

            console.log("func 'useEffect(()' [ buttonSaveChangeTrigger ] state:", state);

            //Пока что отключил передачу обновление в MRSICT
            //похоже проблемма в самом MRSICT так как я забыл добавить в метод
            //func (fstix FileCyberObservableObjectSTIX) DecoderJSON(raw *json.RawMessage) (interface{}, error) {
            //добавить ContainsRefs: commonObject.ContainsRefs и ContentRef: commonObject.ContentRef,
            //однако есть проблемма с ContainsRefs: commonObject.ContainsRefs, ну и кроме того, потом нужно обновить
            //MRSICT

            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
            
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonSaveChangeTrigger ]);

    const handlerCheckStateButtonIsDisabled = (size) => {
        if(typeof size !== "undefined"){
            if(helpers.checkInputValidation({
                "name": "integer", 
                "value": size, 
            }) && size[0] !== "0"){
                return handlerButtonIsDisabled(false);
            }

            return handlerButtonIsDisabled(true);
        }

        if(state && helpers.checkInputValidation({
            "name": "integer", 
            "value": state.size, 
        }) && state.size[0] !== "0"){           
            handlerButtonIsDisabled(false);
        } else {
            handlerButtonIsDisabled(true);
        }
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
            <CreateFilePatternElements 
                isDisabled={false}
                showRefElement={stateShowRef}
                campaignPatterElement={state}
                //handlerName={(e) => { dispatch({ type: "updateName", data: e }); handlerCheckStateButtonIsDisabled(e); }}
                handlerName={() => {}}
                handlerSize={(size) => { dispatch({ type: "updateSize", data: size }); handlerCheckStateButtonIsDisabled(size); }}
                handlerClick={(parentId, refId) => {
                    console.log("func 'CreateDialogContentFileSTIXObject', handlerClick, CLICK ref id: ", refId, " parentId: ", parentId, " stateShowRef.id:", stateShowRef.id);

                    socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
                        if(!isExistTransmittedData(data)){
                            return;
                        }

                        for(let obj of data.information.additional_parameters.transmitted_data){
                            if(parentId.includes("directory")){
                                dispatchShowRef({ type: "updateRefObjDirectory", data: obj });

                                return;
                            }

                            dispatchShowRef({ type: "updateRefObj", data: obj });
                        }
                    });

                    socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                        searchObjectId: refId,
                        parentObjectId: parentId,
                    }});
                }}
                handlerNameEnc={(e) => { dispatch({ type: "updateNameEnc", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerMimeType={(e) => { dispatch({ type: "updateMineType", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerAddHashes={(hashObj) => {
                    dispatch({ type: "updateAddHashes", data: hashObj }); handlerCheckStateButtonIsDisabled();
                }}
                handlerDelHashes={(elem) => {
                    dispatch({ type: "handlerDelHashes", data: elem }); handlerCheckStateButtonIsDisabled();
                }}
                handlerButtonShowLink={(refId) => {
                    dispatchShowRef({ type: "addId", data: refId });
                    dispatchShowRef({ type: "cleanObj", data: {} });
            
                    console.log("func 'CreateDialogContentFileSTIXObject', handlerButtonShowLink, CLICK ref id:", refId);

                    socketIo.once("isems-mrsi response ui: send search request, get STIX object for id", (data) => {
                        if(!isExistTransmittedData(data)){
                            return;
                        }

                        for(let obj of data.information.additional_parameters.transmitted_data){

                            console.log("func handlerButtonShowLink, RESEIVED obj:", obj);

                            dispatchShowRef({ type: "addObject", data: obj });        
                        }
                    });

                    socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                        searchObjectId: refId,
                        parentObjectId: state.id,
                    }});
                }}
                handlerMagicNumberHex={(e) => { dispatch({ type: "updateMagicNumberHex", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerChangeDateTimeMtime={(e) => { dispatch({ type: "updateDateTimeMtime", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerChangeDateTimeAtime={(e) => { dispatch({ type: "updateDateTimeAtime", data: e }); handlerCheckStateButtonIsDisabled(); }}
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

/**
//FileCyberObservableObjectSTIX объект "File Object", по терминалогии STIX, последекодирования из JSON (основной, рабочий объект)
// Extensions - определяет следующие расширения pdf-ext, archive-ext, ntfs-ext, raster-image-ext, windows-pebinary-ext. В дополнении к ним пользователь может создавать
//  свои расширения. При этом ключ словаря должен однозначно идентифицировать тип расширения.
// Hashes - определяет словарь хешей для файла. При этом ДОЛЖНЫ использоватся ключи из открытого словаря hash-algorithm- ov.
// Size - содержит размер файла в байтах
// Name - содержит имя файла
// NameEnc - определяет кодировку имени файла. Содержимое должно соответствовать ревизии IANA от 2013-12-20.
// MagicNumberHex - указывает шестнадцатеричную константу (“магическое число”), связанную с определенным форматом файла, который соответствует этому файлу, если это применимо.
// MimeType - определяет MIME имени файла, например, application/msword.
// Ctime - время, в формате "2016-05-12T08:17:27.000Z", создания файла
// Mtime - время, в формате "2016-05-12T08:17:27.000Z", модификации файла
// Atime - время, в формате "2016-05-12T08:17:27.000Z", обращения к файлу
// ParentDirectoryRef - определяет родительскую директорию для файла. Объект ссылающийся на это свойство ДОЛЖЕН быть типом directory
// ContainsRefs - содержит ссылки на другие Cyber-observable Objects STIX, содержащиеся в файле, например другой файл, добавленный в конец файла, или IP-адрес, содержащийся где-то в файле.
// ContentRef - определяет контент файла. Данное значение ДОЛЖНО иметь тип artifact, то есть ссылатся на ArtifactCyberObservableObjectSTIX
 */
import _ from "lodash";

const listFieldEmailMessageRef = [
    "to_refs",
    "cc_refs",
    "bcc_refs",
];

export default function reducerGroupingSTIXObject(state, action){
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

    switch(action.type){
    case "newAll":
        return {...state, mainObj: action.data};
    case "cleanAll":
        return {...state, mainObj: {}};
    case "addRefObj":

        console.log("func 'reducerGroupingSTIXObject', action.type:", action.type, " action.data:", action.data);

        if(action.data.type === "directory"){
            action.data.refs = action.data.contains_refs.map((item) => {
                return { id: item, value: item };
            });
        }

        console.log("func 'reducerGroupingSTIXObject', action.data.refs:", action.data.refs);

        state.refObj = searchElemRef(state.refObj, action.data);

        console.log("func 'reducerGroupingSTIXObject', state.refObj:", state.refObj);

        return {...state};
    case "updateRefId":
        state.refId = action.data;

        return {...state};
    case "updateRefObj":
        state.refObj = action.data;
        if(action.data.type === "directory" && typeof action.data.contains_refs !== "undefined"){
            state.refObj.refs = action.data.contains_refs.map((item) => {
                return { id: item, value: item };
            });
        }

        return {...state};
    case "updateRefObjEmailMessageRef":
        if(state.refObj["from_ref"] && state.refObj["from_ref"] === action.data.id){
            state.refObj["from_ref"] = action.data.value;
        }

        if(state.refObj["sender_ref"] && state.refObj["sender_ref"] === action.data.id){
            state.refObj["sender_ref"] = action.data.value;
        }

        for(let value of listFieldEmailMessageRef){
            if(state.refObj[value] && state.refObj[value].length > 0){
                for(let i = 0; i <  state.refObj[value].length; i++){
                    if(state.refObj[value][i] !== action.data.id){
                        continue;
                    }

                    state.refObj[value][i] = action.data.value;
                }
            }
        }

        return {...state};
    case "updateRefObjNetworkTrafficRef":
        if(state.refObj.src_ref === action.data.id){
            state.refObj.src_ref = action.data.value;
        }

        if(state.refObj.dst_ref === action.data.id){
            state.refObj.dst_ref = action.data.value;
        }

        return {...state};
    case "updateRefObjFileRef":
        //console.log("func 'reducerGroupingSTIXObject' action.type:", action.type, " action.data:", action.data);

        state.refObj.content_ref = action.data;

        return {...state};
    case "updateResolvesToRefs":
        for(let i = 0; i < state.refObj.resolves_to_refs.length; i++){
            if(state.refObj.resolves_to_refs[i] === action.data.id){
                state.refObj.resolves_to_refs[i] = action.data.value;
            }
        }

        return {...state};
    case "updateName":    
        if(state.mainObj.name === action.data){
            return {...state};
        }
    
        state.mainObj.name = action.data;

        return {...state};    
    case "updateContex":

        console.log("action.type:", action.type, " action.data:", action.data);

        state.mainObj.context = action.data;

        return {...state};
    case "updateDescription":
        if(state.mainObj.description === action.data){
            return {...state};
        }
    
        state.mainObj.description = action.data;

        return {...state};
    case "updateConfidence":
        if(state.mainObj.confidence === action.data.data){
            return {...state};
        }
    
        state.mainObj.confidence = action.data.data;

        return {...state};
    case "updateDefanged":
        state.mainObj.defanged = (action.data.data === "true");

        return {...state};
    case "updateLabels":
        state.mainObj.labels = action.data.listTokenValue;

        return {...state};
    case "updateExternalReferences":
        if(!state.mainObj.external_references){
            state.mainObj.external_references = [];
        }
    
        for(let key of state.mainObj.external_references){
            if(key.source_name === action.data.source_name){
                return {...state};
            }
        }
    
        state.mainObj.external_references.push(action.data);
    
        return {...state};
    case "updateExternalReferencesHashesUpdate":
        if((state.mainObj.external_references[action.data.orderNumber].hashes === null) || (typeof state.mainObj.external_references[action.data.orderNumber].hashes === "undefined")){
            state.mainObj.external_references[action.data.orderNumber].hashes = {};
        }
    
        state.mainObj.external_references[action.data.orderNumber].hashes[action.data.newHash.hash] = action.data.newHash.type;
    
        return {...state};
    case "updateExternalReferencesHashesDelete":
        delete state.mainObj.external_references[action.data.orderNumber].hashes[action.data.hashName];
    
        return {...state};
    case "updateGranularMarkings":
        if(!state.mainObj.granular_markings){
            state.mainObj.granular_markings = [];
        }
    
        for(let keyGM of state.mainObj.granular_markings){
            if(!keyGM.selectors){
                return {...state};
            }
    
            for(let keyS of keyGM.selectors){
                for(let key of action.data.selectors){
                    if(key === keyS){
                        return {...state};
                    }
                }
            }
        }
    
        state.mainObj.granular_markings.push(action.data);
    
        return {...state};
    case "updateExtensions":
        if(!state.mainObj.extensions){
            state.mainObj.extensions = {};
        }
    
        state.mainObj.extensions[action.data.name] = action.data.description;
    
        return {...state};
    case "deleteElementAdditionalTechnicalInformation":
        switch(action.data.itemType){
        case "extensions":
            delete state.mainObj.extensions[action.data.item];
    
            return {...state};
        case "granular_markings":
            state.mainObj.granular_markings.splice(action.data.orderNumber, 1);
    
            return {...state};
        case "external_references":
            state.mainObj.external_references.splice(action.data.orderNumber, 1);
    
            return {...state};
        }
    }
}
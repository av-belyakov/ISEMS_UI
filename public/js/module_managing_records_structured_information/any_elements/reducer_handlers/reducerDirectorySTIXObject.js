export default function reducerDirectoryPatternSTIXObjects(state, action){
    let refs = [];
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
        if(action.data.contains_refs && Array.isArray(action.data.contains_refs)){
            refs = action.data.contains_refs.map((item) => {
                return { id: item, value: item };
            });
        }

        action.data.refs = refs;

        return {...state, mainObj: action.data};
    case "cleanAll":
        return {...state, mainObj: {}};
    case "addId":
        return {...state, id: action.data};
    case "updatePath":
        state.mainObj.path = action.data;

        return {...state};
    case "addRefObj":
        if(action.data.type === "directory"){
            action.data.refs = action.data.contains_refs.map((item) => {
                return { id: item, value: item };
            });
        }

        state.mainObj = searchElemRef(state.mainObj, action.data);

        return {...state};
    case "updateConfidence":
        state.mainObj.confidence === action.data.data;

        return {...state};
    case "updateDefanged":
        state.mainObj.defanged = (action.data.data === "true");

        return {...state};
    case "updateLabels":
        state.mainObj.labels = action.data.listTokenValue;

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
    case "deleteKillChain":
        state.mainObj.kill_chain_phases.splice(action.data, 1);
    
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
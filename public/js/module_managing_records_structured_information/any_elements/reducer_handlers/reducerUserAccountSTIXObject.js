export default function reducerUserAccountSTIXObject(state, action){
    let dateTime = "";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    let tmp = "";

    switch(action.type){
    case "newAll":        
        if(action.data.account_created){
            action.data.account_created = new Date(Date.parse(action.data.account_created)).toISOString();
        }

        if(action.data.account_expires){
            action.data.account_expires = new Date(Date.parse(action.data.account_expires)).toISOString();
        }

        if(action.data.account_last_login){
            action.data.account_last_login = new Date(Date.parse(action.data.account_last_login)).toISOString();
        }

        if(action.data.account_first_login){
            action.data.account_first_login = new Date(Date.parse(action.data.account_first_login)).toISOString();
        }

        if(action.data.credential_last_changed){
            action.data.credential_last_changed = new Date(Date.parse(action.data.credential_last_changed)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {};
    case "updateUserId":
        return {...state, user_id: action.data};    
    case "updateCredential":
        return {...state, credential: action.data};
    case "updateAccountType":
        return {...state, account_type: action.data};
    case "updateDisplayName":
        return {...state, display_name: action.data};
    case "updateAccountLogin":
        return {...state, account_login: action.data};
    case "updateIsPrivileged":
        return {...state, is_privileged: (action.data === "true")};
    case "updateIsDisabled":
        return {...state, is_disabled: (action.data === "true")};
    case "updateCanEscalatePrivs":
        return {...state, can_escalate_privs: (action.data === "true")};
    case "updateIsServiceAccount":
        return {...state, is_service_account: (action.data === "true")};
    case "updateAccountCreated":
        // timestamp
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        state.account_created = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateAccountExpires":
        // timestamp
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        state.account_expires = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateAccountLastLogin":
        // timestamp
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        state.account_last_login = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateAccountFirstLogin":
        // timestamp
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        state.account_first_login = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateCredentialLastChanged":
        // timestamp
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        state.credential_last_changed = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateConfidence":
        if(state.confidence === action.data.data){
            return {...state};
        }
        return {...state, confidence: action.data.data};
    case "updateDefanged":
        return {...state, defanged: (action.data.data === "true")};
    case "updateLabels":
        return {...state, labels: action.data.listTokenValue};
    case "updateExternalReferences":
        if(!state.external_references){
            state.external_references = [];
        }

        for(let key of state.external_references){
            if(key.source_name === action.data.source_name){
                return {...state};
            }
        }

        state.external_references.push(action.data);

        return {...state};
    case "updateExternalReferencesHashesUpdate":
        if((state.external_references[action.data.orderNumber].hashes === null) || (typeof state.external_references[action.data.orderNumber].hashes === "undefined")){
            state.external_references[action.data.orderNumber].hashes = {};
        }

        state.external_references[action.data.orderNumber].hashes[action.data.newHash.hash] = action.data.newHash.type;

        return {...state};
    case "updateExternalReferencesHashesDelete":
        delete state.external_references[action.data.orderNumber].hashes[action.data.hashName];

        return {...state};
    case "updateGranularMarkings":
        if(!state.granular_markings){
            state.granular_markings = [];
        }

        for(let keyGM of state.granular_markings){
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

        state.granular_markings.push(action.data);

        return {...state};
    case "updateExtensions":
        if(!state.extensions){
            state.extensions = {};
        }

        state.extensions[action.data.name] = action.data.description;

        return {...state};
    case "deleteKillChain":
        state.kill_chain_phases.splice(action.data, 1);
    
        return {...state};
    case "deleteElementAdditionalTechnicalInformation":
        switch(action.data.itemType){
        case "extensions":
            delete state.extensions[action.data.item];

            return {...state};
        case "granular_markings":
            state.granular_markings.splice(action.data.orderNumber, 1);

            return {...state};
        case "external_references":
            state.external_references.splice(action.data.orderNumber, 1);

            return {...state};
        }
    }
}
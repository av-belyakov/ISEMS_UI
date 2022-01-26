"use strict";

module.exports.getRequestPattern = function(reqData){
    let timeSeen = {
            start: "0001-01-01T00:00:00.000+00:00",
            end: "0001-01-01T00:00:00.000+00:00",
        },
        listSortableField = ["document_type", "data_created", "data_modified", "data_first_seen", "data_last_seen", "ipv4", "ipv6", "country"],
        listDocumentsType = [
            "attack-pattern",
            "artifact",
            "autonomous-system", 
            "campaign", 
            "course-of-action",
            "directory",
            "domain-name",
            "email-addr",
            "file",
            "ipv4-addr",
            "ipv6-addr",
            "grouping",
            "identity",
            "indicator",
            "infrastructure",
            "intrusion-set",
            "location",
            "malware",
            "malware-analysis",
            "mac-addr",
            "mutex",
            "note",
            "network-traffic",
            "observed-data",
            "opinion",
            "process",
            "software",
            "report",
            "threat-actor",
            "url",
            "user-account",
            "tool",
            "vulnerability",
            "windows-registry-key",
            "x509-certificate",
        ],
        msg = {
            collection_name: "stix object",
            paginate_parameters: {
                max_part_size: 15,
                current_part_number: 1,
            },
            sortable_field: "data_created",
            search_parameters: {
                documents_id: [],
                documents_type: [],
                created: {
                    start: "0001-01-01T00:00:00.000+00:00",
                    end: "0001-01-01T00:00:00.000+00:00",
                },
                modified: {
                    start: "0001-01-01T00:00:00.000+00:00",
                    end: "0001-01-01T00:00:00.000+00:00",
                },
                created_by_ref: "",
                specific_search_fields: [],
                outside_specification_search_fields: {
                    // принятые решения по компьютерной угрозе
                    decisions_made_computer_threat: "",
                    // тип компьютерной угрозы
                    computer_threat_type: "",
                },
            },
        };

    if((typeof reqData.arguments === "undefined") || (typeof reqData.arguments.searchParameters === "undefined")){
        throw new Error("Получены невалидные параметры запроса.");
    }

    if(typeof reqData.arguments.paginateParameters !== "undefined"){
        if((typeof reqData.arguments.paginateParameters.maxPartSize !== "undefined") && (typeof reqData.arguments.paginateParameters.currentPartNumber !== "undefined")){
            msg.paginate_parameters.max_part_size = reqData.arguments.paginateParameters.maxPartSize;
            msg.paginate_parameters.current_part_number = reqData.arguments.paginateParameters.currentPartNumber;
        }
    }
        
    for(let field of listSortableField){
        if(field === reqData.arguments.sortableField){
            msg.sortable_field = reqData.arguments.sortableField;
        }
    }
    
    // --- поисковые параметры запроса ---
    if((typeof reqData.arguments.searchParameters.documentsId !== "undefined") && (reqData.arguments.searchParameters.documentsId.length > 0)){
        msg.search_parameters.documents_id = reqData.arguments.searchParameters.documentsId;
    }

    if((typeof reqData.arguments.searchParameters.documentsType !== "undefined") && (reqData.arguments.searchParameters.documentsType.length > 0)){
        for(let docType of reqData.arguments.searchParameters.documentsType){
            if(listDocumentsType.includes(docType)){
                msg.search_parameters.documents_type.push(docType);
            }
        }   
    }
    
    if(!isNaN(Date.parse(reqData.arguments.searchParameters.created.start)) && !isNaN(Date.parse(reqData.arguments.searchParameters.created.end))){
        msg.search_parameters.created = { start: reqData.arguments.searchParameters.created.start, end: reqData.arguments.searchParameters.created.end };
    }
        
    if(!isNaN(Date.parse(reqData.arguments.searchParameters.modified.start)) && !isNaN(Date.parse(reqData.arguments.searchParameters.modified.end))){
        msg.search_parameters.modified = { start: reqData.arguments.searchParameters.modified.start, end: reqData.arguments.searchParameters.modified.end };
    }

    if(typeof reqData.arguments.searchParameters.createdByRef !== "undefined"){
        msg.search_parameters.created_by_ref = reqData.arguments.searchParameters.createdByRef;
    }

    if(typeof reqData.arguments.searchParameters.outsideSpecificationSearchFields !== "undefined"){
        if(typeof reqData.arguments.searchParameters.outsideSpecificationSearchFields.decisionsMadeComputerThreat !== "undefined"){
            msg.search_parameters.outside_specification_search_fields.decisions_made_computer_threat = reqData.arguments.searchParameters.outsideSpecificationSearchFields.decisionsMadeComputerThreat;
        }

        if(typeof reqData.arguments.searchParameters.outsideSpecificationSearchFields.computerThreatType !== "undefined"){
            msg.search_parameters.outside_specification_search_fields.computer_threat_type = reqData.arguments.searchParameters.outsideSpecificationSearchFields.computerThreatType;
        }
    }

    let countSpecificSearchFields = reqData.arguments.searchParameters.specificSearchFields.length;
    if(countSpecificSearchFields === 0){
        return msg;
    }

    for(let i = 0; i < countSpecificSearchFields; i++){
        let item = reqData.arguments.searchParameters.specificSearchFields[i];

        if((typeof item.firstSeen === "undefined") || (isNaN(Date.parse(item.firstSeen.start))) || (isNaN(Date.parse(item.firstSeen.end)))){
            reqData.arguments.searchParameters.specificSearchFields[i].firstSeen = timeSeen;
           
        }

        if((typeof item.lastSeen === "undefined") || (isNaN(Date.parse(item.lastSeen.start))) || (isNaN(Date.parse(item.lastSeen.end)))){
            reqData.arguments.searchParameters.specificSearchFields[i].lastSeen = timeSeen;
        }

        if((typeof item.published === "undefined") || isNaN(Date.parse(item.published))){
            reqData.arguments.searchParameters.specificSearchFields[i].published = "1970-01-01T00:00:00.000+00:00";
        }
    }

    let specificSearchFieldsTmp = reqData.arguments.searchParameters.specificSearchFields[0];

    msg.search_parameters.specific_search_fields.push(specificSearchFieldsTmp);

    return msg;
};
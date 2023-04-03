const listExtendedObject = [
    {name: "report", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any STIX object)
    {name: "grouping", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any STIX object)
    {name: "malware", listProperties: [ 
        "operating_system_refs", 
        "sample_refs" 
    ]},//operating_system_refs (SCO software) 
    // and sample_refs (SCO file and artifact)
    {name: "malware-analysis", listProperties: [ 
        "host_vm_ref",
        "operating_system_ref",
        "installed_software_refs",
        "sample_ref",
    ]}, //host_vm_ref (SCO software), 
    // operating_system_ref (SCO software),
    // installed_software_refs (SCO software),
    // sample_ref (SCO file, artifact and network traffic)
    {name: "note", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any STIX object)
    {name: "email-addr", listProperties: [ 
        "belongs_to_ref" 
    ]}, //belongs_to_ref (SCO user-account)
    {name: "email-message", listProperties: [ 
        "raw_email_ref",
        "bcc_refs",
        "cc_refs",
        "to_refs",
        "sender_ref",
        "from_ref", 
    ]}, //belongs_to_ref (SCO artifact and email-address)
    {name: "observed-data", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any SCO)
    {name: "opinion", listProperties: [ 
        "object_refs" 
    ]}, //object_refs (any STIX object)
    //SCO
    {name: "domain-name", listProperties: [ 
        "resolves_to_refs" 
    ]}, //resolves_to_refs (ipv4-addr, ipv6-addr, domain-name)
    {name: "directory", listProperties: [ 
        "contains_refs" 
    ]}, //contains_refs (directory, file)
    {name: "file", listProperties: [ 
        "content_ref",
        "contains_refs" 
    ]}, //contains_refs (any STIX object)
    {name: "ipv4-addr", listProperties: [ 
        "resolves_to_refs", 
        "belongs_to_refs" 
    ]},//resolves_to_refs (SCO mac-addr) 
    // and belongs_to_refs (SCO autonomous-system)
    {name: "ipv6-addr", listProperties: [ 
        "resolves_to_refs", 
        "belongs_to_refs" 
    ]},//resolves_to_refs (SCO mac-addr) 
    // and belongs_to_refs (SCO autonomous-system)
    {name: "network-traffic", listProperties: [ 
        "src_ref", 
        "dst_ref",
        "src_payload_ref", 
        "dst_payload_ref",
        "encapsulates_refs", 
        "encapsulated_by_ref", 
    ]}, //src_ref or dst_ref (ipv4-addr, ipv6-addr, domain-name, mac-addr)
    // src_payload_ref or dst_payload_ref (SCO artifact)
    // encapsulates_refs or encapsulated_by_ref (network-traffic)
    {name: "http-request-ext", listProperties: [ 
        "message_body_data_ref" 
    ]}, //message_body_data_ref (SCO artifact)
    {name: "process", listProperties: [ 
        "opened_connection_refs",
        "creator_user_ref",
        "image_ref",
        "parent_ref",
        "child_refs",
    ]}, //opened_connection_refs (SCO network-traffic)
    {name: "windows-registry-key", listProperties: [
        "creator_user_ref",
    ]}, //creator_user_ref (SCO user-account)
    // creator_user_ref (SCO user-account), image_ref (SCO file), parent_ref (process)
    // child_refs (process)
];

export default listExtendedObject;
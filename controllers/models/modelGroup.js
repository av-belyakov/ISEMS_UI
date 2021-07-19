/*
 * Описание модели группы пользователей
 * */

"use strict";

const globalObject = require("../../configure/globalObject");
const connection = globalObject.getData("descriptionDB", "MongoDB", "connection");

let groupSchema = new connection.Schema({
    group_name: String,
    date_register: Number,
    menu_items: {
        id: String,
        name: String,
        analysis_sip: { id: String, status: Boolean, description: String },
        security_event_management: { id: String, status: Boolean, description: String },
        network_interaction: { id: String, status: Boolean, description: String },
        element_settings: {
            id: String,
            name: String,
            setting_groups: { id: String, status: Boolean, description: String },
            setting_users: { id: String, status: Boolean, description: String },
            setting_organizations_and_sources: { id: String, status: Boolean, description: String },
            setting_ids_rules: { id: String, status: Boolean, description: String },
            setting_geoip: { id: String, status: Boolean, description: String },
            setting_search_rules: { id: String, status: Boolean, description: String },
            setting_reputational_lists: { id: String, status: Boolean, description: String }
        }
    },
    management_analysis_sip: {
        id: String,
        name: String,
        element_settings: {
            save: { id: String, status: Boolean, description: String }
        }
    },
    management_security_event_management: {
        id: String,
        name: String,
        element_settings: {
            create: { id: String, status: Boolean, description: String },
            editing_information: { id: String, status: Boolean, description: String },
            privileged_group: { id: String, status: Boolean, description: String },
        }
    },
    management_network_interaction: {
        id: String,
        name: String,
        element_settings: {
            management_tasks_filter: {
                id: String,
                name: String,
                element_settings: {
                    create: { id: String, status: Boolean, description: String },
                    stop: { id: String, status: Boolean, description: String },
                    delete: { id: String, status: Boolean, description: String }
                }
            },
            management_tasks_import: {
                id: String,
                name: String,
                element_settings: {
                    stop: { id: String, status: Boolean, description: String },
                    resume: { id: String, status: Boolean, description: String }
                }
            },
            management_uploaded_files: {
                id: String,
                name: String,
                element_settings: {
                    status_change: { id: String, status: Boolean, description: String },
                    delete: { id: String, status: Boolean, description: String }
                }
            },
        }
    },
    management_users: {
        id: String,
        name: String,
        element_settings: {
            create: { id: String, status: Boolean, description: String },
            edit: { id: String, status: Boolean, description: String },
            delete: { id: String, status: Boolean, description: String }
        }
    },
    management_groups: {
        id: String,
        name: String,
        element_settings: {
            create: { id: String, status: Boolean, description: String },
            edit: { id: String, status: Boolean, description: String },
            delete: { id: String, status: Boolean, description: String }
        }
    },
    management_organizations_and_sources: {
        id: String,
        name: String,
        element_settings: {
            management_organizations: {
                id: String,
                name: String,
                element_settings: {
                    create: { id: String, status: Boolean, description: String },
                    edit: { id: String, status: Boolean, description: String },
                    delete: { id: String, status: Boolean, description: String }
                }
            },
            management_division: {
                id: String,
                name: String,
                element_settings: {
                    create: { id: String, status: Boolean, description: String },
                    edit: { id: String, status: Boolean, description: String },
                    delete: { id: String, status: Boolean, description: String }
                }
            },
            management_sources: {
                id: String,
                name: String,
                element_settings: {
                    create: { id: String, status: Boolean, description: String },
                    edit: { id: String, status: Boolean, description: String },
                    delete: { id: String, status: Boolean, description: String }
                }
            },
        },
    },
    management_ids_rules: {
        id: String,
        name: String,
        element_settings: {
            create: { id: String, status: Boolean, description: String },
            edit: { id: String, status: Boolean, description: String },
            delete: { id: String, status: Boolean, description: String }
        }
    },
    management_geoip: {
        id: String,
        name: String,
        element_settings: {
            create: { id: String, status: Boolean, description: String },
            delete: { id: String, status: Boolean, description: String }
        }
    },
    management_search_rules: {
        id: String,
        name: String,
        element_settings: {
            create: { id: String, status: Boolean, description: String },
            edit: { id: String, status: Boolean, description: String },
            delete: { id: String, status: Boolean, description: String }
        }
    },
    management_reputational_lists: {
        id: String,
        name: String,
        element_settings: {
            create: { id: String, status: Boolean, description: String },
            edit: { id: String, status: Boolean, description: String },
            delete: { id: String, status: Boolean, description: String }
        }
    }
});

groupSchema.set("toObject", { getters: true });

module.exports = connection.model("group", groupSchema);
import React from "react";
import { 
    Grid,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateListLanguageCodeISO639_2 } from "../anyElements.jsx";

export default function CreateSoftwarePatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerCPE,
        handlerName,
        handlerSWID,
        handlerVendor,
        handlerVersion,
        handlerLanguages,
    } = props;

    let currentTime = helpers.getToISODatetime();
    
    if(!campaignPatterElement.created){
        campaignPatterElement.created = currentTime;
    }
    if(!campaignPatterElement.modified){
        campaignPatterElement.modified = currentTime;
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Наименование:</span></Grid>
            <Grid item container md={8}>
                {(campaignPatterElement.id && campaignPatterElement.id !== "")? 
                    <span className="mt-2">{campaignPatterElement.name}</span>:
                    <TextField
                        fullWidth
                        disabled={isDisabled}
                        id="name-element"
                        InputLabelProps={{ shrink: true }}
                        onChange={handlerName}
                        value={(campaignPatterElement.name)? campaignPatterElement.name: ""}
                    />}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Запись Common Platform Enumeration (CPE):</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="cpe-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerCPE}
                    value={(campaignPatterElement.cpe)? campaignPatterElement.cpe: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Запись Тегов Software Identification ID (SWID):</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="swid-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerSWID}
                    value={(campaignPatterElement.swid)? campaignPatterElement.swid: ""}
                />
            </Grid>
        </Grid>

        <CreateListLanguageCodeISO639_2 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement} 
            headerCodeLanguages={handlerLanguages}
        />

        <Grid container direction="row" spacing={3} style={{ marginTop: "2px" }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Название производителя программного обеспечения:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="vendor-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerVendor}
                    value={(campaignPatterElement.vendor)? campaignPatterElement.vendor: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Версия программного обеспечения:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="version-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerVersion}
                    value={(campaignPatterElement.version)? campaignPatterElement.version: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateSoftwarePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerCPE: PropTypes.func.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerSWID: PropTypes.func.isRequired,
    handlerVendor: PropTypes.func.isRequired,
    handlerVersion: PropTypes.func.isRequired,
    handlerLanguages: PropTypes.func.isRequired,
};

/**
//SoftwareCyberObservableObjectSTIX объект "Software Object", по терминологии STIX, содержит свойства, связанные с программным обеспечением, включая программные продукты.
// Name - название программного обеспечения
// CPE - содержит запись Common Platform Enumeration (CPE) для программного обеспечения, если она доступна. Значение этого свойства должно быть значением
// CPE v2.3 из официального словаря NVD CPE [NVD]
// SwID - содержит запись Тегов Software Identification ID (SWID) [SWID] для программного обеспечения, если таковая имеется. SwID помеченный tagId, является
//  глобально уникальным идентификатором и ДОЛЖЕН использоваться как полномочие для идентификации помеченного продукта
// Languages -содержит языки, поддерживаемые программным обеспечением. Значение каждого елемента списка ДОЛЖНО быть кодом языка ISO 639-2
// Vendor - содержит название производителя программного обеспечения
// Version - содержит версию ПО
type SoftwareCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Name      string   `json:"name" bson:"name"`
	CPE       string   `json:"cpe" bson:"cpe"`
	SwID      string   `json:"swid" bson:"swid"`
	Languages []string `json:"languages" bson:"languages"`
	Vendor    string   `json:"vendor" bson:"vendor"`
	Version   string   `json:"version" bson:"version"`
}
 */
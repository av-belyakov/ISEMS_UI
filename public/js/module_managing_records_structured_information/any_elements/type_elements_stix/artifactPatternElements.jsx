import React from "react";
import {
    Grid,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { 
    CreateListHashes,
    CreateListEncryptionAlgorithm,
} from "../anyElements.jsx";

export default function CreateArtifactPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerURL,
        handlerName,
        handlerHashes,
        handlerMimeType,
        handlerPayloadBin,
        handlerDescription,
        handlerDecryptionKey,
        handlerEncryptionAlgorithm,
    } = props;

    let currentTime = helpers.getToISODatetime();
    
    if(!campaignPatterElement.created){
        campaignPatterElement.created = currentTime;
    }
    if(!campaignPatterElement.modified){
        campaignPatterElement.modified = currentTime;
    }

    console.log("func 'CreateArtifactPatternElements', campaignPatterElement:", campaignPatterElement);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование:</span></Grid>
            <Grid item container md={8} >
                {(campaignPatterElement.id && campaignPatterElement.id !== "")? 
                    campaignPatterElement.name:
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
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Дата и время</span>&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
            <Grid item container md={8}></Grid>
        </Grid>      
    
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">создания:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>
    
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">последнего обновления:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Подробное описание:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-description-static"
                    multiline
                    minRows={3}
                    maxRows={8}
                    fullWidth
                    disabled={isDisabled}
                    onChange={handlerDescription}
                    value={(campaignPatterElement.description)? campaignPatterElement.description: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Тип файлов IANA:</span></Grid>
            <Grid item container md={8} >
                <TextField
                    fullWidth
                    //disabled={isDisabled}
                    id="mime-type-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerMimeType}
                    value={(campaignPatterElement.mime_type)? campaignPatterElement.mime_type: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Бинарные данные в base64:</span></Grid>
            <Grid item container md={8} >
                <TextField
                    fullWidth
                    //disabled={isDisabled}
                    id="payload-bin-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerPayloadBin}
                    value={(campaignPatterElement.payload_bin)? campaignPatterElement.payload_bin: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Унифицированный указатель ресурса (URL):</span></Grid>
            <Grid item container md={8} >
                <TextField
                    fullWidth
                    //disabled={isDisabled}
                    id="url-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerURL}
                    value={(campaignPatterElement.url)? campaignPatterElement.url: ""}
                />
            </Grid>
        </Grid>

        <CreateListHashes 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement}
            handlerHashes={handlerHashes} />

        <CreateListEncryptionAlgorithm 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement}
            handlerEncryptionAlgorithm={handlerEncryptionAlgorithm} />

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Ключ для дешифрования зашифрованных данных:</span></Grid>
            <Grid item container md={8} >
                <TextField
                    fullWidth
                    //disabled={isDisabled}
                    id="decryption-key-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerDecryptionKey}
                    value={(campaignPatterElement.decryption_key)? campaignPatterElement.decryption_key: ""}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateArtifactPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,    
    handlerURL: PropTypes.func.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerHashes: PropTypes.func.isRequired,
    handlerMimeType: PropTypes.func.isRequired,
    handlerPayloadBin: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerDecryptionKey: PropTypes.func.isRequired,
    handlerEncryptionAlgorithm: PropTypes.func.isRequired,
};
import React from "react";
import {
    Grid,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";
import validatorjs from "validatorjs";

import { 
    CreateHashes,
    CreateHashesList,
    CreateListEncryptionAlgorithm,
} from "../anyElements.jsx";

export default function CreateArtifactPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerURL,
        handlerMimeType,
        handlerAddHashes,
        handlerPayloadBin,
        handlerDeleteHashe,
        handlerDecryptionKey,
        handlerEncryptionAlgorithm,
    } = props;

    let [ isInvalidURLValue, setIsInvalidURLValue ] = React.useState(true);
    let [ isInvalidPayloadBinValue, setIsInvalidPayloadBinValue ] = React.useState(true);

    React.useEffect(() => {
        if(!campaignPatterElement.url || (typeof campaignPatterElement.url === "undefined")){
            setIsInvalidURLValue(true);

            return;
        }

        if(validatorjs.isURL(campaignPatterElement.url)){
            setIsInvalidURLValue(false);

            return;
        }

        setIsInvalidURLValue(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ campaignPatterElement.url ]);

    React.useEffect(() => {
        if(!campaignPatterElement.payload_bin || (typeof campaignPatterElement.payload_bin === "undefined")){
            setIsInvalidPayloadBinValue(true);

            return;
        }

        if(validatorjs.isBase64(campaignPatterElement.payload_bin)){
            setIsInvalidPayloadBinValue(false);

            return;
        }

        setIsInvalidPayloadBinValue(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ campaignPatterElement.payload_bin ]);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end" className="mt-2"><span className="text-muted">Тип файлов IANA:</span></Grid>
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
            <Grid item container md={4} justifyContent="flex-end" className="mt-2"><span className="text-muted">Бинарные данные в base64:</span></Grid>
            <Grid item container md={8} >
                <TextField
                    fullWidth
                    //disabled={isDisabled}
                    id="payload-bin-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerPayloadBin}
                    value={(campaignPatterElement.payload_bin)? campaignPatterElement.payload_bin: ""}
                    error={isInvalidPayloadBinValue}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end" className="mt-2"><span className="text-muted">Унифицированный указатель ресурса (URL):</span></Grid>
            <Grid item container md={8} >
                <TextField
                    fullWidth
                    //disabled={isDisabled}
                    id="url-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerURL}
                    value={(campaignPatterElement.url)? campaignPatterElement.url: ""}
                    error={isInvalidURLValue}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end" className="mt-2 mb-2"><span className="text-muted">Ключ для дешифрования зашифрованных данных:</span></Grid>
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

        <CreateListEncryptionAlgorithm 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement}
            handlerEncryptionAlgorithm={handlerEncryptionAlgorithm} 
        />

        <CreateHashes
            isDisabled={isDisabled}
            handlerAddHashe={handlerAddHashes} 
        />

        <CreateHashesList
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement} 
            handlerDeleteHashe={handlerDeleteHashe} 
        />
    </React.Fragment>);
}

CreateArtifactPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerURL: PropTypes.func.isRequired,
    handlerMimeType: PropTypes.func.isRequired,
    handlerAddHashes: PropTypes.func.isRequired,
    handlerPayloadBin: PropTypes.func.isRequired,
    handlerDeleteHashe: PropTypes.func.isRequired,
    handlerDecryptionKey: PropTypes.func.isRequired,
    handlerEncryptionAlgorithm: PropTypes.func.isRequired,
};
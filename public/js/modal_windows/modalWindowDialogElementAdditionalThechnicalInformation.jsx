"use strict";

import React, { useState, useCallback } from "react";
import { 
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Grid,
    Select,
    MenuItem,
    TextField,
    FormControl,
    InputLabel,
    IconButton,
    Typography,
    
} from "@material-ui/core";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    formControlTypeHashRE: {
        minWidth: 120,
    },
//    selectEmpty: {
//        marginTop: theme.spacing(2),
//    },
}));

const listHashType = [ 
    { type: "MD5", description: "MD5" },
    { type: "SHA-1", description: "SHA-1" },
    { type: "SHA256", description: "SHA-2 (256)" },
    { type: "SHA384", description: "SHA-2 (384)" },
    { type: "SHA512", description: "SHA-2 (512)" },
    { type: "SHA-3", description: "SHA-3" },
    { type: "RIPEMD", description: "RIPEMD" },
    { type: "Base64", description: "Base64" },
];

export default function DialogElementAdditionalThechnicalInformation(props){
    let { show, onHide, objInfo, uuidValue, listObjectInfo, handlerExternalReferencesButtonSave } = props;
    const listTitle = {
        "external_references": "Управление внешними ссылками",
        "granular_markings": "Управление \"гранулярными метками\"",
        "extensions": "Управление дополнительной информацией",
    };

    //    console.log("func 'DialogElementAdditionalThechnicalInformation', START");
    //  console.log(objInfo);

    let isNewElemER = ((objInfo.actionType === "new") && (objInfo.modalType === "external_references"));
    let [ buttonSaveIsDisabled, setButtonSaveIsDisabled ] = useState(true),
        [ valuesIsInvalideSourceNameER, setValuesIsInvalideSourceNameER ] = useState(true),
        [ valuesIsInvalidSelectorsGM, setValuesIsInvalidSelectorsGM ] = useState(true),
        [ valueER, setValueER ] = useState({
            source_name: "",
            description: "",
            url: "",
            hashes: [],
        }),
        [ valueGM, setValueGM ] = useState({
            lang: "",
            marking_ref: "",
            selectors: [], //jбязательное значение
        }),
        [ valueE, setValueE ] = useState({
            //            source_name: "",
            //            description: "",
            //            url: "",
            //            hashes: [],
        });

    console.log("func 'DialogElementAdditionalThechnicalInformation', START...");
    console.log(listObjectInfo[objInfo.objectId]);

    const handlerSourceNameExternalReferences = (obj) => {
        let valueERTmp = _.cloneDeep(valueER);     
        valueERTmp.source_name = obj.target.value;
        if(obj.target.value.length > 0){
            setValuesIsInvalideSourceNameER(false);
            setButtonSaveIsDisabled(false);
        } else {
            setValuesIsInvalideSourceNameER(true);
            setButtonSaveIsDisabled(true);
        }
        
        setValueER(valueERTmp);
    };
        
    const handlerDescriptionExternalReferences = (obj) => {
        let valueERTmp = _.cloneDeep(valueER);
        valueERTmp.description = obj.target.value;
        
        setValueER(valueERTmp);
    };
        
    const handlerURLExternalReferences = (obj) => {
        let valueERTmp = _.cloneDeep(valueER);
        valueERTmp.url = obj.target.value;
        
        setValueER(valueERTmp);
    };

    const handlerHashesExternalReferences = (hashes) => {
        let valueERTmp = _.cloneDeep(valueER);
        valueERTmp.hashes = hashes;
        
        setValueER(valueERTmp);
    };

    const handlerLangGranularMarkings = (obj) => {

    };

    const handlerMarkingRefGranularMarkings = (obj) => {

    };

    const handlerSelectorsGranularMarkings = (obj) => {

    };

    const switchTypeElement = () => {
        switch(objInfo.modalType){
        case "external_references":
            return <ManagementExternalReferencesObject
                sourceName={objInfo.sourceName}
                externalId={uuidValue}
                listObjectInfo={listObjectInfo[objInfo.objectId]}
                sourceNameIsInvalid={valuesIsInvalideSourceNameER}
                handlerSourceName={handlerSourceNameExternalReferences}
                handlerDescription={handlerDescriptionExternalReferences}
                handlerURL={handlerURLExternalReferences}
                handlerHashList={handlerHashesExternalReferences}
            />;

        case "granular_markings":
            return <ManagementGranularMarkingsObject
                externalId={uuidValue}
                selectorsIsInvalid={valuesIsInvalidSelectorsGM}
                listObjectInfo={listObjectInfo[objInfo.objectId]}
                handlerLang={handlerLangGranularMarkings}
                handlerMarkingRef={handlerMarkingRefGranularMarkings}
                handlerSelectors={handlerSelectorsGranularMarkings}
            />;
    
            /**
 * lang: "",
            marking_ref: "",
            selectors: [],
 */

        case "extensions":
            return <ManagementExtensionsObject 
                externalId={uuidValue} />;

        }

        /*if(objInfo.actionType === "new"){
            switch(objInfo.modalType){
            case "external_references":
                return <ManagementExternalReferencesObject
                    externalId={uuidValue}
                    sourceNameIsInvalid={valuesIsInvalideSourceNameER}
                    handlerSourceName={handlerSourceNameExternalReferences}
                    handlerDescription={handlerDescriptionExternalReferences}
                    handlerURL={handlerURLExternalReferences}
                    handlerHashList={handlerHashesExternalReferences}
                />;

            case "granular_markings":
                return <CreateNewGranularMarkings
                    externalId={uuidValue} />;
    
            case "extensions":
                return <CreateNewExtensions 
                    externalId={uuidValue} />;

            }
        }

        if(objInfo.actionType === "edit"){
            switch(objInfo.modalType){
            case "external_references":
                return <EditExternalReferences/>; 

            case "granular_markings":
                return <EditGranularMarkings/>;

            }        
        }*/
    
        return (<Grid container direction="row">
            <Grid item md={12}>
                <Typography color="error">Ошибка! Неопределенно действие над объектом.</Typography>
            </Grid>
        </Grid>);
    };

    let buttonIsDisabled = buttonSaveIsDisabled;

    if(show && (objInfo.modalType === "external_references") && (objInfo.actionType === "edit")){
        if((listObjectInfo[objInfo.objectId] !== null) && (typeof listObjectInfo[objInfo.objectId] !== "undefined")){
            for(let i = 0; i < listObjectInfo[objInfo.objectId].external_references.length; i++){
                if(listObjectInfo[objInfo.objectId].external_references[i].source_name === objInfo.sourceName){
                    buttonIsDisabled = false;

                    break;
                }
            }
        }
    }

    return (<Dialog
        aria-labelledby="form-dialog-element"
        fullWidth
        maxWidth="md"
        open={show} 
        onClose={onHide}>
        <DialogTitle id="form-dialog-title">{listTitle[objInfo.modalType]}</DialogTitle>
        <DialogContent>{switchTypeElement()}</DialogContent>
        <DialogActions>
            <Button onClick={onHide} color="primary">закрыть</Button>
            <Button 
                disabled={buttonIsDisabled}
                onClick={() => { 
                    let value = {};

                    switch(objInfo.modalType){
                    case "external_references":
                        if(objInfo.actionType === "new"){
                            value = valueER;

                            break;
                        }

                        for(let i = 0; i < listObjectInfo[objInfo.objectId].external_references.length; i++){
                            if(listObjectInfo[objInfo.objectId].external_references[i].source_name === objInfo.sourceName){    
                                value.source_name = objInfo.sourceName;
                                value.description = (valueER.description === "") ? listObjectInfo[objInfo.objectId].external_references[i].description: valueER.description;
                                value.url = (valueER.url === "") ? listObjectInfo[objInfo.objectId].external_references[i].url: valueER.url;
                                value.hashes = (valueER.hashes === "") ? listObjectInfo[objInfo.objectId].external_references[i].hashes: valueER.hashes;
    
                                break;
                            }
                        }

                        break;
                    case "granular_markings":
                        value= valueGM;

                        break;
                    case "extensions":
                        value = valueE;

                        break;    
                    }

                    handlerExternalReferencesButtonSave({ 
                        actionType: objInfo.actionType, 
                        modalType: objInfo.modalType,
                        value: value, 
                    });

                    setValuesIsInvalideSourceNameER(true);
                    setButtonSaveIsDisabled(true);
                }} 
                color="primary">
                сохранить
            </Button>
        </DialogActions>
    </Dialog>);
}

DialogElementAdditionalThechnicalInformation.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    objInfo: PropTypes.object.isRequired,
    uuidValue: PropTypes.string.isRequired,
    listObjectInfo: PropTypes.object.isRequired,
    handlerExternalReferencesButtonSave: PropTypes.func.isRequired,
};

function ManagementExternalReferencesObject(props){
    const classes = useStyles();
    let { externalId, 
        sourceNameIsInvalid,
        sourceName,
        listObjectInfo, 
        handlerSourceName,
        handlerDescription,
        handlerURL,
        handlerHashList } = props;

    let eid = `external-reference--${externalId}`;
    let erInfo = {};
    listObjectInfo.external_references.forEach((item) => {
        if(item.source_name === sourceName){
            eid = item.external_id;
            erInfo = item;
        }
    });

    let [ selectItemHash, setSelectItemHash ] = useState(""),
        [ inputHash, setInputHash ] = useState(""),
        [ buttonAddHashIsDisabled, setButtonAddHashIsDisabled ] = useState(true),
        [ listHashes, setListHashes ] = useState((()=>{
            if((erInfo.hashes === null) || (typeof erInfo.hashes === "undefined")){
                return [];
            }

            let listTmp = [];
            for(let key in erInfo.hashes){
                listTmp.push({ type: key, description: erInfo.hashes[key] });
            }

            return listTmp;
        })());

    const handlerAddNewHash = () => {
            let listHashesTmp = listHashes.concat([{ type: selectItemHash, description: inputHash }]);

            setListHashes(listHashesTmp);
            setInputHash("");
            setSelectItemHash("");

            handlerHashList(listHashesTmp);
        },
        handlerDelItemHash = (num) => {
            let tmp = listHashes.slice();
            tmp.splice(num, 1);
            listHashes = tmp;
            setListHashes(listHashes);
            
            handlerHashList(listHashes);
        };

    let isInvalidSourceName = ((typeof erInfo.source_name === "undefined") || (erInfo.source_name === ""))? sourceNameIsInvalid: false;

    return (<React.Fragment>
        <Grid container direction="row">
            <Grid item md={12}><span className="text-muted">ID</span>: {eid}</Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item md={12}>
                <TextField
                    id="external-references-source-name"
                    label="наименование"
                    defaultValue={(typeof erInfo.source_name === "undefined")? "": erInfo.source_name}
                    disabled={(typeof erInfo.source_name !== "undefined")}
                    error={isInvalidSourceName}
                    fullWidth={true}
                    helperText="обязательное для заполнения поле"
                    onChange={handlerSourceName}
                />
            </Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item md={12}>
                <TextField
                    id="external-references-description"
                    label="описание"
                    fullWidth={true}
                    defaultValue={(typeof erInfo.description === "undefined")? "": erInfo.description}
                    onChange={handlerDescription}
                />
            </Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item md={12}>
                <TextField
                    id="external-references-url"
                    label="url"
                    fullWidth={true}
                    defaultValue={(typeof erInfo.url === "undefined")? "": erInfo.url}
                    onChange={handlerURL}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" key="key_input_hash_field">
            <Grid item md={2}>
                <FormControl className={classes.formControlTypeHashRE}>
                    <InputLabel id="label-hash-type-change">тип хеша</InputLabel>
                    <Select
                        labelId="chose-hash-select-label"
                        id="chose-hash-select-label"
                        value={selectItemHash}
                        fullWidth={true}
                        onChange={(elem) => {
                            let vt = elem.target.value;
                            setSelectItemHash(vt);
                            
                            if((vt.length > 0) && (inputHash.length > 0)){
                                setButtonAddHashIsDisabled(false);
                            } else {
                                setButtonAddHashIsDisabled(true);
                            }
                        }}>
                        {listHashType.map((elem, num)=>{
                            return <MenuItem value={elem.type} key={`key_${elem.type}_${num}`}>{elem.description}</MenuItem>;
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item md={8}>
                <TextField
                    id="external-references-hash"
                    label="хеш-сумма"
                    fullWidth
                    value={inputHash}
                    onChange={(elem) => {
                        let vt = elem.target.value;
                        setInputHash(vt);
                        
                        if((selectItemHash.length > 0) && (vt.length > 0)){
                            setButtonAddHashIsDisabled(false);
                        } else {
                            setButtonAddHashIsDisabled(true);
                        }
                    }}
                />
            </Grid>
            <Grid item md={2} className="text-right pt-2">
                <Button onClick={handlerAddNewHash} disabled={buttonAddHashIsDisabled}>добавить хеш</Button>
            </Grid>
        </Grid>
        {(listHashes.length === 0) ? 
            "" : 
            <Grid container direction="row" className="mt-3">
                <ol>
                    {listHashes.map((elem, numHash) => {
                        return (<li key={`key_item_hash_${numHash}`}>
                            {`${elem.type}: ${elem.description}`}&nbsp;
                            <IconButton aria-label="delete-hash" onClick={() => handlerDelItemHash.call(null, numHash)}>
                                <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                            </IconButton>
                        </li>);
                    })}
                </ol>
            </Grid> }
    </React.Fragment>);
}

ManagementExternalReferencesObject.propTypes = {
    externalId: PropTypes.string.isRequired,
    sourceName: PropTypes.string.isRequired,
    handlerURL: PropTypes.func.isRequired,
    listObjectInfo: PropTypes.object.isRequired,
    handlerHashList: PropTypes.func.isRequired,
    handlerSourceName: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    sourceNameIsInvalid: PropTypes.bool.isRequired,
};

function ManagementGranularMarkingsObject(props){
    let { externalId,
        selectorsIsInvalid,
        listObjectInfo,
        handlerLang,
        handlerMarkingRef,
        handlerSelectors } = props;

    let gmid = `granular-markings--${uuidv4()}`;
    let gmInfo = {};
    listObjectInfo.granular_markings.forEach((item) => {
        /*if(item.source_name === sourceName){
                eid = item.external_id;
                erInfo = item;
            }*/
    });

    /**
 * lang: "",
            marking_ref: "",
            selectors: [], //jбязательное значение
 */

    return (<React.Fragment>
        <Grid container direction="row">
            <Grid item md={12}><span className="text-muted">ID</span>: {gmid}</Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item md={12}>
                <TextField
                    id="granular-markings-lang"
                    label="lang"
                    fullWidth={true}
                    //                    defaultValue={(typeof erInfo.url === "undefined")? "": erInfo.url}
                    onChange={handlerLang   }
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

ManagementGranularMarkingsObject.propTypes = {
    externalId: PropTypes.string.isRequired,
    selectorsIsInvalid: PropTypes.bool.isRequired,
    listObjectInfo: PropTypes.object.isRequired,
    handlerLang: PropTypes.func.isRequired,
    handlerMarkingRef: PropTypes.func.isRequired,
    handlerSelectors: PropTypes.func.isRequired,
};


function ManagementExtensionsObject(props){
    let { externalId } = props;

    return (<DialogContentText>
        {`func 'CreateNewExtensions' ID:'${externalId}'`}
    </DialogContentText>);
}

ManagementExtensionsObject.propTypes = {
    externalId: PropTypes.string.isRequired,
};
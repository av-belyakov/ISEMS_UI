"use strict";

import React, { useState } from "react";
import { 
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
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
import validatejs from "validatejs";
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

export default function ModalWindowDialogElementAdditionalThechnicalInformation(props){
    let { show, 
        onHide, 
        objInfo, 
        uuidValue, 
        listObjectInfo, 
        handlerExternalReferencesButtonSave } = props;

    const listTitle = {
        "external_references": "Управление внешними ссылками",
        "granular_markings": "Управление \"гранулярными метками\"",
        "extensions": "Управление дополнительной информацией",
    };

    let defaultValueER = {
            source_name: "",
            description: "",
            url: "",
            hashes: [],
        },
        defaultValueGM = {
            lang: "",
            marking_ref: "",
            selectors: [],
        },
        defaultValueE = {
            name: "",
            description: "",
        };

    let [ buttonSaveIsDisabled, setButtonSaveIsDisabled ] = useState(true),
        [ valuesIsInvalideSourceNameER, setValuesIsInvalideSourceNameER ] = useState(true),
        [ valuesIsInvalidURLER, setValuesIsInvalidURLER ] = useState(false),
        [ valuesIsInvalideNameE, setValuesIsInvalideNameE ] = useState(true),
        [ valueER, setValueER ] = useState(defaultValueER),
        [ valueGM, setValueGM ] = useState(defaultValueGM),
        [ valueE, setValueE ] = useState(defaultValueE);

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
        setValuesIsInvalidURLER(((typeof valueERTmp.url !== "undefined") && (valueERTmp.url !== "") && (typeof validatejs({
            website: valueERTmp.url,
        }, {
            website: { url: { 
                allowLocal: true, 
                schemes: [ "http", "https", "ftp" ], 
            }},
        }) !== "undefined")));
    };

    const handlerHashesExternalReferences = (hashes) => {
        let valueERTmp = _.cloneDeep(valueER);
        valueERTmp.hashes = hashes;
        
        setValueER(valueERTmp);
    };

    const handlerLangGranularMarkings = (orderNumber, obj) => {
        let valueGMTmp = _.cloneDeep(valueGM);
        valueGMTmp.lang = obj.target.value;
        
        setValueGM(valueGMTmp);
    };

    const handlerMarkingRefGranularMarkings = (orderNumber, obj) => {
        let valueGMTmp = _.cloneDeep(valueGM);
        valueGMTmp.marking_ref = obj.target.value;
        
        setValueGM(valueGMTmp);
    };

    const handlerSelectorsGranularMarkings = (list) => {
        let valueGMTmp = _.cloneDeep(valueGM);
        valueGMTmp.selectors = list;
        
        setValueGM(valueGMTmp);

        if(list.length > 0){
            setButtonSaveIsDisabled(false);
        } else {
            setButtonSaveIsDisabled(true);
        }
    };

    const handlerNameExtensions = (obj) => {
        let valueETmp = _.cloneDeep(valueE);
        valueETmp.name = obj.target.value;
        
        setValueE(valueETmp);

        if(obj.target.value.length > 0){
            setValuesIsInvalideNameE(false);
            setButtonSaveIsDisabled(false);
        } else {
            setValuesIsInvalideNameE(true);
            setButtonSaveIsDisabled(true);
        }
    };
    
    const handlerDescriptionExtensions = (obj) => {
        let valueETmp = _.cloneDeep(valueE);
        valueETmp.description = obj.target.value;
        
        setValueE(valueETmp);
    };

    const switchTypeElement = () => {
        switch(objInfo.modalType){
        case "external_references":
            return <ManagementExternalReferencesObject
                sourceName={objInfo.sourceName}
                externalId={uuidValue}
                urlIsInvalid={valuesIsInvalidURLER}
                listObjectInfo={listObjectInfo[objInfo.objectId]}
                sourceNameIsInvalid={valuesIsInvalideSourceNameER}
                handlerSourceName={handlerSourceNameExternalReferences}
                handlerDescription={handlerDescriptionExternalReferences}
                handlerURL={handlerURLExternalReferences}
                handlerHashList={handlerHashesExternalReferences}
            />;

        case "granular_markings":
            return <ManagementGranularMarkingsObject
                objInfo={objInfo}
                listObjectInfo={listObjectInfo[objInfo.objectId]}
                handlerLang={handlerLangGranularMarkings}
                handlerMarkingRef={handlerMarkingRefGranularMarkings}
                handlerSelectors={handlerSelectorsGranularMarkings}
            />;

        case "extensions":
            return <ManagementExtensionsObject 
                externalId={uuidValue} 
                nameIsInvalid={valuesIsInvalideNameE}
                handlerName={handlerNameExtensions}
                handlerDescription={handlerDescriptionExtensions}
            />;

        }
    
        return (<Grid container direction="row">
            <Grid item md={12}>
                <Typography color="error">Ошибка! Неопределенно действие над объектом.</Typography>
            </Grid>
        </Grid>);
    };

    let buttonIsDisabled = buttonSaveIsDisabled;

    (() => {
        if(!show || (objInfo.modalType !== "external_references") || (objInfo.actionType !== "edit")){
            return;
        }

        if((listObjectInfo[objInfo.objectId] === null) || (typeof listObjectInfo[objInfo.objectId] === "undefined")){
            return;
        }

        for(let i = 0; i < listObjectInfo[objInfo.objectId].external_references.length; i++){
            if(listObjectInfo[objInfo.objectId].external_references[i].source_name === objInfo.sourceName){
                buttonIsDisabled = false;

                break;
            }
        }
    })();

    (() => {
        if(!show || (objInfo.modalType !== "granular_markings") || (objInfo.actionType !== "edit")){
            return;
        }

        if((listObjectInfo[objInfo.objectId] === null) || (typeof listObjectInfo[objInfo.objectId] === "undefined")){
            return;
        }
            
        if(!Array.isArray(listObjectInfo[objInfo.objectId].granular_markings) || (typeof listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber] === "undefined")){
            return;
        }

        if(listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber].selectors.length <= 0){
            return;
        }
                
        buttonIsDisabled = false;  
    })();

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
                            value.external_id = `external-reference--${uuidValue}`;

                            setValueER(defaultValueER);

                            break;
                        }

                        for(let i = 0; i < listObjectInfo[objInfo.objectId].external_references.length; i++){
                            if(listObjectInfo[objInfo.objectId].external_references[i].source_name === objInfo.sourceName){
                                value.source_name = objInfo.sourceName;
                                value.description = ((valueER.description === "") && (typeof listObjectInfo[objInfo.objectId].external_references[i].description !== "undefined"))? 
                                    listObjectInfo[objInfo.objectId].external_references[i].description: 
                                    valueER.description;
                                value.url = ((valueER.url === "") && (typeof listObjectInfo[objInfo.objectId].external_references[i].url !== "undefined"))? 
                                    listObjectInfo[objInfo.objectId].external_references[i].url: 
                                    valueER.url;
                                value.hashes = ((valueER.hashes.length === 0) && (typeof listObjectInfo[objInfo.objectId].external_references[i].hashes !== "undefined"))? 
                                    listObjectInfo[objInfo.objectId].external_references[i].hashes: 
                                    valueER.hashes;
                                value.external_id = listObjectInfo[objInfo.objectId].external_references[i].external_id;
    
                                setValueER(defaultValueER);

                                break;
                            }
                        }

                        break;
                    case "granular_markings":
                        if(objInfo.actionType === "new"){
                            value = valueGM;
                            value.orderNumber = objInfo.orderNumber;

                            setValueGM(defaultValueGM);

                            break;
                        }

                        if((listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber] !== null) && (typeof listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber] !== "undefined")){
                            value.lang = ((valueGM.lang === "") && (typeof listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber].lang !== "undefined"))? 
                                listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber].lang: 
                                valueGM.lang;
                            value.marking_ref = ((valueGM.marking_ref === "") && (typeof listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber].marking_ref !== "undefined"))? 
                                listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber].marking_ref: 
                                valueGM.marking_ref;
                            value.selectors = ((valueGM.selectors.length === 0) && (typeof listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber].selectors !== "undefined"))? 
                                listObjectInfo[objInfo.objectId].granular_markings[objInfo.orderNumber].selectors: 
                                valueGM.selectors;
                            value.orderNumber = objInfo.orderNumber;
                        }

                        setValueGM(defaultValueGM);

                        break;
                    case "extensions":
                        value = valueE;

                        setValueE(defaultValueE);

                        break;    
                    }

                    handlerExternalReferencesButtonSave({ 
                        actionType: objInfo.actionType, 
                        modalType: objInfo.modalType,
                        value: value,
                        objectId: objInfo.objectId,
                    });

                    setValuesIsInvalideNameE(true);
                    setValuesIsInvalideSourceNameER(true);
                    setButtonSaveIsDisabled(true);
                }} 
                color="primary">
                сохранить
            </Button>
        </DialogActions>
    </Dialog>);
}

ModalWindowDialogElementAdditionalThechnicalInformation.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    objInfo: PropTypes.object.isRequired,
    uuidValue: PropTypes.string.isRequired,
    listObjectInfo: PropTypes.object.isRequired,
    handlerExternalReferencesButtonSave: PropTypes.func.isRequired,
};

function ManagementExternalReferencesObject(props){
    const classes = useStyles();
    let { 
        sourceName,
        externalId,
        urlIsInvalid, 
        listObjectInfo,
        sourceNameIsInvalid, 
        handlerSourceName,
        handlerDescription,
        handlerURL,
        handlerHashList, 
    } = props;

    /*
    sourceName={objInfo.sourceName}
    externalId={uuidValue}
    urlIsInvalid={valuesIsInvalidURLER}
    listObjectInfo={listObjectInfo[objInfo.objectId]}
    sourceNameIsInvalid={valuesIsInvalideSourceNameER}
    handlerSourceName={handlerSourceNameExternalReferences}
    handlerDescription={handlerDescriptionExternalReferences}
    handlerURL={handlerURLExternalReferences}
    handlerHashList={handlerHashesExternalReferences}
    */

    let eid = `external-reference--${externalId}`;
    let erInfo = {};

    if(Array.isArray(listObjectInfo.external_references)){
        listObjectInfo.external_references.forEach((item) => {
            if(item.source_name === sourceName){
                eid = item.external_id;
                erInfo = item;
            }
        });
    }

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
                    error={urlIsInvalid}
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
            <Grid item md={2} className="text-end pt-2">
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
    urlIsInvalid: PropTypes.bool.isRequired,
    listObjectInfo: PropTypes.object.isRequired,
    sourceNameIsInvalid: PropTypes.bool.isRequired,
    handlerURL: PropTypes.func.isRequired,
    handlerHashList: PropTypes.func.isRequired,
    handlerSourceName: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
};

function ManagementGranularMarkingsObject(props){
    let { objInfo,
        listObjectInfo,
        handlerLang,
        handlerMarkingRef,
        handlerSelectors } = props;

    let objGM = {};
    if(objInfo.orderNumber !== -1){
        if((listObjectInfo.granular_markings[objInfo.orderNumber] !== null) && (typeof listObjectInfo.granular_markings[objInfo.orderNumber] !== "undefined")){
            objGM = listObjectInfo.granular_markings[objInfo.orderNumber];
        }
    }

    let [ markingRef, setMarkingRef ] = useState(() => (typeof objGM.marking_ref === "undefined")? "": objGM.marking_ref),
        [ lang, setLang ] = useState(() => (typeof objGM.lang === "undefined")? "": objGM.lang),
        [ selectorInput, setSelectorInput ] = useState(""),
        [ selectorsList, setSelectorsList ] = useState(() => ((typeof objGM.selectors === "undefined") || (!Array.isArray(objGM.selectors)))? []: objGM.selectors);

    let buttonIsDisabled = (() => (selectorInput.length === 0))();

    const pphandlerMarkingRef = (obj) => {
        setMarkingRef(obj.target.value);

        handlerMarkingRef.call(null, objInfo.orderNumber, { target: { value: markingRef }});
    };

    const pphandlerGenerateMarkingRef = () => {
        let id = `granular-markings--${uuidv4()}`;
        setMarkingRef(id);

        handlerMarkingRef.call(null, objInfo.orderNumber, { target: { value: id }});
    };

    const pphandlerLang = (obj) => {
        let langValue = (obj.target.value).toUpperCase();
        setLang(langValue);

        handlerLang.call(null, objInfo.orderNumber, { target: { value: langValue }});
    };

    const pphandlerAddSelectorsList = () => {
        let selectorListTmp = selectorsList.slice();
        selectorListTmp.push(selectorInput);
        setSelectorsList(selectorListTmp);
        setSelectorInput("");

        handlerSelectors(selectorListTmp);
    };

    const pphandlerDelSelectorsList = (obj, num) => {
        if(selectorsList.length <= 1){
            return;
        }

        let selectorListTmp = selectorsList.slice();
        selectorListTmp.splice(num, 1);
        setSelectorsList(selectorListTmp);

        handlerSelectors(selectorListTmp);
    };

    let buttonDelIsDisabled = (() => selectorsList.length <= 1)();

    return (<React.Fragment>
        <Grid container direction="row">
            <Grid item md={9}>
                <TextField
                    id="granular-markings-marking-ref"
                    label="идентификатор объекта 'marking-definition'"
                    fullWidth={true}
                    value={markingRef}
                    onChange={pphandlerMarkingRef}
                />
            </Grid>
            <Grid item md={3} className="text-center pt-2">
                <Button onClick={pphandlerGenerateMarkingRef}>сгенерировать</Button>
            </Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item md={12}>
                <TextField
                    id="granular-markings-lang"
                    label="маркер языка"
                    fullWidth={true}
                    value={lang}
                    onChange={pphandlerLang}
                />
            </Grid>
        </Grid>
        <Grid container direction="row" key="key_input_hash_field">
            <Grid item md={6}>
                <TextField
                    id="external-references-hash"
                    label="идентификатор селектора"
                    fullWidth
                    value={selectorInput}
                    onChange={(obj) => setSelectorInput(obj.target.value)}
                />
            </Grid>
            <Grid item md={3} className="text-center pt-2">
                <Button onClick={() => setSelectorInput(`selector--${uuidv4()}`)} >
                    сгенерировать
                </Button>
            </Grid>
            <Grid item md={3} className="text-end pt-2">
                <Button 
                    onClick={pphandlerAddSelectorsList} 
                    disabled={buttonIsDisabled} color="primary" >
                        добавить селектор
                </Button>
            </Grid>
        </Grid>
        {(selectorsList.length === 0) ? 
            "" : 
            <Grid container direction="row" className="mt-3">
                <ol>
                    {selectorsList.map((elem, num) => {
                        return (<li key={`key_item_selector_${num}`}>
                            {elem}
                            <IconButton 
                                disabled={buttonDelIsDisabled}
                                aria-label="delete-selector" 
                                onClick={pphandlerDelSelectorsList.bind(null, num)} >
                                <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                            </IconButton>
                        </li>);
                    })}
                </ol>
            </Grid> }
    </React.Fragment>);
}

ManagementGranularMarkingsObject.propTypes = {
    objInfo: PropTypes.object.isRequired,
    handlerLang: PropTypes.func.isRequired,
    listObjectInfo: PropTypes.object.isRequired,
    handlerSelectors: PropTypes.func.isRequired,
    handlerMarkingRef: PropTypes.func.isRequired,
};


function ManagementExtensionsObject(props){
    let { nameIsInvalid,
        handlerName,
        handlerDescription } = props;

    let [ valueName, setValueName ] = useState(""),
        [ valueDescription, setValueDescription ] = useState("");

    const pphandlerName = (obj) => {
        setValueName(obj.target.value);

        handlerName(obj);
    };

    const pphandlerDescription = (obj) => {
        setValueDescription(obj.target.value);

        handlerDescription(obj);
    };

    return (<React.Fragment>
        <Grid container direction="row">
            <Grid item md={12}>
                <TextField
                    id="extensions-name"
                    label="наименование"
                    size="small"
                    fullWidth={true}
                    error={nameIsInvalid}
                    value={valueName}
                    onChange={pphandlerName}
                    variant="outlined"
                    helperText="обязательное для заполнения поле"
                />
            </Grid>
        </Grid>
        <Grid container direction="row" className="mt-3">
            <Grid item md={12}>
                <TextField
                    id="extensions-description"
                    label="подробное описание"
                    multiline
                    rows={3}
                    fullWidth
                    value={valueDescription}
                    onChange={pphandlerDescription}
                    variant="outlined"/>
            </Grid>
        </Grid>
    </React.Fragment>);
}

ManagementExtensionsObject.propTypes = {
    externalId: PropTypes.string.isRequired,
    handlerName: PropTypes.func.isRequired,
    nameIsInvalid: PropTypes.bool.isRequired,
    handlerDescription: PropTypes.func.isRequired,
};
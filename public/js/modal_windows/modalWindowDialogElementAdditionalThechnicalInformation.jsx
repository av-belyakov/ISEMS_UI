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
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
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
    let { show, onHide, objInfo, uuidValue, handlerExternalReferencesButtonSave } = props;
    const listTitle = {
        "external_references": "Управление внешними ссылками",
        "granular_markings": "Управление \"гранулярными метками\"",
        "extensions": "Управление дополнительной информацией",
    };
    let [ buttonSaveIsDisabled, setButtonSaveIsDisabled ] = useState(true),
        [ valuesIsInvalideSourceNameER, setValuesIsInvalideSourceNameER ] = useState(true),
        [ valueER, setValueER ] = useState({
            source_name: "",
            description: "",
            url: "",
            hashes: [],
        });

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

    const switchTypeElement = ()=>{

        //        console.log("func 'switchTypeElement', START...");
        //        console.log(`actionType:${objInfo.actionType}, modalType: ${objInfo.modalType}`);

        if(objInfo.actionType === "new"){
            switch(objInfo.modalType){
            case "external_references":
                return <CreateNewExternalReferences
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
        }
    
        return (<Grid container direction="row">
            <Grid item md={12}>
                <Typography color="error">Ошибка! Неопределенно действие над объектом.</Typography>
            </Grid>
        </Grid>);
    };

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
                disabled={buttonSaveIsDisabled}
                onClick={() => { handlerExternalReferencesButtonSave(valueER); }} 
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
    handlerExternalReferencesButtonSave: PropTypes.func.isRequired,
};

function CreateNewExternalReferences(props){
    const classes = useStyles();
    let { externalId, 
        sourceNameIsInvalid, 
        handlerSourceName,
        handlerDescription,
        handlerURL,
        handlerHashList } = props;
    let [ selectItemHash, setSelectItemHash ] = useState(""),
        [ inputHash, setInputHash ] = useState(""),
        [ buttonAddHashIsDisabled, setButtonAddHashIsDisabled ] = useState(true),
        [ listHashes, setListHashes ] = useState([]);
    const handlerAddNewHash = () => {

            console.log("func 'handlerAddNewHash'");

            setListHashes(listHashes.concat([{ type: selectItemHash, description: inputHash }]));
            handlerHashList(listHashes);
            setInputHash("");
            setSelectItemHash("");
        },
        handlerDelItemHash = (num) => {
            let tmp = listHashes.slice();
            tmp.splice(num, 1);
            listHashes = tmp;

            setListHashes(listHashes);
            handlerHashList(listHashes);
        };

    return (<React.Fragment>
        <Grid container direction="row">
            <Grid item md={12}>
                <span className="text-muted">ID</span>: {`external-reference--${externalId}`}
            </Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item md={12}>
                <TextField
                    id="external-references-source-name"
                    label="наименование"
                    //defaultValue="Default Value"
                    error={sourceNameIsInvalid}
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
        {(listHashes.length === 0) 
            ? "" 
            : <Grid container direction="row"><ol>
                {listHashes.map((elem, numHash) => {
                    return (<li key={`key_item_hash_${numHash}`}>
                        {`${elem.type}: ${elem.description}`}
                        <IconButton aria-label="delete-hash" onClick={() => handlerDelItemHash.call(null, numHash)}>
                            <IconDeleteOutline style={{ color: red[400] }} />
                        </IconButton>
                    </li>);
                })}
            </ol></Grid> }
    </React.Fragment>);
}

CreateNewExternalReferences.propTypes = {
    externalId: PropTypes.string.isRequired,
    handlerURL: PropTypes.func.isRequired,
    handlerHashList: PropTypes.func.isRequired,
    handlerSourceName: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    sourceNameIsInvalid: PropTypes.bool.isRequired,
};

function EditExternalReferences(props){

    return (<DialogContentText>
        {"func 'EditExternalReferences'"}
    </DialogContentText>);
}

EditExternalReferences.propTypes = {
    
};

function CreateNewGranularMarkings(props){
    let { externalId } = props;

    return (<DialogContentText>
        {`func 'CreateNewGranularMarkings' ID:'${externalId}'`}
    </DialogContentText>);
}

CreateNewGranularMarkings.propTypes = {
    externalId: PropTypes.string.isRequired,
};

function EditGranularMarkings(props){
    return (<DialogContentText>
        {"func 'EditGranularMarkings'"}
    </DialogContentText>);
}

EditGranularMarkings.propTypes = {

};

function CreateNewExtensions(props){
    let { externalId } = props;

    return (<DialogContentText>
        {`func 'CreateNewExtensions' ID:'${externalId}'`}
    </DialogContentText>);
}

CreateNewExtensions.propTypes = {
    externalId: PropTypes.string.isRequired,
};
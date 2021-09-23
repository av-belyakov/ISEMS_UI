"use strict";

import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
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
    Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    formControlTypeHashRE: {
        //        margin: theme.spacing(1),
        minWidth: 120,
    },
//    selectEmpty: {
//        marginTop: theme.spacing(2),
//    },
}));

export default function DialogElementAdditionalThechnicalInformation(props){
    let { show, onHide, objInfo, uuidValue } = props;
    const listTitle = {
        "external_references": "Управление внешними ссылками",
        "granular_markings": "Управление \"гранулярными метками\"",
        "extensions": "Управление дополнительной информацией",
    };
    let [ valuesIsInvalideSourceNameER, setValuesIsInvalideSourceNameER ] = useState(true),
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
        } else {
            setValuesIsInvalideSourceNameER(true);
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

    const switchTypeElement = ()=>{

        console.log("func 'switchTypeElement', START...");
        console.log(`actionType:${objInfo.actionType}, modalType: ${objInfo.modalType}`);

        if(objInfo.actionType === "new"){
            switch(objInfo.modalType){
            case "external_references":
                return <CreateNewExternalReferences
                    externalId={uuidValue}
                    sourceNameIsInvalid={valuesIsInvalideSourceNameER}
                    handlerSourceName={handlerSourceNameExternalReferences}
                    handlerDescription={handlerDescriptionExternalReferences}
                    handlerURL={handlerURLExternalReferences}
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
            <Button onClick={() => { console.log("handler button Subscribe"); }} color="primary">сохранить</Button>
        </DialogActions>
    </Dialog>);
}

DialogElementAdditionalThechnicalInformation.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    objInfo: PropTypes.object.isRequired,
    uuidValue: PropTypes.string.isRequired,
};

function CreateNewExternalReferences(props){
    const classes = useStyles();
    let { externalId, 
        sourceNameIsInvalid, 
        handlerSourceName,
        handlerDescription,
        handlerURL } = props;

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
        <Grid container direction="row">
            <Grid item md={2}>
                <FormControl className={classes.formControlTypeHashRE}>
                    <InputLabel id="label-hash-type-change">тип хеша</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={""}
                        fullWidth={true}
                        onChange={()=>{}}
                    >
                        <MenuItem value="MD5">MD5</MenuItem>
                        <MenuItem value="SHA-1">SHA-1</MenuItem>
                        <MenuItem value="SHA256">SHA-2 (256)</MenuItem>
                        <MenuItem value="SHA384">SHA-2 (384)</MenuItem>
                        <MenuItem value="SHA512">SHA-2 (256)</MenuItem>
                        <MenuItem value="SHA-3">SHA-3</MenuItem>
                        <MenuItem value="RIPEMD">RIPEMD</MenuItem>
                        <MenuItem value="Base64">Base64</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item md={10}>
                <TextField
                    id="external-references-hash"
                    label="хеш-сумма"
                    fullWidth={true}
                    onChange={()=>{}}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateNewExternalReferences.propTypes = {
    externalId: PropTypes.string.isRequired,
    handlerURL: PropTypes.func.isRequired,
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
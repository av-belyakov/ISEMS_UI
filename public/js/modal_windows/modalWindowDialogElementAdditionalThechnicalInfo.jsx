"use strict";

import React from "react";
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
    InputLabel,
    Typography
} from "@material-ui/core";
import PropTypes from "prop-types";

export default class DialogElementAdditionalThechnicalInfo extends React.Component {
    constructor(props){
        super(props);

        this.listTitle = {
            "external_references": "Управление внешними ссылками",
            "granular_markings": "Управление \"гранулярными метками\"",
            "extensions": "Управление дополнительной информацией",
        };

        console.log("func 'DialogElementAdditionalThechnicalInfo'");
        console.log(this.props.objInfo);

        this.state = {
            actionType: this.props.objInfo.actionType,
            modalType: this.props.objInfo.modalType,
            valuesIsInvalide: {
                sourceNameER: true,
            },
            valueER: {
                source_name: "",
                description: "",
                url: "",
                hashes: [],
            },
        };
    }

    componentDidMount(){
        console.log("func 'componentDidMount'");
    }

    handlerSourceNameExternalReferences(obj){
        let valuesIsInvalideTmp = _.cloneDeep(this.state.valuesIsInvalide);
        let valueTmp = _.cloneDeep(this.state.valueER);

        valueTmp.source_name = obj.target.value;
        if(valueTmp.source_name.length > 0){
            valuesIsInvalideTmp.sourceNameER = false;
        } else {
            valuesIsInvalideTmp.sourceNameER = true;
        }

        this.setState({
            valuesIsInvalide: valuesIsInvalideTmp,
            valueER: valueTmp,
        });
    }

    handlerDescriptionExternalReferences(obj){
        let valueTmp = _.cloneDeep(this.state.valueER);
        valueTmp.description = obj.target.value;

        this.setState({ valueER: valueTmp });
    }

    handlerURLExternalReferences(obj){
        let valueTmp = _.cloneDeep(this.state.valueER);
        valueTmp.url = obj.target.value;

        this.setState({ valueER: valueTmp });
    }

    switchTypeElement() {

        console.log("func 'switchTypeElement', START...");
        console.log(`actionType:${this.props.objInfo.actionType}, modalType: ${this.props.objInfo.modalType}`);

        if(this.props.objInfo.actionType === "new"){
            switch(this.props.objInfo.modalType){
            case "external_references":
                return <CreateNewExternalReferences
                    externalId={this.props.uuidValue}
                    sourceNameIsInvalid={this.state.valuesIsInvalide.sourceNameER}
                    handlerSourceName={this.handlerSourceNameExternalReferences.bind(this)}
                    handlerDescription={this.handlerDescriptionExternalReferences.bind(this)}
                    handlerURL={this.handlerURLExternalReferences.bind(this)}
                />;
    
            case "granular_markings":
                return <CreateNewGranularMarkings
                    externalId={this.props.uuidValue} />;
        
            case "extensions":
                return <CreateNewExtensions 
                    externalId={this.props.uuidValue} />;

            }
        }
    
        if(this.props.objInfo.actionType === "edit"){
            switch(this.props.objInfo.modalType){
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
    }

    render(){
        return (<Dialog
            aria-labelledby="form-dialog-element"
            maxWidth="xl"
            open={this.props.show} 
            onClose={this.props.onHide}>
            <DialogTitle id="form-dialog-title">{this.listTitle[this.props.objInfo.modalType]}</DialogTitle>
            <DialogContent>{this.switchTypeElement.call(this)}</DialogContent>
            <DialogActions>
                <Button onClick={this.props.onHide} color="primary">закрыть</Button>
                <Button onClick={() => { console.log("handler button Subscribe"); }} color="primary">сохранить</Button>
            </DialogActions>
        </Dialog>);
    }
}

DialogElementAdditionalThechnicalInfo.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    objInfo: PropTypes.object.isRequired,
    uuidValue: PropTypes.string.isRequired,
};

function CreateDialog(props){
    let {} = props;

    /**
 * 
 * Надо переписать класс DialogElementAdditionalThechnicalInfo как функциональный компонент
 * 
 */

    return (<Dialog
        aria-labelledby="form-dialog-element"
        maxWidth="xl"
        open={this.props.show} 
        onClose={this.props.onHide}>
        <DialogTitle id="form-dialog-title">{this.listTitle[this.props.objInfo.modalType]}</DialogTitle>
        <DialogContent>{this.switchTypeElement.call(this)}</DialogContent>
        <DialogActions>
            <Button onClick={this.props.onHide} color="primary">закрыть</Button>
            <Button onClick={() => { console.log("handler button Subscribe"); }} color="primary">сохранить</Button>
        </DialogActions>
    </Dialog>);
}

CreateDialog.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
};

function CreateNewExternalReferences(props){
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
            <Grid item md={12}>
                <InputLabel id="label-hash-type-change">тип хеша</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={""}
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
import React from "react";
import {
    Button,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateKillChainPhases, CreateKillChainPhasesList, CreateListToolTypes } from "../anyElements.jsx";

export default function CreateToolElements(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerName,
        handlerToolTypes,
        handlerDescription,
        handlerToolVersion, 
        handlerTokenValuesChange,
        handlerDeleteKillChain,
        handlerAddKillChainPhases,
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
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListToolTypes 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerToolTypes={handlerToolTypes}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    readOnly={isDisabled}
                    tokenValues={(!campaignPatterElement.aliases) ? []: campaignPatterElement.aliases}
                    onTokenValuesChange={handlerTokenValuesChange} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Набор элементов цепочки фактов, приведших к какому либо урону</span>
            </Grid>
        </Grid>

        <CreateKillChainPhases
            isDisabled={isDisabled}
            handlerAddKillChainPhases={handlerAddKillChainPhases} />

        <CreateKillChainPhasesList 
            isDisabled={isDisabled}
            listKillChainPhases={(!campaignPatterElement.kill_chain_phases) ? []: campaignPatterElement.kill_chain_phases} 
            handlerDeleteItem={handlerDeleteKillChain} />

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Версия инструмента:</span></Grid>
            <Grid item md={8}>
                <TextField
                    id="outlined-tool-version"
                    //multiline
                    //minRows={3}
                    //maxRows={8}
                    fullWidth
                    disabled={isDisabled}
                    onChange={handlerToolVersion}
                    value={(campaignPatterElement.tool_version)? campaignPatterElement.tool_version: ""}
                    variant="outlined"/>
                {
                    //ToolVersion     string                  `json:"tool_version" bson:"tool_version"`
                }
            </Grid>
        </Grid>

    </React.Fragment>);
}

CreateToolElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerToolTypes: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerToolVersion: PropTypes.func.isRequired,
    handlerTokenValuesChange: PropTypes.func.isRequired,
    handlerDeleteKillChain: PropTypes.func.isRequired,
    handlerAddKillChainPhases: PropTypes.func.isRequired,
};
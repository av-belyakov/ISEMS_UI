import React from "react";
import {
    Grid,
    TextField,
} from "@material-ui/core";
//import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { 
    CreateListThreatActorType, 
    CreateListThreatActorRole, 
    CreateListThreatActorSophistication, 
    CreateListThreatActorResourceLevel, 
    CreateListThreatActorPrimaryMotivation,
    CreateThreatActorSecondaryMotivations,
    CreateThreatActorPersonalMotivations,
} from "../anyElements.jsx";

const minDefaultData = "0001-01-01T00:00:00Z";

export default function CreateThreatActorsPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerName,
        handlerRoles,
        handlerGoals,
        handlerAliases,
        handlerLastSeen,
        handlerFirstSeen,
        handlerDescription,
        handlerResourceLevel,
        handlerSophistication,
        handlerThreatActorTypes,
        handlerPrimaryMotivation,
        handlerPersonalMotivations,
        handlerSecondaryMotivations,
    } = props;

    let firstSeen = minDefaultData;
    let lastSeen = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    let ft = Date.parse(campaignPatterElement.first_seen);
    let lt = Date.parse(campaignPatterElement.last_seen);
    
    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.first_seen !== "undefined" && campaignPatterElement.first_seen !== firstSeen){
            firstSeen = new Date(ft + ms);
        }

        if(typeof campaignPatterElement.last_seen !== "undefined" && campaignPatterElement.last_seen !== lastSeen){
            lastSeen = new Date(lt + ms);
        }
    } else {
        if(typeof campaignPatterElement.first_seen !== "undefined" && campaignPatterElement.first_seen !== firstSeen){
            firstSeen = new Date(ft - (ms * -1));
        }

        if(typeof campaignPatterElement.last_seen !== "undefined" && campaignPatterElement.last_seen !== lastSeen){
            lastSeen = new Date(lt - (ms * -1));
        }
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
                <CreateListThreatActorType 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    headerThreatActorType={handlerThreatActorTypes}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена используемые для этого субъекта угроз:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    readOnly={isDisabled}
                    tokenValues={(!campaignPatterElement.aliases) ? []: campaignPatterElement.aliases}
                    onTokenValuesChange={handlerAliases} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Начало временного окна, когда данный субъект угроз был впервые зафиксирован:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(firstSeen, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={firstSeen}
                            minDate={new Date("2000-01-01")}
                            maxDate={new Date()}
                            onChange={handlerFirstSeen}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>
    
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Окончание временного окна, когда данный субъект угроз был зафиксирован в последний раз:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(lastSeen, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={lastSeen}
                            minDate={new Date("2000-01-02")}
                            maxDate={new Date()}
                            onChange={handlerLastSeen}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListThreatActorRole 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    headerThreatActorRole={handlerRoles}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Высокоуровневые цели субъекта угроз:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    readOnly={isDisabled}
                    tokenValues={(!campaignPatterElement.goals) ? []: campaignPatterElement.goals}
                    onTokenValuesChange={handlerGoals} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListThreatActorSophistication 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerSophistication={handlerSophistication}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListThreatActorResourceLevel 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerResourceLevel={handlerResourceLevel}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListThreatActorPrimaryMotivation 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerPrimaryMotivation={handlerPrimaryMotivation}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <CreateThreatActorSecondaryMotivations 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerSecondaryMotivation={handlerSecondaryMotivations}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="flex-start">
                <CreateThreatActorPersonalMotivations 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerPersonalMotivations={handlerPersonalMotivations}
                />
            </Grid>
        </Grid>

    </React.Fragment>);
}

CreateThreatActorsPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerRoles: PropTypes.func.isRequired,
    handlerGoals: PropTypes.func.isRequired,
    handlerAliases: PropTypes.func.isRequired,
    handlerLastSeen: PropTypes.func.isRequired,
    handlerFirstSeen: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerResourceLevel: PropTypes.func.isRequired,
    handlerSophistication: PropTypes.func.isRequired,
    handlerThreatActorTypes: PropTypes.func.isRequired,
    handlerPrimaryMotivation: PropTypes.func.isRequired,
    handlerPersonalMotivations: PropTypes.func.isRequired,
    handlerSecondaryMotivations: PropTypes.func.isRequired,
};
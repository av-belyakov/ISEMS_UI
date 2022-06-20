import React from "react";
import { 
    Grid,
    TextField,
} from "@material-ui/core";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { CreateKillChainPhases, CreateKillChainPhasesList, CreateListInfrastructureTypes } from "../anyElements.jsx";

const minDefaultData = "0001-01-01T00:00:00Z",
    defaultData = "2001-01-01T00:00:01Z";

export default function CreateInfrastructurePatternElements(props){
    let {
        isDisabled, 
        campaignPatterElement,
        handlerName,
        handlerDescription, 
        handlerDeleteKillChain,
        handlerTokenValuesChange,
        handlerAddKillChainPhases,
        handlerInfrastructureTypes,
        handlerChangeDateTimeLastSeen,
        handlerChangeDateTimeFirstSeen,
    } = props;

    let firstSeen = (!campaignPatterElement.first_seen || (campaignPatterElement.first_seen === minDefaultData))? defaultData: campaignPatterElement.first_seen;
    let lastSeen = (!campaignPatterElement.last_seen || (campaignPatterElement.last_seen === minDefaultData))? defaultData: campaignPatterElement.last_seen;

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
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Первое обнаружение:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(firstSeen, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={firstSeen}
                            minDate={new Date("2000-01-01")}
                            maxDate={new Date()}
                            onChange={handlerChangeDateTimeFirstSeen}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Последнее обнаружение:</span>
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
                            onChange={handlerChangeDateTimeLastSeen}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
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
                    disabled={isDisabled}
                    fullWidth
                    onChange={handlerDescription}
                    defaultValue={campaignPatterElement.description}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    readOnly={isDisabled}
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.aliases) ? []: campaignPatterElement.aliases}
                    onTokenValuesChange={handlerTokenValuesChange} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListInfrastructureTypes
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerInfrastructureTypes={handlerInfrastructureTypes}
                />
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
    </React.Fragment>);
}

CreateInfrastructurePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired, 
    handlerDeleteKillChain: PropTypes.func.isRequired,
    handlerTokenValuesChange: PropTypes.func.isRequired,
    handlerAddKillChainPhases: PropTypes.func.isRequired,
    handlerInfrastructureTypes: PropTypes.func.isRequired,
    handlerChangeDateTimeLastSeen: PropTypes.func.isRequired,
    handlerChangeDateTimeFirstSeen: PropTypes.func.isRequired,
};
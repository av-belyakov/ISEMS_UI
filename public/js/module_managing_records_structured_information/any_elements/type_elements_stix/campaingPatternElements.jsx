import React from "react";
import { 
    TextField,
    Grid,
} from "@material-ui/core";
import TokenInput from "react-customize-token-input";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";

const defaultData = "0001-01-01T00:00:00.000Z";
const minDefaultData = new Date();

export default function CreateCampaingPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerName, 
        handlerObjective, 
        handlerDescription, 
        handlerTokenValuesChange,
        handlerChangeDateTimeFirstSeen,
        handlerChangeDateTimeLastSeen,
    } = props;

    let firstSeen = minDefaultData;
    let lastSeen = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    
    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.first_seen !== "undefined" && campaignPatterElement.first_seen !== defaultData){
            firstSeen = new Date(Date.parse(campaignPatterElement.first_seen) + ms);
        }

        if(typeof campaignPatterElement.last_seen !== "undefined" && campaignPatterElement.last_seen !== defaultData){
            lastSeen = new Date(Date.parse(campaignPatterElement.last_seen) + ms);
        }
    } else {
        if(typeof campaignPatterElement.first_seen !== "undefined" && campaignPatterElement.first_seen !== defaultData){
            firstSeen = new Date(Date.parse(campaignPatterElement.first_seen) - (ms * -1));
        }

        if(typeof campaignPatterElement.last_seen !== "undefined" && campaignPatterElement.last_seen !== defaultData){
            lastSeen = new Date(Date.parse(campaignPatterElement.last_seen) - (ms * -1));
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

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
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
                    value={(campaignPatterElement.description)? campaignPatterElement.description: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ paddingTop: 6 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    readOnly={isDisabled}
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.aliases) ? []: campaignPatterElement.aliases}
                    onTokenValuesChange={handlerTokenValuesChange} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ paddingTop: 6 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Первое обнаружение:</span>
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
                            onChange={handlerChangeDateTimeFirstSeen}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ paddingTop: 6 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Последнее обнаружение:</span>
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

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Основная цель или желаемый результат:</span>
            </Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    minRows={2}
                    disabled={isDisabled}
                    fullWidth
                    onChange={handlerObjective}
                    value={(campaignPatterElement.objective)? campaignPatterElement.objective: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateCampaingPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerObjective: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerTokenValuesChange: PropTypes.func.isRequired,
    handlerChangeDateTimeFirstSeen: PropTypes.func.isRequired,
    handlerChangeDateTimeLastSeen: PropTypes.func.isRequired,
};
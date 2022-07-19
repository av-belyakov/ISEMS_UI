import React from "react";
import {
    Button,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";

const minDefaultData = "0001-01-01T00:00:00Z",
    defaultData = "2001-01-01T00:00:01Z";


export default function CreateObservedDataPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerName,
        handlerFirstObserved,
        handlerLastObserved,
        handlerNumberObserved,
    } = props;

    //
    //
    //"indicator": "",зависит от "observed-data"
    //
    //

    let currentTime = helpers.getToISODatetime();
    
    if(!campaignPatterElement.created){
        campaignPatterElement.created = currentTime;
    }
    if(!campaignPatterElement.modified){
        campaignPatterElement.modified = currentTime;
    }

    let firstObserved = (campaignPatterElement.first_observed === minDefaultData)? defaultData: campaignPatterElement.first_observed;
    let lastObserved = (campaignPatterElement.last_observed === minDefaultData)? defaultData: campaignPatterElement.last_observed;

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
                <span className="text-muted">Начало временного окна, в течение которого были замечены данные:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(firstObserved, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={firstObserved}
                            minDate={new Date("2000-01-01")}
                            maxDate={new Date()}
                            onChange={handlerFirstObserved}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Окончание временного окна, в течение которого были замечены данные:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(lastObserved, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={lastObserved}
                            minDate={new Date("2000-01-02")}
                            maxDate={new Date()}
                            onChange={handlerLastObserved}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="center">
                <TextField
                    id="precision-number"
                    label="Количество фиксации наблюдаемого кибер объекта SCO, представленный в свойстве ObjectRef (NumberObserved)"
                    type="number"
                    disabled={isDisabled}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.precision)? campaignPatterElement.precision: 0}
                    onChange={handlerNumberObserved}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateObservedDataPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerFirstObserved: PropTypes.func.isRequired,
    handlerLastObserved: PropTypes.func.isRequired,
    handlerNumberObserved: PropTypes.func.isRequired,
};

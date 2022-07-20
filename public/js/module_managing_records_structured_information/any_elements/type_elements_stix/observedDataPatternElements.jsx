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
        handlerFirstObserved,
        handlerLastObserved,
        handlerNumberObserved,
    } = props;

    //
    //
    //"indicator": "",зависит от "observed-data"
    // к сожалению это не так, как выяснилось observed-data может содержать только объекты типа  Cyber-observable Objects
    //
    //

    console.log("func 'CreateObservedDataPatternElements' campaignPatterElement = ", campaignPatterElement);

    let currentTime = helpers.getToISODatetime();
    
    if(!campaignPatterElement.created){
        campaignPatterElement.created = currentTime;
    }
    if(!campaignPatterElement.modified){
        campaignPatterElement.modified = currentTime;
    }

    let firstObserved = (campaignPatterElement.first_observed === minDefaultData)? defaultData: campaignPatterElement.first_observed;
    let lastObserved = (campaignPatterElement.last_observed === minDefaultData)? defaultData: campaignPatterElement.last_observed;

    //object_refs

    return (<React.Fragment>
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
            {
                //Количество фиксации наблюдаемого кибер объекта SCO, представленный в свойстве ObjectRef (NumberObserved)
            }
            <Grid item container md={4} justifyContent="flex-start">
                <span className="text-muted">Количество фиксации наблюдаемого кибер объекта:</span>
            </Grid>
            <Grid item container md={8} justifyContent="flex-start">
                <TextField
                    id="number-observed"
                    type="number"
                    disabled={isDisabled}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.number_observed)? campaignPatterElement.number_observed: 1}
                    onChange={handlerNumberObserved}
                />
            </Grid>
        </Grid>

        {campaignPatterElement.object_refs && (() => {
            return (campaignPatterElement.object_refs.length === 0)? 
                <Typography variant="caption">
                    <span  style={{ color: red[800] }}>
                        * необходимо добавить хотя бы один идентификатор любого кибер-наблюдаемого STIX объекта
                    </span>
                </Typography>:
                campaignPatterElement.object_refs.map((item, key) => {
                    let type = item.split("--");
                    let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                    if(typeof objectElem === "undefined" ){
                        return "";
                    }

                    return (<Grid container direction="row" key={`key_object_ref_${key}`}>
                        <Grid item container md={12} justifyContent="flex-start">
                            <Button onClick={() => {}} disabled>
                                <img 
                                    key={`key_object_ref_type_${key}`} 
                                    src={`/images/stix_object/${objectElem.link}`} 
                                    width="35" 
                                    height="35" />
                                    &nbsp;{item}&nbsp;
                            </Button>
                        </Grid>
                    </Grid>);
                });
        })()}
    </React.Fragment>);
}

CreateObservedDataPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerFirstObserved: PropTypes.func.isRequired,
    handlerLastObserved: PropTypes.func.isRequired,
    handlerNumberObserved: PropTypes.func.isRequired,
};

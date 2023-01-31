import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";

const defaultData = "0001-01-01T00:00:00.000Z";
const minDefaultData = new Date();

/*
let getLinkImage = (elem) => {
    let tmp = [""];
    if(typeof elem !== "undefined" && elem.includes("--")){
        tmp = elem.split("--");
    }

    return helpers.getLinkImageSTIXObject(tmp[0]);
};
*/

export default function CreateObservedDataPatternElements(props){
    let { 
        isDisabled,
        showRefId,
        showRefObj,
        campaignPatterElement,
        handlerClick,
        handlerLastObserved,
        handlerFirstObserved,
        handlerNumberObserved,
        handlerClickButtonObjectRef,
    } = props;

    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

    let firstObserved = minDefaultData;
    let lastObserved = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    
    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.first_observed !== "undefined" && campaignPatterElement.first_observed !== defaultData){
            firstObserved = new Date(Date.parse(campaignPatterElement.first_observed) + ms);
        }

        if(typeof campaignPatterElement.last_observed !== "undefined" && campaignPatterElement.last_observed !== defaultData){
            lastObserved = new Date(Date.parse(campaignPatterElement.last_observed) + ms);
        }
    } else {
        if(typeof campaignPatterElement.first_observed !== "undefined" && campaignPatterElement.first_observed !== defaultData){
            firstObserved = new Date(Date.parse(campaignPatterElement.first_observed) - (ms * -1));
        }

        if(typeof campaignPatterElement.last_observed !== "undefined" && campaignPatterElement.last_observed !== defaultData){
            lastObserved = new Date(Date.parse(campaignPatterElement.last_observed) - (ms * -1));
        }
    }

    let handleExpandClick = (id) => {
        if(id !== refId){
            setExpanded(true); 
            setRefId(id);
        } else {
            if(expanded){
                setExpanded(false);
            } else {
                setExpanded(true); 
            }    
        }

        handlerClickButtonObjectRef(id);
    };


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

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Идентификаторы объектов:</span>
            </Grid>
        </Grid>

        <Grid container direction="row" style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                {campaignPatterElement.object_refs && (() => {
                    return (campaignPatterElement.object_refs.length === 0)? 
                        <Typography variant="caption">
                            <span  style={{ color: red[800] }}>
                                * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                            </span>
                        </Typography>:
                        campaignPatterElement.object_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
    
                            if(typeof objectElem === "undefined" || type[0] === "relationship"){
                                return "";
                            }

                            let disabled = false;
                            if(type[0] === "report"){                    
                                disabled = true;
                            }        

                            return (<Card variant="outlined" style={{ width: "100%" }} key={`key_rf_object_ref_${key}`}>
                                <CardActions>
                                    <Button onClick={() => {                                        
                                        handleExpandClick(item);
                                    }}
                                    disabled={disabled} >
                                        <img 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                        &nbsp;{item}
                                    </Button>
                                </CardActions>
                                <Collapse in={refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        {(showRefId !== "" && showRefId === item)?  
                                            <CreateShortInformationSTIXObject  
                                                obj={showRefObj}
                                                handlerClick={handlerClick} />: 
                                            ""}
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        });
                })()}
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateObservedDataPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefId: PropTypes.string.isRequired,
    showRefObj: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerClick: PropTypes.func.isRequired,
    handlerFirstObserved: PropTypes.func.isRequired,
    handlerLastObserved: PropTypes.func.isRequired,
    handlerNumberObserved: PropTypes.func.isRequired,
    handlerClickButtonObjectRef: PropTypes.func.isRequired,
};

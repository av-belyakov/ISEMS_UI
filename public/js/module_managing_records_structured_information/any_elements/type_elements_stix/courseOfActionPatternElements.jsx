import React from "react";
import { 
    Grid,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";

export default function CreateCourseOfActionPatternElements(props){
    let { 
        isDisabled,
        projectPatterElement, 
        handlerName,
        handlerDescription 
    } = props;

    let currentTime = helpers.getToISODatetime();
    
    if(!projectPatterElement.created){
        projectPatterElement.created = currentTime;
    }
    if(!projectPatterElement.modified){
        projectPatterElement.modified= currentTime;
    }

    console.log("func 'CreateCourseOfActionPatternElements', projectPatterElement:", projectPatterElement);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование:</span></Grid>
            <Grid item container md={8} >
                {(projectPatterElement.id && projectPatterElement.id !== "")? 
                    projectPatterElement.name:
                    <TextField
                        fullWidth
                        disabled={isDisabled}
                        id="name-element"
                        InputLabelProps={{ shrink: true }}
                        onChange={handlerName}
                        value={(projectPatterElement.name)? projectPatterElement.name: ""}
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
                {helpers.convertDateFromString(projectPatterElement.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">последнего обновления:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(projectPatterElement.modified, { monthDescription: "long", dayDescription: "numeric" })}
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
                    defaultValue={projectPatterElement.description}
                    variant="outlined"/>
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateCourseOfActionPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
};
import React from "react";
import {
    Grid,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

export default function CreateAutonomousSystemPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerRIR,
        handlerName,
        handlerNumber,
    } = props;

    let [ invalidNumber, setInvalidNumber ] = React.useState(false);

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

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Номер присвоенный Автономной системе:</span></Grid>
            <Grid item md={8}>
                <TextField
                    id="outlined-number-autonomous-system"
                    //multiline
                    //minRows={3}
                    //maxRows={8}
                    fullWidth
                    error={invalidNumber}
                    size="small"
                    disabled={isDisabled}
                    onChange={(e) => {
                        if(!new RegExp("^[0-9]{1,}$").test(e.target.value)){
                            setInvalidNumber(true);
                        } else {
                            setInvalidNumber(false);
                        }

                        handlerNumber(e);
                    }}
                    value={(campaignPatterElement.number)? campaignPatterElement.number: ""}
                    helperText="поле может содержать только цифры"
                    variant="outlined" />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Название регионального Интернет-реестра (Regional Internet Registry):</span></Grid>
            <Grid item md={8}>
                <TextField
                    id="outlined-rir"
                    //multiline
                    //minRows={3}
                    //maxRows={8}
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    onChange={handlerRIR}
                    value={(campaignPatterElement.rir)? campaignPatterElement.rir: ""}
                    variant="outlined" />
            </Grid>
        </Grid>

    </React.Fragment>);
}

CreateAutonomousSystemPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerRIR: PropTypes.func.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerNumber: PropTypes.func.isRequired,
};
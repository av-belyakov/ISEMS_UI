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

    let [ invalidNumber, setInvalidNumber ] = React.useState(((typeof campaignPatterElement.number === "undefined") || (campaignPatterElement.number === 0)));

    React.useEffect(() => {
        if((typeof campaignPatterElement.number !== "undefined") && new RegExp("^[0-9]{1,}$").test(campaignPatterElement.number) && campaignPatterElement.number[0] !== "0"){
            setInvalidNumber(false);
        }
    }, [campaignPatterElement.number]);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Наименование:</span></Grid>
            <Grid item container md={7}>
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
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Номер присвоенный Автономной системе:</span>
            </Grid>
            <Grid item md={7}>
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
                        let number = e.target.value;

                        if(!new RegExp("^[0-9]{1,}$").test(number) || number[0] === "0"){
                            setInvalidNumber(true);
                        } else {
                            setInvalidNumber(false);
                        }

                        handlerNumber(e);
                    }}
                    value={(campaignPatterElement.number)? campaignPatterElement.number: ""}
                    helperText="поле может содержать только цифры"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Название регионального Интернет-реестра (RIR):</span>
            </Grid>
            <Grid item md={7}>
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
                />
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
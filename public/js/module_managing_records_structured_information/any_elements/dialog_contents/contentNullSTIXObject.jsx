import React from "react";
import {
    Grid,
    DialogContent,
    Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";

export default function CreateNullSTIXObject(){ 
    return (<DialogContent>
        <Grid container direction="row" className="pt-3">
            <Grid item container md={12} justifyContent="center">
                <Typography variant="caption" display="block" gutterBottom style={{ color: red[400] }}>
                    подходящий для отрисовки STIX объект не найден
                </Typography>
            </Grid>
        </Grid>
    </DialogContent>);
}

CreateNullSTIXObject.propTypes = {};
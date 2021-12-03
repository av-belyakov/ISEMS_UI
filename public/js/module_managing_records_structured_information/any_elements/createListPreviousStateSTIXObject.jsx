"use strict";

import React, { useState } from "react";
import { 
    Box,
    //Card,
    //CardHeader,
    //CardContent,
    //Typography, 
    Grid,
    CircularProgress,
} from "@material-ui/core";
import Frame, { FrameContextConsumer } from "react-frame-component";
import NoSsr from "@material-ui/core/NoSsr";
/*import IconCloseOutlined from "@material-ui/icons/CloseOutlined";
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import IconSave from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import TokenInput from "react-customize-token-input";
import { blue, grey, green, red } from "@material-ui/core/colors";*/
import PropTypes from "prop-types";

//import { v4 as uuidv4 } from "uuid";

export default function CreateListPreviousStateSTIXObject(props){
    let { socketIo, searchObjectId, objectPreviousState } = props;

    console.log("func 'CreateListPreviousStateSTIXObject', START...");
    console.log(objectPreviousState);

    /**
 * <Grid container direction="row" className="pt-3">
                        <Grid item container md={12} justifyContent="center">
                            <strong>История предыдущих состояний</strong>
                        </Grid>
                    </Grid>
 */
    let createFrame = () => {
        return (<NoSsr>
            <Frame>
                <Grid container direction="row">
                    <Grid item container md={12}>
                        {JSON.stringify(objectPreviousState.transmitted_data)}
                    </Grid>
                </Grid>
            </Frame>
        </NoSsr>);
    };

    return (<React.Fragment>
        <Box height={100} width="100%">
            <Box height="5%" alignContent="flex-start" display="inline-block">
                <Grid container direction="column" className="pt-3">
                    <Grid item container md={12} justifyContent="center">
                        <strong>История предыдущих состояний</strong>
                    </Grid>
                </Grid>
            </Box>
            <Box height="95%" minHeight="95%" display="inline-block">
                <Grid container direction="row" className="pt-3">
                    <Grid item container md={12} justifyContent="center">
                        {((objectPreviousState.transmitted_data === null) || (typeof objectPreviousState.transmitted_data === "undefined"))? 
                            "Загрузка...":
                            createFrame()}
                    </Grid>
                </Grid>
            </Box>
        </Box>
        {/*<Grid container direction="column" className="pt-3" justifyContent="flex-start" alignItems="center">
            <Grid item container md={12} justifyContent="center">
                <strong>История предыдущих состояний</strong>
            </Grid>
        </Grid>
        <Grid container direction="row" alignItems="stretch">
            <Grid item container md={12} justifyContent="center">
                {((objectPreviousState.transmitted_data === null) || (typeof objectPreviousState.transmitted_data === "undefined"))? 
                    "Загрузка...":
                    createFrame()}
            </Grid>
    </Grid>*/}
    </React.Fragment>);
}

CreateListPreviousStateSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    searchObjectId: PropTypes.string.isRequired,
    objectPreviousState: PropTypes.object.isRequired,
};
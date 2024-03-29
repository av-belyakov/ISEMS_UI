"use strict";

import React from "react";
import { 
    DialogContent,
    Grid,
} from "@material-ui/core";
import { teal, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "fixed",
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    appBreadcrumbs: {
        position: "fixed",
        top: "60px",
        color: theme.palette.getContrastText(grey[50]),
        backgroundColor: grey[50],
        paddingLeft: theme.spacing(4),
    },
    buttonSave: {
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default function CreateDialogContentAuxiliarySTIXObject(props){
    return (<DialogContent>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={12} justifyContent="center" className="pb-3">
                Данный STIX объект является вспомогательным или связующим объектом, просмотр и редактирование подобных объектов доступен 
                только из родительских STIX объектов.
            </Grid>
        </Grid>
    </DialogContent>);
}

CreateDialogContentAuxiliarySTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};
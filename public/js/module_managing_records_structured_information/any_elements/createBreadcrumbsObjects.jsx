"use strict";

import React from "react";
import { 
    AppBar,
    Breadcrumbs,
    Link,
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


//путь до текущего объекта, почти самая верхняя строка
export default function CreateBreadcrumbsObjects(props){
    const classes = useStyles();
    const { firstObjectId, 
        secondObjectId, 
        handlerChangeCurrentObjectId } = props;
        
    console.log("func 'CreateBreadcrumbsObjects', START...");
    console.log(`firstObjectId: '${firstObjectId}', secondObjectId: '${secondObjectId}'`);


    return (<AppBar className={classes.appBreadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
            {(firstObjectId === "")? 
                "": 
                <Link
                    color={(secondObjectId === "")? "textPrimary": "inherit"}
                    href="#"
                    onClick={handlerChangeCurrentObjectId.bind(null, firstObjectId)}>
                    {firstObjectId}
                </Link>}
            {(secondObjectId === "")? 
                "": 
                <Link
                    color="textPrimary"
                    href="#"
                    onClick={handlerChangeCurrentObjectId.bind(null, secondObjectId)}>
                    {secondObjectId}
                </Link>}
        </Breadcrumbs>
    </AppBar>);
}

CreateBreadcrumbsObjects.propTypes = {
    firstObjectId: PropTypes.string.isRequired,
    secondObjectId: PropTypes.string.isRequired,
    handlerChangeCurrentObjectId: PropTypes.func.isRequired,
};
"use strict";

import React, { useState } from "react";
/*import { 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography, 
    TextField,
    Grid,
    Select,
    IconButton,
    InputLabel,
    FormControl,
    MenuItem,
} from "@material-ui/core";
import IconCloseOutlined from "@material-ui/icons/CloseOutlined";
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
    let { socketIo, searchObjectId } = props;
    let [ listPreviousState, setListPreviousState ] = useState([]);

    //запрос на получение дополнительной информации о предыдущем состоянии STIX объектов
    socketIo.emit("isems-mrsi ui request: send search request, get different objects STIX object for id", { 
        arguments: { 
            "documentId": searchObjectId,
            "paginateParameters": {
                "max_part_size": 15,
                "current_part_number": 1,
            } 
        }});

    socketIo.on("isems-mrsi ui request: send search request, list different objects STIX object for id", (list) => {
        console.log("?----+++ func 'CreateListPreviousStateSTIXObject' +++----?, received list different objects:");
        console.log(list);

        setListPreviousState(list);
    });

    if(listPreviousState.length === 0){
        return (<div>Крутим спинер</div>);
    }

    return (<div>JSON.stringify(listPreviousState)</div>);
}

CreateListPreviousStateSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    searchObjectId: PropTypes.string.isRequired,
};
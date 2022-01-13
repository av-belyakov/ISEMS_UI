"use strict";

import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
//import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

export default function CreateListSelect(props){
    let { list, label, uniqId, currentItem, handlerChosen, isNotDisabled } = props;
    let listKeys = Object.keys(list);

    return (<TextField
        id={`select-computer-threat_${uniqId}`}
        select
        fullWidth
        label={label}
        value={(currentItem === "undefined")? "": currentItem}
        onChange={handlerChosen}
        disabled={!isNotDisabled} >
        {listKeys.map((item) => <MenuItem key={list[item].ID} value={item}>{list[item].Description}</MenuItem>)}
    </TextField>);
}

CreateListSelect.propTypes = {
    list: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    uniqId: PropTypes.string.isRequired,
    currentItem: PropTypes.string.isRequired,
    handlerChosen: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool,
};
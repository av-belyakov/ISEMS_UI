import React, { useState, useEffect } from "react";
import {
    TextField, 
    MenuItem,
} from "@material-ui/core";
import PropTypes from "prop-types";

/**
 * формирует список по типам компьютерных угроз
 * @param {*} props 
 * @returns 
 */
export default function CreateListTypesComputerThreat(props){
    let { socketIo, defaultValue, handlerTypesComputerThreat } = props;

    let [ currentTypesComputerThreat, setCurrentTypesComputerThreat ] = useState(defaultValue);
    let [ listTypesComputerThreat, setListTypesComputerThreat ] = useState({});
    let listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        setListTypesComputerThreat(data.information.additional_parameters.list);
    };

    useEffect(() => {
        socketIo.once("isems-mrsi response ui: list types computer threat", listener);
        socketIo.emit("isems-mrsi ui request: get list types computer threat", { arguments: {}});
    }, []);

    return (<TextField
        id={"select-search-computer_threat_type"}
        select
        fullWidth
        label={"тип компьютерной угрозы"}
        value={currentTypesComputerThreat}
        onChange={(obj) => { 
            setCurrentTypesComputerThreat(obj.target.value);
            handlerTypesComputerThreat(obj.target.value);

        }} >
        <MenuItem key="key-computer_threat_type-value-empty" value="">пустое значение</MenuItem>
        {Object.keys(listTypesComputerThreat).map((item) => {
            return (<MenuItem key={listTypesComputerThreat[item].ID} value={item}>
                {listTypesComputerThreat[item].Description}
            </MenuItem>);
        })}
    </TextField>);
}

CreateListTypesComputerThreat.propTypes = {
    socketIo: PropTypes.object.isRequired,
    defaultValue: PropTypes.func.isRequired,
    handlerTypesComputerThreat: PropTypes.func.isRequired,
};

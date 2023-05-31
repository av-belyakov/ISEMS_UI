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
    let { socketIo, currentValue, handlerTypesComputerThreat } = props;

    let defaultValue = "";
    let outsideSpecificationIsExist = ((currentValue.outside_specification === null) || (typeof currentValue.outside_specification === "undefined"));
    let outsideIsExist = ((currentValue.outsideSpecificationSearchFields === null) || (typeof currentValue.outsideSpecificationSearchFields === "undefined"));

    if(!outsideSpecificationIsExist){
        if((currentValue.outside_specification.computer_threat_type !== null) && (typeof currentValue.outside_specification.computer_threat_type !== "undefined")){
            defaultValue = currentValue.outside_specification.computer_threat_type;
        }
    } 

    if(!outsideIsExist){
        if((currentValue.outsideSpecificationSearchFields.computerThreatType !== null) && (typeof currentValue.outsideSpecificationSearchFields.computerThreatType !== "undefined")){
            defaultValue = currentValue.outsideSpecificationSearchFields.computerThreatType;
        }
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<TextField
        id={"select-search-computer_threat_type"}
        select
        fullWidth
        label={"тип компьютерной угрозы"}
        value={defaultValue}
        onChange={handlerTypesComputerThreat} 
    >
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
    currentValue: PropTypes.object.isRequired,
    handlerTypesComputerThreat: PropTypes.func.isRequired,
};

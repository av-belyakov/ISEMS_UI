import React, { useState, useEffect } from "react";
import {
    TextField, 
    MenuItem,
} from "@material-ui/core";
import PropTypes from "prop-types";

/**
 * Формирует список по решениям принятым по компьютерным угрозам
 * @param {*} props 
 * @returns 
 */
export default function CreateListTypesDecisionsMadeComputerThreat(props){
    let { socketIo, defaultValue, handlerDecisionsMadeComputerThreat } = props;

    let [ currentDecisionsMadeComputerThreat, setCurrentDecisionsMadeComputerThreat ] = useState(defaultValue);
    let [ listTypesDecisionsMadeComputerThreat, setListTypesDecisionsMadeComputerThreat ] = useState({});
    let listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        setListTypesDecisionsMadeComputerThreat(data.information.additional_parameters.list);
    };

    useEffect(() => {
        socketIo.once("isems-mrsi response ui: list types decisions made computer threat", listener);
        socketIo.emit("isems-mrsi ui request: get list types decisions made computer threat", { arguments: {}});        
    }, []);

    return (<TextField
        id={"select-search-decisions_made_computer_threat"}
        select
        fullWidth
        label={"принятое решение"}
        value={currentDecisionsMadeComputerThreat}
        onChange={(obj) => {
            setCurrentDecisionsMadeComputerThreat(obj.target.value);
            handlerDecisionsMadeComputerThreat(obj.target.value);
        }} >
        <MenuItem key="key-decisions_made_computer_threat-value-empty" value="">пустое значение</MenuItem>
        {Object.keys(listTypesDecisionsMadeComputerThreat).map((item) => {
            return (<MenuItem key={listTypesDecisionsMadeComputerThreat[item].ID} value={item}>
                {listTypesDecisionsMadeComputerThreat[item].Description}
            </MenuItem>);
        })}
    </TextField>);
}

CreateListTypesDecisionsMadeComputerThreat.propTypes = {
    socketIo: PropTypes.object.isRequired,
    defaultValue: PropTypes.func.isRequired,
    handlerDecisionsMadeComputerThreat: PropTypes.func.isRequired,
};
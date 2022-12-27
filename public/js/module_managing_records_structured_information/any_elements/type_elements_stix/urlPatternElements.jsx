import React, { useState } from "react";
import {
    Grid,
    TextField,
} from "@material-ui/core";
import validatorjs from "validatorjs";
import PropTypes from "prop-types";

export default function CreateURLPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerValue,
    } = props;

    let [ isInvalidValue, setIsInvalidValue ] = useState(true);

    React.useEffect(() => {
        if(!campaignPatterElement.value || (typeof campaignPatterElement.value === "undefined")){
            setIsInvalidValue(true);

            return;
        }

        if(validatorjs.isURL(campaignPatterElement.value)){
            setIsInvalidValue(false);

            return;
        }

        setIsInvalidValue(true);
    }, [ campaignPatterElement.value ]);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Унифицированный указатель информационного ресурса:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="name-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerValue}
                    value={(campaignPatterElement.value)? campaignPatterElement.value: ""}
                    error={isInvalidValue}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateURLPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerValue: PropTypes.func.isRequired,
};

/**
//URLCyberObservableObjectSTIX объект "URL Object", по терминологии STIX, содержит унифицированный указатель информационного ресурса (URL).
// Value - содержит унифицированный указатель информационного ресурса (URL).
type URLCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Value string `json:"value" bson:"value"`
}
*/
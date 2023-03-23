import React, { useState } from "react";
import {
    Grid,
    TextField,
} from "@material-ui/core";
import validatorjs from "validatorjs";
import PropTypes from "prop-types";

export default function CreateMacAddrPatternElements(props){
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

        if(validatorjs.isMACAddress(campaignPatterElement.value)){
            setIsInvalidValue(false);

            return;
        }

        setIsInvalidValue(true);
    }, [ campaignPatterElement.value ]);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">MAC адрес:</span></Grid>
            <Grid item container md={7}>
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

CreateMacAddrPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerValue: PropTypes.func.isRequired,
};

/**
//MACAddressCyberObservableObjectSTIX объект "MAC Address Object", по терминалогии STIX, содержит объект MAC-адрес, представляющий собой один адрес управления доступом к среде (MAC).
// Value - Задает значение одного MAC-адреса. Значение MAC - адреса ДОЛЖНО быть представлено в виде одного строчного MAC-48 address, разделенного двоеточием,
//  который ДОЛЖЕН включать начальные нули для каждого октета. Пример: 00:00:ab:cd:ef:01. (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
type MACAddressCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Value string `json:"value" bson:"value"`
}
 */
import React, { useState } from "react";
import {
    Grid,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

export default function CreateMutexPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerName,
    } = props;

    let [ isInvalidName, setIsInvalidName ] = useState(true);

    React.useEffect(() => {
        if(!campaignPatterElement.name || (typeof campaignPatterElement.name === "undefined")){
            setIsInvalidName(true);

            return;
        }

        if(campaignPatterElement.name.length > 0){
            setIsInvalidName(false);

            return;
        }

        setIsInvalidName(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ campaignPatterElement.name ]);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Имя объекта мьютекса:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="name-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerName}
                    value={(campaignPatterElement.name)? campaignPatterElement.name: ""}
                    error={isInvalidName}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateMutexPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
};

/**
//MutexCyberObservableObjectSTIX объект "Mutex Object", по терминалогии STIX, содержит свойства объекта взаимного исключения (mutex).
// Name - указывает имя объекта мьютекса (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ).
type MutexCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Name string `json:"name" bson:"name"`
}
 */
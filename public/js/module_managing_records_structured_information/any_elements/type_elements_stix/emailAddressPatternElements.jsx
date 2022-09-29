import React from "react";
import {
    Button,
    Grid,
    TextField,
} from "@material-ui/core";
import validator from "validatorjs";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";

export default function CreateEmailAddressPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerValue,
        handlerDisplayName,
    } = props;

    let [ isInvalidValue, setIsInvalidValue ] = React.useState(((typeof campaignPatterElement.value === "undefined") || (!validator.isEmail(campaignPatterElement.value))));

    React.useEffect(() => {
        if(typeof campaignPatterElement.value !== "undefined"){
            setIsInvalidValue(!validator.isEmail(campaignPatterElement.value));
        }
    }, [ campaignPatterElement ]);

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Адрес электронной почты:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="value-element"
                    InputLabelProps={{ shrink: true }}
                    error={isInvalidValue}
                    onChange={(e) => {
                        if(e.target.value === "" || !validator.isEmail(e.target.value)){
                            setIsInvalidValue(true);
                        } else {
                            setIsInvalidValue(false);
                        }

                        handlerValue(e);
                    }}
                    helperText="обязательное для заполнения поле"
                    value={(campaignPatterElement.value)? campaignPatterElement.value: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Почтовое имя которое видит человек при просмотре письма:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="display_name-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerDisplayName}
                    value={(campaignPatterElement.display_name)? campaignPatterElement.display_name: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Ссылка на учетную запись пользователя, которой принадлежит адрес электронной почты:</span>
            </Grid>
            <Grid item container md={8}>
                {campaignPatterElement.belongs_to_ref && campaignPatterElement.belongs_to_ref.length !== 0?
                    <React.Fragment>
                        <Grid container direction="row">
                            <Grid item container md={12} justifyContent="flex-start">
                                <Button onClick={() => {}} disabled>
                                    <img 
                                        src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.belongs_to_ref.split("--")[0]).link}`} 
                                        width="35" 
                                        height="35" />
                                    &nbsp;{campaignPatterElement.belongs_to_ref}
                                </Button>
                            </Grid>
                        </Grid>
                    </React.Fragment>:
                    ""}
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateEmailAddressPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerValue: PropTypes.func.isRequired,
    handlerDisplayName: PropTypes.func.isRequired,
};
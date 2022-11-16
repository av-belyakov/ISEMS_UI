import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    TextField,
} from "@material-ui/core";
import validator from "validatorjs";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import CreateShortInformationSTIXObject from "../createShortInformationSTIXObject.jsx";

export default function CreateEmailAddressPatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement, 
        handlerValue,
        handlerDisplayName,
        handlerButtonShowLink,
    } = props;

    let [ isInvalidValue, setIsInvalidValue ] = React.useState(((typeof campaignPatterElement.value === "undefined") || (!validator.isEmail(campaignPatterElement.value))));
    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

    React.useEffect(() => {
        if(typeof campaignPatterElement.value !== "undefined"){
            setIsInvalidValue(!validator.isEmail(campaignPatterElement.value));
        }
    }, [ campaignPatterElement ]);

    let handleExpandClick = (id) => {
        if(id !== refId){
            setExpanded(true); 
            setRefId(id);
        } else {
            if(expanded){
                setExpanded(false);
            } else {
                setExpanded(true); 
            }    
        }

        handlerButtonShowLink(id);
    };

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

        {campaignPatterElement.belongs_to_ref && campaignPatterElement.belongs_to_ref.length !== 0?
            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end">
                    <span className="text-muted mt-3">Ссылка на учетную запись пользователя, которой принадлежит адрес электронной почты:</span>
                </Grid>
                <Grid item container md={8}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.belongs_to_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.belongs_to_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.belongs_to_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={refId === campaignPatterElement.belongs_to_ref && expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                {(showRefElement.id !== "" && showRefElement.id === campaignPatterElement.belongs_to_ref)? 
                                    <CreateShortInformationSTIXObject 
                                        obj={showRefElement.obj}
                                        handlerClick={() => {}} 
                                    />: 
                                    <i>информация не найдена</i>}
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}
    </React.Fragment>);
}

CreateEmailAddressPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerValue: PropTypes.func.isRequired,
    handlerDisplayName: PropTypes.func.isRequired,
    handlerButtonShowLink: PropTypes.func.isRequired,
};
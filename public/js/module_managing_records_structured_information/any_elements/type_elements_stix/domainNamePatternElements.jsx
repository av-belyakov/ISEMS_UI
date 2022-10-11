import React from "react";
import {
    Button,
    Grid,
    Link,
    TextField,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";

export default function CreateDomainNamePatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerValue,
    } = props;

    let [ isInvalidValue, setIsInvalidValue ] = React.useState(((typeof campaignPatterElement.value === "undefined") || (campaignPatterElement.value === "")));

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Сетевое доменное имя:</span></Grid>
            <Grid item container md={8}>
                {(campaignPatterElement.id && campaignPatterElement.id !== "")? 
                    <span className="mt-2">
                        <Link href={campaignPatterElement.value} onClick={() => {}} style={{ color: blue[400], margin: "2px" }}>{campaignPatterElement.value}</Link>
                    </span>:
                    <TextField
                        fullWidth
                        disabled={isDisabled}
                        id="value-element"
                        InputLabelProps={{ shrink: true }}
                        error={isInvalidValue}
                        onChange={(e) => {
                            if(e.target.value === "" || !helpers.checkInputValidation({ name: "domanName", value: e.target.value })){
                                setIsInvalidValue(true);
                            } else {
                                setIsInvalidValue(false);
                            }

                            handlerValue(e);
                        }}
                        helperText="обязательное для заполнения поле"
                        value={(campaignPatterElement.value)? campaignPatterElement.value: ""}
                    />}
            </Grid>
        </Grid>

        {campaignPatterElement.resolves_to_refs && campaignPatterElement.resolves_to_refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start"><span className="text-muted">Список ссылок на один или несколько IP-адресов или доменных имен, на которые разрешается доменное имя:</span></Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.resolves_to_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Grid container direction="row" key={`key_resolves_ref_${key}`}>
                                <Grid item container md={12} justifyContent="flex-start">
                                    <Button onClick={() => {}} disabled>
                                        <img 
                                            key={`key_resolves_ref_type_${key}`} 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                        &nbsp;{item}&nbsp;
                                    </Button>
                                </Grid>
                            </Grid>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}
    </React.Fragment>);
}

CreateDomainNamePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerValue: PropTypes.func.isRequired,
};
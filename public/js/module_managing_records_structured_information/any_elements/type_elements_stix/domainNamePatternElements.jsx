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

let getLinkImage = (elem) => {
    let tmp = [""];
    if(typeof elem !== "undefined" && elem.includes("--")){
        tmp = elem.split("--");
    }

    return helpers.getLinkImageSTIXObject(tmp[0]);
};

export default function CreateDomainNamePatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerValue,
        handleExpandClick,
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

        {(typeof campaignPatterElement.resolves_to_refs !== "undefined") && (campaignPatterElement.resolves_to_refs !== null) && (campaignPatterElement.resolves_to_refs.length > 0)?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start"><span className="text-muted">Список ссылок на один или несколько IP-адресов или доменных имен, на которые разрешается доменное имя:</span></Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <ol>
                            {campaignPatterElement.resolves_to_refs.map((item, key) => {
                                return (<ul key={`key_domain_name_resolves_to_ref_${key}`}>
                                    {(typeof getLinkImage(item) !== "undefined")?
                                        <Button onClick={() => {                                        
                                            handleExpandClick(item);
                                        }}>
                                            <img src={`/images/stix_object/${getLinkImage(item).link}`} width="25" height="25" />
                                            &nbsp;{item}
                                        </Button>:
                                        <TextField
                                            fullWidth
                                            disabled
                                            InputLabelProps={{ shrink: true }}
                                            onChange={() => {}}
                                            value={item}
                                        />}
                                </ul>);
                            })}
                        </ol>
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
    handleExpandClick: PropTypes.func.isRequired,
};

/**
//DomainNameCyberObservableObjectSTIX объект "Domain Name", по терминалогии STIX, содержит сетевое доменное имя
// Value - сетевое доменное имя (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ResolvesToRefs - список ссылок на один или несколько IP-адресов или доменных имен, на которые разрешается доменное имя
type DomainNameCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Value          string               `json:"value" bson:"value" required:"true"`
	ResolvesToRefs []IdentifierTypeSTIX `json:"resolves_to_refs" bson:"resolves_to_refs"`
}
 */
import React, { useState } from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    TextField,
} from "@material-ui/core";
import validatorjs from "validatorjs";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";

export default function CreateIpv4AddrPatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement,
        handlerValue,
        handlerButtonShowLink,
    } = props;

    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

    let [ isInvalidValue, setIsInvalidValue ] = useState(true);

    console.log("func 'CreateIpv4AddrPatternElements', campaignPatterElement: ", campaignPatterElement);

    React.useEffect(() => {
        let isInvalid = true;

        if(!campaignPatterElement.value || (typeof campaignPatterElement.value === "undefined")){
            setIsInvalidValue(isInvalid);

            return;
        }

        if(!campaignPatterElement.value.includes("/")){
            if(validatorjs.isIP(campaignPatterElement.value, 4)){
                isInvalid = false;    
            }
        } else {
            let b = campaignPatterElement.value.split("/")[1];
            if(/(([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2})/.test(campaignPatterElement.value) && (b && +b <= 32)){

                isInvalid = false;    
            }
        }

        setIsInvalidValue(isInvalid);

    }, [ campaignPatterElement.value ]);

    let handleExpandClick = (id) => {
        if(id === refId && expanded){
            setExpanded(false);
            
            return;
        }

        if(id !== refId){
            setExpanded(true); 
            setRefId(id);
        } else {            
            setExpanded(!expanded);
        }

        handlerButtonShowLink(id);
    };

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">IP адреса:</span></Grid>
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

        {campaignPatterElement.resolves_to_refs && campaignPatterElement.resolves_to_refs.length !== 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <span className="text-muted">Ссылки на один или несколько MAC-адресов:</span>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.resolves_to_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);

                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Card variant="outlined" style={{ width: "100%" }} key={`key_rf_bcc_ref_${key}`}>
                                <CardActions>
                                    <Button onClick={() => { 
                                        handleExpandClick(item);
                                    }}>
                                        <img 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                &nbsp;{item}
                                    </Button>
                                </CardActions>
                                <Collapse in={showRefElement.id === item && refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <CreateShortInformationSTIXObject 
                                            obj={showRefElement.obj} 
                                            handlerClick={() => {}} 
                                        />
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

        {campaignPatterElement.belongs_to_refs && campaignPatterElement.belongs_to_refs.length !== 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <span className="text-muted">Ссылки на одну или несколько автономных систем (AS):</span>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.belongs_to_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);

                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Card variant="outlined" style={{ width: "100%" }} key={`key_rf_bcc_ref_${key}`}>
                                <CardActions>
                                    <Button onClick={() => { 
                                        handleExpandClick(item);
                                    }}>
                                        <img 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                &nbsp;{item}
                                    </Button>
                                </CardActions>
                                <Collapse in={showRefElement.id === item && refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <CreateShortInformationSTIXObject 
                                            obj={showRefElement.obj} 
                                            handlerClick={() => {}} 
                                        />
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}
    </React.Fragment>);
}

CreateIpv4AddrPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerValue: PropTypes.func.isRequired,
    handlerButtonShowLink: PropTypes.func.isRequired,
};

/**
//IPv4AddressCyberObservableObjectSTIX объект "IPv4 Address Object", по терминалогии STIX, содержит один или более IPv4 адресов, выраженных с помощью нотации CIDR.
// Value - указывает значения одного или нескольких IPv4-адресов, выраженные с помощью нотации CIDR. Если данный объект IPv4-адреса представляет собой один IPv4-адрес,
//  суффикс CIDR /32 МОЖЕТ быть опущен. (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ResolvesToRefs - указывает список ссылок на один или несколько MAC-адресов управления доступом к носителям уровня 2, на которые разрешается IPv6-адрес. Объекты,
//  на которые ссылается этот список, ДОЛЖНЫ иметь тип macaddr.
// BelongsToRefs - указывает список ссылок на одну или несколько автономных систем (AS), к которым принадлежит IPv6-адрес. Объекты, на которые ссылается этот список,
//  ДОЛЖНЫ быть типа autonomous-system.
type IPv4AddressCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	Value          string               `json:"value" bson:"value"`
	ResolvesToRefs []IdentifierTypeSTIX `json:"resolves_to_refs" bson:"resolves_to_refs"`
	BelongsToRefs  []IdentifierTypeSTIX `json:"belongs_to_refs" bson:"belongs_to_refs"`
}
 */
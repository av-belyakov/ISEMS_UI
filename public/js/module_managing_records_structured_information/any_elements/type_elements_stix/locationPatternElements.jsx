import React, { useState } from "react";
import { 
    Grid,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";
import validatorjs from "validatorjs";

import { helpers } from "../../../common_helpers/helpers";
import { CreateListRegion } from "../anyElements.jsx";

export default function CreateLocationPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerCity,
        handlerName,
        handlerRegion,
        handlerCountry,
        handlerLatitude,
        handlerLongitude,
        handlerPrecision,
        handlerPostalCode,
        handlerDescription,
        handlerStreetAddress,
        handlerAdministrativeArea,
    } = props;

    let [ isInvalidCountry, setIsInvalidCountry ] = useState(false);
    let [ isInvalidLatitude, setIsInvalidLatitude ] = useState(false);
    let [ isInvalidLongitude, setIsInvalidLongitude ] = useState(false);

    let currentTime = helpers.getToISODatetime();
    
    if(!campaignPatterElement.created){
        campaignPatterElement.created = currentTime;
    }
    if(!campaignPatterElement.modified){
        campaignPatterElement.modified = currentTime;
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование:</span></Grid>
            {/*<Grid item container md={8} >{campaignPatterElement.name}</Grid>*/}
            <Grid item container md={8} justifyContent="flex-start">
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="name-element"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerName}
                    value={(campaignPatterElement.name)? campaignPatterElement.name: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Дата и время</span>&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
            <Grid item container md={8}></Grid>
        </Grid>      

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">создания:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">последнего обновления:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Подробное описание:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-description-static"
                    multiline
                    minRows={3}
                    maxRows={8}
                    disabled={isDisabled}
                    fullWidth
                    onChange={handlerDescription}
                    defaultValue={campaignPatterElement.description}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={3} justifyContent="flex-start">
                <TextField
                    id="latitude-number"
                    label="Широта (Latitude)"
                    type="number"
                    disabled={isDisabled}
                    error={isInvalidLatitude}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.latitude)? campaignPatterElement.latitude: ""}
                    onChange={(e) => {
                        let latitude = e.target.value;
                        if((e.target.value > 90.0) || (e.target.value < -90.0)){
                            setIsInvalidLatitude(true);

                            return;
                        }

                        if((latitude+"").includes(",")){
                            latitude = latitude.replace("\\,", ".");
                        }

                        setIsInvalidLatitude(false);
                        handlerLatitude.call(this, +latitude);
                    }}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    id="longitude-number"
                    label="Долгота (Longitude)"
                    type="number"
                    disabled={isDisabled}
                    error={isInvalidLongitude}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.longitude)? campaignPatterElement.longitude: ""}
                    onChange={(e) => {
                        let longitude = e.target.value;
                        if((e.target.value > 180.0) || (e.target.value < -180.0)){
                            setIsInvalidLongitude(true);

                            return;
                        }

                        if((longitude+"").includes(",")){
                            longitude = longitude.replace("\\,", ".");
                        }

                        setIsInvalidLongitude(false);
                        handlerLongitude.call(this, +longitude);
                    }}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    id="precision-number"
                    label="Точность (Precision)"
                    type="number"
                    disabled={isDisabled}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.precision)? campaignPatterElement.precision: 0}
                    onChange={handlerPrecision}
                />
            </Grid>
            <Grid item container md={3} justifyContent="flex-end">
                <CreateListRegion 
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerRegion={handlerRegion}        
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={3} justifyContent="flex-start">
                <TextField
                    id="country-element"
                    error={isInvalidCountry}
                    label="Страна (на латинице)"
                    disabled={isDisabled}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.country)? campaignPatterElement.country: ""}
                    onChange={(e) => {
                        if(e.target.value.length === 0){
                            setIsInvalidCountry(false);
                            handlerCountry.call(null, e);

                            return;
                        }

                        if(!validatorjs.isAlpha(e.target.value, "en-US")){
                            setIsInvalidCountry(true);

                            return;
                        }                

                        setIsInvalidCountry(false);
                        handlerCountry.call(null, e);
                    }}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    id="administrative-area-element"
                    label="Административный округ"
                    disabled={isDisabled}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.administrative_area)? campaignPatterElement.administrative_area: ""}
                    onChange={handlerAdministrativeArea}
                />
            </Grid>
            <Grid item container md={3} justifyContent="center">
                <TextField
                    id="city-element"
                    label="Город"
                    disabled={isDisabled}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.city)? campaignPatterElement.city: ""}
                    onChange={handlerCity}
                />
            </Grid>
            <Grid item container md={3} justifyContent="flex-end">
                <TextField
                    id="postal-code-element"
                    label="Почтовый код"
                    type="number"
                    disabled={isDisabled}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.postal_code)? campaignPatterElement.postal_code: ""}
                    onChange={handlerPostalCode}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <TextField
                    fullWidth
                    id="street-address-element"
                    label="Адрес"
                    disabled={isDisabled}
                    InputLabelProps={{ shrink: true }}
                    value={(campaignPatterElement.street_address)? campaignPatterElement.street_address: ""}
                    onChange={handlerStreetAddress}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateLocationPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerCity: PropTypes.func.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerRegion: PropTypes.func.isRequired,
    handlerCountry: PropTypes.func.isRequired,
    handlerLatitude: PropTypes.func.isRequired,
    handlerLongitude: PropTypes.func.isRequired,
    handlerPrecision: PropTypes.func.isRequired,
    handlerPostalCode: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerStreetAddress: PropTypes.func.isRequired,
    handlerAdministrativeArea: PropTypes.func.isRequired,
};

/**
//LocationDomainObjectsSTIX объект "Location", по терминалогии STIX, содержит описание географического местоположения
// Name - имя используемое для идентификации "Location"
// Description - более подробное описание
// Latitude - широта
// Longitude - долгота
// Precision - определяет точность координат, заданных свойствами широта и долгота (измеряется в метрах)
// Region - один, из заранее определенного (предложенного) перечня регионов
// Country - наименование страны
// AdministrativeArea - административный округ
// City - наименование города
// StreetAddress - физический адрес
// PostalCode - почтовый адрес
type LocationDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name               string            `json:"name" bson:"name"`
	Description        string            `json:"description" bson:"description"`
	Latitude           float32           `json:"latitude" bson:"latitude"`
	Longitude          float32           `json:"longitude" bson:"longitude"`
	Precision          float32           `json:"precision" bson:"precision"`
	Region             OpenVocabTypeSTIX `json:"region" bson:"region"`
	Country            string            `json:"country" bson:"country"`
	AdministrativeArea string            `json:"administrative_area" bson:"administrative_area"`
	City               string            `json:"city" bson:"city"`
	StreetAddress      string            `json:"street_address" bson:"street_address"`
	PostalCode         string            `json:"postal_code" bson:"postal_code"`
}
 */
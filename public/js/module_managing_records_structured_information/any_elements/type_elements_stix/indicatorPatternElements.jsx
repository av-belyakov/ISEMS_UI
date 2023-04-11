import React from "react";
import { 
    Grid, 
    TextField 
} from "@material-ui/core";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { 
    CreateListPatternType,
    CreateKillChainPhases, 
    CreateKillChainPhasesList, 
    CreateListIndicatorTypes,
} from "../anyElements.jsx";

const defaultData = "0001-01-01T00:00";
const minDefaultData = "1970-01-01T00:00:00.000Z";

export default function CreateIndicatorPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerName,
        handlerPattern,
        handlerIndicator,
        handlerValidFrom,
        handlerValidUntil,
        handlerDescription,
        handlerPatternType,
        handlerPatternVersion,
        handlerDeleteKillChain,
        handlerAddKillChainPhases,
    } = props;
    
    let [ invalidePattern, setInvalidePattern ] = React.useState(((typeof campaignPatterElement.pattern === "undefined") || (campaignPatterElement.pattern === "")));
    let [ isInvalidPatternType, setIsInvalidPatternType ] = React.useState(((typeof campaignPatterElement.pattern_type === "undefined") || (campaignPatterElement.pattern_type === "")));

    React.useEffect(() => {
        if((typeof campaignPatterElement.pattern !== "undefined") && campaignPatterElement.pattern !== ""){
            setInvalidePattern(false);
        } else {
            setInvalidePattern(true);
        }

        if((typeof campaignPatterElement.pattern_type !== "undefined") && campaignPatterElement.pattern_type !== ""){
            setIsInvalidPatternType(false);
        } else {
            setIsInvalidPatternType(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignPatterElement.pattern]);

    let validFrom = minDefaultData;
    let validUntil = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    
    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.valid_from !== "undefined" && campaignPatterElement.valid_from !== defaultData){
            validFrom = new Date(Date.parse(campaignPatterElement.valid_from) + ms);
        }

        if(typeof campaignPatterElement.valid_until !== "undefined" && campaignPatterElement.valid_until.slice(0, 16) !== defaultData){            
            validUntil = new Date(Date.parse(campaignPatterElement.valid_until) + ms);
        }
    } else {
        if(typeof campaignPatterElement.valid_from !== "undefined" && campaignPatterElement.valid_from !== defaultData){
            validFrom = new Date(Date.parse(campaignPatterElement.valid_from) - (ms * -1));
        }

        if(typeof campaignPatterElement.valid_until !== "undefined" && campaignPatterElement.valid_until.slice(0, 16) !== defaultData){           
            validUntil = new Date(Date.parse(campaignPatterElement.valid_until) - (ms * -1));
        }
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Наименование:</span></Grid>
            <Grid item container md={8}>
                {(campaignPatterElement.id && campaignPatterElement.id !== "")? 
                    <span className="mt-2">{campaignPatterElement.name}</span>:
                    <TextField
                        fullWidth
                        disabled={isDisabled}
                        id="name-element"
                        InputLabelProps={{ shrink: true }}
                        onChange={handlerName}
                        value={(campaignPatterElement.name)? campaignPatterElement.name: ""}
                    />}
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

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Время с которого этот индикатор считается валидным:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(validFrom, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={validFrom}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerValidFrom}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>
    
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Время начиная с которого этот индикатор не может считаться валидным:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(validUntil, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={validUntil}
                            minDate={new Date("1970-01-01")}
                            maxDate={new Date()}
                            onChange={handlerValidUntil}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Шаблон для обнаружения индикаторов:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    error={invalidePattern}
                    id="outlined-pattern"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerPattern}
                    value={(campaignPatterElement.pattern)? campaignPatterElement.pattern: ""}
                    helperText="обязательное поле"
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Версия языка шаблонов:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="outlined-pattern_version"
                    InputLabelProps={{ shrink: true }}
                    onChange={handlerPatternVersion}
                    value={(campaignPatterElement.pattern_version)? campaignPatterElement.pattern_version: ""}
                />
            </Grid>
        </Grid>

        <CreateListPatternType 
            isDisabled={isDisabled}
            isInvalidValue={isInvalidPatternType}
            campaignPatterElement={campaignPatterElement}
            handlerPattern={(e) => {
                if(e.target.value === ""){
                    setIsInvalidPatternType(true);
                } else {
                    setIsInvalidPatternType(false);
                }

                handlerPatternType(e);
            }}
        />

        <Grid container direction="row" spacing={3} style={{ marginTop: 2 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Подробное описание:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-description-static"
                    multiline
                    minRows={3}
                    maxRows={8}
                    fullWidth
                    disabled={isDisabled}
                    onChange={handlerDescription}
                    value={(campaignPatterElement.description)? campaignPatterElement.description: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <CreateListIndicatorTypes 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement}
            handlerIndicator={handlerIndicator}
        />

        <Grid container direction="row" spacing={3} style={{ marginBottom: 4 }}>
            <Grid item container md={12}>
                <CreateKillChainPhases
                    isDisabled={isDisabled}
                    handlerAddKillChainPhases={handlerAddKillChainPhases} />
                <CreateKillChainPhasesList 
                    isDisabled={isDisabled}
                    listKillChainPhases={(!campaignPatterElement.kill_chain_phases) ? []: campaignPatterElement.kill_chain_phases} 
                    handlerDeleteItem={handlerDeleteKillChain} />                
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateIndicatorPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerPattern: PropTypes.func.isRequired,
    handlerIndicator: PropTypes.func.isRequired,
    handlerValidFrom: PropTypes.func.isRequired,
    handlerValidUntil: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerPatternType: PropTypes.func.isRequired,
    handlerPatternVersion: PropTypes.func.isRequired,
    handlerDeleteKillChain: PropTypes.func.isRequired,
    handlerAddKillChainPhases: PropTypes.func.isRequired,
};

/*
//IndicatorDomainObjectsSTIX объект "Indicator", по терминалогии STIX, содержит шаблон который может быть использован для
//  обнаружения подозрительной или вредоносной киберактивности
// Name - имя используемое для идентификации "Indicator" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// IndicatorTypes - заранее определенный (предложенный) перечень категорий индикаторов
// Pattern - шаблон для обнаружения индикаторов (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// PatternType - одно, из заранее определенных (предложенных) значений языкового шаблона, используемого в этом индикаторе (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// PatternVersion - версия языка шаблонов
// ValidFrom - время с которого этот индикатор считается валидным, в формате "2016-05-12T08:17:27.000Z" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ValidUntil - время начиная с которого этот индикатор не может считаться валидным, в формате "2016-05-12T08:17:27.000Z"
// KillChainPhases - список цепочки фактов, к которым можно отнести соответствующте индикаторы
type IndicatorDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name            string                  `json:"name" bson:"name" required:"true"`
	Description     string                  `json:"description" bson:"description"`
	IndicatorTypes  []OpenVocabTypeSTIX     `json:"indicator_types" bson:"indicator_types"`
	Pattern         string                  `json:"pattern" bson:"pattern" required:"true"`
	PatternType     OpenVocabTypeSTIX       `json:"pattern_type" bson:"pattern_type" required:"true"`
	PatternVersion  string                  `json:"pattern_version" bson:"pattern_version"`
	ValidFrom       time.Time               `json:"valid_from" bson:"valid_from" required:"true"`
	ValidUntil      time.Time               `json:"valid_until" bson:"valid_until"`
	KillChainPhases KillChainPhasesTypeSTIX `json:"kill_chain_phases" bson:"kill_chain_phases"`
}
*/
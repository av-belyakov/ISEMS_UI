import React from "react";
import { 
    Grid,
    TextField,
} from "@material-ui/core";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { 
    CreateListResourceLevelAttack, 
    CreateListPrimaryMotivation, 
    CreateListSecondaryMotivations,
} from "../anyElements.jsx";

const minDefaultData = "0001-01-01T00:00:00Z",
    defaultData = "2001-01-01T00:00:01Z";

export default function CreateIntrusionSetPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerName,
        handlerDescription, 
        handlerPrimaryMotivation,
        handlerResourceLevelAttack,
        handlerSecondaryMotivations,
        handlerGoalsTokenValuesChange,
        handlerChangeDateTimeLastSeen,
        handlerChangeDateTimeFirstSeen,
        handlerAliasesTokenValuesChange,
    } = props;

    let currentTime = helpers.getToISODatetime();
    
    if(!campaignPatterElement.created){
        campaignPatterElement.created = currentTime;
    }
    if(!campaignPatterElement.modified){
        campaignPatterElement.modified = currentTime;
    }

    let firstSeen = (!campaignPatterElement.first_seen || (campaignPatterElement.first_seen === minDefaultData))? defaultData: campaignPatterElement.first_seen;
    let lastSeen = (!campaignPatterElement.last_seen || (campaignPatterElement.last_seen === minDefaultData))? defaultData: campaignPatterElement.last_seen;

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование:</span></Grid>
            <Grid item container md={8} >
                {(campaignPatterElement.id && campaignPatterElement.id !== "")? 
                    campaignPatterElement.name:
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

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Первое обнаружение:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(firstSeen, { monthDescription: "long", dayDescription: "numeric" })
                    :<MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={firstSeen}
                            minDate={new Date("2000-01-01")}
                            maxDate={new Date()}
                            onChange={handlerChangeDateTimeFirstSeen}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Последнее обнаружение:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(lastSeen, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={lastSeen}
                            minDate={new Date("2000-01-02")}
                            maxDate={new Date()}
                            onChange={handlerChangeDateTimeLastSeen}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
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
                    value={(campaignPatterElement.description)? campaignPatterElement.description: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    readOnly={isDisabled}
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.aliases) ? []: campaignPatterElement.aliases}
                    onTokenValuesChange={handlerAliasesTokenValuesChange} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Высокоуровневые цели этого набора вторжения:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    readOnly={isDisabled}
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.goals) ? []: campaignPatterElement.goals}
                    onTokenValuesChange={handlerGoalsTokenValuesChange} />
            </Grid>
        </Grid>

        <CreateListResourceLevelAttack 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement}
            handlerResourceLevelAttack={handlerResourceLevelAttack}
        />

        <CreateListPrimaryMotivation 
            isDisabled={isDisabled}
            campaignPatterElement={campaignPatterElement}
            handlerPrimaryMotivation={handlerPrimaryMotivation}
        />

        <CreateListSecondaryMotivations
            isDisabled={isDisabled} 
            campaignPatterElement={campaignPatterElement}
            handlerSecondaryMotivations={handlerSecondaryMotivations}
        />
    </React.Fragment>);
}

CreateIntrusionSetPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired, 
    handlerPrimaryMotivation: PropTypes.func.isRequired,
    handlerResourceLevelAttack: PropTypes.func.isRequired,
    handlerSecondaryMotivations: PropTypes.func.isRequired,
    handlerGoalsTokenValuesChange: PropTypes.func.isRequired,
    handlerChangeDateTimeLastSeen: PropTypes.func.isRequired,
    handlerChangeDateTimeFirstSeen: PropTypes.func.isRequired,
    handlerAliasesTokenValuesChange: PropTypes.func.isRequired,
};

/**
//IntrusionSetDomainObjectsSTIX объект "Intrusion Set", по терминалогии STIX, содержит сгруппированный набор враждебного поведения и ресурсов
//  с общими свойствами, который, как считается, управляется одной организацией
// Name - имя используемое для идентификации "Intrusion Set" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// Aliases - альтернативные имена используемые для идентификации набора вторжения
// FirstSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный набор вторжения впервые был зафиксирован
// LastSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный набор вторжения был зафиксирован в последний раз
// Goals - высокоуровневые цели этого набора вторжения
// ResourceLevel - заранее определенный (предложенный) перечень уровней, на которых обычно работает данный набор вторжений, который, в свою очередь,
//  определяет ресурсы, доступные этому набору вторжений для использования в атаке
// PrimaryMotivation - одно, из заранее определенных (предложенных) перечней причин, мотиваций или целей определяющий данный набор вторжения
// SecondaryMotivations - заранее определенный (предложенный) вторичный перечень причин, мотиваций или целей определяющий данный набор вторжений
type IntrusionSetDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name                 string              `json:"name" bson:"name" required:"true"`
	Description          string              `json:"description" bson:"description"`
	Aliases              []string            `json:"aliases" bson:"aliases"`
	FirstSeen            time.Time           `json:"first_seen" bson:"first_seen"`
	LastSeen             time.Time           `json:"last_seen" bson:"last_seen"`
	Goals                []string            `json:"goals" bson:"goals"`
	ResourceLevel        OpenVocabTypeSTIX   `json:"resource_level" bson:"resource_level"`
	PrimaryMotivation    OpenVocabTypeSTIX   `json:"primary_motivation" bson:"primary_motivation"`
	SecondaryMotivations []OpenVocabTypeSTIX `json:"secondary_motivations" bson:"secondary_motivations"`
}
 */
import React from "react";
import {
    Button,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";

export default function CreateOpinionPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement,
        handlerAuthors,
        handlerOpinion, 
        handlerExplanation,
    } = props;

    let valuesIsInvalideContent = campaignPatterElement.opinion === "";

    return (<React.Fragment>
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
                <span className="text-muted">Объяснение обработчика почему он оставил это мнение:</span>
            </Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-abstract-static"
                    multiline
                    disabled={isDisabled}
                    fullWidth
                    onChange={handlerExplanation}
                    value={(campaignPatterElement.explanation)? campaignPatterElement.explanation: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Мнение обо всех STIX объектах на которые ссылается данный объект:</span>
            </Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-content-static"
                    multiline
                    error={valuesIsInvalideContent}
                    minRows={3}
                    maxRows={8}
                    disabled={isDisabled}
                    fullWidth
                    helperText="обязательное для заполнения поле"
                    onChange={handlerOpinion}
                    value={(campaignPatterElement.opinion)? campaignPatterElement.opinion: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Список авторов этого мнения:</span></Grid>
            <Grid item md={8}>
                <TokenInput
                    readOnly={isDisabled}
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.authors) ? []: campaignPatterElement.authors}
                    onTokenValuesChange={handlerAuthors} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Идентификаторы объектов:</span>
            </Grid>
        </Grid>

        {campaignPatterElement.object_refs && (() => {
            return (campaignPatterElement.object_refs.length === 0)? 
                <Typography variant="caption">
                    <span  style={{ color: red[800] }}>
                        * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                    </span>
                </Typography>:
                campaignPatterElement.object_refs.map((item, key) => {
                    let type = item.split("--");
                    let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                    if(typeof objectElem === "undefined" ){
                        return "";
                    }

                    return (<Grid container direction="row" key={`key_object_ref_${key}`}>
                        <Grid item container md={12} justifyContent="flex-start">
                            <Button onClick={() => {}} disabled>
                                <img 
                                    key={`key_object_ref_type_${key}`} 
                                    src={`/images/stix_object/${objectElem.link}`} 
                                    width="35" 
                                    height="35" />
                                    &nbsp;{item}&nbsp;
                            </Button>
                        </Grid>
                    </Grid>);
                });
        })()}
    </React.Fragment>);
}

CreateOpinionPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerAuthors: PropTypes.func.isRequired,
    handlerOpinion: PropTypes.func.isRequired, 
    handlerExplanation: PropTypes.func.isRequired,
};

/**
//OpinionDomainObjectsSTIX объект "Opinion", по терминалогии STIX, содержит оценку информации в приведенной в каком либо другом объекте STIX, которую произвел
//  другой участник анализа.
// Explanation - объясняет почему обработчик оставил это мнение
// Authors - список авторов этого мнения
// Opinion - мнение обо всех STIX объектах перечисленных в ObjectRefs (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ObjectRefs - список идентификаторов на другие STIX объекты (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
type OpinionDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Explanation string               `json:"explanation" bson:"explanation"`
	Authors     []string             `json:"authors" bson:"authors"`
	Opinion     EnumTypeSTIX  (string)       `json:"opinion" bson:"opinion" required:"true"`
	ObjectRefs  []IdentifierTypeSTIX `json:"object_refs" bson:"object_refs" required:"true"`
}
 */
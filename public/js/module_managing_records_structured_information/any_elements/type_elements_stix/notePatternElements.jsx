import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import CreateShortInformationSTIXObject from "../createShortInformationSTIXObject.jsx";

export default function CreateNotePatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement,
        handlerAuthors,
        handlerContent, 
        handlerAbstract,
        handlerButtonShowLink,
    } = props;

    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

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

    let valuesIsInvalideContent = campaignPatterElement.content === "";

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
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Краткое изложение содержания:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-abstract-static"
                    multiline
                    fullWidth
                    disabled={isDisabled}
                    onChange={handlerAbstract}
                    value={(campaignPatterElement.abstract)? campaignPatterElement.abstract: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Основное содержание:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-content-static"
                    multiline
                    error={valuesIsInvalideContent}
                    minRows={3}
                    maxRows={8}
                    fullWidth
                    disabled={isDisabled}
                    helperText="обязательное для заполнения поле"
                    onChange={handlerContent}
                    value={(campaignPatterElement.content)? campaignPatterElement.content: ""}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена:</span></Grid>
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
        
                    if(typeof objectElem === "undefined" || type[0] === "relationship"){
                        return "";
                    }

                    let disabled = false;
                    if(type[0] === "report"){                    
                        disabled = true;
                    }
                    
                    return (<Card variant="outlined" style={{ width: "100%" }} key={`key_rf_to_ref_${key}`}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(item);
                            }}
                            disabled={disabled} >
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
                });
        })()}
    </React.Fragment>);
}

CreateNotePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerAuthors: PropTypes.func.isRequired,
    handlerContent: PropTypes.func.isRequired, 
    handlerAbstract: PropTypes.func.isRequired,
    handlerButtonShowLink: PropTypes.func.isRequired,
};

/**
//NoteDomainObjectsSTIX объект "Note", по терминалогии STIX, содержит текстовую информации дополняющую текущий контекст анализа либо содержащей
//  результаты дополнительного анализа которые не может быть описан в терминах объектов STIX
// Abstract - краткое изложение содержания записки
// Content - основное содержание (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Authors - список авторов
// ObjectRefs - список идентификаторов на других DO STIX объектов к которым применяется замечание (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
type NoteDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Abstract   string               `json:"abstract" bson:"abstract"`
	Content    string               `json:"content" bson:"content" required:"true"`
	Authors    []string             `json:"authors" bson:"authors"`
	ObjectRefs []IdentifierTypeSTIX `json:"object_refs" bson:"object_refs" required:"true"`
}
 */
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
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { CreateListContextGrouping } from "../anyElements.jsx";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";
 
export default function CreateGroupingPatternElements(props){
    let { 
        isDisabled,
        showRefId,
        showRefObj,
        campaignPatterElement,
        handlerName,
        handlerClick,
        handlerContext,
        handlerDescription,
        handlerButtonShowLink,
    } = props;

    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

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

    let currentTime = helpers.getToISODatetime();
    
    if(!campaignPatterElement.created){
        campaignPatterElement.created = currentTime;
    }
    if(!campaignPatterElement.modified){
        campaignPatterElement.modified= currentTime;
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
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListContextGrouping
                    isDisabled={isDisabled}
                    campaignPatterElement={campaignPatterElement}
                    handlerContext={handlerContext}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Идентификаторы объектов:</span>
            </Grid>
        </Grid>

        <Grid container direction="row" style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
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

                            return (<Card variant="outlined" style={{ width: "100%" }} key={`key_rf_object_ref_${key}`}>
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
                                <Collapse in={refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        {(showRefId !== "" && showRefId === item)?  
                                            <CreateShortInformationSTIXObject  
                                                obj={showRefObj}
                                                handlerClick={handlerClick} />: 
                                            ""}
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        });
                })()}
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateGroupingPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefId: PropTypes.string.isRequired,
    showRefObj: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerName: PropTypes.func.isRequired,
    handlerClick: PropTypes.func.isRequired,
    handlerContext: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired, 
    handlerButtonShowLink: PropTypes.func.isRequired,
};

/**
 //GroupingDomainObjectsSTIX объект "Grouping", по терминалогии STIX, объединяет различные объекты STIX в рамках какого то общего контекста
// Name - имя используемое для идентификации "Grouping" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// Context - краткий дескриптор конкретного контекста, совместно используемого содержимым, на которое ссылается группа. Должно быть одно, из
//  заранее определенных (предложенных) значений (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ObjectRefs - указывает на список объектов STIX, на которые ссылается эта группировка (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
type GroupingDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name        string               `json:"name" bson:"name" required:"true"`
	Description string               `json:"description" bson:"description"`
	Context     OpenVocabTypeSTIX    `json:"context" bson:"context" required:"true"`
	ObjectRefs  []IdentifierTypeSTIX `json:"object_refs" bson:"object_refs" required:"true"`
}
 */
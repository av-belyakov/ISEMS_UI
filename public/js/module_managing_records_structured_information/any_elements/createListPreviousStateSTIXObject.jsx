"use strict";

import React, { useState } from "react";
import { 
    Box,
    Card,
    CardHeader,
    CardContent,
    Paper,
    Typography, 
    Grid,
//    CircularProgress,
} from "@material-ui/core";
import { orange } from "@material-ui/core/colors";
import InfiniteScroll from "react-infinite-scroll-component";

/*import IconCloseOutlined from "@material-ui/icons/CloseOutlined";
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import IconSave from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import TokenInput from "react-customize-token-input";
import { blue, grey, green, red } from "@material-ui/core/colors";*/
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//import { v4 as uuidv4 } from "uuid";
import { helpers } from "../../common_helpers/helpers";


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
        height: 400,
        width: "100%",
        border: "none",
        boxShadow: theme.shadows[1]
    },
}));

export default function CreateListPreviousStateSTIXObject(props){
    let { socketIo, searchObjectId, objectPreviousState } = props;
    const classes = useStyles();

    console.log("func 'CreateListPreviousStateSTIXObject', START...");
    console.log(objectPreviousState);

    const listValueName = {
        Created: "время создания",
        Modified: "время модификации",
        CreatedByRef: "id источника создавшего данный объект",
        Labels: "термины используемые для описания данного объекта",
        Сonfidence: "уверенность создателя в правильности своих данных",
        Lang: "текстовый код языка",
        ExternalReferences: "внешние ссылки",
        ObjectMarkingRefs: "список ID ссылающиеся на объект \"marking-definition\"",
        GranularMarkings: "список \"гранулярных меток\"",
        Extensions: "список дополнительной информации",
        Name: "имя",
        Description: "подробное описание",
        Aliases: "альтернативные имена",
        KillChainPhases: "список цепочки фактов",
        FirstSeen: "время первого обнаружения",
        LastSeen: "время последнего обнаружения",
        Objective: "основная цель",
    };

    let createFrame = () => {
        return (<InfiniteScroll
            height={900}
            next={()=> {
                console.log("element InfiniteScroll, start func 'Next' --->");
            }}
            onScroll={(e) => {
                console.log("element InfiniteScroll, start func 'onScroll' --->");
                console.log(e);
            }}
            dataLength={objectPreviousState.transmitted_data.length}>
            {objectPreviousState.transmitted_data.map((item, num) => {
                return (<Card className="mb-2 pl-2 pr-2" variant="outlined" key={`key_history_${num}`}>
                    <CardContent>
                        <div>
                            <Typography variant="caption">
                                <span className="text-muted">время модификации</span>: <span  style={{ color: orange[600] }}>{helpers.convertDateFromString(item.modified_time, { monthDescription: "long", dayDescription: "numeric" })}</span>
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption">
                                <span className="text-muted">изменения выполнил</span>: {(item.user_name_modified_object.length === 0)? 
                                    <strong>имя неизвестно</strong>:
                                    item.user_name_modified_object}
                            </Typography>
                        </div>
                        <hr/>
                        <div className="text-center">
                            <Typography variant="caption">Предыдущее значение:</Typography>
                        </div>
                        {item.field_list.map((e, n) => {
                            let tmpPath = e.path.split("/"),
                                num = tmpPath.length - 1,
                                value = e.value,
                                valueName = (typeof listValueName[tmpPath[num]] === "undefined")? tmpPath[num]: listValueName[tmpPath[num]];

                            console.log(`Value: ${e.value}, type: ${typeof e.value}`);

                            /*return (<Typography variant="caption" color="textSecondary" key={`key_value_name_${n}`}>
                                {valueName}: <strong>{e.value}</strong>
                            </Typography>);*/
                            if((typeof value === "string") && (value.length === 0)){
                                value = "пустое значение";
                            }

                            /** 
                             *      !!!!
                             * Здесь нужно придумать функцию замыкания для вывода информации из объектов и массивов
                             *      !!!!
                             */
                            if(_.isObject(value)){
                                if(Array.isArray(value)){
                                    value = e.value.map((item, n) => {
                                        let elem = item;
                                        if(_.isObject(item)){
                                            elem = JSON.stringify(item);
                                        }

                                        return (<div key={`key_value_list_array_${n}`}>{elem}</div>);
                                    });
                                } else {
                                    value = [];
                                    for(let k in value){
                                        let elem = value[k];

                                        if(_.isObject(value[k])){
                                            elem = JSON.stringify(value[k]);
                                        }

                                        value.push(<div key={`key_value_list_object_${n}`}>{elem}</div>); 
                                    }
                                }
                            }

                            return (<div key={`key_value_name_${n}`}>
                                <Typography variant="caption" color="inherit" display="block">
                                    <span className="text-muted">{valueName}</span>: {`${value}`}
                                </Typography>
                            </div>);
                        })}

                        {/*JSON.stringify(objectPreviousState.transmitted_data)*/}
                        {/*<Typography variant="caption" display="block">
                        {JSON.stringify(objectPreviousState.transmitted_data)}
                </Typography>*/}
                    </CardContent>
                </Card>);
            })}
        </InfiniteScroll>);

        /**
         *             <Grid container direction="row">
                <Grid item container md={12}>
                    {JSON.stringify(objectPreviousState.transmitted_data)}
                </Grid>
        </Grid>
         * 
        return (<NoSsr>
            <Frame style={{ width: "100%", height: "100%", display: "flex" }}>
                <Grid container direction="row">
                    <Grid item container md={12}>
                        {JSON.stringify(objectPreviousState.transmitted_data)}
                    </Grid>
                </Grid>
            </Frame>
        </NoSsr>);
         */
    };

    return (<React.Fragment>
        <Grid container direction="row" className="pt-3">
            <Grid item container md={12} justifyContent="center"><strong>История предыдущих состояний</strong></Grid>
        </Grid>
        <Grid container direction="row" className="pt-2">
            <Grid item container md={12} justifyContent="center">
                {((objectPreviousState.transmitted_data === null) || (typeof objectPreviousState.transmitted_data === "undefined"))? 
                    "Загрузка...":
                    createFrame()}
            </Grid>
        </Grid>

        {/*<Grid container direction="column" className="pt-3" justifyContent="flex-start" alignItems="center">
            <Grid item container md={12} justifyContent="center">
                <strong>История предыдущих состояний</strong>
            </Grid>
        </Grid>
        <Grid container direction="row" alignItems="stretch">
            <Grid item container md={12} justifyContent="center">
                {((objectPreviousState.transmitted_data === null) || (typeof objectPreviousState.transmitted_data === "undefined"))? 
                    "Загрузка...":
                    createFrame()}
            </Grid>
    </Grid>*/}
    </React.Fragment>);
}

CreateListPreviousStateSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    searchObjectId: PropTypes.string.isRequired,
    objectPreviousState: PropTypes.object.isRequired,
};
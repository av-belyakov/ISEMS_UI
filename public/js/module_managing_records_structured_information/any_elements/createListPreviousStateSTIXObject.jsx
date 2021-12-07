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
import { Badge } from "react-bootstrap";
import { orange, green } from "@material-ui/core/colors";
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

import { helpers } from "../../common_helpers/helpers";
import _ from "lodash";

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

const showInformationInCycle = (data, num) => {
    //console.log(`func 'showInformationInCicle', Num: ${num}, data:`);
    //console.log(data);
    //console.log("__________");

    if(_.isEmpty(data)){
        return <span style={{ color: green[600] }}>нет значения</span>;
    }

    if((_.isString(data)) || (_.isBoolean(data))){
        if((_.isString(data)) && (data.length === 0)){
            return <span style={{ color: green[600] }}>нет значения</span>;
        }

        return data;
    }

    if(_.isObject(data)){
        if(Array.isArray(data)){
            let tmpList = [];

            for(let i = 0; i < data.length; i++){
                if((_.isString(data[i])) || (_.isBoolean(data[i]))){
                    tmpList.push(<span key={`key_badge_${i}_${num}`}><Badge bg="info">{data[i]}</Badge>{" "}</span>);

                    continue;
                }

                if(Array.isArray(data[i])){
                    tmpList.push(<div key={`key_list_${i}_${num}`} style={{ marginTop: 4 }}>{showInformationInCycle(data[i], num++)}</div>);
                } else {
                    tmpList.push(showInformationInCycle(data[i], num++));
                }
            }

            return tmpList;
        } else {
            if(Object.keys(data).length === 2){
                let newKey = (data.Key)? data.Key: "",
                    newValue = (data.Value)? data.Value: "";

                if(newValue.length === 0){
                    newValue = <span style={{ color: green[600] }}>нет значения</span>;
                }

                return (<div style={{ marginLeft: 6, paddingBottom: -2 }} key={`key_div_${newKey}_${num}`}>
                    <span className="text-muted">{newKey}</span>: {newValue}
                </div>);
            }/* else {
                let tmp = [];
                for(let k in data){
                    console.log("==========");
                    console.log(k);
                    console.log(data[k]);
                    console.log("==========");

                    if((_.isString(data[k])) || (_.isBoolean(data[k]))){
                        tmp.push(<div key={`key_${k}_${num}`}>{(listValueName[k])? listValueName[k]: k}: {data[k]}</div>);
                        //                tmp.push(<div key={`key_${k}_${num}`}>{(listValueName[k])? listValueName[k]: k}: {data[k]}</div>);
        
                        continue;
                    }

                    let comma = (tmp.length === 0)? " ": ", ";
                    tmp.push(comma + showInformationInCicle(data[k], num++));
                }
            }*/
        }
    }

    return data;
};

export default function CreateListPreviousStateSTIXObject(props){
    let { socketIo, searchObjectId, objectPreviousState } = props;
    const classes = useStyles();

    console.log("func 'CreateListPreviousStateSTIXObject', START...");
    console.log(objectPreviousState);

    /**
 * 
 * Для теста изменил некоторые значения объекта Attack-Pattern, в БД история для этого объекта изменилась 
 * с 5 документов до 6, однако в интерфейсе как было 5 отрисованных элементов так и осталось. 
 * Но когда я выполнил перезагрузку страницы, стало 6 элементов!!!
 * 
 */

    let createFrame = () => {
        return (<InfiniteScroll
            height={900}
            next={()=> {
                //console.log("element InfiniteScroll, start func 'Next' --->");
            }}
            onScroll={(e) => {
                //console.log("element InfiniteScroll, start func 'onScroll' --->");
                //console.log(e);
            }}
            dataLength={objectPreviousState.transmitted_data.length}>
            {objectPreviousState.transmitted_data.map((item, num) => {

                console.log("modified data: ", item.modified_time);

                return (<Card className="mb-2 pl-2 pr-2" variant="outlined" key={`key_history_${num}_${item.modified_time}`}>
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
                        <div className="text-start mb-2">
                            <Typography variant="subtitle2">предыдущие значения:</Typography>
                        </div>
                        {item.field_list.map((e, n) => {
                            let tmpPath = e.path.split("/"),
                                num = tmpPath.length - 1,
                                value = e.value,
                                valueName = (typeof listValueName[tmpPath[num]] === "undefined")? tmpPath[num]: listValueName[tmpPath[num]];

                            //console.log(`Value: ${value}, type: ${typeof value}`);
                            //console.log(value);

                            /*return (<Typography variant="caption" color="textSecondary" key={`key_value_name_${n}`}>
                                {valueName}: <strong>{e.value}</strong>
                            </Typography>);*/

                            /** 
                             *      !!!!
                             * Здесь нужно придумать функцию замыкания для вывода информации из объектов и массивов
                             *      !!!!
                             */
                            /*if(_.isObject(value)){
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
                            }*/

                            return (<div key={`key_value_name_${n}_${item.modified_time}`}>
                                <Typography variant="caption" color="inherit" display="block">
                                    <span className="text-muted">{valueName}</span>: {showInformationInCycle(value, 1)}
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
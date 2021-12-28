"use strict";

import React from "react";
import { 
    Box,
    Card,
    CardContent,
    Typography, 
    Paper,
    Grid,
} from "@material-ui/core";
import { Badge } from "react-bootstrap";
import { orange, green } from "@material-ui/core/colors";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";
import _ from "lodash";

const showInformationInCycle = (data, num) => {
    if(!(_.isInteger(data)) && (_.isEmpty(data))){
        return <span style={{ color: green[600] }}>нет значения</span>;
    }

    if((_.isString(data)) || (_.isBoolean(data))){
        if((_.isString(data)) && (data.length === 0)){
            return <span style={{ color: green[600] }}>нет значения</span>;
        }

        return data;
    }

    if(Array.isArray(data)){
        let tmpList = [];

        for(let i = 0; i < data.length; i++){
            if(_.isString(data[i])){
                tmpList.push(<span key={`key_badge_info_${i}_${num}`}><Badge bg="info">{data[i]}</Badge>{" "}</span>);

                continue;
            }

            if(_.isBoolean(data[i])){
                let bg = (data[i])? "success": "danger"; 
                tmpList.push(<Badge key={`key_badge_true_false_${i}_${num}`} bg={bg}>{data[i]}</Badge>);

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
        if((_.isObject(data)) && (Object.keys(data).length === 2)){
            let newKey = (data.Key)? data.Key: "",
                newValue = (data.Value)? data.Value: "";

            if(Array.isArray(newValue)){
                return (<div style={{ marginLeft: 6, paddingBottom: -2 }} key={`key_div_${newKey}_${num}`}>
                    <span className="text-muted">{newKey}</span>: {showInformationInCycle(newValue, num++)}
                </div>);
            }

            if((newKey === "url") && (newValue.length > 0)){
                let urlValue = newValue;
                if(newValue.length > 45){
                    urlValue = newValue.substr(0, 45)+"...";
                }

                newValue = <a href={newValue}>{urlValue}</a>;
            }

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

    return data;
};

export default function CreateListPreviousStateSTIXObject(props){
    let { socketIo, searchObjectId, optionsPreviousState, listPreviousState } = props;
    let [ hasMore, setHasMore ] = React.useState(true);

    let createFrame = () => {
        return (<InfiniteScroll
            height={1000}
            loader={<div className="text-center"><h5>загрузка...</h5></div>}
            dataLength={listPreviousState.length}
            hasMore={hasMore}
            next={()=> {
                if(listPreviousState.length >= optionsPreviousState.countFoundDocuments){
                    setHasMore(false);

                    return;
                }

                if(listPreviousState.length > 100){
                    setHasMore(false);

                    return;
                }

                let currentPartNumber = optionsPreviousState.currentPartNumber+1;
                socketIo.emit("isems-mrsi ui request: send search request, get different objects STIX object for id", { 
                    arguments: { 
                        "documentId": searchObjectId,
                        "paginateParameters": {
                            "max_part_size": optionsPreviousState.sizePart,
                            "current_part_number": currentPartNumber,
                        } 
                    }});
            }} >
            {listPreviousState.map((item, num) => {
                if(typeof item.modified_time === "undefined"){
                    return;
                }

                return (<Box display="inline-block" sx={{ width: "100%" }} key={`key_history_${num}_${item.modified_time}`}>
                    <Card className="mb-3 pl-2 pr-2">
                        <CardContent>
                            <div>
                                <Typography variant="caption">
                                    <span className="text-muted">время модификации</span>: <span  style={{ color: orange[800] }}>
                                        {helpers.convertDateFromString(item.modified_time, { monthDescription: "long", dayDescription: "numeric" })}
                                    </span>
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption">
                                    <span className="text-muted">изменения выполнил</span>: {(item.user_name_modified_object.length === 0)? 
                                        <strong>имя неизвестно</strong>:
                                        item.user_name_modified_object}
                                </Typography>
                            </div>
                            <div className="text-start mb-2">
                                <Typography variant="subtitle2">предыдущие значения:</Typography>
                            </div>
                            {item.field_list.map((e, n) => {
                                let tmpPath = e.path.split("/"),
                                    num = tmpPath.length - 1,
                                    value = e.value;

                                return (<Grid item xs zeroMinWidth key={`key_value_name_${n}_${item.modified_time}`}>
                                    <Typography variant="caption" color="inherit" display="block">
                                        <span className="text-muted">{helpers.getHumanNameSTIXElement(tmpPath[num])}</span>: {showInformationInCycle(value, 1)}
                                    </Typography>
                                </Grid>);
                            })}
                        </CardContent>
                    </Card>
                </Box>);
            })}
        </InfiniteScroll>);
    };

    return (<React.Fragment>
        <Grid container direction="row" className="pt-3">
            <Grid item container md={12} justifyContent="center"><strong>История предыдущих состояний</strong></Grid>
        </Grid>
        <Grid container direction="row" className="pt-3">
            <Grid item container md={12} justifyContent="flex-end" className="text-muted">Всего документов:&nbsp; 
                <strong>{optionsPreviousState.countFoundDocuments}</strong>
            </Grid>
        </Grid>
        <Grid container direction="row" className="pt-2">
            <Grid item container md={12} justifyContent="center">
                {((listPreviousState === null) || (typeof listPreviousState === "undefined"))? 
                    "загрузка...":
                    createFrame()}
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateListPreviousStateSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    searchObjectId: PropTypes.string.isRequired,
    optionsPreviousState: PropTypes.object.isRequired,
    listPreviousState: PropTypes.array.isRequired,
};
"use strict";

import React from "react";
import { 
    Box,
    Card,
    CardContent,
    Typography, 
    Grid,
} from "@material-ui/core";
import { Badge } from "react-bootstrap";
import { orange, green } from "@material-ui/core/colors";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";
import _ from "lodash";

const SizePart = 15;
const sortDateFunc = (a, b) => {
    let timeA = +new Date(a.modified_time);
    let timeB = +new Date(b.modified_time);

    if(timeA > timeB) return -1;
    if(timeA === timeB) return 0;
    if(timeA < timeB) return 1;
};

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
        }
    }

    return data;
};

export default function CreateListPreviousStateSTIX(props){
    let { 
        socketIo, 
        searchObjectId, 
    } = props;

    let optionsPreviousStatePattern = {
        sizePart: SizePart,
        countFoundDocuments: 0,
        objectId: searchObjectId,
        currentPartNumber: 1,
    };
    let reduser = (state, action) => {
        switch(action.type){
        case "cleanAll":
            return optionsPreviousStatePattern;

        case "updateCurrentPartNumber":
            state.currentPartNumber = state.currentPartNumber + action.data;
            return {...state};

        case "updateCountFoundDocuments":
            state.countFoundDocuments = action.data;
            return {...state};
        }
    };
    let [ hasMore, setHasMore ] = React.useState(true);
    let [ listPreviousState, setListPreviousState ] = React.useState([]);
    let [ stateOptionsPrevious, dispatchOptionsPreviousState ] = React.useReducer(reduser, optionsPreviousStatePattern);
    let [ showListPreviousState, setShowListPreviousState ] = React.useState(false);

    let handlerHasMore = (data) => {
        setHasMore(data);
    };

    let listenerListDifferentObjects = (data) => {
            if((data.information === null) || (typeof data.information === "undefined")){
                return;
            }

            if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                return;
            }

            setShowListPreviousState(true);

            if(data.information.additional_parameters.transmitted_data.length === 0){
                return;
            }

            if(stateOptionsPrevious.objectId !== data.information.additional_parameters.transmitted_data[0].document_id){
                return;
            }

            if(listPreviousState.length === 0){
                setListPreviousState((data.information.additional_parameters.transmitted_data.length === 0)? 
                    [{}]: 
                    data.information.additional_parameters.transmitted_data);
            } else {
                setListPreviousState((prevState) => {
                    for(let item of data.information.additional_parameters.transmitted_data){
                        if(!prevState.find((elem) => elem.modified_time === item.modified_time)){
                            prevState.push(item);
                        }
                    }
        
                    prevState.sort(sortDateFunc);
                            
                    return prevState;
                });             
            }
        
            dispatchOptionsPreviousState({ type: "updateCurrentPartNumber", data: data.information.additional_parameters.number_transmitted_part });
            
        },
        listenerCountListDifferentObjects = (data) => {
            if((data.information === null) || (typeof data.information === "undefined")){
                return;
            }

            if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                return;
            }

            if(stateOptionsPrevious.objectId === data.information.additional_parameters.document_id){
                dispatchOptionsPreviousState({ type: "updateCountFoundDocuments", data: data.information.additional_parameters.number_documents_found });
            }
        };
    React.useEffect(() => {
        socketIo.on("isems-mrsi response ui: send search request, list different objects STIX object for id", listenerListDifferentObjects);
        socketIo.on("isems-mrsi response ui: send search request, count list different objects STIX object for id", listenerCountListDifferentObjects);

        //запрос на получение количества документов о предыдущем состоянии STIX объектов
        socketIo.emit("isems-mrsi ui request: send search request, get count different objects STIX object for id", {
            arguments: { "documentId": searchObjectId },
        });

        //запрос на получение дополнительной информации о предыдущем состоянии STIX объектов
        socketIo.emit("isems-mrsi ui request: send search request, get different objects STIX object for id", { 
            arguments: { 
                "documentId": searchObjectId,
                "paginateParameters": {
                    "max_part_size": SizePart,
                    "current_part_number": 1,
                } 
            }});

        return () => {
            socketIo.off("isems-mrsi response ui: send search request, list different objects STIX object for id", listenerListDifferentObjects);
            socketIo.off("isems-mrsi response ui: send search request, count list different objects STIX object for id", listenerCountListDifferentObjects);

            dispatchOptionsPreviousState({ type: "cleanAll" });
            setListPreviousState([]);
        };
    }, []);

    let framePreviousState = React.useMemo(() => <CreateFrame
        searchObjectId={searchObjectId}
        showListPreviousState={showListPreviousState} 
        listPreviousState={listPreviousState} 
        stateOptionsPrevious={stateOptionsPrevious}
        hasMore={hasMore}
        socketIo={socketIo}
        handlerHasMore={handlerHasMore}
    />, [ showListPreviousState, hasMore, listPreviousState ]);
    
    return (<React.Fragment>
        <Grid container direction="row" className="pt-3">
            <Grid item container md={12} justifyContent="center"><strong>История предыдущих состояний</strong></Grid>
        </Grid>
        <Grid container direction="row" className="pt-3">
            <Grid item container md={12} justifyContent="flex-end" className="text-muted">
                Всего документов:&nbsp;<strong>{stateOptionsPrevious.countFoundDocuments}</strong>
            </Grid>
        </Grid>
        <Grid container direction="row" className="pt-2">
            <Grid item container md={12} justifyContent="center">
                {((!listPreviousState) || (typeof listPreviousState === "undefined"))? 
                    "загрузка...":
                    framePreviousState}
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateListPreviousStateSTIX.propTypes = {
    socketIo: PropTypes.object.isRequired,
    searchObjectId: PropTypes.string.isRequired,
};

function CreateFrame(props){
    let { 
        searchObjectId,
        showListPreviousState, 
        listPreviousState, 
        stateOptionsPrevious,
        hasMore,
        socketIo,
        handlerHasMore, 
    } = props;

    return (<InfiniteScroll
        height={1000}
        loader={(showListPreviousState)? <span></span>: <div className="text-center"><h5>загрузка...</h5></div>}
        dataLength={listPreviousState.length}
        hasMore={hasMore}
        next={()=> {
            if(listPreviousState.length >= stateOptionsPrevious.countFoundDocuments){
                handlerHasMore(false);

                return;
            }

            if(listPreviousState.length > 100){
                handlerHasMore(false);

                return;
            }

            socketIo.emit("isems-mrsi ui request: send search request, get different objects STIX object for id", { 
                arguments: { 
                    "documentId": searchObjectId,
                    "paginateParameters": {
                        "max_part_size": stateOptionsPrevious.sizePart,
                        "current_part_number": stateOptionsPrevious.currentPartNumber,
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
}

CreateFrame.propTypes = {
    searchObjectId: PropTypes.string.isRequired,
    showListPreviousState: PropTypes.bool.isRequired, 
    listPreviousState: PropTypes.array.isRequired, 
    stateOptionsPrevious: PropTypes.object.isRequired,
    hasMore: PropTypes.bool.isRequired,
    socketIo: PropTypes.object.isRequired,
    handlerHasMore: PropTypes.func.isRequired,
};

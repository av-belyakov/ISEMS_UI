import React, { useState, useEffect } from "react";
import { 
    Avatar,
    Box,
    Chip,
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    TablePagination, 
    Tooltip, 
    Typography, 
    Grid,
    Paper, 
    LinearProgress } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";
import { CreateButtonNewReport } from "../buttons/createButtonNewReport.jsx";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 750,
    },
}));

const columns = [
    { id: "num", label: "№", minWidth: 45 },
    { id: "type", label: "Тип", minWidth: 45, align: "center", },
    { id: "item_id", label: "Доступен для групп", minWidth: 170 },
    { id: "create", label: "Создан", minWidth: 130 },
    { id: "modify", label: "Модифицирован", minWidth: 130 },
    { id: "publication", label: "Опубликован", minWidth: 130 },
    { id: "name", label: "Краткое название", minWidth: 170 },
    {
        id: "content_type",
        label: "Типы контента",
        minWidth: 100,
        align: "right",
        //format: (value) => value.toLocaleString("en-US"),
    },
];

const currentPage = 0, //текущая страница
    showReportsPerPage = 10, //количество строк на странице
    maxPartSize = 30; //максимальный размер запрашиваемых данных

export default function CreateMainTableForReport(props) {
    let {
        socketIo,
        sendNewSearch,
        searchPattern,
        buttonAddNewReportIsDisabled,
        handlerChangeSendNewSearch,
        handlerShowModalWindowAddNewReport,
        handlerShowModalWindowInformationReport,
    } = props;

    let [ listReports, setListReports ] = useState([]);
    let [ currentPartNumber, setCurrentPartNumber ] = useState(1);
    let [ numCurrentPagePagination, setNumCurrentPagePagination ] = useState(currentPage);
    let [ countSearchReports, setCountSearchReports ] = useState(0);
    let [ countShowReportsPerPage, setCountShowReportsPerPage ] = useState(showReportsPerPage);
    let [ isShowProgress, setIsShowProgress ] = useState(true);

    let searchReguest = {
        paginateParameters: {
            maxPartSize: maxPartSize,
            currentPartNumber: currentPartNumber,
        },
        sortableField: "data_created",
        searchParameters: searchPattern,
    };

    useEffect(() => {
        let listenerSearchTableReport = (data) => {
            if((typeof data.information === "undefined") || (data.information === null)){
                return;
            }
    
            if((typeof data.information.additional_parameters === "undefined") || (data.information.additional_parameters === null)){
                return;
            }
    
            if((typeof data.information.additional_parameters.transmitted_data === "undefined") || (data.information.additional_parameters.transmitted_data === null)){
                return;
            }
    
            //console.log(222222222);
            //console.log(data.information.additional_parameters.transmitted_data);
            //console.log("numCurrentPagePagination: '", numCurrentPagePagination, "'");
            //console.log("BEFORE listReport count: ", listReports.length);
    
            let listReportsTmp = listReports.slice(),
                listIdReport = [];

            if(sendNewSearch){
                listReportsTmp = [];
                handlerChangeSendNewSearch();
            }
    
            for(let item of data.information.additional_parameters.transmitted_data){
                listReportsTmp.push(item);
                listIdReport.push(item.id);
            }
    
            if(listIdReport.length > 0){
                setIsShowProgress(false);
            }
    
            //console.log("AFTER listReportsTmp count: ", listReportsTmp.length);
    
            setListReports(listReportsTmp);
            socketIo.emit("isems-mrsi ui request: get short information about groups which report available", { arguments: listIdReport });
        };

        socketIo.on("isems-mrsi response ui: send search request, table page report", listenerSearchTableReport);

        return () => {
            socketIo.off("isems-mrsi response ui: send search request, table page report", listenerSearchTableReport);    
        };
    }, [ listReports, setListReports, sendNewSearch, handlerChangeSendNewSearch ]);

    useEffect(() => {
        //запрос полной информации по заданным параметрам
        socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: searchReguest });
    }, []);

    console.log("func 'CreateMainTableForReport' MOUNT === TABLE ===");

    let handlerOnRowsPerPageChange = (rowsPerPage) => {
            setCountShowReportsPerPage(rowsPerPage);        
        },
        handlerOnPageChange = (num) => {
            setNumCurrentPagePagination(num);

            //console.log("(30 * num) - ", (maxPartSize * num), " < ", countSearchReports, " - countSearchReports");
            //console.log("listReports.length - ", listReports.length, " < ", countSearchReports, " - countSearchReports");
            //console.log("num = ", num, ", countShowReportsPerPage = ", countShowReportsPerPage, " maxPartSize / countShowReportsPerPage = ", (maxPartSize / countShowReportsPerPage));

            if(maxPartSize === 0){
                return;
            }

            //console.log("num: ", num, " >= ", (maxPartSize / countShowReportsPerPage) - 1, " :(maxPartSize / countShowReportsPerPage) - 1");

            /*let equalityOne = countSearchReports > 10 && countSearchReports < 20;
            let equalityTwo = countSearchReports > 20 && countSearchReports < 30;
            let equalityThree = countSearchReports > 30 && countSearchReports < 40;
            if(equalityOne || equalityTwo || equalityThree){

                console.log("SEND new reguest for search data 1111 --->");

                handlerRequestNextPageOfTable();

                return;
            }*/

            if(num >= ((maxPartSize * currentPartNumber) / countShowReportsPerPage) - 1){
                
                console.log("SEND new reguest for search data 2222 --->");

                handlerRequestNextPageOfTable();
            }
        },
        handlerTableOnClick = (elem, elemId) => {
            handlerShowModalWindowInformationReport(elemId);
        },
        handlerCountSearchedReports = (docCount) => {
            if(sendNewSearch){
                setNumCurrentPagePagination(0);
            }

            setCountSearchReports(docCount);
        },
        handlerRequestNextPageOfTable = () => {
            ++currentPartNumber;

            console.log("func 'handlerRequestNextPageOfTable', START..., CurrentPartNumber = ", currentPartNumber);

            setCurrentPartNumber((prevState) => prevState + 1);
            socketIo.emit("isems-mrsi ui request: send search request, table page report", { arguments: {
                paginateParameters: {
                    maxPartSize: 30,
                    currentPartNumber: currentPartNumber,
                },
                sortableField: "data_created",
                searchParameters: searchPattern,
            }});        
        };

    return (<Paper elevation={3}>
        <Box m={2} mb={2} pt={2} pb={2}>
            <ShowDocumentCount 
                socketIo={socketIo}
                searchReguest={searchReguest}
                buttonAddNewReportIsDisabled={buttonAddNewReportIsDisabled}
                handlerCountSearchedReports={handlerCountSearchedReports}
                handlerShowModalWindowAddNewReport={handlerShowModalWindowAddNewReport}
            />
            <CreateTable 
                socketIo={socketIo}
                listReports={listReports} 
                isShowProgress={isShowProgress}
                countSearchReports={countSearchReports}
                countShowReportsPerPage={countShowReportsPerPage}
                numCurrentPagePagination={numCurrentPagePagination} 
                handlerTableOnClick={handlerTableOnClick}
                handlerOnPageChange={handlerOnPageChange}
                handlerOnRowsPerPageChange={handlerOnRowsPerPageChange} 
            />
        </Box>
    </Paper>);
}

CreateMainTableForReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    sendNewSearch: PropTypes.bool.isRequired,
    searchPattern: PropTypes.object.isRequired,
    buttonAddNewReportIsDisabled: PropTypes.bool.isRequired,
    handlerChangeSendNewSearch: PropTypes.func.isRequired,
    handlerShowModalWindowAddNewReport: PropTypes.func.isRequired,
    handlerShowModalWindowInformationReport: PropTypes.func.isRequired,
};

function ShowDocumentCount(props){
    let { 
        socketIo,
        searchReguest,
        buttonAddNewReportIsDisabled,
        handlerCountSearchedReports,
        handlerShowModalWindowAddNewReport, 
    } = props;

    let [ countSearchReports, setCountSearchReports ] = useState(0);
    
    React.useEffect(() => {
        let listenerCountFoundElem = (data) => {
            let num = data.information.additional_parameters.number_documents_found;
    
            console.log(11111111);
    
            handlerCountSearchedReports(num);
            setCountSearchReports(num);
        };
    
        socketIo.on("isems-mrsi response ui: send search request, count found elem, table page report", listenerCountFoundElem);
        //запрос краткой информации (количество) по заданным параметрам
        socketIo.emit("isems-mrsi ui request: send search request, cound found elem, table page report", { arguments: searchReguest });

        return () => {
            socketIo.off("isems-mrsi response ui: send search request, count found elem, table page report", listenerCountFoundElem);
        };
    }, [ setCountSearchReports, handlerCountSearchedReports ]);

    return (<Grid container direction="row" className="pb-2">
        <Grid item container md={8} justifyContent="flex-start">
            <i>{`Всего документов найдено: ${countSearchReports}`}</i>
        </Grid>
        <Grid item container md={4} justifyContent="flex-end">
            <CreateButtonNewReport 
                buttonIsDisabled={buttonAddNewReportIsDisabled}
                handlerShowModalWindow={handlerShowModalWindowAddNewReport}/>
        </Grid>
    </Grid>);
}

ShowDocumentCount.propTypes = {
    socketIo: PropTypes.object.isRequired,
    searchReguest: PropTypes.object.isRequired,
    buttonAddNewReportIsDisabled: PropTypes.bool.isRequired,
    handlerCountSearchedReports: PropTypes.func.isRequired,
    handlerShowModalWindowAddNewReport: PropTypes.func.isRequired,
};

function CreateTable(props){
    let {
        socketIo,
        listReports, 
        isShowProgress,
        countSearchReports,
        countShowReportsPerPage,
        numCurrentPagePagination, 
        handlerTableOnClick,
        handlerOnPageChange,
        handlerOnRowsPerPageChange,
    } = props;

    let [ listGroupsWhichReportAvailable, setListGroupsWhichReportAvailable ] = useState([]);
    
    React.useEffect(() => {
        let listenerGroupAvailable = (data) => {
            if((typeof data.information === "undefined") || (data.information === null)){
                return;
            }
    
            if((typeof data.information.additional_parameters === "undefined") || (data.information.additional_parameters === null)){
                return;
            }
    
            //console.log(333333333);
    
            let tmp = listGroupsWhichReportAvailable.slice();
            for(let item of data.information.additional_parameters){
                if(typeof tmp.find((elem) => {
                    return (elem.group_name === item.group_name && elem.object_id === item.object_id);
                }) === "undefined"){
                    tmp.push(item);
                }
            }
    
            setListGroupsWhichReportAvailable(tmp);
        };

        socketIo.on("isems-mrsi response ui: short information about groups which report available", listenerGroupAvailable);
        
        return () => {
            socketIo.off("isems-mrsi response ui: short information about groups which report available", listenerGroupAvailable);
        };
    }, [ listGroupsWhichReportAvailable, setListGroupsWhichReportAvailable ]);

    const classes = useStyles();
    let onPageChange = (elem, data) => {
            handlerOnPageChange(data);
        },
        onRowsPerPageChange = (data) => {
            handlerOnRowsPerPageChange(data.target.value);
        },
        getChipForGroups = (elemId) => {
            let listTmp = [];
            for(let item of listGroupsWhichReportAvailable){
                if(elemId === item.object_id){
                    listTmp.push(<Chip 
                        size="small"
                        avatar={<Avatar>{item.group_name.slice(0, 1).toUpperCase()}</Avatar>} 
                        label={item.group_name}
                        className="mr-1"  
                        key={`key_${item.group_name}`}
                        disabled />);
                }
            }
    
            return (<React.Fragment>
                <Chip  size="small" avatar={<Avatar>A</Avatar>} label="administrator" className="mr-1" key="key_administrator" disabled/>
                {listTmp}
            </React.Fragment>);
        };

    if(isShowProgress){
        return <LinearProgress />;
    }

    if(countSearchReports === 0){
        return (<Grid container direction="row">
            <Grid item container md={12} justifyContent="center">
                <Typography variant="overline" style={{ color: red[400] }}>по заданным параметрам  отчётов не найдено</Typography>
            </Grid>
        </Grid>);
    }

    //console.log("countSearchReports: ", countSearchReports);
    //console.log("countShowReportsPerPage: ", countShowReportsPerPage);
    //console.log("numCurrentPagePagination: ", numCurrentPagePagination);

    return (<Paper className={classes.root}>
        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }} >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listReports.map((item, num) => {
                        let imgTypeSTIX = "",
                            timePublished = <span className="text-secondary">не опубликован</span>;
                        
                        if(Date.parse(item.published) > 0){
                            timePublished = helpers.convertDateFromString(item.published, {});
                        }

                        let currentType = helpers.getLinkImageSTIXObject(item.type);
                        if(typeof currentType !== "undefined"){
                            imgTypeSTIX = <Tooltip title={currentType.description} key={`key_tooltip_report_type_${currentType.link}`}>
                                <img src={`/images/stix_object/${currentType.link}`} width="35" height="35" />
                            </Tooltip>;
                        }

                        if((num >= (countShowReportsPerPage * numCurrentPagePagination)) && (num < (countShowReportsPerPage * (numCurrentPagePagination + 1)))){
                            return (<TableRow 
                                key={`table_row_${item.id}`} 
                                hover role="checkbox" tabIndex={-1} 
                                onClick={(elem) => { handlerTableOnClick(elem, item.id); }}>
                                <TableCell>{`${++num}.`}</TableCell>
                                <TableCell align="center">{imgTypeSTIX}</TableCell>
                                <TableCell >{getChipForGroups(item.id)}</TableCell>
                                <TableCell>{helpers.convertDateFromString(item.created, {})}</TableCell>
                                <TableCell>{helpers.convertDateFromString(item.modified, {})}</TableCell>
                                <TableCell>{timePublished}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">{item.report_types.map((elem) => {
                                    let linkImage = helpers.getLinkImageSTIXObject(elem);
    
                                    if(typeof linkImage === "undefined"){
                                        return;
                                    }
    
                                    return (<Tooltip title={linkImage.description} key={`key_tooltip_report_type_${elem}`}>
                                        <img 
                                            key={`key_report_type_${elem}`} 
                                            src={`/images/stix_object/${linkImage.link}`} 
                                            width="35" 
                                            height="35" />
                                    </Tooltip>);
                                })}
                                </TableCell>
                            </TableRow>);
                        }
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={countSearchReports}
            rowsPerPage={countShowReportsPerPage}
            page={numCurrentPagePagination}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange} />
    </Paper>);
}

CreateTable.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listReports: PropTypes.array.isRequired,
    isShowProgress: PropTypes.bool.isRequired,
    countSearchReports: PropTypes.number,
    numCurrentPagePagination: PropTypes.number,
    countShowReportsPerPage: PropTypes.number,
    handlerTableOnClick: PropTypes.func.isRequired,
    handlerOnPageChange: PropTypes.func.isRequired,
    handlerOnRowsPerPageChange: PropTypes.func.isRequired,
};

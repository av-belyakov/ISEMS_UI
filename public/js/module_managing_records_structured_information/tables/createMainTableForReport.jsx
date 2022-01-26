import React from "react";
import { Col, Row } from "react-bootstrap";
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
    Tooltip, 
    TablePagination, 
    Grid,
    Paper, 
    LinearProgress } from "@material-ui/core";
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

export default class CreateMainTableForReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            listReports: [],
            listGroupsWhichReportAvailable: [],
            countSearchReports: 0,
            numCurrentPagePagination: 0,
            countShowReportsPerPage: 10,
        };

        this.getChipForGroups = this.getChipForGroups.bind(this);
        this.handlerOnPageChange = this.handlerOnPageChange.bind(this);
        this.handlerTableOnClick = this.handlerTableOnClick.bind(this);
        this.handlerOnRowsPerPageChange = this.handlerOnRowsPerPageChange.bind(this);

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("isems-mrsi response ui", (data) => {
            if(data.section === "send search request, count found elem, table page report"){

                console.log("func 'createMainTableForReport', handlerEvents");
                console.log(data);

                if(!data.information.is_successful){
                    return;
                }

                this.setState({ countSearchReports: data.information.additional_parameters.number_documents_found });
            }

            if(data.section === "send search request, table page report"){
                
                console.log("func 'createMainTableForReport', handlerEvents");
                console.log(data);

                if((typeof data.information === "undefined") || (data.information === null)){
                    return;
                }

                if((typeof data.information.additional_parameters === "undefined") || (data.information.additional_parameters === null)){
                    return;
                }

                if((typeof data.information.additional_parameters.transmitted_data === "undefined") || (data.information.additional_parameters.transmitted_data === null)){
                    return;
                }

                let listReportsTmp = [],
                    listIdReport = [];
                if(this.props.paginateParameters.currentPartNumber > 1){
                    listReportsTmp = this.state.listReports.slice();

                    this.props.changeValueAddNewReport(false);
                }

                for(let item of data.information.additional_parameters.transmitted_data){
                    listReportsTmp.push(item);
                    listIdReport.push(item.id);
                }

                this.props.socketIo.emit("isems-mrsi ui request: get short information about groups which report available", { arguments: listIdReport });

                this.setState({ listReports: listReportsTmp });
            }

            if(data.section === "short information about groups which report available"){
                if((typeof data.information === "undefined") || (data.information === null)){
                    return;
                }

                if((typeof data.information.additional_parameters === "undefined") || (data.information.additional_parameters === null)){
                    return;
                }

                let tmp = this.state.listGroupsWhichReportAvailable.slice();
                for(let item of data.information.additional_parameters){
                    if(typeof tmp.find((elem) => {
                        return (elem.group_name === item.group_name && elem.object_id === item.object_id);
                    }) === "undefined"){
                        tmp.push(item);
                    }
                }

                this.setState({ listGroupsWhichReportAvailable: tmp });
            }
        });
    }

    requestEmitter(){}

    handlerOnRowsPerPageChange(rowsPerPage){        
        this.setState({ countShowReportsPerPage: rowsPerPage });
    }

    handlerOnPageChange(numCurrentPagePagination){
        if(numCurrentPagePagination > this.state.numCurrentPagePagination){
            if(((30 * numCurrentPagePagination) < this.state.countSearchReports) && (this.state.listReports.length < this.state.countSearchReports)){
                this.props.handlerRequestNextPageOfTable(numCurrentPagePagination+1);
            }
        }

        this.setState({ numCurrentPagePagination: numCurrentPagePagination });
    }

    handlerTableOnClick(elem, elemId){
        this.props.handlerShowModalWindowInformationReport(elemId);
    }

    getChipForGroups(elemId){
        let listTmp = [];
        for(let item of this.state.listGroupsWhichReportAvailable){
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
    }

    showDocumentCount(){
        return (<Grid container direction="row" className="pb-2">
            <Grid item container md={8} justifyContent="flex-start">
                <i>{`Всего документов найдено: ${this.state.countSearchReports}`}</i>
            </Grid>
            <Grid item container md={4} justifyContent="flex-end">
                <CreateButtonNewReport 
                    buttonIsDisabled={this.props.buttonAddNewReportIsDisabled}
                    handlerShowModalWindow={this.props.handlerShowModalWindowAddNewReport}/>
            </Grid>
        </Grid>);
    }

    render(){
        return (<Paper elevation={3}>
            <Box m={2} mb={2} pt={2} pb={2}>
                {this.showDocumentCount.call(this)}
                <CreateTable 
                    listReports={this.state.listReports} 
                    countSearchReports={this.state.countSearchReports} 
                    numCurrentPagePagination={this.state.numCurrentPagePagination}
                    countShowReportsPerPage={this.state.countShowReportsPerPage} 
                    handlerTableOnClick={this.handlerTableOnClick}
                    handlerOnPageChange={this.handlerOnPageChange}
                    handlerOnRowsPerPageChange={this.handlerOnRowsPerPageChange}
                    getChipForGroups={this.getChipForGroups} />
            </Box>
        </Paper>);
    }
}

CreateMainTableForReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    addNewReport: PropTypes.bool.isRequired,
    paginateParameters: PropTypes.object.isRequired,
    changeValueAddNewReport: PropTypes.func.isRequired,
    buttonAddNewReportIsDisabled: PropTypes.bool.isRequired,
    handlerRequestNextPageOfTable: PropTypes.func.isRequired,
    handlerShowModalWindowAddNewReport: PropTypes.func.isRequired,
    handlerShowModalWindowInformationReport: PropTypes.func.isRequired,
};

function CreateTable(props){
    let { 
        listReports, 
        countSearchReports, 
        numCurrentPagePagination, 
        countShowReportsPerPage,
        handlerTableOnClick,
        handlerOnPageChange,
        handlerOnRowsPerPageChange,
        getChipForGroups,
    } = props;
    const classes = useStyles(),
        onPageChange = (elem, data) => {
            handlerOnPageChange(data);
        },
        onRowsPerPageChange = (data) => {
            handlerOnRowsPerPageChange(data.target.value);
        };

    if(listReports.length === 0){
        return <LinearProgress />;
    }

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
    listReports: PropTypes.array.isRequired,
    countSearchReports: PropTypes.number,
    numCurrentPagePagination: PropTypes.number,
    countShowReportsPerPage: PropTypes.number,
    handlerTableOnClick: PropTypes.func.isRequired,
    handlerOnPageChange: PropTypes.func.isRequired,
    handlerOnRowsPerPageChange: PropTypes.func.isRequired,
    getChipForGroups: PropTypes.func.isRequired,
};
import React from "react";
import { Col, Row } from "react-bootstrap";
import { 
    Avatar,
    Chip,
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Tooltip, 
    TablePagination, 
    Paper, 
    LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";

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

            //            console.log("class 'CreateMainTableForReport'");
            //            console.log(data);

            if(data.section === "send search request, count found elem, table page report"){
                //console.log("___ data for COUNT DOCUMENTS START");
                //console.log(data);
                //console.log("___ data for COUNT DOCUMENTS END");

                if(!data.information.is_successful){
                    return;
                }

                this.setState({ countSearchReports: data.information.additional_parameters.number_documents_found });
            }

            if(data.section === "send search request, table page report"){
                console.log("___ data for table START");
                console.log(data);
                console.log("___ data for table END");

                if((typeof data.information === "undefined") || (data.information === null)){
                    return;
                }

                if((typeof data.information.additional_parameters === "undefined") || (data.information.additional_parameters === null)){
                    return;
                }

                if((typeof data.information.additional_parameters.transmitted_data === "undefined") || (data.information.additional_parameters.transmitted_data === null)){
                    return;
                }

                let listReportsTmp = [];
                for(let item of this.state.listReports){
                    listReportsTmp.push(item);
                }

                for(let item of data.information.additional_parameters.transmitted_data){
                    listReportsTmp.push(item);
                }

                console.log(`______ func 'handlerEvents' num listReportsTmp: ______ ${listReportsTmp.length}`);

                this.setState({ listReports: listReportsTmp });
            }
        });
    }

    requestEmitter(){}

    handlerOnRowsPerPageChange(rowsPerPage){
        console.log("handler func 'handlerOnRowsPerPageChange', START...");
        
        this.setState({ countShowReportsPerPage: rowsPerPage });
    }

    handlerOnPageChange(numCurrentPagePagination){
        console.log("func 'handlerOnPageChange', START...");
        console.log(numCurrentPagePagination);

        if(numCurrentPagePagination > this.state.numCurrentPagePagination){
            console.log("___func 'handlerOnPageChange', --->>>");

            if(((30 * numCurrentPagePagination) < this.state.countSearchReports) && (this.state.listReports.length < this.state.countSearchReports)){
                this.props.handlerRequestNextPageOfTable(numCurrentPagePagination+1);
            }
        } else {
            console.log("func 'handlerOnPageChange', <<<");
        }

        this.setState({ numCurrentPagePagination: numCurrentPagePagination });
    }

    handlerTableOnClick(elem, elemId){
        console.log("func 'handlerTableOnClick', START...");
        console.log(elem);
        console.log(`ID element: '${elemId}'`);

        this.props.handlerShowModalWindowInformationReport(elemId);
    }

    getChipForGroups(elemId){
        //тут нужно выполнить поиск в списке докладов доступных для групп и вывести результат сложив со значком administrator

        return <Chip avatar={<Avatar>A</Avatar>} label="Administrator" disabled/>;
    }

    showDocumentCount(){
        return (
            <Row>
                <Col md={12} className="text-left pb-2"><i>{`Всего документов найдено: ${this.state.countSearchReports}`}</i></Col>
            </Row>
        );
    }

    render(){
        return (
            <React.Fragment>
                <hr/>
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
            </React.Fragment>
        );
    }
}

CreateMainTableForReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    handlerRequestNextPageOfTable: PropTypes.func.isRequired,
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
    const classes = useStyles();

    const onPageChange = (elem, data) => {
        console.log("func 'onPageChange', START...");
        console.log(elem);

        handlerOnPageChange(data);
    };

    const onRowsPerPageChange = (data) => {
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
                            return (
                                <TableRow key={`table_row_${item.id}`} hover role="checkbox" tabIndex={-1} onClick={(elem) => { handlerTableOnClick(elem, item.id); }}>
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
                                </TableRow>
                            );
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
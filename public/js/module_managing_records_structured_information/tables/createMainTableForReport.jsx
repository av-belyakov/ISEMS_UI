import React from "react";
import { Col, Row } from "react-bootstrap";
import { 
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

import { helpers } from "../../common_helpers//helpers";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 750,
    },
    pagination: {
        width: "100%",
        align: "center",
        textAlign: "center",
        alignItems: "center",
        alignContent: "center",
        padding: theme.spacing(2,2),
    },
}));

const columns = [
    { id: "num", label: "№", minWidth: 45 },
    { id: "type", label: "Тип", minWidth: 45, align: "center", },
    { id: "create", label: "Дата создания", minWidth: 130 },
    { id: "modify", label: "Дата модификации", minWidth: 130 },
    { id: "publication", label: "Дата публикации", minWidth: 130 },
    { id: "name", label: "Наименование", minWidth: 170 },
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
            currentPagePagination: 0,
        };

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("isems-mrsi response ui", (data) => {

            //            console.log("class 'CreateMainTableForReport'");
            //            console.log(data);

            if(data.section === "send search request, count found elem, table page report"){
                console.log("___ data for COUNT DOCUMENTS START");
                console.log(data);
                console.log("___ data for COUNT DOCUMENTS END");

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

                this.setState({ listReports: data.information.additional_parameters.transmitted_data });
            }
        });
    }

    requestEmitter(){}

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
                    currentPagePagination={this.state.currentPagePagination}/>
            </React.Fragment>
        );
    }
}

CreateMainTableForReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
};

function CreateTable(props){
    let { listReports, countSearchReports, currentPagePagination } = props;
    const classes = useStyles();

    const onPageChange = ()=>{
        console.log("handler func 'onPageChange', START...");
    };

    const onRowsPerPageChange = ()=>{
        console.log("handler func 'onRowsPerPageChange', START...");
    };

    console.log("CreateTable");
    console.log(listReports);

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
                            timePublished = <span className="text-secondary">не опубликовано</span>;
                        
                        if(Date.parse(item.published) > 0){
                            timePublished = helpers.convertDateFromString(item.published);
                        }

                        let currentType = helpers.getLinkImageSTIXObject(item.type);
                        if(typeof currentType !== "undefined"){
                            imgTypeSTIX = <Tooltip title={currentType.description} key={`key_tooltip_report_type_${currentType.link}`}>
                                <img src={`/images/stix_object/${currentType.link}`} width="35" height="35" />
                            </Tooltip>;
                        }

                        return (
                            <TableRow key={`table_row_${item.id}`}>
                                <TableCell>{`${++num}.`}</TableCell>
                                <TableCell align="center">{imgTypeSTIX}</TableCell>
                                <TableCell>{helpers.convertDateFromString(item.created)}</TableCell>
                                <TableCell>{helpers.convertDateFromString(item.modified)}</TableCell>
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
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={countSearchReports}
            rowsPerPage={10}
            page={currentPagePagination}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange} />
    </Paper>);
}

CreateTable.propTypes = {
    listReports: PropTypes.array.isRequired,
    countSearchReports: PropTypes.number,
    currentPagePagination: PropTypes.number,
};
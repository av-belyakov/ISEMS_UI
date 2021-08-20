import React from "react";
import { Col, Row } from "react-bootstrap";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers//helpers";

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
});

const columns = [
    { id: "num", label: "№", minWidth: 45 },
    { id: "create", label: "Дата создания", minWidth: 150 },
    { id: "modify", label: "Дата модификации", minWidth: 150 },
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
        };

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("isems-mrsi response ui", (data) => {

            //            console.log("class 'CreateMainTableForReport'");
            //            console.log(data);

            if(data.section === "send search request, table page report"){
                console.log("___ data for table START");
                console.log(data);
                console.log("___ data for table END");

                if((typeof data.information === "undefined") || (data.information === null)){

                    console.log("ERROR: 1");

                    return;
                }

                if((typeof data.information.additional_parameters === "undefined") || (data.information.additional_parameters === null)){
                    
                    console.log("ERROR: 2");
                    
                    return;
                }

                if((typeof data.information.additional_parameters.transmitted_data === "undefined") || (data.information.additional_parameters.transmitted_data === null)){
                    
                    console.log("ERROR: 3");
                    
                    return;
                }

                this.setState({ listReports: data.information.additional_parameters.transmitted_data });
            }
        });
    }

    requestEmitter(){}

    render(){
        return (
            <React.Fragment>
                <hr/>
                <Row><Col md={12} className="pt-4 text-center"><h3>Область основной таблицы страницы Report!</h3></Col></Row>
                <CreateTable listReports={this.state.listReports}/>
            </React.Fragment>
        );
    }
}

CreateMainTableForReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
};

function CustomPagination() {
    
}

function CreateTable(props){
    let { listReports } = props;
    const classes = useStyles();

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
                        return (
                            <TableRow key={`table_row_${item.id}`}>
                                <TableCell>{`${++num}.`}</TableCell>
                                <TableCell>{item.created}</TableCell>
                                <TableCell>{item.modified}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">{JSON.stringify(item.report_types)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>);
}
//helpers.getDate(item.created)
CreateTable.propTypes = {
    listReports: PropTypes.array.isRequired,
};
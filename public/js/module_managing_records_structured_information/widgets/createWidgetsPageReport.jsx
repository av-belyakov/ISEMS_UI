import React from "react";
import { Col, Row } from "react-bootstrap";
import { Avatar, Paper, Tooltip, Typography, Grid } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import { grey, lightGreen, teal, red, yellow } from "@material-ui/core/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: "hidden",
        padding: theme.spacing(1, 0),
    },
    typography: {
        subtitle1: {
            fontSize: 12,
        },
    },
    paper: {
        maxWidth: 300,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
    controls: {
        display: "flex",
        alignItems: "center",
        //paddingRight: theme.spacing(3),
        //paddingTop: theme.spacing(-3),
    },
    teal: {
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    yellow: {
        color: theme.palette.getContrastText(yellow[500]),
        backgroundColor: yellow[500],
    },
    lightGreen: {
        color: theme.palette.getContrastText(lightGreen[500]),
        backgroundColor: lightGreen[500],
    },
    red: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
    },
    grey: {
        color: theme.palette.getContrastText(grey[500]),
        backgroundColor: grey[500],
    },
}));

export default class CreateWidgetsPageReport extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            numOpenReports: 0, //количество докладов ожидающих обработки (не опубликованных)
            showNumOpenReports: false,
            numPublishedReports: 0, //количество опубликованных докладов
            showNumPublishedReports: false,
            numTotalReports: 0, //общее количество докладов, это сумма numOpenReports + numPublishedReports
            showNumTotalReports: false,
            numSuccessfullyImplementedComputerThreat: 0, //успешно реализованные компьютерные угрозы
            showNumSuccessfullyImplementedComputerThreat: false,
            numComputerThreatNotSuccessful: 0, //компьютерные угрозы не являющиеся успешными
            showNumComputerThreatNotSuccessful: false,
            numUnconfirmedComputerThreat: 0, //не подтвердившиеся компьютерные угрозы
            showNumUnconfirmedComputerThreat: false,
        };

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("isems-mrsi response ui", (data) => {
            console.log("class 'CreateWidgetsPageReport', receive event:");
            console.log(data);
        
            if(!data.eventForWidgets){
                return;
            }

            switch(data.section){
            case "get count doc type 'reports' status 'open'":
                this.setState({ numOpenReports: data.additional_parameters.number_documents_found });

                return;
            case "handling search requests":
                if(typeof data.additional_parameters.number_documents_found !== "undefined"){
                    console.log("результат ввиде колличества найденных документов");

                    this.setState({ totalReports: data.additional_parameters.number_documents_found });
                } else if(typeof data.additional_parameters.transmitted_data !== "undefined"){
                    console.log("результат ввиде полного списка найденной информации");
                } else {
                    console.log("наверное информационное сообщение что данные не определены");
                }

                return;
        
            case "":
        
                return;
            }
        });

        /** test timer */
        setTimeout(()=>{
            this.setState({ showNumOpenReports: true });
        }, 5000);
        setTimeout(()=>{
            this.setState({ showNumPublishedReports: true });
        }, 6000);
        setTimeout(()=>{
            this.setState({ showNumTotalReports: true });
        }, 7000);
        setTimeout(()=>{
            this.setState({ showNumSuccessfullyImplementedComputerThreat: true });
        }, 8000);
        setTimeout(()=>{
            this.setState({ showNumComputerThreatNotSuccessful: true });
        }, 9000);
        setTimeout(()=>{
            this.setState({ showNumUnconfirmedComputerThreat: true });
        }, 10000);
    }

    requestEmitter(){
        this.props.socketIo.emit("isems-mrsi ui request: get count doc type 'reports' status 'open'", { arguments: {}});
    }

    render(){
        return (
            <React.Fragment>
                <Row>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.numOpenReports}
                            avatarColor="lightGreen"
                            avatarText="д"
                            text="обрабатываемые"
                            show={this.state.showNumOpenReports}
                            titleText="количество докладов ожидающих обработки" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.numPublishedReports}
                            avatarColor="lightGreen"
                            avatarText="д"
                            text="опубликованные"
                            show={this.state.showNumPublishedReports}
                            titleText="количество опубликованных докладов" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.numTotalReports}
                            avatarColor="teal"
                            avatarText="д"
                            text="всего"
                            show={this.state.showNumTotalReports}
                            titleText="общее количество докладов" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.numSuccessfullyImplementedComputerThreat}
                            avatarColor="red"
                            avatarText="ку"
                            text="успешно"
                            show={this.state.showNumSuccessfullyImplementedComputerThreat}
                            titleText="успешно реализованные компьютерные угрозы" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.numComputerThreatNotSuccessful}
                            avatarColor="yellow"
                            avatarText="ку"
                            text="безуспешно"
                            show={this.state.showNumComputerThreatNotSuccessful}
                            titleText="компьютерные угрозы не являющиеся успешными" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.numUnconfirmedComputerThreat}
                            avatarColor="grey"
                            avatarText="ку"
                            text="отклоненные"
                            show={this.state.showNumUnconfirmedComputerThreat}
                            titleText="не подтвердившиеся компьютерные угрозы" />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

CreateWidgetsPageReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
};

function CardElement(props){
    const { text, count, avatarColor, avatarText, titleText, show } = props;
    const classes = useStyles();
  
    return (
        <Tooltip title={titleText}>
            {(show)?
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Grid container wrap="nowrap" spacing={3}>
                            <Grid item>
                                <AvatarElement color={avatarColor} text={avatarText}/>
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <h5>{count}</h5>
                                <Typography noWrap>{text}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>:
                <div className={classes.root}><Skeleton variant="rect" width={190} height={88}/></div>}
        </Tooltip>);
}

/**
 * 
 * написать обработчик событий для виджета
 * 
 */

CardElement.propTypes = {
    show: PropTypes.bool,
    text: PropTypes.string,
    count: PropTypes.number,
    avatarColor: PropTypes.string, 
    avatarText: PropTypes.string,
    titleText: PropTypes.string,
};

function AvatarElement(props){
    const { color, text } = props;
    const classes = useStyles();
    const colorList = {
        yellow: classes.yellow,
        lightGreen: classes.lightGreen,
        teal: classes.teal,
        red: classes.red,
        grey: classes.grey,
    };

    return <Avatar aria-label="recipe" className={colorList[color]}>{text.toUpperCase()}</Avatar>;
}

AvatarElement.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
};
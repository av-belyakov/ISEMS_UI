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
            openReports: { num: 0, show: false }, //количество докладов ожидающих обработки (не опубликованных)
            publishedReports: { num: 0, show: false }, //количество опубликованных докладов
            successfullyImplementedComputerThreat: { num: 0, show: false }, //успешно реализованные компьютерные угрозы
            computerThreatNotSuccessful: { num: 0, show: false }, //компьютерные угрозы не являющиеся успешными
            unconfirmedComputerThreat: { num: 0, show: false }, //не подтвердившиеся компьютерные угрозы
        };

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);

        this.getTotalReport = this.getTotalReport.bind(this);
    }

    handlerEvents(){
        this.props.socketIo.on("isems-mrsi response ui", (data) => {
            if(!data.eventForWidgets){
                return;
            }

            switch(data.section){
            case "doc type 'reports' status 'open'":
                this.setState({ 
                    openReports: {
                        num: data.information.additional_parameters.number_documents_found,
                        show: true,
                    },
                });

                return;

            case "get count doc type 'reports' status 'published'":
                this.setState({ 
                    publishedReports: {
                        num: data.information.additional_parameters.number_documents_found,
                        show: true,
                    },
                });

                return;
        
            case "get count doc statuses decisions made computer threats":
                for(let key in data.information.additional_parameters.list_computer_threat){
                    switch(key){
                    case "successfully implemented computer threat":
                        this.setState({
                            successfullyImplementedComputerThreat: { 
                                num: data.information.additional_parameters.list_computer_threat[key], 
                                show: true, 
                            }});
                        break;

                    case "unsuccessfully computer threat":
                        this.setState({
                            computerThreatNotSuccessful: { 
                                num: data.information.additional_parameters.list_computer_threat[key], 
                                show: true, 
                            }});
                        break;

                    case "false positive":
                        this.setState({
                            unconfirmedComputerThreat: { 
                                num: data.information.additional_parameters.list_computer_threat[key], 
                                show: true, 
                            }});
                        break;

                    }
                }

                return;
            }
        });
    }

    requestEmitter(){
        this.props.socketIo.emit("isems-mrsi ui request: get count doc type 'reports' status 'open'", { arguments: {}});
        this.props.socketIo.emit("isems-mrsi ui request: get count doc type 'reports' status 'published'", { arguments: {}});
        this.props.socketIo.emit("isems-mrsi ui request: get count doc statuses decisions made computer threats", { arguments: {}});
    }

    getTotalReport(){
        if(!this.state.openReports.show || !this.state.publishedReports.show){
            return { numTotalReports: 0, showNumTotalReports: false };
        }

        return { numTotalReports: (this.state.openReports.num+this.state.publishedReports.num), showNumTotalReports: true };
    }

    render(){
        let { numTotalReports, showNumTotalReports } = this.getTotalReport();

        return (
            <React.Fragment>
                <Row>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.openReports.num}
                            avatarColor="lightGreen"
                            avatarText="д"
                            text="обрабатываемые"
                            show={this.state.openReports.show}
                            titleText="количество докладов ожидающих обработки" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.publishedReports.num}
                            avatarColor="lightGreen"
                            avatarText="д"
                            text="опубликованные"
                            show={this.state.publishedReports.show}
                            titleText="количество опубликованных докладов" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={numTotalReports}
                            avatarColor="teal"
                            avatarText="д"
                            text="всего"
                            show={showNumTotalReports}
                            titleText="общее количество докладов" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.successfullyImplementedComputerThreat.num}
                            avatarColor="red"
                            avatarText="ку"
                            text="успешно"
                            show={this.state.successfullyImplementedComputerThreat.show}
                            titleText="успешно реализованные компьютерные угрозы" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.computerThreatNotSuccessful.num}
                            avatarColor="yellow"
                            avatarText="ку"
                            text="безуспешно"
                            show={this.state.computerThreatNotSuccessful.show}
                            titleText="компьютерные угрозы не являющиеся успешными" />
                    </Col>
                    <Col md={2}>
                        <CardElement 
                            count={this.state.unconfirmedComputerThreat.num}
                            avatarColor="grey"
                            avatarText="ку"
                            text="отклоненные"
                            show={this.state.unconfirmedComputerThreat.show}
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
  
    return (<Tooltip title={titleText}>
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
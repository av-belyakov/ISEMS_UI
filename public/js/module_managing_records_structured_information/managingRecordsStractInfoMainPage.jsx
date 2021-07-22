import React from "react";
import ReactDOM from "react-dom";
import { Col, Row } from "react-bootstrap";
import { Tab, Tabs, Tooltip } from "@material-ui/core";
import PropTypes from "prop-types";
import { BrowserRouter, Link as LinkRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import CreatePageReport from "./pages/createPageReport.jsx";
import CreatePageObservedData from "./pages/createPageObservedData.jsx";
import CreatePageMalware from "./pages/createPageMalware.jsx";
import CreatePageVulnerability from "./pages/createPageVulnerability.jsx";
import CreatePageThreatActor from "./pages/createPageThreatActor.jsx";
import CreatePageInfrastructure from "./pages/createPageInfrastructure.jsx";
import CreatePageTools from "./pages/createPageTools.jsx";
import CreatePageStatistic from "./pages/createPageStatistic.jsx";
import CreatePageChangeLog from "./pages/createPageChangeLog.jsx";
import CreatePageFinalDocuments from "./pages/createPageFinalDocuments.jsx";
import CreatePageReportingMaterials from "./pages/createPageReportingMaterials.jsx";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));

function LeftElements(props){
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{paper: classes.drawerPaper}}
            anchor="left">
            <Tabs
                value={props.handler}
                indicatorcolor="primary"
                orientation="vertical"
                variant="scrollable"
                aria-label="Vertical tabs example" >
                {props.list}
            </Tabs>
        </Drawer>
    );
}

function ChildElements(props){
    let url = new URL(window.location.href);
    let name = url.searchParams.get("name");
    
    switch(name){
    case "":
        return <CreatePageReport socketIo={props.socketIo}/>;
    case "reports":
        return <CreatePageReport socketIo={props.socketIo}/>;
    case "observed_data":
        return <CreatePageObservedData socketIo={props.socketIo}/>;
    case "malware":
        return <CreatePageMalware socketIo={props.socketIo}/>;
    case "vulnerability":
        return <CreatePageVulnerability socketIo={props.socketIo}/>;
    case "threat_actor":
        return <CreatePageThreatActor socketIo={props.socketIo}/>;
    case "infrastructure":
        return <CreatePageInfrastructure socketIo={props.socketIo}/>;
    case "tools":
        return <CreatePageTools socketIo={props.socketIo}/>;
    case "statistic":
        return <CreatePageStatistic socketIo={props.socketIo}/>;
    case "change_log":
        return <CreatePageChangeLog socketIo={props.socketIo}/>;
    case "final_documents":
        return <CreatePageFinalDocuments socketIo={props.socketIo}/>;
    case "reporting_materials":
        return <CreatePageReportingMaterials socketIo={props.socketIo}/>;
    default:
        return <CreatePageReport socketIo={props.socketIo}/>;
    }
}

class CreateMainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.menuItem = {
            "/security_event_management?name=reports": { 
                "num": 0, 
                "label": "доклады", 
                "title": "совокупность данных об угрозах, сосредоточенных на одной или нескольких темах" },
            "/security_event_management?name=observed_data": { 
                "num": 1, 
                "label": "наблюдаемые данные", 
                "title": "информация о сущностях связанных с кибер безопасностью, таких как файлы, системы или сети" },
            "/security_event_management?name=malware": { 
                "num": 2, 
                "label": "вредоносное по", 
                "title": "подробная информация о функционировании вредоносного программного обеспечения" },
            "/security_event_management?name=vulnerability": { 
                "num": 3, 
                "label": "уязвимости", 
                "title": "описание уязвимостей компьютерных систем" },
            "/security_event_management?name=threat_actor": { 
                "num": 4, 
                "label": "субъекты угроз", 
                "title": "информация о физических лицах или их группах и организациях которые могут действовать со злым умыслом" },
            "/security_event_management?name=infrastructure": { 
                "num": 5, 
                "label": "инфраструктура", 
                "title": "описание любых систем, программных служб, физических или виртуальных ресурсов, предназначенных для поддержки какой-либо цели" },
            "/security_event_management?name=tools": { 
                "num": 6, 
                "label": "инструменты реализации угроз", 
                "title": "описание легитимного программного обеспечения используемого для реализации компьютерных угроз" },
            "/security_event_management?name=statistic": { 
                "num": 7, 
                "label": "статистика", 
                "title": "общая статистическая информация" },
            "/security_event_management?name=change_log": { 
                "num": 8, 
                "label": "журнал изменений", 
                "title": "перечень изменений выполненных над сущностями" },
            "/security_event_management?name=final_documents": { 
                "num": 9, 
                "label": "итоговые документы", 
                "title": "формирование файлов итоговых документов" },
            "/security_event_management?name=reporting_materials": { 
                "num": 10, 
                "label": "отчетные материалы", 
                "title": "формирование файлов отчетных материалов" },
        };
    }

    getSelectedMenuItem(){
        let name = `${window.location.pathname}${window.location.search}`;
        if((typeof name === "undefined") || (name === null)){           
            return 0;
        } else if (typeof this.menuItem[name] === "undefined") {
            return 0;
        } else if (typeof this.menuItem[name].num === "undefined") {
            return 0;
        } else {
            return this.menuItem[name].num;
        }
    }

    render() {
        let list = [];
        for(let item in this.menuItem){
            list.push(<Tooltip title={this.menuItem[item].title} key={`tooltip_menu_item_${this.menuItem[item].num}`}>
                <Tab 
                    href={item} 
                    containerelement={<LinkRouter to={item}/>}
                    label={this.menuItem[item].label} 
                    key={`menu_item_${this.menuItem[item].num}`}/>
            </Tooltip>);
        }

        return (
            <React.Fragment>
                <BrowserRouter>
                    <CssBaseline />
                    <Row>
                        {/*<Col md={2}>
                            <Tabs
                                value={this.getSelectedMenuItem.call(this)}
                                indicatorcolor="primary"
                                orientation="vertical"
                                variant="scrollable"
                                aria-label="Vertical tabs example" >
                                {list}
                            </Tabs>
                        </Col>
                        <Col md={10}>
                            <ChildElements socketIo={this.props.socketIo} />
                        </Col>*/}
                        <Col md={2}>
                            <LeftElements list={list} handler={this.getSelectedMenuItem}/>
                            {/**
                             * В LeftElements попробовать перейти на List вместо Tab
                             * 
                             */}
                        </Col>
                        <Col md={10}>
                            <ChildElements socketIo={this.props.socketIo} />
                        </Col>
                    </Row>

                </BrowserRouter>
            </React.Fragment>
        );
    }
}

CreateMainPage.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listItems: PropTypes.object.isRequired,
};

ReactDOM.render(<CreateMainPage
    socketIo={socket}
    listItems={receivedFromServer} />, document.getElementById("main-page-content"));
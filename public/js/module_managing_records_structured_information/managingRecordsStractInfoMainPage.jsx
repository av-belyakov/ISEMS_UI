import React from "react";
import ReactDOM from "react-dom/client";
import { Col, Row } from "react-bootstrap";
import { 
    CssBaseline, 
    Drawer,
    Tab, 
    Tabs, 
    Tooltip, 
    LinearProgress 
} from "@material-ui/core";
import PropTypes from "prop-types";
import { BrowserRouter, Link as LinkRouter } from "react-router-dom";
import { Alert } from "material-ui-lab";
import { makeStyles } from "@material-ui/core/styles";

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

const drawerWidth = 260;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        marginTop: 85,
        width: drawerWidth,
        zIndex: 1,
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

    return (<nav className={classes.drawer}>
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{ paper: classes.drawerPaper }}
            anchor="left">
            <Tabs
                value={props.handler()}
                indicatorcolor="primary"
                orientation="vertical"
                variant="scrollable">
                {props.list}
            </Tabs>
        </Drawer>
    </nav>);
}

LeftElements.propTypes = {
    list: PropTypes.array.isRequired,
    handler: PropTypes.func.isRequired,
};

function ChildElements(props){
    let url = new URL(window.location.href),
        name = url.searchParams.get("name"),
        { socketIo, receivedData } = props;
    let currentElement = <CreatePageReport 
        socketIo={socketIo} 
        receivedData={receivedData} />;

    console.log("FUNC 'ChildElements' !!!!!");

    switch(name){
    case "observed_data":
        currentElement = <CreatePageObservedData socketIo={socketIo} receivedData={receivedData}/>;

        break;
    case "malware":
        currentElement = <CreatePageMalware socketIo={socketIo} receivedData={receivedData}/>;
    
        break;
    case "vulnerability":
        currentElement = <CreatePageVulnerability socketIo={socketIo} receivedData={receivedData}/>;
    
        break;
    case "threat_actor":
        currentElement = <CreatePageThreatActor socketIo={socketIo} receivedData={receivedData}/>;
    
        break;
    case "infrastructure":
        currentElement = <CreatePageInfrastructure socketIo={socketIo} receivedData={receivedData}/>;
    
        break;
    case "tools":
        currentElement = <CreatePageTools socketIo={socketIo} receivedData={receivedData}/>;
    
        break;
    case "statistic":
        currentElement = <CreatePageStatistic socketIo={socketIo} receivedData={receivedData}/>;

        break;
    case "change_log":
        currentElement = <CreatePageChangeLog socketIo={socketIo} receivedData={receivedData}/>;
    
        break;
    case "final_documents":
        currentElement = <CreatePageFinalDocuments socketIo={socketIo} receivedData={receivedData}/>;
    
        break;
    case "reporting_materials":
        currentElement = <CreatePageReportingMaterials socketIo={socketIo} receivedData={receivedData}/>;

        break;
    }

    return <main style={{ flexGrow: 1 }}>{currentElement}</main>;
}

ChildElements.propTypes = {
    socketIo: PropTypes.object.isRequired, 
    receivedData: PropTypes.object.isRequired,
};

class CreateMainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "connectModuleMRSICT": this.handlerConnectModuleMRSICT.call(this),
            "listTypesComputerThreat": {},
            "listTypesDecisionsMadeComputerThreat": {},
        };

        this.menuItem = {
            "/security_event_management?name=reports": { 
                "num": 0, 
                "label": "отчёты", 
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
                "label": "сводки", 
                "title": "формирование файлов-сводок" },
        };

        this.handlerEvents = this.handlerEvents.call(this);

        console.log("_____ CREATE ____ MAIN ____ PAGE _______");
    }

    handlerConnectModuleMRSICT() {
        return (typeof this.props.receivedData !== "undefined")? this.props.receivedData.connectionModules.moduleMRSICT: false;
    }

    handlerEvents() {
        this.props.socketIo.on("module_MRSICT-API", (data) => {

            console.log("-----====== CONNECTION STATUS: ", data.options.connectionStatus);

            if (data.type === "connectModuleMRSICT") {
                if (data.options.connectionStatus) {
                    this.setState({ "connectModuleMRSICT": true });

                    location.reload();
                } else {
                    if (!this.state.connectModuleMRSICT) {
                        return;
                    }

                    this.setState({ "connectModuleMRSICT": false });
                }
            }
        });
    }

    showModuleConnectionError() {
        return (<React.Fragment>
            <Row className="mt-2">
                <Col md={12}>
                    <Alert variant="filled" severity="error">
                        <strong>Ошибка!</strong> Отсутствует доступ к модулю управления структурированной информации. Пытаемся установить соединение...
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <LinearProgress color="secondary" />
                </Col>
            </Row>
        </React.Fragment>);
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

    getLeftListMenu(){
        let list = [];
        for(let item in this.menuItem){
            list.push(<Tooltip title={this.menuItem[item].title} key={`tooltip_menu_item_${this.menuItem[item].num}`}>
                <Tab 
                    href={item} 
                    wrapped
                    textColor="secondary"
                    containerelement={<LinkRouter to={item}/>}
                    label={this.menuItem[item].label} 
                    key={`menu_item_${this.menuItem[item].num}`}/>
            </Tooltip>);
        }

        return list;
    }

    render() {

        console.log("_______________==================________________");
        
        return (<BrowserRouter>
            <CssBaseline />

            <div style={{ display: "flex" }}>
                <LeftElements menuItem={this.menuItem} list={this.getLeftListMenu.call(this)} handler={this.getSelectedMenuItem}/>
                
                {(!this.state.connectModuleMRSICT)? 
                    this.showModuleConnectionError.call(this):  
                    <ChildElements 
                        socketIo={this.props.socketIo} 
                        receivedData={this.props.receivedData} 
                    />}
            </div>    
                
        </BrowserRouter>);
    }
}

CreateMainPage.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};

ReactDOM.createRoot(document.getElementById("main-page-content")).render(<CreateMainPage
    socketIo={socket}
    receivedData={receivedFromServer} />);
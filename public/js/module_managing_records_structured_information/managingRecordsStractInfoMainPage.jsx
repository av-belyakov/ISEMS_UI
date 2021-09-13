import React from "react";
import ReactDOM from "react-dom";
import { Col, Row } from "react-bootstrap";
import { CssBaseline, Drawer, Tab, Tabs, Tooltip, LinearProgress } from "@material-ui/core";
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

const drawerWidth = 240;
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

    return (
        <React.Fragment>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{paper: classes.drawerPaper}}
                anchor="left">
                <Tabs
                    value={props.handler()}
                    indicatorcolor="primary"
                    orientation="vertical"
                    variant="scrollable">
                    {props.list}
                </Tabs>
            </Drawer>
        </React.Fragment>
    );
}

LeftElements.propTypes = {
    list: PropTypes.array.isRequired,
    handler: PropTypes.func.isRequired,
};

function ChildElements(props){
    let url = new URL(window.location.href),
        name = url.searchParams.get("name"),
        { socketIo, receivedData, listTypesComputerThreat, listTypesDecisionsMadeComputerThreat } = props;

    switch(name){
    case "":
        return <CreatePageReport 
            socketIo={socketIo} 
            receivedData={receivedData}
            listTypesComputerThreat={listTypesComputerThreat}
            listTypesDecisionsMadeComputerThreat={listTypesDecisionsMadeComputerThreat} />;
    case "reports":
        return <CreatePageReport 
            socketIo={socketIo} 
            receivedData={receivedData}
            listTypesComputerThreat={listTypesComputerThreat}
            listTypesDecisionsMadeComputerThreat={listTypesDecisionsMadeComputerThreat} />;
    case "observed_data":
        return <CreatePageObservedData socketIo={socketIo} receivedData={receivedData}/>;
    case "malware":
        return <CreatePageMalware socketIo={socketIo} receivedData={receivedData}/>;
    case "vulnerability":
        return <CreatePageVulnerability socketIo={socketIo} receivedData={receivedData}/>;
    case "threat_actor":
        return <CreatePageThreatActor socketIo={socketIo} receivedData={receivedData}/>;
    case "infrastructure":
        return <CreatePageInfrastructure socketIo={socketIo} receivedData={receivedData}/>;
    case "tools":
        return <CreatePageTools socketIo={socketIo} receivedData={receivedData}/>;
    case "statistic":
        return <CreatePageStatistic socketIo={socketIo} receivedData={receivedData}/>;
    case "change_log":
        return <CreatePageChangeLog socketIo={socketIo} receivedData={receivedData}/>;
    case "final_documents":
        return <CreatePageFinalDocuments socketIo={socketIo} receivedData={receivedData}/>;
    case "reporting_materials":
        return <CreatePageReportingMaterials socketIo={socketIo} receivedData={receivedData}/>;
    default:
        return <CreatePageReport 
            socketIo={socketIo} 
            receivedData={receivedData}
            listTypesComputerThreat={listTypesComputerThreat}
            listTypesDecisionsMadeComputerThreat={listTypesDecisionsMadeComputerThreat} />;
    }
}

ChildElements.propTypes = {
    socketIo: PropTypes.object.isRequired, 
    receivedData: PropTypes.object.isRequired,
    listTypesComputerThreat: PropTypes.object.isRequired,
    listTypesDecisionsMadeComputerThreat: PropTypes.object.isRequired,
};

class CreateMainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "connectModuleMRSICT": this.connectModuleMRSICT.call(this),
            "listTypesComputerThreat": {},
            "listTypesDecisionsMadeComputerThreat": {},
        };

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

        this.handlerEvents = this.handlerEvents.call(this);
        this.requestEmitter = this.requestEmitter.call(this);
    }

    connectModuleMRSICT() {
        return (typeof this.props.receivedData !== "undefined") ? this.props.receivedData.connectionModules.moduleMRSICT : false;
    }

    requestEmitter() {
        if (!this.state.connectModuleMRSICT) {
            return;
        }

        this.props.socketIo.emit("isems-mrsi ui request: get list types decisions made computer threat", { arguments: {}});
        this.props.socketIo.emit("isems-mrsi ui request: get list types computer threat", { arguments: {}});
    }

    handlerEvents() {
        this.props.socketIo.on("module_MRSICT-API", (data) => {
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

        //обработка события связанного с приемом списка групп которым разрешен доступ к данному докладу
        this.props.socketIo.on("isems-mrsi response ui", (data) => {

            //console.log("class 'CreateMainPage', func 'handlerEvents'");
            //console.log(`sections: ${data.section}`);
            //console.log(data.information.additional_parameters);

            if((data.information === null) || (typeof data.information === "undefined")){
                return;
            }

            if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
                return;
            }

            switch(data.section){
            case "list types decisions made computer threat":
                this.setState({ "listTypesDecisionsMadeComputerThreat": data.information.additional_parameters.list });

                break;
            case "list types computer threat":
                this.setState({ "listTypesComputerThreat": data.information.additional_parameters.list });

                break;
            }
        });
    }

    showModuleConnectionError() {
        return (
            <React.Fragment>
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
            </React.Fragment>
        );
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

    createMainElements(){
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

        return (
            <BrowserRouter>
                <CssBaseline />
                <Row>
                    <Col md={2}>
                        <LeftElements menuItem={this.menuItem} list={list} handler={this.getSelectedMenuItem}/>
                    </Col>
                    <Col md={10}>
                        {(!this.state.connectModuleMRSICT) ? 
                            this.showModuleConnectionError.call(this):  
                            <ChildElements 
                                socketIo={this.props.socketIo} 
                                receivedData={this.props.receivedData} 
                                listTypesComputerThreat={this.state.listTypesComputerThreat}
                                listTypesDecisionsMadeComputerThreat={this.state.listTypesDecisionsMadeComputerThreat} />}
                    </Col>
                </Row>
            </BrowserRouter>
        );
    }

    render() {
        return this.createMainElements.call(this);
    }
}

CreateMainPage.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};

ReactDOM.render(<CreateMainPage
    socketIo={socket}
    receivedData={receivedFromServer} />, document.getElementById("main-page-content"));
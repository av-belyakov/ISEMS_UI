import React from "react";
import ReactDOM from "react-dom";
import { Button, Container, Navbar, Nav, NavDropdown, Tooltip, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";

import { ModalWindowChangeAdminPasswd } from "./commons/modalWindowChangeAdminPasswd.jsx";
import DrawingAlertMessage from "./drawingAlertsMessage.jsx";

class CreateHeaderMenu extends React.Component {
    constructor(props) {
        super(props);

        this.listItems = this.props.listItems;

        this.state = {
            connectionModuleAna: this.connModuleAna.call(this),
            connectionModuleAcc: this.connModuleAcc.call(this),
            connectionModuleNI: this.connModuleNI.call(this),
            showNotifyMsg: false,
            notifyMsg: {},
        };

        this.createMenu = this.createMenu.bind(this);
        this.firstIconIsBig = this.firstIconIsBig.bind(this);
        this.statusConnectModules = this.statusConnectModules.bind(this);

        this.handlerShowNotifyClose = this.handlerShowNotifyClose.bind(this);

        this.handlerEvents.call(this);

        /** function test */
        //this.handlerTest.call(this);
    }

    handlerTest(){
        setInterval(() => {
            
            console.log("START setInterval...");
            
            this.setState({
                notifyMsg: {
                    type: "danger",
                    message: "test message!!",
                },
                showNotifyMsg: true
            });

            //this.handlerShowNotifyClose(null);
        }, 15000);
    }

    handlerEvents() {
        this.props.socketIo.on("module NI API", (data) => {
            if (data.type === "connectModuleNI") {
                if (data.options.connectionStatus) {
                    this.setState({ "connectionModuleNI": true });
                } else {
                    this.setState({ "connectionModuleNI": false });
                }
            }
        });

        this.props.socketIo.on("module_MRSICT-API", (data) => {
            if (data.type === "connectModuleMRSICT") {
                if (data.options.connectModuleMRSICT){
                    this.setState({"connectionModuleAcc": true});
                } else {
                    this.setState({"connectionModuleAcc": false});
                }
            }
        });

        this.props.socketIo.on("notify information", data => {

            console.log("HandlerMenu === data:");
            console.log(data);

            let msg = JSON.parse(data.notify);

            this.setState({
                notifyMsg: msg,
                showNotifyMsg: true
            });
        });
    }

    handlerShowNotifyClose(){
        this.setState({ showNotifyMsg: false });
    }

    connModuleAna() {
        return (typeof this.listItems !== "undefined") ? this.listItems.connectionModules.moduleAna : false;        
    }

    connModuleAcc() {
        return (typeof this.listItems !== "undefined") ? this.listItems.connectionModules.moduleMRSICT : false;        
    }

    connModuleNI() {
        return (typeof this.listItems !== "undefined") ? this.listItems.connectionModules.moduleNI : false;
    }

    statusConnectModules() {
        let imgAnaIcon = (this.state.connectionModuleAna) ? "icon_analytic_green.png" : "icon_analytic_red.png";
        let imgAccIcon = (this.state.connectionModuleAcc) ? "icon_accounting_green.png" : "icon_accounting_red.png";
        let imgNetIcon = (this.state.connectionModuleNI) ? "icon_net_green.png" : "icon_net_red.png";
        
        return (<React.Fragment>
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>модуль аналитики</Tooltip>}>
                <img src={"/images/" + imgAnaIcon} width="30" height="30" />
            </OverlayTrigger>
                &nbsp;
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>модуль управления структурированной информации</Tooltip>}>
                <img src={"/images/" + imgAccIcon} width="30" height="30" />
            </OverlayTrigger>
                &nbsp;
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>модуль сетевого взаимодействия</Tooltip>}>
                <img src={"/images/" + imgNetIcon} width="30" height="30" />
            </OverlayTrigger>
        </React.Fragment>);
    }

    createSubmenu(listDropDown) {
        let list = [];

        for (let item in listDropDown) {
            let linkElemIsDisabled = "";
            let classElemIsDisable = "";
            if ((typeof listDropDown[item].status !== "undefined") && (!listDropDown[item].status)) {
                linkElemIsDisabled = "true";
                classElemIsDisable = " disabled";
            }

            /**
            *      !!!!!!!!!
            * Временно выключаем доступ к некоторым пунктам подменю
            *      !!!!!!!!!
            */

            if (item === "setting_geoip" || item === "setting_search_rules" || item === "setting_reputational_lists") {
                linkElemIsDisabled = "true";
                classElemIsDisable = " disabled";
            }

            list.push((<NavDropdown.Item
                className={classElemIsDisable}
                href={item}
                key={`${item}_key`}
                aria-disabled={linkElemIsDisabled}>
                {listDropDown[item].name.toLowerCase()}
            </NavDropdown.Item>));
        }

        return list;
    }

    firstIconIsBig(str) {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    }

    createMenu() {
        let list = [];
        list.push(<Nav.Link href="/" key="main_key">Главная</Nav.Link>);

        let linkElemIsDisabled = "";
        let classElemIsDisable = "";
        let menuSettings = this.listItems.menuSettings;

        for (let key in menuSettings) {
            let submenuIsNotExist = (typeof menuSettings[key].submenu === "undefined");

            if ((typeof menuSettings[key].status !== "undefined") && (!menuSettings[key].status)) {
                linkElemIsDisabled = "true";
                classElemIsDisable = " disabled";
            }

            if (submenuIsNotExist) {
                
                /**
                *       !!!!!!!!!!!
                * временно выключаю доступ к некоторым элементам меню
                *       !!!!!!!!!!!
                */

                if (key === "analysis_sip"/*|| key === "security_event_management"*/) {
                    linkElemIsDisabled = "true";
                    classElemIsDisable = " disabled";
                }

                list.push(<Nav.Link className={classElemIsDisable} href={key} key={`${key}_key`} aria-disabled={linkElemIsDisabled}>
                    {this.firstIconIsBig(menuSettings[key].name)}
                </Nav.Link>);

                linkElemIsDisabled = "";
                classElemIsDisable = "";

                continue;
            }

            list.push(<NavDropdown title={this.firstIconIsBig(menuSettings[key].name)} key={`${key}_key`}>
                {this.createSubmenu.call(this, menuSettings[key].submenu)}
            </NavDropdown>);
        }

        return list;
    }

    render() {
        return (<Container>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Navbar.Brand href="/">
                    <img src="/images/logo1.png" width="200" height="60" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="mr-auto">{this.createMenu()}</Nav>
                <Navbar.Collapse className="justify-content-end">
                    {this.statusConnectModules()}
                        &nbsp;&nbsp;
                    <Navbar.Text>{this.listItems.userName}</Navbar.Text>
                        &nbsp;&nbsp;
                    <Button variant="outline-info" size="sm" href="logout">ВЫХОД</Button>
                        &nbsp;&nbsp;
                </Navbar.Collapse>
            </Navbar>

            <ModalWindowChangeAdminPasswd
                login={this.listItems.login}
                passIsDefault={this.listItems.isPasswordDefaultAdministrator}
                socketIo={this.props.socketIo} />

            <DrawingAlertMessage
                show={this.state.showNotifyMsg} 
                onHide={this.handlerShowNotifyClose}
                notiyMsg={this.state.notifyMsg} />
        </Container>);
    }
}

CreateHeaderMenu.protoTypes = {
    socketIo: PropTypes.object.isRequired,
    listItems: PropTypes.object.isRequired,
};

ReactDOM.render(<CreateHeaderMenu
    socketIo={socket}
    listItems={resivedFromServer} />, document.getElementById("menu-top"));

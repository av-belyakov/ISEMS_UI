import React from "react";
import ReactDOM from "react-dom";
import { Col, Row } from "react-bootstrap";
//import { CssBaseline, Drawer, Tab, Tabs, Tooltip, LinearProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import { Alert } from "material-ui-lab";
//import { makeStyles } from "@material-ui/core/styles";

class CreatePageInformationReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "connectModuleMRSICT": this.connectModuleMRSICT.call(this),
        };

        this.handlerEvents = this.handlerEvents.call(this);
    }

    connectModuleMRSICT() {
        return (typeof this.props.receivedData !== "undefined") ? this.props.receivedData.connectionModules.moduleMRSICT : false;
    }

    requestEmitter() {
        if (!this.state.connectModuleMRSICT) {
            return;
        }
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
                        {/*<LinearProgress color="secondary" />*/}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    render() {
        return (
            <Row>
                <Col md={12}>
                    <h2>Page Information Report STIX object</h2>
                    <p>{this.props.receivedData}</p>
                </Col>
            </Row>
        );
    }
}

CreatePageInformationReport.propTypes = {
    socketIo: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
};

ReactDOM.render(<CreatePageInformationReport
    socketIo={socket}
    receivedData={receivedFromServer} />, document.getElementById("main-page-content"));
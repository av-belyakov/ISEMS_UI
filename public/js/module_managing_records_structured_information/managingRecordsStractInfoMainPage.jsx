import React from "react";
import ReactDOM from "react-dom";
import { Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";

import CreateVerticalMenuItems from "./createVerticalMenuItems.jsx";
import CreatePageReport from "./createPageReport.jsx";
import CreatePageObservedData from "./createPageObservedData.jsx";
import CreatePageMalware from "./createPageMalware.jsx";

class CreateMainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageName: ""
        };

        this.switchPage = this.switchPage.bind(this);
        this.handlerMenuItem = this.handlerMenuItem.bind(this);
    }

    handlerMenuItem(pn){
        this.setState({ pageName: pn });
    }

    switchPage(){
        switch(this.state.pageName){
        case "":
            return <CreatePageReport/>;
        case "reports":
            return <CreatePageReport/>;
        case "observed_data":
            return <CreatePageObservedData/>;
        case "malware":
            return <CreatePageMalware/>;
        default:
            return <CreatePageReport/>;
        }
    }

    render() {
        return (
            <React.Fragment>
                <Row>
                    <Col md={12}>
                        <CreateVerticalMenuItems handler={this.handlerMenuItem} value={123}/>
                    </Col>
                    <Col md={10}>
                        {this.switchPage()}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

/**
 * <div class="col-md-2" id="header-page-vertical_menu"></div>
                    <div class="col-md-10 panel-body widget-main text-center mt-3" id="main-page-content"></div>
 */

CreateMainPage.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listItems: PropTypes.object.isRequired,
};

ReactDOM.render(<CreateMainPage
    socketIo={socket}
    listItems={receivedFromServer} />, document.getElementById("main-page-content"));
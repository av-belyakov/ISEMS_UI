import React from "react";
import ReactDOM from "react-dom/client";
import { Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";

import CreateBodyDynamics from "./createBodyDynamics.jsx";
import ModalWindowShowInformationTask from "../modal_windows/modalWindowShowInformationTask.jsx";

class CreatePageDimanic extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            shortTaskInformation: { 
                sourceID: 0, 
                sourceName: "",
                taskID: "",
            },
            showModalWindowShowTaskInformation: false,
        };

        this.handlerModalWindowShowTaskTnformation = this.handlerModalWindowShowTaskTnformation.bind(this);
        this.handlerShowModalWindowShowTaskInformation = this.handlerShowModalWindowShowTaskInformation.bind(this);
        this.handlerCloseModalWindowShowTaskInformation=this.handlerCloseModalWindowShowTaskInformation.bind(this);
    }

    handlerModalWindowShowTaskTnformation(data){
        let objCopy = Object.assign({}, this.state);
        objCopy.shortTaskInformation.sourceID = data.sourceID;
        objCopy.shortTaskInformation.sourceName = data.sourceName;
        objCopy.shortTaskInformation.taskID = data.taskID;
        this.setState(objCopy);

        this.handlerShowModalWindowShowTaskInformation();
    }

    handlerShowModalWindowShowTaskInformation(){
        this.setState({ showModalWindowShowTaskInformation: true });
    }

    handlerCloseModalWindowShowTaskInformation(){
        this.setState({ showModalWindowShowTaskInformation: false });
    }

    render(){
        return (
            <React.Fragment>
                <Row className="pt-3">
                    <Col md={12}>
                        <CreateBodyDynamics 
                            socketIo={this.props.socketIo}
                            handlerModalWindowShowTaskTnformation={this.handlerModalWindowShowTaskTnformation} />
                    </Col>
                </Row>
                
                <ModalWindowShowInformationTask 
                    show={this.state.showModalWindowShowTaskInformation}
                    onHide={this.handlerCloseModalWindowShowTaskInformation}
                    socketIo={this.props.socketIo}
                    shortTaskInfo={this.state.shortTaskInformation} />
            </React.Fragment>
        );
    }
}

CreatePageDimanic.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listItems: PropTypes.object.isRequired,
}; 

ReactDOM.createRoot(document.getElementById("main-page-content")).render(<CreatePageDimanic
    socketIo={socket}
    listItems={receivedFromServer} />);
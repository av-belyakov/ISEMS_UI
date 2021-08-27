"use strict";

import React from "react";
import { Col, Button, Modal, Row } from "react-bootstrap";
import PropTypes from "prop-types";

export default class ModalWindowShowInformationReportSTIX extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            reportInfo: {},
            availableForGroups: [],
        };

        this.handleSave = this.handleSave.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handlerEvents = this.handlerEvents.call(this);
    }

    handlerEvents(){
        //обработка события связанного с приемом списка групп которым разрешен доступ к данному докладу
        this.props.socketIo.on("isems-mrsi response ui", (data) => {

            console.log("class 'ModalWindowShowInformationReportSTIX', func 'handlerEvents'");
            console.log(`sections: ${data.section}`);
            console.log(data.information.additional_parameters);

            if(data.section === "list of groups that are allowed access"){
                this.setState({ availableForGroups: data.information.additional_parameters });
            }

            if(data.section === "send search request, get report for id"){
                this.setState({ reportInfo: data.information.additional_parameters.transmitted_data });
            }
        }); 
    }

    handleClose(){
        this.modalClose();
    }

    handleSave(){}

    modalClose(){
        this.props.onHide();

        this.setState({
            reportInfo: {},
            availableForGroups: [],
        });
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.modalClose}
                //dialogClassName="modal-90w"
                size="lg"
                aria-labelledby="contained-modal-title-vcenter" >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Доклад
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Show Information Report STIX ID:{this.props.showReportId}.
                    Здесь должна быть полная информация о дакладе с ID {this.props.showReportId}, включая дополнительную
                    информацию о других объектах STIX, получаемой через сслыки в object_refs. А так же информация о группах
                    для кторых возможен просмотр данного доклада и элементы добавления или удаления разрешения доступа для групп.
                    <hr/>
                    <Row>
                        <Col md={8}>{JSON.stringify(this.state.reportInfo)}</Col>
                        <Col md={4}>{JSON.stringify(this.state.availableForGroups)}</Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" size="sm" onClick={this.handleClose}>закрыть</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalWindowShowInformationReportSTIX.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    showReportId: PropTypes.string.isRequired,
};
"use strict";

import React from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";

export default class ModalWindowAddReportSTIX extends React.Component {
    constructor(props){
        super(props);

        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.modalClose = this.modalClose.bind(this);
    }

    handleClose(){
        this.modalClose();
    }

    handleSave(){

    }

    modalClose(){
        this.props.onHide();
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
                        Новый доклад
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
                </Modal.Body>
                <Modal.Footer>
                    {/*<ModalAlertDangerMessage show={this.state.showAlert} onClose={this.onCloseHandle} message={alertMessage}>
                            Ошибка при сохранении!
        </ModalAlertDangerMessage>*/}                   
                    <Button variant="outline-secondary" size="sm" onClick={this.handleClose}>закрыть</Button>
                    <Button variant="outline-primary" size="sm" onClick={this.handleSave}>сохранить</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalWindowAddReportSTIX.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
};
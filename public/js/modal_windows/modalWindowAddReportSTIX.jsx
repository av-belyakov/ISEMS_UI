"use strict";

import React from "react";
import { 
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

export default function ModalWindowAddReportSTIX(props) {
    let { show, onHide, socketio } = props;

    return (<Dialog 
        fullWidth
        maxWidth="xl"
        scroll="paper"
        open={show} >
        <DialogTitle>Новый доклад</DialogTitle>
        <DialogContent>
            <Grid container direction="row">
                <Grid item container md={12}>
                REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
            REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
            REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
            REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
            REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
            REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
            REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
            REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY REPORT BODY
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => { onHide(); }} color="primary">закрыть</Button>
            <Button 
                //disabled={_.isEqual(dataPatterElement, listObjectInfo[currentIdSTIXObject])}
                onClick={() => {}}
                color="primary">
                сохранить
            </Button>
        </DialogActions>
    </Dialog>);
}

ModalWindowAddReportSTIX.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
};

/*


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
                    <Button variant="outline-secondary" size="sm" onClick={this.handleClose}>закрыть</Button>
                    <Button variant="outline-primary" size="sm" onClick={this.handleSave}>сохранить</Button>
                </Modal.Footer>
            </Modal>
*/
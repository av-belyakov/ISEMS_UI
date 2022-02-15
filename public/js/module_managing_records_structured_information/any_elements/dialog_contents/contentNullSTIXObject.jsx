import React from "react";
import { Col, Row } from "react-bootstrap";
import { 
    DialogContent,
} from "@material-ui/core";

export default function CreateNullSTIXObject(){ 
    return (<DialogContent>
        <Row className="mt-2">
            <Col md={12} className="pl-3 pr-3">
                Подходящий для отрисовки STIX объект не найден
            </Col>
        </Row>
    </DialogContent>);
}

CreateNullSTIXObject.propTypes = {};
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

export default class CreatePageReport extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <React.Fragment>
                <Row className="pt-4">
                    <Col md={12} className="text-right">Report Page</Col>
                </Row>
            </React.Fragment>
        );
    }
}

CreatePageReport.propTypes = {
    
};
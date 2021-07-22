import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

export default class CreatePageStatistic extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <React.Fragment>
                <Row className="pt-4">
                    <Col md={12} className="text-right">Statistic Page</Col>
                </Row>
            </React.Fragment>
        );
    }
}

CreatePageStatistic.propTypes = {
    
};
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

export default class CreatePageObservedData extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <React.Fragment>
                <Row className="pt-4">
                    <Col md={12}>
                        <p>Observed Data Page</p>
                        <p>
                        Здесь будут объекты типа Observed-data Document Object STIX и все объекты типа STIX Ciber Observable.
                        </p>
                        <p>
                            Если мы являемся привилегированным пользователем то мы видим этот раздел, если мы пользователи которые
                            не могут видеть все Reports то для нас этот раздел будет неактивен
                        </p>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

CreatePageObservedData.propTypes = {
    
};
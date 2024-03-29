import React from "react";
import ReactDOM from "react-dom/client";
import { Button, Col, Form, Row, Spinner, Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";

class CreateSourceList extends React.Component {
    constructor(props){
        super(props);

        this.getListSource = this.getListSource.bind(this);
    }

    getListSource(){
        return Object.keys(this.props.listSources).sort((a, b) => a < b).map((sourceID, num) => {
            return (
                <option 
                    key={`key_source_${num}_${this.props.listSources[sourceID].id}`} 
                    value={sourceID} >
                    {`${sourceID} ${this.props.listSources[sourceID].shortName}`}
                </option>
            );
        });
    }

    render(){
        return (
            <Form.Group>
                <Form.Control onChange={this.props.handlerChosen} as="select" size="sm" id="dropdown_list_sources">
                    <option>источники</option>
                    {this.getListSource()}
                </Form.Control>
            </Form.Group>
        );
    }
}

CreateSourceList.propTypes = {
    listSources: PropTypes.object.isRequired,
    handlerChosen: PropTypes.func.isRequired,
};

class CreateNotificationTypeList extends React.Component {
    constructor(props){
        super(props);

        this.getListNotificationType = this.getListNotificationType.bind(this);
    }

    getListNotificationType(){
        let list = [ 
            { t: "info", n: "информационное" },
            { t: "danger", n: "критичное" },
            { t: "success", n: "успешное" },
            { t: "warning", n: "требует внимания" },
        ];

        return list.map((item) => {
            return <option key={`key_n_${item.t}`} className={`text-${item.t}`} value={item.t}>{item.n}</option>;
        });
    }

    render(){
        return (
            <Form.Group>
                <Form.Control onChange={this.props.handlerChosen} as="select" size="sm" id="dropdown_list_sources">
                    <option value="">тип сообщения</option>
                    {this.getListNotificationType()}
                </Form.Control>
            </Form.Group>
        );
    }
}

CreateNotificationTypeList.propTypes = {
    handlerChosen: PropTypes.func.isRequired,
};

class CreatePageNotificationLog extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            chosenSource: 0,
            notificationType: "",
            numChunk: 1,
            buttonNextChunkIsDisabled: false,
            countDocument: this.props.listItems.mainInformation.countDocument,
            msgList: this.props.listItems.mainInformation.foundList,
        };

        this.formaterInt = new Intl.NumberFormat();
        this.createBodyTable = this.createBodyTable.bind(this);
        this.handlerNextChunk = this.handlerNextChunk.bind(this);
        this.handlerButtonSubmit = this.handlerButtonSubmit.bind(this);
        this.handlerChosenSource = this.handlerChosenSource.bind(this);
        this.handlerChosenNotificationType = this.handlerChosenNotificationType.bind(this);

        this.headerEvents.call(this);
    }

    headerEvents(){
        this.props.socketIo.on("module NI API:send notification log for source ID", (data) => {
            if(!data.options.addToList){
                this.setState({
                    countDocument: data.options.countDocument,
                    msgList: data.options.foundList,
                });

                return;
            }

            let msgList = [].concat(this.state.msgList, data.options.foundList);
            let objCopy = Object.assign({}, this.state);
            objCopy.countDocument = data.options.countDocument;
            objCopy.msgList = msgList;
            objCopy.buttonNextChunkIsDisabled = false;
            this.setState(objCopy);
        });

        this.props.socketIo.on("module NI API:send notification log next chunk", (data) => {
            let msgList = [].concat(this.state.msgList, data.options.foundList);
            let objCopy = Object.assign({}, this.state);
            objCopy.msgList = msgList;
            objCopy.buttonNextChunkIsDisabled = false;
            this.setState(objCopy);
        });
    }

    handlerChosenSource(e){
        let value = e.target.value;
        if(value === "источники"){
            value = 0;
        }

        this.setState({ 
            chosenSource: +(value),
            numChunk: 1,
        });
    }

    handlerChosenNotificationType(e){
        this.setState({ 
            notificationType: e.target.value,
            numChunk: 1, 
        });
    }

    handlerButtonSubmit(){
        this.props.socketIo.emit("network interaction: get notification log for source ID", { 
            arguments: {
                sourceID: this.state.chosenSource,
                notificationType: this.state.notificationType,
                numberChunk: this.state.numChunk,
            } 
        });

        this.setState({ buttonNextChunkIsDisabled: false });
    }

    handlerNextChunk(){
        let nextChunk = this.state.numChunk + 1;

        this.setState({
            numChunk: nextChunk,
            buttonNextChunkIsDisabled: true,
        });

        //запрос на получение следующей части сообщений для выбранного источника
        this.props.socketIo.emit("network interaction: get notification log for source ID", { 
            arguments: {
                sourceID: this.state.chosenSource,
                notificationType: this.state.notificationType,
                numberChunk: nextChunk,
            } 
        });
    }

    createBodyTable(){
        let formatterDate = new Intl.DateTimeFormat("ru-Ru", {
            timeZone: "Europe/Moscow",
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

        return this.state.msgList.map((item, index) => {
            return (
                <OverlayTrigger
                    key={`tooltip_${index}`}
                    placement="top"
                    overlay={<Tooltip>{`ID задачи: ${item.id}`}</Tooltip>}>
                    <tr key={`tr_key_${++index}`}>
                        <td className="align-middle"><small>{index}.</small></td>
                        <td className="align-middle">
                            <small>{formatterDate.format(item.date_register)}</small>
                        </td>
                        <td className={`text-${item.type} text-left my_line_spacing`}>
                            <small>{item.message}</small>
                        </td>
                    </tr>
                </OverlayTrigger>
            ); 
        });
    }

    createButtonNextChunk(){
        return (
            <Button 
                size="sm" 
                variant="outline-secondary" 
                onClick={this.handlerNextChunk}
                disabled={this.state.buttonNextChunkIsDisabled} >
                {this.state.buttonNextChunkIsDisabled && <Spinner as="span" size="sm" role="status" aria-hidden="true" animation="border" variant="info" />}
                &nbsp;Ещё...
            </Button>
        );
    }

    render(){
        let isDisabled = ((this.state.chosenSource === 0) && (this.state.notificationType === ""));

        return (
            <React.Fragment>
                <Row className="pt-3">
                    <Col md={3} className="mt-2">
                        <CreateSourceList 
                            listSources={this.props.listItems.listSources}
                            handlerChosen={this.handlerChosenSource} />
                    </Col>
                    <Col md={2} className="mt-2">
                        <CreateNotificationTypeList handlerChosen={this.handlerChosenNotificationType} />
                    </Col>
                    <Col md={1} className="mt-2">
                        <Button 
                            variant="outline-primary" 
                            onClick={this.handlerButtonSubmit} 
                            disabled={isDisabled}
                            size="sm">
                            показать
                        </Button>
                    </Col>
                    <Col md={6} className="text-right text-muted">
                        <Row className="pt-1">
                            <Col md={12}>
                            информационных сообщений найдено:&nbsp; 
                                <span className="text-info">{this.formaterInt.format(this.state.countDocument)}</span>
                            </Col>
                        </Row>
                        <Row className="mt-n2">
                            <Col md={12}>
                            из них на странице:&nbsp;
                                <span className="text-info">{this.state.msgList.length}</span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="mt-2">
                        <Table size="sm" striped hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className="my_line_spacing">дата и время регистрации</th>
                                    <th className="my_line_spacing">сообщение</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.createBodyTable()}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="text-right">
                        {this.createButtonNextChunk.call(this)}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

CreatePageNotificationLog.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listItems: PropTypes.object.isRequired,
}; 

ReactDOM.createRoot(document.getElementById("main-page-content")).render(<CreatePageNotificationLog
    socketIo={socket}
    listItems={receivedFromServer} />);
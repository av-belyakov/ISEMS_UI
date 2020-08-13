import React from "react";
import ReactDOM from "react-dom";
import { Button, Col, Form, Row, Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";

class CreateSourceList extends React.Component {
    constructor(props){
        super(props);

        this.getListSource = this.getListSource.bind(this);
    }

    getListSource(){
        return Object.keys(this.props.listSources).sort((a, b) => a < b).map((sourceID) => {
            return (
                <option 
                    key={`key_sour_${this.props.listSources[sourceID].id}`} 
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

class CreatePageNotificationLog extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            chosenSource: 0,
            numChunk: 1,
            buttonNextChunkIsDisabled: false,
            countDocument: this.props.listItems.mainInformation.countDocument,
            msgList: this.props.listItems.mainInformation.foundList,
        };

        this.createBodyTable = this.createBodyTable.bind(this);
        this.handlerNextChunk = this.handlerNextChunk.bind(this);
        this.handlerButtonSubmit = this.handlerButtonSubmit.bind(this);
        this.handlerChosenSource = this.handlerChosenSource.bind(this);

        this.headerEvents.call(this);

        console.log("func 'CreatePageNotificationLog'");
        console.log(this.props.listItems);
    }

    headerEvents(){
        this.props.socketIo.on("module NI API:send notification log for source ID", (data) => {

            console.log("func 'headerEvents', event: module NI API:send notification log for source ID");
            console.log(data);

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
            
            console.log("func 'headerEvents', event: module NI API:send notification log next chunk");
            console.log(data);

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

    handlerButtonSubmit(){
        console.log("func 'handlerButtonSubmit', START...");

        this.props.socketIo.emit("network interaction: get notification log for source ID", { 
            arguments: {
                sourceID: this.state.chosenSource,
                numberChunk: this.state.numChunk,
            } 
        });

        this.setState({ buttonNextChunkIsDisabled: false });
    }

    handlerNextChunk(){
        console.log("func 'handlerNextChunk' ***");

        let nextChunk = this.state.numChunk + 1;

        this.setState({
            numChunk: nextChunk,
            buttonNextChunkIsDisabled: true,
        });

        if(this.state.chosenSource === 0){
            console.log("запрос на получение следующей части всех сообщений ");

            //запрос на получение следующей части всех сообщений 
            this.props.socketIo.emit("network interaction: get notification log next chunk", {
                arguments: {
                    sourceID: 0,
                    numberChunk: nextChunk,
                }
            });

            return;
        }

        //запрос на получение следующей части сообщений для выбранного источника
        this.props.socketIo.emit("network interaction: get notification log for source ID", { 
            arguments: {
                sourceID: this.state.chosenSource,
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
        if(this.state.countDocument <= this.props.listItems.maxChunkLimit){
            return;
        }

        if(this.state.msgList.length >= this.state.countDocument){
            return;
        }

        return (
            <Row>
                <Col md={12} className="text-right">
                    <Button 
                        size="sm" 
                        variant="light" 
                        onClick={this.handlerNextChunk}
                        disabled={this.state.buttonNextChunkIsDisabled} >ещё...</Button>
                </Col>
            </Row>
        );
    }

    render(){
        return (
            <React.Fragment>
                <Row>
                    <Col md={12} className="text-left text-muted">журнал информационных сообщений</Col>
                </Row>
                <Row>
                    <Col md={4} className="mt-2">
                        <CreateSourceList 
                            listSources={this.props.listItems.listSources}
                            handlerChosen={this.handlerChosenSource} />
                    </Col>
                    <Col md={1} className="mt-2">
                        <Button 
                            variant="outline-primary" 
                            onClick={this.handlerButtonSubmit} 
                            disabled={(this.state.chosenSource === 0)}
                            size="sm">
                            показать
                        </Button>
                    </Col>
                    <Col md={7} className="text-right text-muted">
                        информационных сообщений найдено:&nbsp; 
                        <span className="text-info">{this.state.countDocument}</span>, 
                        из них на странице:&nbsp;
                        <span className="text-info">{this.state.msgList.length}</span>
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
                {this.createButtonNextChunk.call(this)}
            </React.Fragment>
        );
    }
}

CreatePageNotificationLog.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listItems: PropTypes.object.isRequired,
}; 

ReactDOM.render(<CreatePageNotificationLog
    socketIo={socket}
    listItems={receivedFromServer} />, document.getElementById("main-page-content"));
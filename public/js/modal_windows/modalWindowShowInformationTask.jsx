"use strict";

import React from "react";
import { Badge, Button, Card, Col, Modal, Row, Spinner, ProgressBar } from "react-bootstrap";
import PropTypes from "prop-types";

import Circle from "react-circle";

import {helpers} from "../common_helpers/helpers.js";

/**
 * Типовое модальное окно для вывода всей информации о выполняемой задаче
 * Сначала выводится вся информация о задаче полученная по запросу из БД,
 * а по мере обновления информации и перехватывания соответсвующих событий
 * обновляется только информация относящаяся к данному событию
 */
export default class ModalWindowShowInformationTask extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showInfo: false,
            taskID: "",
            clientTaskID: "",
            userInitiatedFilteringProcess: "",
            userInitiatedFileDownloadProcess: "",
            taskType: "",          
            parametersFiltration: {
                dt: {s:0, e:0},
                f: {
                    ip: { any: [], src: [], dst: [] },
                    nw: { any: [], src: [], dst: [] },
                    pt: { any: [], src: [], dst: [] },
                },
                p: "any",
            },
            filteringStatus: {
                mpf: 0, ndf: 0, nepf: 0, nffrf: 0, nfmfp: 0, sffrf: 0, sfmfp: 0, ts: "нет данных",
                tte: { s: 0, e: 0},
            },
            downloadingStatus: {
                nfd: 0, nfde: 0, nft: 0, pdsdf: "", ts: "нет данных",
                tte: { s: 0, e: 0},
            }
        };

        this.formatter = Intl.DateTimeFormat("ru-Ru", {
            timeZone: "Europe/Moscow",
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

        this.getListNetworkParameters = this.getListNetworkParameters.bind(this);
        this.getInformationProgressFiltration = this.getInformationProgressFiltration.bind(this);

        this.handlerEvents.call(this);
    }

    handlerEvents(){
        this.props.socketIo.on("module NI API", (msg) => {
            if(msg.type === "processingGetAllInformationByTaskID"){               
                let uifp = (typeof msg.options.taskParameter.uifp === "undefined") ? "": msg.options.taskParameter.uifp;
                let uifdp = (typeof msg.options.taskParameter.uifdp === "undefined") ? "": msg.options.taskParameter.uifdp;

                this.setState({
                    showInfo: true,
                    taskID: msg.options.taskParameter.tid,
                    clientTaskID: msg.options.taskParameter.ctid,   
                    userInitiatedFilteringProcess: uifp,
                    userInitiatedFileDownloadProcess: uifdp,                
                    parametersFiltration: msg.options.taskParameter.fo,
                    filteringStatus: msg.options.taskParameter.diof,
                    downloadingStatus: msg.options.taskParameter.diod,
                });
            }
            if(msg.type === "filtrationProcessing"){
                if(this.state.taskID !== msg.options.taskIDModuleNI){
                    return;
                }

                this.setState({ taskType: "filtration" });

                let tmpCopy = Object.assign(this.state.filteringStatus);
                tmpCopy.ts = msg.options.status;
                tmpCopy.nfmfp = msg.options.parameters.numAllFiles;
                tmpCopy.nffrf = msg.options.parameters.numFindFiles;
                tmpCopy.mpf = msg.options.parameters.numProcessedFiles;
                tmpCopy.nepf = msg.options.parameters.numProcessedFilesError;
                tmpCopy.sfmfp = msg.options.parameters.sizeAllFiles;
                tmpCopy.sffrf = msg.options.parameters.sizeFindFiles;
                this.setState({ filteringStatus: tmpCopy });
            }
            if(msg.type === "downloadProcessing"){
                if(this.state.taskID !== msg.options.taskIDModuleNI){
                    return;
                }

                this.setState({ taskType: "download" });

                let tmpCopy = Object.assign(this.state.downloadingStatus);               
                tmpCopy.ts = msg.options.status;
                tmpCopy.nft = msg.options.parameters.numberFilesTotal;
                tmpCopy.nfd = msg.options.parameters.numberFilesDownloaded;
                tmpCopy.nfde = msg.options.parameters.numberFilesDownloadedError;
                this.setState({ downloadingStatus: tmpCopy });
            }
        });
    }

    handlerButtonStop(sourceID){
        let taskTypeStop = "network interaction: stop filtration task";
        if(this.state.taskType === "download"){
            taskTypeStop = "network interaction: stop download files";
        }

        this.props.socketIo.emit(taskTypeStop, {
            actionType: "stop task",
            arguments: { 
                taskID: this.state.clientTaskID,
                sourceID: sourceID,
            },
        });

        this.props.onHide();
    }

    getListNetworkParameters(type){
        let getListDirection = (d) => {
            if((this.state.parametersFiltration.f[type][d] === null) || (this.state.parametersFiltration.f[type][d].length === 0)){
                return { value: "", success: false };
            }

            let result = this.state.parametersFiltration.f[type][d].map((item) => {
                if(d === "src"){
                    return (<div className="ml-4" key={`elem_${type}_${d}_${item}`}>
                        <small className="text-info">{d}&#8592; </small><small>{item}</small>
                    </div>); 
                }
                if(d === "dst"){
                    return (<div className="ml-4" key={`elem_${type}_${d}_${item}`}>
                        <small className="text-info">{d}&#8594; </small><small>{item}</small>
                    </div>); 
                }

                return (<div className="ml-4" key={`elem_${type}_${d}_${item}`}>
                    <small className="text-info">{d}&#8596; </small><small>{item}</small>
                </div>); 
            });

            return { value: result, success: true };
        };

        let resultAny = getListDirection("any");
        let resultSrc = getListDirection("src");
        let resultDst = getListDirection("dst");

        return (
            <React.Fragment>
                <div>{resultAny.value}</div>
                {(resultAny.success && (resultSrc.success || resultDst.success)) ? <div className="text-danger text-center my-n2">&laquo;<small>ИЛИ</small>&raquo;</div> : <div></div>}                   
                <div>{resultSrc.value}</div>
                {(resultSrc.success && resultDst.success) ? <div className="text-danger text-center  my-n2">&laquo;<small>И</small>&raquo;</div> : <div></div>}                   
                <div>{resultDst.value}</div>
            </React.Fragment>
        );
    }

    getInformationProgressFiltration(){
        if(this.state.filteringStatus.nfmfp === 0){
            return;
        }

        let numFormatter = new Intl.NumberFormat("ru");
        let sfmfp = helpers.changeByteSize(this.state.filteringStatus.sfmfp);
        let sffrf = helpers.changeByteSize(this.state.filteringStatus.sffrf);

        return (
            <React.Fragment>
                <Row>
                    <Col md={12} className="text-muted mt-0">
                        <small>ход выполнения</small>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="text-muted">
                        <Card>
                            <Card.Body className="pt-0 pb-0">
                                <Row>
                                    <Col md={8} className="text-muted">                                
                                        <Row className="mb-n2">
                                            <Col md={6}><small>всего файлов:</small></Col>
                                            <Col md={6} className="text-left"><small><strong>{numFormatter.format(this.state.filteringStatus.nfmfp)}</strong> шт.</small></Col>
                                        </Row>
                                        <Row className="mb-n2">
                                            <Col md={5}><small>общим размером:</small></Col>
                                            <Col md={7} className="text-left"><small><strong>{numFormatter.format(this.state.filteringStatus.sfmfp)}</strong> байт (<strong>{sfmfp.size}</strong> {sfmfp.name})</small></Col>
                                        </Row>
                                        <Row className="mb-n2">
                                            <Col md={6}><small>файлов обработанно:</small></Col>
                                            <Col md={6} className="text-left"><small><strong>{numFormatter.format(this.state.filteringStatus.mpf)}</strong> шт.</small></Col>
                                        </Row>
                                        <Row className="mb-n2">
                                            <Col md={6}><small>файлов обработанно с ошибкой:</small></Col>
                                            <Col md={6} className="text-left"><small><strong>{this.state.filteringStatus.nepf}</strong> шт.</small></Col>
                                        </Row>
                                        <Row className="mb-n2">
                                            <Col md={6}><small>файлов найдено:</small></Col>
                                            <Col md={6} className="text-left"><small><strong>{numFormatter.format(this.state.filteringStatus.nffrf)}</strong> шт.</small></Col>
                                        </Row>
                                        <Row className="mb-n2">
                                            <Col md={5}><small>общим размером:</small></Col>
                                            <Col md={7} className="text-left"><small><strong>{numFormatter.format(this.state.filteringStatus.sffrf)}</strong> байт (<strong>{sffrf.size}</strong> {sffrf.name})</small></Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}><small>фильтруемых директорий:</small></Col>
                                            <Col md={6} className="text-left"><small><strong>{this.state.filteringStatus.ndf}</strong> шт.</small></Col>
                                        </Row>
                                    </Col>
                                    <Col md={4} className="mt-3 text-center">
                                        {this.createCircleProcessFilter.call(this)}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    getInformationProgressDownload(){
        if((this.state.filteringStatus.nffrf === 0) || (this.state.filteringStatus.ts !== "complete")){
            return;
        }

        let percent = 0;
        if(this.state.downloadingStatus.nfd > 0){
            percent = Math.round((this.state.downloadingStatus.nfd*100) / this.state.downloadingStatus.nft);
        }

        return (
            <React.Fragment>
                <Row>
                    <Col md={12} className="text-muted">
                        <small>
                        общее количество файлов подлежащих скачиванию: <strong>{this.state.downloadingStatus.nft}</strong>, 
                        загруженных файлов: <strong>{this.state.downloadingStatus.nfd}</strong>, 
                        из них с ошибкой: <strong>{this.state.downloadingStatus.nfde}</strong>
                        </small>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <ProgressBar now={percent} label={`${percent}%`} />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    getStatusFiltering(){
        let ts = this.state.filteringStatus.ts;
    
        if(ts === "wait"){
            return <small className="text-info">готовится к выполнению</small>;
        } else if(ts === "refused"){
            return <small className="text-danger">oтклонена</small>;
        } else if(ts === "execute"){
            return <small className="text-primary">выполняется</small>;
        } else if(ts === "complete"){
            return <small className="text-success">завершена успешно</small>;
        } else if(ts === "stop"){
            return <small className="text-warning">остановлена пользователем</small>;
        } else {
            return <small>ts</small>;
        }
    }

    getStatusDownload(){
        let ts = this.state.downloadingStatus.ts;
    
        if(ts === "wait"){
            return <small className="text-info">готовится к выполнению</small>;
        } else if(ts === "refused"){
            return <small className="text-danger">oтклонена</small>;
        } else if(ts === "execute"){
            return <small className="text-primary">выполняется</small>;       
        } else if(ts === "complete"){
            return <small className="text-success">завершена успешно</small>;       
        } else if(ts === "stop"){
            return <small className="text-warning">остановлена пользователем</small>;
        } else if(ts === "not executed"){
            return <small className="text-light bg-dark">не выполнялась</small>;
        } else {
            return <small>ts</small>;
        }
    }

    createNetworkParameters(){
        return (
            <React.Fragment>
                <Row>
                    <Col sm="3" className="text-center">
                        <Badge  bg="info">ip адрес</Badge>
                    </Col>
                    <Col sm="2" className="text-danger text-center">&laquo;<small>ИЛИ</small>&raquo;</Col>
                    <Col sm="3" className="text-center">
                        <Badge  bg="info">сеть</Badge>
                    </Col>
                    <Col sm="1" className="text-danger text-center">&laquo;<small>И</small>&raquo;</Col>
                    <Col sm="3" className="text-center">
                        <Badge  bg="info">сетевой порт</Badge>
                    </Col>
                </Row>
                <Row>
                    <Col sm="4">{this.getListNetworkParameters("ip")}</Col>
                    <Col sm="1"></Col>
                    <Col sm="4">{this.getListNetworkParameters("nw")}</Col>
                    <Col sm="3">{this.getListNetworkParameters("pt")}</Col>
                </Row>
            </React.Fragment>
        );
    }

    createCircleProcessFilter() {
        let percent = (this.state.filteringStatus.mpf*100) / this.state.filteringStatus.nfmfp;

        return (
            <Circle
                progress={Math.round(percent)}
                animate={true} // Boolean: Animated/Static progress
                animationDuration="1s" // String: Length of animation
                responsive={false} // Boolean: Make SVG adapt to parent size
                size="170" // String: Defines the size of the circle.
                lineWidth="35" // String: Defines the thickness of the circle's stroke.
                progressColor="rgb(76, 154, 255)" // String: Color of "progress" portion of circle.
                bgColor="#ecedf0" // String: Color of "empty" portion of circle.
                textColor="#6b778c" // String: Color of percentage text color.
                textStyle={{
                    font: "bold 4rem Helvetica, Arial, sans-serif" // CSSProperties: Custom styling for percentage.
                }}
                percentSpacing={10} // Number: Adjust spacing of "%" symbol and number.
                roundedStroke={false} // Boolean: Rounded/Flat line ends
                showPercentage={true} // Boolean: Show/hide percentage.
                showPercentageSymbol={true} // Boolean: Show/hide only the "%" symbol.
            />
        );
    }

    createUserDownloadTask(){
        if(this.state.downloadingStatus.ts === "not executed"){
            return;
        }

        let userInitiatedFileDownloadProcess = (this.state.userInitiatedFileDownloadProcess.length > 0) ? this.state.userInitiatedFileDownloadProcess: "задача сформирована автоматически";

        return (
            <Row>
                <Col md={12} className="text-center text-muted">Пользователь: <i>{userInitiatedFileDownloadProcess}</i></Col>
            </Row>
        );
    }

    createPathDirFilterFiles(){
        if(this.state.filteringStatus.nfmfp === 0){
            return;
        }

        return (
            <Row className="text-center text-muted">                   
                <Col md={12}>
                    <small>директория содержащая файлы полученные в результате фильтрации</small>
                </Col>
                <Col md={12} className="my_line_spacing">
                    <small><strong>{this.state.filteringStatus.pdfff}</strong></small>
                </Col>
            </Row>
        );
    }

    createPathDirStorageFiles(){
        if(this.state.downloadingStatus.nfd === 0){
            return;
        }

        return (
            <Row className="text-center text-muted">                   
                <Col md={12}>
                    <small>директория для долговременного хранения загруженных файлов</small>
                </Col>
                <Col md={12} className="my_line_spacing">
                    <small><strong>{this.state.downloadingStatus.pdsdf}</strong></small>
                </Col>
            </Row>
        );
    }

    createModalBody(){
        if(!this.state.showInfo){
            return (
                <div className="col-md-12 text-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="sr-only">Загрузка...</span>
                    </Spinner>
                </div>
            );
        }

        let fdts = this.state.parametersFiltration.dt.s*1000;
        let fdte = this.state.parametersFiltration.dt.e*1000;

        let filtrationStart = this.state.filteringStatus.tte.s*1000;
        if(filtrationStart === 0){
            filtrationStart = "нет данных";
        } else {
            filtrationStart = this.formatter.format(filtrationStart);
        }

        let filtrationEnd = this.state.filteringStatus.tte.e*1000;
        if(filtrationEnd === 0){
            filtrationEnd = "нет данных";
        } else {
            filtrationEnd = this.formatter.format(filtrationEnd);
        }

        let downloadStart = this.state.downloadingStatus.tte.s*1000;
        if(downloadStart === 0){
            downloadStart = "нет данных";
        } else {
            downloadStart = this.formatter.format(downloadStart);
        }

        let downloadEnd = this.state.downloadingStatus.tte.e*1000;
        if(downloadEnd === 0){
            downloadEnd = "нет данных";
        } else {
            downloadEnd = this.formatter.format(downloadEnd);
        }

        let userInitiatedFilteringProcess = (this.state.userInitiatedFilteringProcess.length > 0) ? this.state.userInitiatedFilteringProcess: "задача сформирована автоматически";

        return (
            <React.Fragment>
                <Row>
                    <Col md={12} className="text-center">
                    Задача по фильтрации (добавлена: <i>{filtrationStart}</i>, завершена: <i>{filtrationEnd}</i>)
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="text-center text-muted">Пользователь: <i>{userInitiatedFilteringProcess}</i></Col>
                </Row>
                <Row>
                    <Col md={12} className="text-muted mt-2">
                        <small>параметры</small>
                    </Col>
                </Row>
                <Card>
                    <Card.Body className="pt-0 pb-0">
                        <Row>
                            <Col md={9} className="text-muted">
                                <small>
                                дата и время,
                                начальное: <strong>{this.formatter.format(fdts)}</strong>, 
                                конечное: <strong>{this.formatter.format(fdte)}</strong>
                                </small>
                            </Col>
                            <Col md={3} className="text-muted"><small>сетевой протокол: <strong>{(this.state.parametersFiltration.p === "any") ? "любой" : this.state.parametersFiltration.p}</strong></small></Col>
                        </Row>
                        <Row><Col md={12}>{this.createNetworkParameters.call(this)}</Col></Row>
                    </Card.Body>                   
                </Card>               
                <Row className="text-muted mb-n2">
                    <Col md={2}><small>статус задачи: </small></Col>
                    <Col md={10} className="text-right">{this.getStatusFiltering.call(this)}</Col>
                </Row>
                {this.getInformationProgressFiltration()}
                {this.createPathDirFilterFiles.call(this)}
                <Row>
                    <Col md={12} className="text-center mt-3">
                    Задача по скачиванию файлов (добавлена: <i>{downloadStart}</i>, завершена: <i>{downloadEnd}</i>)
                    </Col>
                </Row>
                {this.createUserDownloadTask.call(this)}
                <Row className="text-muted mb-n2">
                    <Col md={2}><small>статус задачи: </small></Col>
                    <Col md={10} className="text-right">{this.getStatusDownload.call(this)}</Col>
                </Row>
                {this.getInformationProgressDownload.call(this)}
                {this.createPathDirStorageFiles.call(this)}
            </React.Fragment>
        );
    }

    createButtonStop(){
        let filterExecute = (this.state.filteringStatus.ts === "execute") || (this.state.filteringStatus.ts === "wait");
        let downloadExecute = (this.state.downloadingStatus.ts === "execute") || (this.state.downloadingStatus.ts === "wait");

        if(filterExecute || downloadExecute) {
            return (
                <Button 
                    variant="outline-danger" 
                    onClick={this.handlerButtonStop.bind(this, this.props.shortTaskInfo.sourceID)} 
                    size="sm">
                    остановить задачу
                </Button>
            );
        }

        return;
    }

    render(){
        return (<Modal
            size="xl"
            show={this.props.show} 
            onHide={this.props.onHide}
            aria-labelledby="example-modal-sizes-title-lg" >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    <h5>Источник №{this.props.shortTaskInfo.sourceID} ({this.props.shortTaskInfo.sourceName})</h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.createModalBody.call(this)}
            </Modal.Body>
            <Modal.Footer>
                {this.createButtonStop.call(this)}
                <Button variant="outline-secondary" onClick={this.props.onHide} size="sm">
                        закрыть
                </Button>
            </Modal.Footer>
        </Modal>);
    }
}

ModalWindowShowInformationTask.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    socketIo: PropTypes.object.isRequired,
    shortTaskInfo: PropTypes.object.isRequired,
};
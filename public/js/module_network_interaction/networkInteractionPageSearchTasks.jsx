import React from "react";
import ReactDOM from "react-dom";
import { Button, Col, Row, Table, Form, Pagination, Tooltip, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";

import GetStatusDownload from "../commons/getStatusDownload.jsx";
import GetStatusFiltering from "../commons/getStatusFiltering.jsx";
import CreateBodySearchTask from "./createBodySearchTask.jsx";
import ListNetworkParameters from "../commons/listNetworkParameters.jsx";
import { ModalWindowConfirmMessage } from "../modal_windows/modalWindowConfirmMessage.jsx";
import ModalWindowAddFilteringTask from "../modal_windows/modalWindowAddFilteringTask.jsx";
import ModalWindowShowInformationTask from "../modal_windows/modalWindowShowInformationTask.jsx";

class CreatePageSearchTasks extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            shortTaskInformation: { 
                sourceID: 0, 
                sourceName: "",
                taskID: "",
            },
            showModalWindowFiltration: false,
            showModalWindowDeleteTask: false,
            showModalWindowShowTaskInformation: false,
            listCheckboxMarkedTasksDel: new Set(),
            listSources: this.props.listItems.listSources,
            listTasksFound: {
                p: { cs: 0, cn: 0, ccn: 1 },
                slft: [],
                tntf: 0,            
            },
            listInputForSearch: [],
            currentFilteringParameters: {
                dt: { s: +new Date, e: +new Date },
                sid: 0,
                p: "any",
                f: { 
                    ip: { any: [], src: [], dst: [] },
                    pt: { any: [], src: [], dst: [] },
                    nw: { any: [], src: [], dst: [] },
                },
            },
        };

        this.handlerEvents.call(this);
        this.requestEmitter.call(this);

        this.getUserPermission = this.getUserPermission.bind(this);
        this.handlerTaskDelete = this.handlerTaskDelete.bind(this);
        this.handlerButtonSearch = this.handlerButtonSearch.bind(this);
        this.createTableListDownloadFile = this.createTableListDownloadFile.bind(this);
        this.closeModalWindowTasksDelete = this.closeModalWindowTasksDelete.bind(this);
        this.handlerButtonSubmitWindowFilter = this.handlerButtonSubmitWindowFilter.bind(this);
        this.handlerCloseModalWindowFiltration = this.handlerCloseModalWindowFiltration.bind(this);
        this.handlerModalWindowShowTaskTnformation = this.handlerModalWindowShowTaskTnformation.bind(this);
        this.handlerShowModalWindowShowTaskInformation = this.handlerShowModalWindowShowTaskInformation.bind(this);
        this.handlerCloseModalWindowShowTaskInformation=this.handlerCloseModalWindowShowTaskInformation.bind(this);
    }

    requestEmitter(){
        this.props.socketIo.emit("network interaction: get list all tasks", { arguments: {} });   
    }

    getUserPermission(){
        return this.props.listItems.userPermissions;
    }

    handlerEvents(){
        this.props.socketIo.on("module NI API", (data) => {
            if(data.type === "send a list of found tasks"){   
                let tmpCopy = Object.assign(this.state.listTasksFound);
                tmpCopy = { 
                    p: data.options.p,
                    slft: data.options.slft, 
                    tntf: data.options.tntf,
                };
                this.setState({ listTasksFound: tmpCopy });
            }
        });
    }

    handlerModalWindowShowTaskTnformation(data){
        let objCopy = Object.assign({}, this.state);
        objCopy.shortTaskInformation.sourceID = data.sourceID;
        objCopy.shortTaskInformation.sourceName = data.sourceName;
        objCopy.shortTaskInformation.taskID = data.taskID;
        this.setState(objCopy);

        this.handlerShowModalWindowShowTaskInformation();
    }

    handlerShowModalWindowShowTaskInformation(){
        this.setState({ showModalWindowShowTaskInformation: true });
    }

    handlerCloseModalWindowShowTaskInformation(){
        this.setState({ showModalWindowShowTaskInformation: false });
    }

    headerClickTable(objData, type){
        if(type === "info"){
            this.handlerModalWindowShowTaskTnformation(objData);
            
            this.props.socketIo.emit("network interaction: show info about all task", {
                arguments: { taskID: objData.taskID } 
            });
        }
        
        if(type === "re-filtering"){
            let objCopy = Object.assign({}, this.state.currentFilteringParameters);
            objCopy.sid = this.state.listTasksFound.slft[objData.index].sid;
            objCopy.dt = this.state.listTasksFound.slft[objData.index].pf.dt;
            objCopy.p = this.state.listTasksFound.slft[objData.index].pf.p;
            objCopy.f = this.state.listTasksFound.slft[objData.index].pf.f;

            this.setState({ 
                currentFilteringParameters: objCopy,
                showModalWindowFiltration: true 
            });
        }

        if(type === "delete"){
            if(this.state.listCheckboxMarkedTasksDel.size === 0){
                return;
            }

            this.setState({ showModalWindowDeleteTask: true });
        }
    }

    handlerCloseModalWindowFiltration(){
        this.setState({ showModalWindowFiltration: false });
    }

    headerNextItemPagination(num){
        if(this.state.listTasksFound.p.ccn === num){
            return;
        }

        this.props.socketIo.emit("network interaction: get next chunk list all tasks", {
            taskID: this.state.currentTaskID,
            chunkSize: this.state.listTasksFound.p.cs,
            nextChunk: num,
        });
    }

    handlerTaskDelete(){
        let listTaskID = [];
        for(let id of this.state.listCheckboxMarkedTasksDel){
            listTaskID.push(id);
        }

        this.props.socketIo.emit("network interaction: delete all information about a task", {
            listTaskID: listTaskID
        });

        this.setState({ showModalWindowDeleteTask: false });
    }

    handlerButtonSubmitWindowFilter(objTaskInfo){
        let checkExistInputValue = () => {
            let isEmpty = true;

            done:
            for(let et in objTaskInfo.inputValue){
                for(let d in objTaskInfo.inputValue[et]){
                    if(Array.isArray(objTaskInfo.inputValue[et][d]) && objTaskInfo.inputValue[et][d].length > 0){
                        isEmpty = false;

                        break done;  
                    }
                }
            }

            return isEmpty;
        };

        //проверяем наличие хотя бы одного параметра в inputValue
        if(checkExistInputValue()){
            return;
        }

        this.props.socketIo.emit("network interaction: start new filtration task", {
            actionType: "add new task",
            arguments: {
                source: objTaskInfo.source,
                dateTime: {
                    start: +(new Date(objTaskInfo.startDate)),
                    end: +(new Date(objTaskInfo.endDate)),
                },
                networkProtocol: objTaskInfo.networkProtocol,
                inputValue: objTaskInfo.inputValue,
            },
        });

        this.handlerCloseModalWindowFiltration();
    }

    handlerButtonSearch(list){
        let listInput = [];
        for(let type in list){
            for(let direction in list[type]){
                if(!Array.isArray(list[type][direction])){
                    continue;
                }

                list[type][direction].forEach((item) => {
                    listInput.push(item);
                });
            }    
        }

        this.setState({ listInputForSearch: listInput });
    }

    closeModalWindowTasksDelete(){
        this.setState({ showModalWindowDeleteTask: false });
    }

    isDisabledDelete(){       
        if(!this.getUserPermission().management_tasks_filter.element_settings.delete.status){
            return "disabled";
        }

        return (this.state.listCheckboxMarkedTasksDel.size > 0) ? "" : "disabled";
    }

    changeCheckboxMarked(tid, e){ 
        let lcmtd = this.state.listCheckboxMarkedTasksDel;
        if(e.target.checked){
            lcmtd.add(tid);
        } else {
            lcmtd.delete(tid);
        }
                
        this.setState({ listCheckboxMarkedTasksDel: lcmtd });
    }

    createTableListDownloadFile(){
        let createTableBody = () => {
            if((typeof this.state.listTasksFound.slft === "undefined") || (this.state.listTasksFound.slft.length === 0)){
                return;
            }

            let num = 0;
            if(this.state.listTasksFound.p.ccn > 1){
                num = (this.state.listTasksFound.p.ccn - 1) * this.state.listTasksFound.p.cs;
            }

            let tableBody = [];
            let formatterDate = new Intl.DateTimeFormat("ru-Ru", {
                timeZone: "Europe/Moscow",
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
            });

            this.state.listTasksFound.slft.forEach((item, index) => {
                let dataInfo = { taskID: item.tid, sourceID: item.sid, sourceName: item.sn, index: index };

                tableBody.push(<tr key={`tr_${item.tid}`}>
                    <td className="align-middle clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_num`}>
                        <small>{`${++num}.`}</small>
                    </td>
                    <td className="align-middle clicabe_cursor text-info" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_sourceID`}>
                        <small>{item.sid}</small>
                    </td>
                    <td className="align-middle my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_sourceName`}>
                        <small>{item.sn}</small>
                    </td>
                    <td className="align-middle my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_time_begin`}>
                        <div><small className="text-info">{formatterDate.format(item.stte*1000)}</small></div>
                    </td>
                    <td className="align-middle my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_time`}>
                        <div><small>{formatterDate.format(item.pf.dt.s*1000)}</small></div>
                        <div><small>{formatterDate.format(item.pf.dt.e*1000)}</small></div>
                    </td>
                    <td className="my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_ip`}>
                        <small><ListNetworkParameters type={"ip"} item={item.pf.f.ip} listInput={this.state.listInputForSearch} /></small>
                    </td>
                    <td className="my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_network`}>
                        <small><ListNetworkParameters type={"nw"} item={item.pf.f.nw} listInput={this.state.listInputForSearch} /></small>
                    </td>
                    <td className="my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_port`}>
                        <small><ListNetworkParameters type={"pt"} item={item.pf.f.pt} listInput={this.state.listInputForSearch} /></small>
                    </td>
                    <td className="my_line_spacing align-middle clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_sf`}>
                        <small><GetStatusFiltering status={item.fts} /></small>
                    </td>
                    <td className="my_line_spacing align-middle clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_sd`}>
                        <small><GetStatusDownload status={item.fdts} /></small>
                    </td>
                    <td className="align-middle">
                        <Button 
                            size="sm" 
                            variant="outline-light" >
                            <a href="#" onClick={this.headerClickTable.bind(this, dataInfo, "re-filtering")}>
                                <img className="clickable_icon" src="../images/icons8-repeat-24.png" alt="выполнить повторную фильтрацию"></img>
                            </a>
                        </Button>
                    </td>
                    <td className="align-middle">
                        <OverlayTrigger
                            key={`tooltip_${item.tid}_checkbox`}
                            placement="right"
                            overlay={<Tooltip>отметить для удаления</Tooltip>}>
                            <Form>
                                <Form.Check 
                                    className="mt-1"
                                    custom 
                                    onChange={this.changeCheckboxMarked.bind(this, item.tid)}
                                    type="checkbox" 
                                    id={`checkbox-${item.tid}`}
                                    label="" />
                            </Form>
                        </OverlayTrigger>
                    </td>
                </tr>);
            });

            return tableBody;
        };

        if(this.state.listTasksFound.tntf === 0){
            return (
                <React.Fragment>
                    <Row className="pt-4">
                        <Col md={10} className="text-left text-muted">
                        всего задач найдено: <i>{this.state.listTasksFound.tntf}</i>
                        </Col>
                        <Col md={2} className="text-right"></Col>
                    </Row>
                </React.Fragment>
            );        
        }

        return (
            <React.Fragment>
                <Row className="pt-4">
                    <Col md={10} className="text-left text-muted">
                    всего задач найдено: <i>{this.state.listTasksFound.tntf}</i>
                    </Col>
                    <Col md={2} className="text-right">
                        <Button 
                            size="sm" 
                            variant="outline-danger"
                            disabled={this.isDisabledDelete.call(this)}
                            onClick={this.headerClickTable.bind(this, {}, "delete")} >
                            удалить
                        </Button>
                    </Col>
                </Row>
                <Row className="py-2">
                    <Col md={12}>
                        <Table size="sm" striped hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>ID</th>
                                    <th>название</th>
                                    <th>задача добавлена</th>
                                    <th>интервал времени</th>
                                    <th>ip</th>
                                    <th>network</th>
                                    <th>port</th>
                                    <th>фильтрация</th>
                                    <th>выгрузка</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {createTableBody()}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    createPagination(){
        if(this.state.listTasksFound.p.cn <= 1){
            return;
        }

        let listItem = [];
        for(let i = 1; i < this.state.listTasksFound.p.cn+1; i++){       
            listItem.push(
                <Pagination.Item 
                    key={`pag_${i}`} 
                    active={this.state.listTasksFound.p.ccn === i}
                    onClick={this.headerNextItemPagination.bind(this, i)} >
                    {i}
                </Pagination.Item>
            );
        }

        return (
            <Row>
                <Col md={12} className="d-flex justify-content-center">
                    <Pagination size="sm">{listItem}</Pagination>
                </Col>
            </Row>
        );
    }

    render(){
        let taskStringName = "выбранную задачу";
        if((this.state.listCheckboxMarkedTasksDel.size > 1) && (this.state.listCheckboxMarkedTasksDel.size < 5)){
            taskStringName = "выбранные задачи";
        } else if(this.state.listCheckboxMarkedTasksDel.size > 4){
            taskStringName = "выбранных задач";
        }

        return (
            <React.Fragment>
                <Row>
                    <Col md={12} className="text-left text-muted">поиск задач</Col>
                </Row>
                <CreateBodySearchTask 
                    socketIo={this.props.socketIo} 
                    listSources={this.props.listItems.listSources}
                    handlerButtonSearch={this.handlerButtonSearch} />
                {this.createTableListDownloadFile.call(this)}
                {this.createPagination.call(this)}

                <ModalWindowShowInformationTask 
                    show={this.state.showModalWindowShowTaskInformation}
                    onHide={this.handlerCloseModalWindowShowTaskInformation}
                    socketIo={this.props.socketIo}
                    shortTaskInfo={this.state.shortTaskInformation} />
                <ModalWindowAddFilteringTask 
                    show={this.state.showModalWindowFiltration}
                    onHide={this.handlerCloseModalWindowFiltration}
                    listSources={this.state.listSources}
                    currentFilteringParameters={this.state.currentFilteringParameters}
                    handlerButtonSubmit={this.handlerButtonSubmitWindowFilter} />
                <ModalWindowConfirmMessage 
                    show={this.state.showModalWindowDeleteTask}
                    onHide={this.closeModalWindowTasksDelete}
                    msgBody={`Вы действительно хотите удалить ${this.state.listCheckboxMarkedTasksDel.size} ${taskStringName}`}
                    msgTitle={"Удаление"}
                    nameDel={""}
                    handlerConfirm={this.handlerTaskDelete} />
            </React.Fragment>
        );
    }
}

CreatePageSearchTasks.propTypes = {
    socketIo: PropTypes.object.isRequired,
    listItems: PropTypes.object.isRequired,
}; 

ReactDOM.render(<CreatePageSearchTasks
    socketIo={socket}
    listItems={receivedFromServer} />, document.getElementById("main-page-content"));
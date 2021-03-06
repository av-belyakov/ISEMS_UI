import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Pagination as Paginationmui } from "@material-ui/lab";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import PropTypes from "prop-types";

import { helpers } from "../common_helpers/helpers";
import ListNetworkParameters from "../commons/listNetworkParameters.jsx";

export default class CreateBodyDownloadFiles extends React.Component {
    constructor(props){
        super(props);
    }

    headerClickTable(objData, type, e){
        if(type === "info"){
            this.props.handlerModalWindowShowTaskTnformation(objData);
            
            this.props.socketIo.emit("network interaction: show info about all task", {
                arguments: { taskID: objData.taskID } 
            });
        } else {
            this.props.handlerShowModalWindowListFileDownload(objData);

            this.props.socketIo.emit("network interaction: get a list of files for a task", {
                arguments: { 
                    taskID: objData.taskID,
                    partSize: 25,
                    offsetListParts: 0,
                } 
            });
        }
    }

    headerNextItemPagination(obj, num){
        if(this.props.listFileDownloadOptions.p.ccn === num){
            return;
        }

        this.props.socketIo.emit("network interaction: get next chunk list tasks files not downloaded", {
            taskID: this.props.currentTaskID,
            chunkSize: this.props.listFileDownloadOptions.p.cs,
            nextChunk: num,
        });
    }

    createPaginationMUI(){
        if(this.props.listFileDownloadOptions.p.cn <= 1){
            return;
        }

        return (
            <Row>
                <Col md={12} className="d-flex justify-content-center">
                    <Paginationmui 
                        size="small"
                        color="primary"
                        variant="outlined"
                        count={this.props.listFileDownloadOptions.p.cn}
                        onChange={this.headerNextItemPagination.bind(this)}
                        page={this.props.listFileDownloadOptions.p.ccn}
                        boundaryCount={2}
                        siblingCount={0}
                        showFirstButton
                        showLastButton >
                    </Paginationmui>
                </Col>
            </Row>
        );
    }

    createTableListDownloadFile(){
        let createTableBody = () => {
            if((typeof this.props.listFileDownloadOptions.slft === "undefined") || (this.props.listFileDownloadOptions.slft.length === 0)){
                return;
            }

            let num = 0;
            if(this.props.listFileDownloadOptions.p.ccn > 1){
                num = (this.props.listFileDownloadOptions.p.ccn - 1) * this.props.listFileDownloadOptions.p.cs;
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
            let formaterInt = new Intl.NumberFormat();

            this.props.listFileDownloadOptions.slft.forEach((item) => {
                let dataInfo = { taskID: item.tid, sourceID: item.sid, sourceName: item.sn };
                let tsffarf = helpers.changeByteSize(item.tsffarf);

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
                    <td className="align-middle my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_time`}>
                        <div><small>{formatterDate.format(item.pf.dt.s*1000)}</small></div>
                        <div><small>{formatterDate.format(item.pf.dt.e*1000)}</small></div>
                    </td>
                    <td className="align-middle my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_proto`}>
                        <small>{item.pf.p}</small>
                    </td>
                    <td className="my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_ip`}>
                        <small><ListNetworkParameters type={"ip"} item={item.pf.f.ip} listInput={[]} /></small>
                    </td>
                    <td className="my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_network`}>
                        <small><ListNetworkParameters type={"nw"} item={item.pf.f.nw} listInput={[]} /></small>
                    </td>
                    <td className="my_line_spacing clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_port`}>
                        <small><ListNetworkParameters type={"pt"} item={item.pf.f.pt} listInput={[]} /></small>
                    </td>
                    <td className="align-middle clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_search_file`}>
                        <small>{`${formaterInt.format(item.nffarf)} (${formaterInt.format(item.nfd)})`}</small>
                    </td>
                    <td className="align-middle clicabe_cursor" onClick={this.headerClickTable.bind(this, dataInfo, "info")} key={`tr_${item.tid}_size_search_files`}>
                        <small>{tsffarf.size} {tsffarf.name}</small>
                    </td>
                    <td className="align-middle" onClick={this.headerClickTable.bind(this, dataInfo, "download")}>
                        <a href="#">
                            <CloudDownloadIcon style={{ fontSize: 25 }} />
                        </a>
                    </td>
                </tr>);
            });

            return tableBody;
        };

        if(this.props.listFileDownloadOptions.tntf === 0){
            return (
                <React.Fragment>
                    <Row className="py-2"></Row>    
                </React.Fragment>
            );        
        }

        return (
            <Row className="py-2">
                <Col>
                    <Table size="sm" striped hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th className="my_line_spacing">ID</th>
                                <th className="my_line_spacing">название</th>
                                <th className="my_line_spacing">интервал времени</th>
                                <th className="my_line_spacing">сет. протокол</th>
                                <th className="my_line_spacing">ip</th>
                                <th className="my_line_spacing">network</th>
                                <th className="my_line_spacing">port</th>
                                <th className="my_line_spacing">файлы найденны (выгружены)</th>
                                <th className="my_line_spacing">общим размером</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {createTableBody()}
                        </tbody>
                    </Table>
                </Col>
            </Row>    
        );
    }

    render(){
        let pagination = this.createPaginationMUI.call(this);

        return (
            <React.Fragment>
                <Row className="text-right">
                    <Col className="text-muted mt-3">
                    задач, по которым не выполнялась выгрузка файлов: <i>{this.props.listFileDownloadOptions.tntf}</i>
                    </Col>
                </Row>
                {pagination}
                {this.createTableListDownloadFile.call(this)}
                {pagination}
            </React.Fragment>
        );
    }
}


CreateBodyDownloadFiles.propTypes = {
    socketIo: PropTypes.object.isRequired,
    currentTaskID: PropTypes.string.isRequired,
    listFileDownloadOptions: PropTypes.object.isRequired,
    handlerModalWindowShowTaskTnformation: PropTypes.func.isRequired,
    handlerShowModalWindowListFileDownload: PropTypes.func.isRequired,
};
import React from "react";
import { Button, Badge, Card, Col, Form, Row } from "react-bootstrap";
import PropTypes from "prop-types";

import ModalWindowAddEntity from "../../modal_windows/modalWindowAddEntity.jsx";

class ButtonSaveNewEntity extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        if(!this.props.showButton){
            return <div></div>;
        }

        return <Button onClick={this.props.handler} variant="outline-success" size="sm">сохранить</Button>;
    }
}

ButtonSaveNewEntity.propTypes = {
    showButton: PropTypes.bool,
    handler: PropTypes.func.isRequired,
};

export default class CreateBodyNewEntity extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            addedNewEntity: false,
            showModalWindow: false,
            chosenDivisionID: null,
            chosenOrganizationID: null,
            listOrganizationName: this.createListOrganization.call(this, this.props.listShortEntity),
            listDivisionName: this.createListDivision.call(this, this.props.listShortEntity),
            listNewEntity: [],
        };

        this.modalWindowSettings = {
            type: "",
            name: "",
            listFieldActivity: this.props.listFieldActivity,
        };

        this.handlerAddEntity = this.handlerAddEntity.bind(this);
        this.handelrButtonAdd = this.handelrButtonAdd.bind(this);
        this.closeModalWindow = this.closeModalWindow.bind(this);

        this.listenerSocketIoConn = this.listenerSocketIoConn.call(this);

        this.createNewSource = this.createNewSource.bind(this);
        this.createNewDivision = this.createNewDivision.bind(this);
        this.createNewOrganization = this.createNewOrganization.bind(this);
        
        this.createListElementDivision = this.createListElementDivision.bind(this);
        this.createListElementOrganization = this.createListElementOrganization.bind(this);
    }

    componentDidMount() {
        this.elOrg = $("#select_list_organization");
        this.elDiv = $("#select_list_division");
       
        this.elOrg.select2({
            placeholder: "добавить организацию",
            maximumInputLength: 10,
        });

        this.elDiv.select2({
            placeholder: "добавить подразделение",
            maximumInputLength: 10,
        });
    
        this.elOrg.on("change", this.selectedOrganization.bind(this));
        this.elDiv.on("change", this.selectedDivision.bind(this));
    }

    handelrButtonAdd(){
        let typeEntity = "source";

        if(this.state.chosenOrganizationID === null){
            typeEntity = "organization";
        } else if(this.state.chosenOrganizationID !== null && this.state.chosenDivisionID === null){
            typeEntity = "division";
        }

        this.showModalWindow.call(this, typeEntity);
    }

    showModalWindow(typeEntity){
        const listTypeEntity = {
            "organization": {
                name: "организацию",
            },
            "division": {
                name: "подразделение или филиал",
            },
            "source": {
                name: "источник",
            },
        };

        this.resultBody = this.resultBody.bind(this);
        this.sendInfoNewEntity = this.sendInfoNewEntity.bind(this);

        this.modalWindowSettings.type = typeEntity;
        this.modalWindowSettings.name = listTypeEntity[typeEntity].name;
        
        this.setState({ showModalWindow: true });    
    }

    closeModalWindow(){
        this.setState({ showModalWindow: false });
    }

    selectedOrganization(e){
        let v = (e.target.value === "all") ? null: e.target.value;

        this.setState({ chosenOrganizationID: v });
        this.setState({ chosenDivisionID: null });
    }

    selectedDivision(e){
        let oid = null;
        let v = (e.target.value === "all") ? null: e.target.value;
        this.setState({ chosenDivisionID: v });

        for(let key in this.state.listDivisionName){   
            if(this.state.listDivisionName[key].did === v){   
                oid = this.state.listDivisionName[key].oid;
    
                break;
            }
        }                
        
        if(this.state.chosenOrganizationID === null){
            this.setState({ chosenOrganizationID: oid });
        }
    }

    createListOrganization(listShortEntity){
        let listOrg = listShortEntity.shortListOrganization.map((item) => {
            return { name: item.name, id: item.id };
        });
 
        listOrg.sort((a, b) => {
            if(a.name > b.name) return 1;
            if(a.name === b.name) return 0;
            if(a.name < b.name) return -1;
        });

        return listOrg;
    }

    createListDivision(listShortEntity){
        let listDivName = listShortEntity.shortListDivision.map((item) => {
            return {
                name: item.name,
                did: item.id,
                oid: item.id_organization,
            };
        });

        listDivName.sort((a, b) => {
            if(a.name > b.name) return 1;
            if(a.name === b.name) return 0;
            if(a.name < b.name) return -1;
        });

        return listDivName;
    }

    createListElementOrganization(){
        return (
            <Form.Group>
                <Form.Label>Организация</Form.Label>
                <Form.Control as="select" size="sm" id="select_list_organization">
                    <option value="all" key={"select_organization_option_none"}>добавить организацию</option>
                    {this.state.listOrganizationName.map((item) => {
                        return <option value={item.id} key={`select_${item.id}_option`}>{item.name}</option>;
                    })}
                </Form.Control>
            </Form.Group>
        );
    }
    
    createListElementDivision(){
        let listOptions = this.state.listDivisionName.map((item) => {
            let isEqual = this.state.chosenOrganizationID === item.oid;

            if(isEqual || this.state.chosenOrganizationID === null || this.state.chosenOrganizationID === "all"){      
                return <option value={item.did} key={`select_${item.did}_option`}>{item.name}</option>;
            }
        });

        return (
            <Form.Group>
                <Form.Label>Подразделение или филиал организации</Form.Label>
                <Form.Control as="select" size="sm" id="select_list_division">
                    <option value="all" key={"select_division_option_none"}>добавить подразделение</option>
                    {listOptions}
                </Form.Control>
            </Form.Group>
        );
    }

    handlerAddEntity(objInfo){
        switch(objInfo.windowType){
        case "organization":
            this.createNewOrganization(objInfo.options);
            
            break;

        case "division":
            this.createNewDivision(objInfo.options);

            break;

        case "source":
            this.createNewSource(objInfo.options);
        }
    }

    createNewOrganization(options){
        //обновляем список организаций
        let updateOrgName = this.state.listOrganizationName;

        //проверяем наличие организации с таким же названием
        for(let i = 0; i < updateOrgName.length; i++){
            if(updateOrgName[i].name === options.organizationName){
                return;
            }
        }

        updateOrgName.push({ 
            name: options.organizationName, 
            id: options.id,
        });
        updateOrgName.sort((a, b) => {
            if(a.name > b.name) return 1;
            if(a.name === b.name) return 0;
            if(a.name < b.name) return -1;
        });

        this.setState({ listOrganizationName: updateOrgName });
        
        let listNewEntity = this.state.listNewEntity;
        listNewEntity.push({
            id_organization: options.id,
            name: options.organizationName,
            legal_address: options.legalAddress,
            field_activity: options.fieldActivity,
            division_or_branch_list_id: [],
        });
        this.setState({ listNewEntity: listNewEntity });

        //говорим что добавилась новая организация (отображение кнопки "Сохранить")
        this.setState({ addedNewEntity: true });
    }

    createNewDivision(options){
        let isExist = false;
        let newRecord = {
            id_organization: options.parentID,
            id_division: options.id,
            name: options.divisionName,
            physical_address: options.physicalAddress,
            description: options.description,
            source_list: [],
        };

        //обновляем список подразделений
        let updateDiviName = this.state.listDivisionName;
        updateDiviName.push({
            name: options.divisionName,
            did: options.id,
            oid: options.parentID,
        });

        updateDiviName.sort((a, b) => {
            if(a.name > b.name) return 1;
            if(a.name === b.name) return 0;
            if(a.name < b.name) return -1;
        });

        updateDiviName[options.divisionName] = {
            did: options.id,
            oid: options.parentID,
        };
        this.setState({ listDivisionName: updateDiviName });

        let listNewEntity = this.state.listNewEntity;

        for(let i = 0; i < listNewEntity.length; i++){
            //ищем объект организации в listNewEntity
            if((typeof listNewEntity[i].division_or_branch_list_id !== "undefined") && (listNewEntity[i].id_organization === options.parentID)){
                listNewEntity[i].division_or_branch_list_id.push(newRecord);
                isExist = true;

                break;
            }
        }

        //если не нашли организацию просто добавляе в массив
        if(!isExist){
            listNewEntity.push(newRecord);
        }

        this.setState({ listNewEntity: listNewEntity });
        this.setState({ addedNewEntity: true });
    }

    createNewSource(options){
        let isExist = false;
        let newRecord = {
            id_division: options.parentID,
            id_source: options.id,
            source_id: options.sourceID,
            short_name: options.shortName,
            network_settings: {
                ipaddress: options.ipAddress,
                port: options.port,
                token_id: options.token,
            },
            source_settings: { 
                type_architecture_client_server: options.architecture,
                transmission_telemetry: options.telemetry,
                maximum_number_simultaneous_filtering_processes: options.maxSimultaneousProc,
                type_channel_layer_protocol: options.networkChannel,
                list_directories_with_file_network_traffic: options.directoriesNetworkTraffic,
            },
            description: options.description,
        };

        let addNewSource = function(listNewEntity){
            for(let i = 0; i < listNewEntity.length; i++){
                //ищем объект организации в listNewEntity
                if((typeof listNewEntity[i].id_organization !== "undefined") && (listNewEntity[i].id_division === options.parentID)){
                    listNewEntity[i].source_list.push(newRecord);
                    isExist = true;
    
                    break;
                }

                if((typeof listNewEntity[i].division_or_branch_list_id !== "undefined") || Array.isArray(listNewEntity[i].division_or_branch_list_id)){
                    addNewSource(listNewEntity[i].division_or_branch_list_id);
                }
            }
        };

        let listNewEntity = this.state.listNewEntity;
        addNewSource(listNewEntity);

        //если не нашли организацию просто добавляе в массив
        if(!isExist){
            listNewEntity.push(newRecord);
        }

        this.setState({ listNewEntity: listNewEntity });
        this.setState({ addedNewEntity: true });
    }

    resultBody(){
        let i = 0;
        let getTextBody = (listEmtity, textResult, parents) => {
            if((typeof listEmtity.id_organization !== "undefined") && (typeof listEmtity.id_division === "undefined")){
                textResult.push(<div key={`org_l_${i}`}>Организация:&nbsp;<Badge variant="info">{listEmtity.name}</Badge></div>);
                parents = "organization";
            }

            if(parents === "none") {
                if((typeof listEmtity.id_division !== "undefined") && (typeof listEmtity.id_source === "undefined")){                
                    textResult.push(<div key={`div_l_${i}`}>Подразделение или филиал:&nbsp;<Badge variant="info">{listEmtity.name}</Badge></div>);
                } 
    
                if(typeof listEmtity.id_source !== "undefined"){
                    textResult.push(<div key={`sour_l_${i}`}>Источник:&nbsp;<Badge variant="info">{listEmtity.source_id} - {listEmtity.short_name}</Badge></div>);
                } 
            } else {
                if((typeof listEmtity.id_division !== "undefined") && (typeof listEmtity.id_source === "undefined")){                
                    textResult.push(<div key={`div_l_${i}`}>
                        &#8195;Подразделение или филиал:&nbsp;<Badge variant="dark">{listEmtity.name}</Badge>
                        &nbsp;<a onClick={this.delAddedElem.bind(this, listEmtity.id_division)} className="clickable_icon" href="#"><img src="./images/icons8-delete-16.png"></img></a>
                    </div>);
                } 
    
                if(parents === "organization"){
                    if(typeof listEmtity.id_source !== "undefined"){
                        textResult.push(<div key={`sour_l_${i}`}>
                            &#8195;&#8195;Источник:&nbsp;<Badge variant="dark">{listEmtity.source_id} - {listEmtity.short_name}</Badge>
                            &nbsp;<a onClick={this.delAddedElem.bind(this, listEmtity.id_source)} className="clickable_icon" href="#"><img src="./images/icons8-delete-16.png"></img></a>
                        </div>);
                    }
                } else {
                    if(typeof listEmtity.id_source !== "undefined"){
                        textResult.push(<div key={`sour_l_${i}`}>
                            &#8195;Источник:&nbsp;<Badge variant="dark">{listEmtity.source_id} - {listEmtity.short_name}</Badge>
                            &nbsp;<a onClick={this.delAddedElem.bind(this, listEmtity.id_source)} className="clickable_icon" href="#"><img src="./images/icons8-delete-16.png"></img></a>
                        </div>);
                    }
                }
            }                

            if(parents !== "organization") {
                parents = "division";
            }

            if(Array.isArray(listEmtity.division_or_branch_list_id) && listEmtity.division_or_branch_list_id.length > 0){
                textResult.push(listEmtity.division_or_branch_list_id.map((item) => getTextBody(item, [], parents)));
            }

            if(Array.isArray(listEmtity.source_list) && listEmtity.source_list.length > 0){
                textResult.push(listEmtity.source_list.map((item) => getTextBody(item, [], parents)));
            }

            return textResult;
        };

        let num = 0;
        return this.state.listNewEntity.map((item) => {
            let delForID = "";

            if(typeof item.id_organization !== "undefined"){
                delForID = item.id_organization;
            } else if ((typeof item.id_division !== "undefined") && (typeof item.id_source === "undefined")) {
                delForID = item.id_division;
            } else if (typeof item.id_source !== "undefined") {
                delForID = item.id_source;
            }

            return (
                <React.Fragment key={`toast_id_${num++}`}>
                    <Card>
                        <blockquote className="text-left blockquote mb-0 card-body">
                            {getTextBody(item, [], "none")}
                            <footer>
                                <br/><Button onClick={this.delAddedElem.bind(this, delForID)} size="sm" variant="outline-danger">удалить</Button>
                            </footer>
                        </blockquote>
                    </Card>
                    <br/>
                </React.Fragment>
            );
        });
    }

    delAddedElem(elemID){
        function findAndDeleteItemByID(listEntity, listOrg, listDiv, id) {
            let iterator = (obj, func) => {
                let newObj = {};
                for(let key in obj){
                    if(func(obj[key])){
                        newObj[key] = obj[key];
                    }
                }

                return newObj;
            };

            let listNameID = ["id_organization", "id_division", "id_source"];
            let searchIDAndDel = (listEntity, id) => {      
                for(let i = 0; i < listEntity.length; i++){
                    for(let name in listEntity[i]){
                        if(listNameID.includes(name)){   
                            if(listEntity[i][name] && listEntity[i][name] === id){   
                                listEntity.splice(i, 1);

                                if(name === "id_organization"){
                                    listOrg = iterator(listOrg, (value) => value !== id);
                                    listDiv = iterator(listDiv, (value) => value.oid !== id);
                                } 
                                if(name === "id_division"){
                                    listDiv = iterator(listDiv, (value) => value.did !== id);
                                }
    
                                return;
                            }   
                        }
        
                        if(Array.isArray(listEntity[i][name]) && listEntity[i][name].length > 0){
                            searchIDAndDel(listEntity[i][name], id);
                        }
                    }
                }
            };
            searchIDAndDel(listEntity, id);

            return {
                listEntity: listEntity,
                listOrganization: listOrg, 
                listDivision: listDiv,
            };
        }

        const COUNT_ORGANIZATION_NAME = Object.keys(this.state.listOrganizationName).length;
        const COUNT_DIVISION_NAME = Object.keys(this.state.listDivisionName).length;

        let modifiedObject = findAndDeleteItemByID(this.state.listNewEntity, this.state.listOrganizationName, this.state.listDivisionName, elemID);

        //изменяем тип открываемого модального окна если были изменения в объектах-списках 
        if(COUNT_ORGANIZATION_NAME > Object.keys(modifiedObject.listOrganization).length){
            this.setState({ chosenOrganizationID: null });
        }
        if(COUNT_DIVISION_NAME > Object.keys(modifiedObject.listDivision).length){
            this.setState({ chosenDivisionID: null });
        }

        this.setState({ listNewEntity: modifiedObject.listEntity });
        this.setState({ listOrganizationName: modifiedObject.listOrganization });
        this.setState({ listDivisionName: modifiedObject.listDivision });

        //убираем кнопку 'сохранить'
        if(modifiedObject.listEntity.length === 0){
            this.setState({ addedNewEntity: false });
        }
    }

    sendInfoNewEntity(){
        this.props.socketIo.emit("add new entitys", {
            actionType: "add new",
            arguments: this.state.listNewEntity,
        });

        //очищаем список добавляемых объектов
        this.setState({ listNewEntity: [] });

        //убираем кнопку 'сохранить'
        this.setState({ addedNewEntity: false });
    }

    listenerSocketIoConn(){
        this.props.socketIo.on("entity: new short source list", (data) => {
            this.setState({ listOrganizationName: this.createListOrganization.call(this, data.arguments) });
            this.setState({ listDivisionName: this.createListDivision.call(this, data.arguments) });
        });
    }

    render(){
        return (
            <React.Fragment>
                <br/>
                <div className="row">
                    <div className="col-md-12 text-left">
                        <Form>
                            <Row>
                                <Col>{this.createListElementOrganization()}</Col>
                                <Col>{this.createListElementDivision()}</Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-right">
                        <Button size="sm" variant="outline-primary" onClick={this.handelrButtonAdd}>Новая сущность</Button>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12">
                        {this.resultBody()}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-right">
                        <ButtonSaveNewEntity 
                            handler={this.sendInfoNewEntity} 
                            showButton={this.state.addedNewEntity} />
                    </div>
                </div>

                <ModalWindowAddEntity 
                    show={this.state.showModalWindow}
                    onHide={this.closeModalWindow}
                    userPermissions={this.props.userPermissions}
                    settings={this.modalWindowSettings}
                    parentDivisionID={this.state.chosenDivisionID}
                    parentOrganizationID={this.state.chosenOrganizationID}
                    handlerAddButton={this.handlerAddEntity} />
            </React.Fragment>
        );
    }
}

CreateBodyNewEntity.propTypes ={
    socketIo: PropTypes.object.isRequired,
    userPermissions: PropTypes.object.isRequired,
    listShortEntity: PropTypes.object.isRequired,
    listFieldActivity: PropTypes.array.isRequired,
};
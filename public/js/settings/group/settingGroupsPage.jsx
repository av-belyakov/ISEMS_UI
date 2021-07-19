/**
 * Модуль формирующий основную таблицу на странице
 * 
 * Версия 0.3, дата релиза 14.01.2020
 */

"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Alert, Button, Table } from "react-bootstrap";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";
import ModalWindowAddNewGroup from "../../modal_windows/modalWindowAddNewGroup.jsx";
import { ModalWindowConfirmMessage } from "../../commons/modalWindowConfirmMessage.jsx";

//перечисление типов действий доступных для администратора
class CreateListCategoryMain extends React.Component {
    render() {
        let itemName = " ";
        if(typeof this.props.list.name !== "undefined"){
            itemName = <strong>{this.props.list.name}</strong>;
        }

        let liNoMarker = { "listStyleType": "none" };

        let isMenuItem = this.props.parameters.typeItem === "menu_items";
        let moreThanTree = this.props.parameters.countSend === 3;

        let createCategoryValue = <CreateCategoryValue
            list={this.props.list}
            listOtherGroup={this.props.listOtherGroup}
            parameters={this.props.parameters} 
            handleCheckedItem={this.props.handleCheckedItem} />;

        if (this.props.parameters.group === "administrator") {
            if (this.props.parameters.first) {
                return (
                    <ul className="text-left">
                        {itemName}
                        <ul style={liNoMarker}>
                            {createCategoryValue}
                        </ul>
                    </ul>
                );
            }

            if (isMenuItem || moreThanTree) {
                return (
                    <div>
                        {itemName}
                        <ul style={liNoMarker}>
                            {createCategoryValue}
                        </ul>
                    </div>
                );
            }

            return (
                <React.Fragment>
                    {itemName}
                    {createCategoryValue}
                </React.Fragment>
            );
        }

        if ((this.props.parameters.first) || isMenuItem || moreThanTree) {
            return <div>&nbsp;{createCategoryValue}</div>;
        }

        return createCategoryValue;
    }
}

CreateListCategoryMain.propTypes = {
    list: PropTypes.object.isRequired,
    listOtherGroup: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired,
    handleCheckedItem: PropTypes.func.isRequired,
};

//перечисление значений 
class CreateCategoryValue extends React.Component {
    render() {
        let arrItems = [];
        let parameters = {
            "group": this.props.parameters.group,
            "typeItem": this.props.parameters.typeItem,
            "first": false
        };

        for (let item in this.props.list) {
            if (item === "name" || item === "id") continue;

            if (typeof this.props.list[item].status === "undefined") {
                parameters.countSend = this.props.parameters.countSend + 1;

                arrItems.push(
                    <CreateListCategoryMain
                        list={this.props.list[item]}
                        listOtherGroup={this.props.listOtherGroup}
                        parameters={parameters}
                        handleCheckedItem={this.props.handleCheckedItem}
                        key={`return_${this.props.list[item].id}`} />
                );

                continue;
            }

            if (this.props.parameters.group === "administrator") {
                arrItems.push(
                    <div key={`div_${this.props.list[item].id}`}>
                        <input
                            type="checkbox"
                            disabled="disabled"
                            defaultChecked={this.props.list[item].status}
                            name="checkbox_administrator" />&nbsp;                        
                        {this.props.list[item].description}
                    </div>
                );

                continue;
            }

            let groupObj = this.props.listOtherGroup[this.props.parameters.group][this.props.list[item].id];
            arrItems.push(
                <div key={`div_${groupObj.keyID}`}>
                    <input
                        type="checkbox"
                        defaultChecked={groupObj.status}
                        onClick={this.props.handleCheckedItem.bind(null, {
                            groupName: this.props.parameters.group,
                            id: this.props.list[item].id,
                            keyID: groupObj.keyID,
                        })}
                        name={`checkbox_${this.props.parameters.group}`} />&nbsp;
                </div>
            );
        }

        return arrItems;
    }
}

CreateCategoryValue.propTypes = {
    list: PropTypes.object.isRequired,
    listOtherGroup: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired,
    handleCheckedItem: PropTypes.func.isRequired,
};

//кнопка 'добавить' новую группу
class ButtonAddGroup extends React.Component {
    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
    }

    handleShow() {
        this.props.handlerShowModal();
    }

    render() {
        let disabledCreate = (this.props.access.create.status) ? "" : "disabled";

        return (
            <Button
                variant="outline-primary"
                size="sm"
                onClick={this.handleShow.bind(this)}
                disabled={disabledCreate} >
                добавить
            </Button>
        );
    }
}

ButtonAddGroup.propTypes = {
    access: PropTypes.object.isRequired,
    handlerShowModal: PropTypes.func.isRequired,
    groupListElement: PropTypes.object.isRequired
};

//кнопка 'сохранить изменение параметров группы'
class ButtonEdit extends React.Component {
    render() {
        return (
            <Button
                variant="outline-dark"
                size="sm"
                onClick={this.props.handleUpdateGroup}
                disabled={this.props.disabledEdit}>
                сохранить
            </Button>
        );
    }
}

ButtonEdit.propTypes = { 
    disabledEdit: PropTypes.string.isRequired,
    handleUpdateGroup: PropTypes.func.isRequired,
};

//кнопка 'удалить группу'
class ButtonDelete extends React.Component {
    render() {
        return (
            <Button
                variant="outline-danger"
                size="sm"
                onClick={this.props.handleDeleteGroup}
                disabled={this.props.disabledDelete}>
                удалить
            </Button>
        );
    }
}

ButtonDelete.propTypes = { 
    disabledDelete: PropTypes.string.isRequired,
    handleDeleteGroup: PropTypes.func.isRequired,
};

//перечисление групп
class EnumGroupName extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let styleGroupName = {
            "paddingBottom": "13px"
        };

        let disabledDelete = (!this.props.accessRights.delete.status) ? "disabled" : "";

        let bEdit, bDel;
        let textCenter = "text-left";
        let butAddGroup = <ButtonAddGroup
            access={this.props.accessRights}
            handlerShowModal={this.props.handlerShowModal}
            groupListElement={this.props.listAdmin.elements} />;

        let arrGroup = this.props.groupsName.map(group => {
            let disabledEdit = (this.props.accessRights.edit.status && group.allowChange) ? "":"disabled";

            if (group.groupName.toLowerCase() !== "administrator") {
                bDel = <ButtonDelete disabledDelete={disabledDelete} handleDeleteGroup={this.props.handleDeleteGroup.bind(this, group.groupName)} />;
                bEdit = <ButtonEdit disabledEdit={disabledEdit} handleUpdateGroup={this.props.handleUpdateGroup.bind(this, group.groupName)} />;
                textCenter = "text-center";
                styleGroupName.paddingBottom = "";
                butAddGroup = "";
            }

            return (
                <th className={textCenter} style={styleGroupName} key={`group_name_${group.groupName}`}>
                    {group.groupName}&nbsp;
                    <div>{butAddGroup}&nbsp;{bEdit}&nbsp;{bDel}</div>
                </th>
            );
        });

        return arrGroup;
    }
}

EnumGroupName.propTypes = {
    groupsName: PropTypes.array.isRequired,
    listAdmin: PropTypes.object.isRequired,
    accessRights: PropTypes.object.isRequired,
    handlerShowModal: PropTypes.func.isRequired,
    handleDeleteGroup: PropTypes.func.isRequired,
    handleUpdateGroup: PropTypes.func.isRequired,
};

//вывод даты создания группы
class ShowDateCreateGroup extends React.Component {
    render() {
        let dateCreate = this.props.groupsName.map(group => {
            let text = "";
            let textCenter = "text-center";

            if (group.groupName === "administrator") {
                text = "группа создана: ";
                textCenter = "text-left";
            }

            let [dateString,] = helpers.getDate(group.dateRegister).split(" ");
            let [year, month, day] = dateString.split("-");
            let dateCreate = `${day}.${month}.${year}`;

            return (
                <th className={textCenter} key={`date_create_${group.groupName}`}>
                    {`${text} ${dateCreate}`}
                </th>
            );
        });

        return dateCreate;
    }
}

ShowDateCreateGroup.propTypes = {
    groupsName: PropTypes.array.isRequired,
};

class CreateBodyElement extends React.Component {
    constructor(props){
        super(props);
    }

    createElement() {
        let { groupsName, listAdmin, listOtherGroup, handleCheckedItem } = this.props;

        let arrTmp = [];

        console.log("func 'CreateBodyElement'");
        console.log(listAdmin);

        for (let item in listAdmin.elements) {           
            let arrTd = groupsName.map(group => {
                let listCategoryParameters = {
                    "group": group.groupName,
                    "countSend": 0,
                    "typeItem": item,
                    "first": true
                };

                if(group.groupName === "administrator"){
                    return (
                        <td key={`td_${group.groupName}_${listAdmin.elements[item].id}`}>
                            <CreateListCategoryMain
                                list={listAdmin.elements[item]}
                                listOtherGroup={listOtherGroup}
                                parameters={listCategoryParameters}
                                handleCheckedItem={handleCheckedItem}
                                key={listAdmin.elements[item].id} />
                        </td>
                    );    
                }

                return (
                    <td key={`td_${group.groupName}_${listAdmin.elements[item].id}`}>
                        <CreateListCategoryMain
                            list={listAdmin.elements[item]}
                            listOtherGroup={listOtherGroup}
                            parameters={listCategoryParameters}
                            handleCheckedItem={handleCheckedItem}
                            key={listAdmin.elements[item].id} />
                    </td>
                );
            });

            arrTmp.push(<tr key={`tr_${listAdmin.elements[item].id}`}>{arrTd}</tr>);
        }

        return arrTmp;
    }

    render() {
        return this.createElement.call(this);
    }
}

CreateBodyElement.propTypes = {
    groupsName: PropTypes.array.isRequired,
    listAdmin: PropTypes.object.isRequired,
    listOtherGroup: PropTypes.objectOf(PropTypes.object).isRequired,
    handleCheckedItem: PropTypes.func.isRequired,
};

//создание основной таблицы
class CreateTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalConfirm: {
                show: false,
                groupName: "",
            },
            modalWindowAddShow: false,
            groupsName: this.getGroupsName(),
        };

        this.groupsAdministrator = this.props.mainInformation.administrator;
        this.listOtherGroup = this.changeListGroupsInformation(this.props.mainInformation);
        this.mapCountSelected = this.countCheckItem();

        this.handleCheckedItem = this.handleCheckedItem.bind(this);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose= this.handleClose.bind(this);
        this.addNewGroup = this.addNewGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.handleAddNewGroup = this.handleAddNewGroup.bind(this);
        this.handleUpdateGroup = this.handleUpdateGroup.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);

        this.handlerModalConfirmShow = this.handlerModalConfirmShow.bind(this);
        this.handlerModalConfirmClose = this.handlerModalConfirmClose.bind(this);

        this.addListeners();
    }

    handleShow() {
        this.setState({ modalWindowAddShow: true });
    }

    handleClose() {
        this.setState({ modalWindowAddShow: false });
    }

    handleAddNewGroup(data) {
        this.props.socketIo.emit("add new group", {
            actionType: "create",
            arguments: data
        });
    }

    handleDeleteGroup(){
        this.props.socketIo.emit("delete group", {
            actionType: "delete",
            arguments: {
                groupName: this.state.modalConfirm.groupName,
            },
        });

        this.handlerModalConfirmClose();
    }

    handleUpdateGroup(groupName){
        //обновляем количество выбранных элементов
        this.mapCountSelected.set(groupName, this.getCountSelectedItem(this.listOtherGroup[groupName]));

        //устанавливаем кнопку Edit как не активную
        this.chageStateEditButton(groupName, false);

        this.props.socketIo.emit("update group", {
            actionType: "update",
            arguments: {
                groupName: groupName,
                listPossibleActions: this.listOtherGroup[groupName],
            },
        });
    }

    handleCheckedItem(data, e){
        for(let groupName in this.listOtherGroup){
            if(groupName !== data.groupName) continue;
            
            for(let ID in this.listOtherGroup[groupName]){
                if((ID === data.id) && (this.listOtherGroup[groupName][ID].keyID === data.keyID)){
                    this.listOtherGroup[groupName][ID].status = e.target.checked;

                    let countSelectedBefore = this.getCountSelectedItem(this.listOtherGroup[groupName]);
                    let countSelectedAfter = this.mapCountSelected.get(groupName);

                    if(countSelectedAfter === "undefined") return;
                    if(countSelectedAfter === countSelectedBefore){
                        //Кнопка Edit неактивна
                        this.chageStateEditButton(groupName, false);
                    } else {
                        //Кнопка Edit активна
                        this.chageStateEditButton(groupName, true);
                    }

                    return;
                }
            }   
        }
    }

    handlerModalConfirmShow(groupName){
        let stateCopy = Object.assign({}, this.state);
 
        stateCopy.modalConfirm.show = true;
        stateCopy.modalConfirm.groupName = groupName;
 
        this.setState({stateCopy});
    }

    handlerModalConfirmClose(){
        let stateCopy = Object.assign({}, this.state);
 
        stateCopy.modalConfirm.show = false;
        stateCopy.modalConfirm.groupName = "";
 
        this.setState({stateCopy});
    }

    addListeners(){
        let listEvents = {
            "add new group": newGroup => {
                this.addNewGroup(newGroup);
            },
            "del selected group": delGroup => {
                this.deleteGroup(delGroup);
            },
        };

        for(let event in listEvents){
            this.props.socketIo.on(event, listEvents[event]);
        }
    }

    addNewGroup(newGroup){
        let newGroupObj = JSON.parse(newGroup);
        let groupName = newGroupObj.group_name;

        let newObj = {};
        newObj[groupName]={
            "date_register": newGroupObj["date_register"],
            "elements": newGroupObj[groupName],
        };
        let convertObj = this.changeListGroupsInformation(newObj);

        let stateCopy = Object.assign({}, this.state);
        stateCopy.groupsName.push({
            groupName: groupName,
            dateRegister: newGroupObj["date_register"],
            allowChange: false,
        });

        this.listOtherGroup = Object.assign(this.listOtherGroup, convertObj);
        this.mapCountSelected = this.countCheckItem();

        this.setState({stateCopy});
    }

    deleteGroup(delGroup){
        let groupInfo = JSON.parse(delGroup);

        this.setState({ 
            groupsName: this.state.groupsName.filter(item => item.groupName !== groupInfo.groupName), 
        });
    }

    getGroupsName() {
        let groups = Object.keys(this.props.mainInformation);
        groups.sort();

        let list = [{
            groupName: "administrator",
            dateRegister: this.props.mainInformation["administrator"].date_register,
            allowChange: false,
        }];
        let groupsOtherAdmin = groups.filter(item => item !== "administrator");

        for(let item of groupsOtherAdmin){
            list.push({
                groupName: item,
                dateRegister: this.props.mainInformation[item].date_register,
                allowChange: false,
            });
        }

        return list;
    }

    getCountSelectedItem(listElem){
        let itemNumIsTrue = 0;

        for(let item in listElem){
            if(listElem[item].status) itemNumIsTrue++;
        }

        return itemNumIsTrue;
    }

    countCheckItem(){
        let resultMap = new Map();

        for(let groupName in this.listOtherGroup){
            if(groupName === "administrator") continue;

            let countSelected = this.getCountSelectedItem(this.listOtherGroup[groupName]);
            resultMap.set(groupName, countSelected);
        }

        return resultMap;
    }

    chageStateEditButton(groupName, state){
        let stateCopy = Object.assign({}, this.state);
        for(let i = 0; i < stateCopy.groupsName.length; i++){
            if(stateCopy.groupsName[i].groupName === groupName){
                stateCopy.groupsName[i].allowChange = state;

                break;
            }
        }

        this.setState({stateCopy});
    }

    changeListGroupsInformation(listOtherGroup){
        let obj = {};
        let getElementObject = (groupName, listElement, listAdmin) => {
            for (let key in listAdmin) {              
                if ((typeof listAdmin[key] === "string") || (typeof listAdmin[key] === "number")) continue;
                if ("status" in listAdmin[key]) {
                    obj[groupName][listAdmin[key].id] = {
                        keyID: listElement[key].id,
                        status: listElement[key].status,
                    };

                    continue;
                }

                getElementObject(groupName, listElement[key], listAdmin[key]);
            }
        };

        for(let groupName in listOtherGroup){
            obj[groupName] = {};

            if(groupName === "administrator") continue;

            getElementObject(groupName, listOtherGroup[groupName].elements, this.groupsAdministrator.elements);
        }

        return obj;
    }

    showAlerts() {
        return <Alert variant="danger">Message</Alert>;
    }

    render() {
        return (
            <div>
                <h6 className="text-center">{"управление группами".toUpperCase()}</h6>
                <Table striped hover>
                    <thead>
                        <tr>
                            <ShowDateCreateGroup groupsName={this.state.groupsName} />
                        </tr>
                        <tr>
                            <EnumGroupName
                                groupsName={this.state.groupsName}
                                listAdmin={this.groupsAdministrator}
                                accessRights={this.props.accessRights}
                                handleDeleteGroup={this.handlerModalConfirmShow}
                                handleUpdateGroup={this.handleUpdateGroup} 
                                handlerShowModal={this.handleShow} />
                        </tr>
                    </thead>
                    <tbody>
                        <CreateBodyElement
                            groupsName={this.state.groupsName}
                            listAdmin={this.groupsAdministrator}
                            listOtherGroup={this.listOtherGroup}
                            handleCheckedItem={this.handleCheckedItem} />
                    </tbody>
                </Table>
                <ModalWindowAddNewGroup
                    show={this.state.modalWindowAddShow}
                    onHide={this.handleClose}
                    listelement={this.props.mainInformation.administrator.elements}
                    handleAddNewGroup={this.handleAddNewGroup} />
                <ModalWindowConfirmMessage
                    show={this.state.modalConfirm.show} 
                    onHide={this.handlerModalConfirmClose}
                    nameDel={this.state.modalConfirm.groupName}
                    handlerConfirm={this.handleDeleteGroup}
                    msgTitle={"Удаление"}
                    msgBody={`Вы действительно хотите удалить группу '${this.state.modalConfirm.groupName}'?`} />
            </div>
        );
    }
}

CreateTable.propTypes = {
    socketIo: PropTypes.object.isRequired,
    accessRights: PropTypes.object.isRequired,
    mainInformation: PropTypes.object.isRequired,
};

ReactDOM.render(<CreateTable 
    mainInformation={receivedFromServerMain} 
    accessRights={receivedFromServerAccess}
    socketIo={socket} />, document.getElementById("field_information"));


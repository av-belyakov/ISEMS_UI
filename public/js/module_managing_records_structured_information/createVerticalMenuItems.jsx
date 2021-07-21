import React from "react";
import ReactDOM from "react-dom";
import { Tab, Tabs, Tooltip } from "@material-ui/core";
import { BrowserRouter, Switch as SwitchRouter, Route, Link as LinkRouter, useLocation, useParams, useRouteMatch } from "react-router-dom";
import PropTypes from "prop-types";

import CreatePageReport from "./createPageReport.jsx";
import CreatePageObservedData from "./createPageObservedData.jsx";
import CreatePageMalware from "./createPageMalware.jsx";

export default class CreateVerticalMenuItems extends React.Component {
    constructor(props){
        super(props);

        this.menuItem = {
            "/security_event_management?name=reports": { 
                "num": 0, 
                "label": "доклады", 
                "title": "совокупность данных об угрозах, сосредоточенных на одной или нескольких темах" },
            "/security_event_management?name=observed_data": { 
                "num": 1, 
                "label": "наблюдаемые данные", 
                "title": "информация о сущностях связанных с кибер безопасностью, таких как файлы, системы или сети" },
            "/security_event_management?name=malware": { 
                "num": 2, 
                "label": "вредоносное по", 
                "title": "подробная информация о функционировании вредоносного программного обеспечения" },
            "/security_event_management?name=vulnerability": { 
                "num": 3, 
                "label": "уязвимости", 
                "title": "описание уязвимостей компьютерных систем" },
            "/security_event_management?name=threat_actor": { 
                "num": 4, 
                "label": "субъекты угроз", 
                "title": "информация о физических лицах или их группах и организациях которые могут действовать со злым умыслом" },
            "/security_event_management?name=infrastructure": { 
                "num": 5, 
                "label": "инфраструктура", 
                "title": "описание любых систем, программных служб, физических или виртуальных ресурсов, предназначенных для поддержки какой-либо цели" },
            "/security_event_management?name=tools": { 
                "num": 6, 
                "label": "инструменты реализации угроз", 
                "title": "описание легитимного программного обеспечения используемого для реализации компьютерных угроз" },
            "/security_event_management?name=statistic": { 
                "num": 7, 
                "label": "статистика", 
                "title": "общая статистическая информация" },
            "/security_event_management?name=change_log": { 
                "num": 8, 
                "label": "журнал изменений", 
                "title": "перечень изменений выполненных над сущностями" },
            "/security_event_management?name=final_documents": { 
                "num": 9, 
                "label": "итоговые документы", 
                "title": "формирование файлов итоговых документов" },
            "/security_event_management?name=reporting_materials": { 
                "num": 10, 
                "label": "отчетные материалы", 
                "title": "формирование файлов отчетных материалов" },
        };

        this.handlerMenuItem = this.handlerMenuItem.bind(this);
    }

    handlerMenuItem(){
        this.props.handler();
    }

    getSelectedMenuItem(){
        if((typeof this.menuItem[window.location.pathname] === "undefined") || (this.menuItem[window.location.pathname] === null)){           
            return 3;
        }
    
        return (typeof this.menuItem[window.location.pathname].num !== "undefined") ? this.menuItem[window.location.pathname].num : 0;
    }

    createMenu(){
        let list = [];
        for(let item in this.menuItem){
            list.push(<Tooltip title={this.menuItem[item].title} key={`tooltip_menu_item_${this.menuItem[item].num}`}>
                <div>
                    <LinkRouter to={item} key={`menu_item_${this.menuItem[item].num}`}>{this.menuItem[item].label}</LinkRouter>
                </div>
                {/*<Tab 
                    href={item} 
                    containerelement={<LinkRouter to={item}/>}
                    //component={LinkRouter} 
                    //to={item}
                    label={this.menuItem[item].label} 
                key={`menu_item_${this.menuItem[item].num}`}/>*/}
            </Tooltip>);
        }


        console.log(this.props);
        console.log(`value: ${this.props.value}`);


        return (
            <BrowserRouter>
                {/*<Tabs
                    value={this.getSelectedMenuItem.call(this)}
                    indicatorColor="primary"
                    orientation="vertical"
                    variant="scrollable"
                    aria-label="Vertical tabs example" >
                    {list}
                </Tabs>*/}
                <div>
                    <LinkRouter to="/security_event_management?name=reports">доклады</LinkRouter>
                </div>
                <div>
                    <LinkRouter to="/security_event_management?name=observed_data">наблюдаемые данные</LinkRouter>
                </div>
                <div>
                    <LinkRouter to="/security_event_management?name=malware">вредоносное по</LinkRouter>
                </div>
                <ChildElements handlerMenuItem={this.props.handler}/>
            </BrowserRouter>
        );
    }

    render(){
        return this.createMenu.call(this);
    }
}

CreateVerticalMenuItems.propTypes = {
    value: PropTypes.number,
    handler: PropTypes.func.isRequired,
};

//ReactDOM.render(<CreateMenuItemsVertical />, document.getElementById("header-page-vertical_menu"));

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ChildElements(handlerMenuItem){
    let query = useQuery();
    let name = query.get("name") != null ? query.get("name"): "";

    console.log(`query: ${name}/n------------`);
    console.log(handlerMenuItem);

    handlerMenuItem(name);

}

/*function Child(){
    let query = useQuery();
    let name = query.get("name") != null ? query.get("name"): "";

    console.log(name);
    console.log(`query: ${name}`);

    switch(name){
    case "":
        return <CreatePageReport/>;
    case "reports":
        return <CreatePageReport/>;
    case "observed_data":
        return <CreatePageObservedData/>;
    case "malware":
        return <CreatePageMalware/>;
    default:
        return <CreatePageReport/>;
    }
}*/

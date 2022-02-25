"use strict";

import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

export default function CreateListUnprivilegedGroups(props){
    let { groupList, handlerChosen, isNotDisabled } = props;

    const [ currentGroup, setCurrentGroup ] = React.useState("select_group");

    return (<Form.Group>
        <Form.Control 
            disabled={!isNotDisabled}
            as="select" 
            size="sm" 
            onChange={(e) => {
                handlerChosen(e);
                setCurrentGroup("select_group");
            }} 
            defaultValue={currentGroup} 
            id="dropdown_list_unprivileged_groups" >
            <option key="key_group_0_0" value="select_group">выбрать группу</option>
            {(()=>{
                return groupList.map((item, num) => {
                    let isDisabled = false;
                    if(item.privilegedGroup){
                        isDisabled = true;
                    }
                        
                    return (<option 
                        key={`key_group_${num}_${item.groupName}`} 
                        value={item.groupName} 
                        disabled={isDisabled}>
                        {item.groupName}
                    </option>);
                });
            })()}
        </Form.Control>
    </Form.Group>);
}

CreateListUnprivilegedGroups.propTypes = {
    groupList: PropTypes.array.isRequired,
    handlerChosen: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool,
};
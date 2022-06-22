import React, { useReducer } from "react";
import {
    Box, 
    Button,
    Paper,
    Grid,
    Typography, 
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import reducerCourseOfActionSTIXObjects from "../reducer_handlers/reducerCourseOfActionSTIXObjects.js";
import CreateCourseOfActionPatternElements from "../type_elements_stix/courseOfActionPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateCourseOfActionPatternNewSTIXObject(props){
    let { 
        isNotDisabled,
        parentIdSTIXObject,
        projectPatterElement,
        handlerAddSTIXObject,
    } = props;
    /**
     * наверное тут надо принимать общий обработчик для всех типов STIX объектов а саму обработку и 
     * добавление данных проводить в contentCreateNewSTIXObject, тогда будет проще обработать доступность
     * кнопки "сохранить" и действие при ее нажатии 
     */

    const [ state, dispatch ] = useReducer(reducerCourseOfActionSTIXObjects, projectPatterElement);

    let buttonIsDisabled = true;

    console.log("func CreateCourseOfActionPatternNewSTIXObject projectPatterElement: ", projectPatterElement);


    let id = `course-of-action--${uuidv4()}`;
    /**
     * перед тем как отправить вновь созданный объект (именно вновь созданный, надо проверять) через handlerAddSTIXObject
     * надо добовлять к объекту id
     */
     
    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();
    
                break;
            case "hashes_delete":
                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();
    
                break;
            default:
                dispatch({ type: "updateExternalReferences", data: obj.data });
                handlerButtonIsDisabled();
            }
        }
        
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerButtonIsDisabled();
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerButtonIsDisabled();
        }
    };

    const handlerButtonIsDisabled = () => {
        /*if(!buttonIsDisabled){
            return;
        }

        setButtonIsDisabled();*/
        },
        handlerButtonSaveChangeTrigger = () => {
            //        setButtonSaveChangeTrigger((prevState) => !prevState);
        };

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("course-of-action").description}`}
                    </Typography> 
                </Grid>
                <Grid item container md={4} justifyContent="flex-end">
                    <Button onClick={handlerAddSTIXObject} color="primary" disabled={buttonIsDisabled}>добавить</Button>
                </Grid>
            </Grid>
            <CreateCourseOfActionPatternElements
                isDisabled={false} 
                projectPatterElement={state}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
            />
            <CreateElementAdditionalTechnicalInformationDO
                objectId={id}
                reportInfo={state}
                isNotDisabled={isNotDisabled}
                handlerElementConfidence={(e) => { dispatch({ type: "updateConfidence", data: e }); handlerButtonIsDisabled(); }}
                handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerButtonIsDisabled(); }}
                handlerElementLabels={(e) => { dispatch({ type: "updateLabels", data: e }); handlerButtonIsDisabled(); }}
                handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerButtonIsDisabled(); }}
                handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo} 
            />
        </Box>
    </Paper>);
}
     
CreateCourseOfActionPatternNewSTIXObject.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
};

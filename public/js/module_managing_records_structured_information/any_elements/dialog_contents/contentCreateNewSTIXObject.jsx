"use strict";

import React from "react";
import { 
    AppBar,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Select,
    TextField,
    InputLabel,
    FormControl,
    MenuItem,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { teal, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "fixed",
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    appBreadcrumbs: {
        position: "fixed",
        top: "60px",
        color: theme.palette.getContrastText(grey[50]),
        backgroundColor: grey[50],
        paddingLeft: theme.spacing(4),
    },
    buttonSave: {
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default function CreateDialogContentNewSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        currentIdSTIXObject,
        listRefsForObjectSTIX,
        handlerDialog,
        handlerDialogClose,
    } = props;

    let [ typeObjectSTIX, setTypeObjectSTIX ] = React.useState("");
    let [ currentRefObjectSTIX, setCurrentRefObjectSTIX ] = React.useState(listRefsForObjectSTIX.find((item) => item === "object_refs")? "object_refs": listRefsForObjectSTIX[0]);

    let buttonSaveIsDisabled = (listRefsForObjectSTIX.length === 0);
    let listLinkImageSTIXObject = Object.keys(helpers.getListLinkImageSTIXObject());

    console.log("func 'CreateDialogContentNewSTIXObject' currentRefObjectSTIX = ", currentRefObjectSTIX);
    console.log(helpers.getListLinkImageSTIXObject());

    return (<React.Fragment>
        <DialogContent>
            <Grid container direction="row" className="pt-3" spacing={3}>
                <Grid item container md={4}>
                    {(listRefsForObjectSTIX.length > 1)?
                        <Grid container direction="row">
                            <Grid item container md={12} justifyContent="flex-start">
                                <TextField
                                    id={"select-property-connect-parent-child-object"}
                                    select
                                    fullWidth
                                    label={"свойство обеспечивающее связь родительского и дочернего объектов"}
                                    value={currentRefObjectSTIX}
                                    onChange={(obj) => { 
                                
                                        console.log("func 'change select-property-connect-parent-child-object', obj = ", obj);

                                        /**
                                 * надо добавить обработчик сюда!!!
                                 */

                                        //setCurrentTypesComputerThreat(obj.target.value);
                                        //handlerTypesComputerThreat(obj.target.value);
            
                                    }}>
                                    {listRefsForObjectSTIX.map((item) => <MenuItem key={`key-${item}`} value={item}>{item}</MenuItem>)}
                                </TextField>
                            </Grid>
                        </Grid>:
                        ""}
                    <Grid container direction="row">
                        <Grid item container md={12} justifyContent="flex-start">
                            <TextField
                                id={"select-type-create-object"}
                                select
                                fullWidth
                                label={"тип искомого или создаваемого объекта (не обязательный параметр)"}
                                value={typeObjectSTIX}
                                onChange={(obj) => setTypeObjectSTIX(obj.target.value)}>
                                {listLinkImageSTIXObject.map((item) => <MenuItem key={`key-${item}`} value={item}>{helpers.getLinkImageSTIXObject(item).description}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" className="pt-3">
                        <Grid item container md={12} justifyContent="flex-start">
                    1. Выбор свойства куда нужно добавить объект, если listRefsForObjectSTIX то вообще нельзя ничего делать, а 
                    если только object_refs то не показывать этот шаг.
                    2. Тип создоваемого объекта, при поиске не обязателен.
                    3. Строка поиска по id, name, domainame, ip и т.д. (поиск из кеша).
                    4. Вывод списка найденных ссылок.
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container md={8} justifyContent="center">
                Добавление какого либо нового STIX объекта. При это можно как добавить новый STIX объект, так и выполнить поиск
            уже существующих STIX объектов по их типам, времени создания, идентификатору и т.д. Родительский объект {currentIdSTIXObject}.
            listRefsForObjectSTIX = {listRefsForObjectSTIX}
                </Grid>
            </Grid>
        </DialogContent>

        <DialogActions>
            <Button onClick={handlerDialogClose} color="primary">закрыть</Button>
            <Button 
                disabled={buttonSaveIsDisabled}
                onClick={() => {
                    handlerDialog({});
                }}
                color="primary">
                сохранить
            </Button>
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentNewSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired, 
    listRefsForObjectSTIX: PropTypes.array.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

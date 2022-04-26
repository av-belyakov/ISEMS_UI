"use strict";

import React from "react";
import { 
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";

export default function ModalWindowConfirmDeleteLinkFromObjRefs(props){    
    let { 
        objectsId,
        showModalWindow,
        handlerDialogClose,
        handlerDialogConfirm,
    } = props;

    return (<Dialog 
        fullWidth
        maxWidth="xl"
        scroll="paper"
        open={showModalWindow} >
        <DialogTitle>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={11}><span className="pt-2">Удаление ссылки {objectsId[1]}</span></Grid>
                <Grid item container md={1} justifyContent="flex-end">
                    <IconButton edge="start" color="inherit" onClick={handlerDialogClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid> 
        </DialogTitle>
        <DialogContent>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={12} style={{ display: "block" }}>
                    Вы действительно хотите удалить ссылку <strong>{objectsId[0]}</strong> из <strong>{objectsId[1]}</strong>?
                </Grid>
            </Grid>            
        </DialogContent>
        <DialogActions>
            <Button onClick={handlerDialogClose} color="primary">закрыть</Button>            
            <Button
                onClick={handlerDialogConfirm}
                color="primary">
                сохранить
            </Button>
        </DialogActions>
    </Dialog>);
}

ModalWindowConfirmDeleteLinkFromObjRefs.propTypes = {
    objectsId: PropTypes.array.isRequired,
    showModalWindow: PropTypes.bool.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    handlerDialogConfirm: PropTypes.func.isRequired,
};
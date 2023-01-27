import React from "react";
import { 
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
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
        open={showModalWindow} 
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle>Удаление ссылки с ID:&nbsp;<strong>{objectsId[1]}</strong></DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Вы действительно хотите удалить ссылку с ID:&nbsp;<strong>{objectsId[1]}</strong> из объекта с ID:&nbsp;<strong>{objectsId[0]}</strong>?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button 
                onClick={handlerDialogClose} 
                style={{ color: blue[500] }} 
                color="primary">
                закрыть
            </Button>            
            <Button
                onClick={handlerDialogConfirm}
                style={{ color: blue[500] }}
                color="primary">
                удалить
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

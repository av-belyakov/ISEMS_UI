import React, { useState } from "react";
import {
    Grid,
    Link,
    TextField,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { showDirectoryList } from "../createShortInformationSTIXObject.jsx";

export default function CreateDirectoryPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerPath,
        handlerClick,
    } = props;

    let [ isInvalidPath, setIsInvalidPath ] = useState(((typeof campaignPatterElement.path === "undefined") || (campaignPatterElement.path === "")));

    if(campaignPatterElement.contains_refs && campaignPatterElement.contains_refs.length > 0){
        campaignPatterElement.contains_refs.sort();
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Директория файловой системы:</span></Grid>
            <Grid item container md={7}>
                {(campaignPatterElement.id && campaignPatterElement.id !== "")? 
                    <span className="mt-2">
                        <Link href={campaignPatterElement.path} onClick={() => {}} style={{ color: blue[400], margin: "2px" }}>{campaignPatterElement.path}</Link>
                    </span>:
                    <TextField
                        fullWidth
                        disabled={isDisabled}
                        id="path-element"
                        InputLabelProps={{ shrink: true }}
                        error={isInvalidPath}
                        onChange={(e) => {
                            if(e.target.value === ""){
                                setIsInvalidPath(true);
                            } else {
                                setIsInvalidPath(false);
                            }

                            handlerPath(e);
                        }}
                        helperText="обязательное для заполнения поле"
                        value={(campaignPatterElement.path)? campaignPatterElement.path: ""}
                    />}
            </Grid>
        </Grid>

        {campaignPatterElement.path_enc?
            <Grid container direction="row" spacing={3} style={{ marginBottom: 2 }}>
                <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Кодировка для пути (указывается, если путь хранится в кодировке, отличной от Unicode):</span></Grid>
                <Grid item container md={7} justifyContent="flex-start">{campaignPatterElement.path_enc}</Grid>
            </Grid>:
            ""}

        {campaignPatterElement.ctime && campaignPatterElement.ctime !== "0001-01-01T00:00:00Z"?
            <Grid container direction="row" spacing={3}>
                <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Время создания директории:</span></Grid>
                <Grid item container md={7} justifyContent="flex-start">
                    {helpers.convertDateFromString(new Date(campaignPatterElement.ctime).toISOString(), { monthDescription: "long", dayDescription: "numeric" })}
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.mtime && campaignPatterElement.mtime !== "0001-01-01T00:00:00Z"?
            <Grid container direction="row" spacing={3}>
                <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Время модификации или записи в директорию:</span></Grid>
                <Grid item container md={7} justifyContent="flex-start">
                    {helpers.convertDateFromString(new Date(campaignPatterElement.mtime).toISOString(), { monthDescription: "long", dayDescription: "numeric" })}
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.atime && campaignPatterElement.atime !== "0001-01-01T00:00:00Z"?
            <Grid container direction="row" spacing={3}>
                <Grid item container md={5} justifyContent="flex-end"><span className="text-muted">Время последнего обращения к директории:</span></Grid>
                <Grid item container md={7} justifyContent="flex-start">
                    {helpers.convertDateFromString(new Date(campaignPatterElement.atime).toISOString(), { monthDescription: "long", dayDescription: "numeric" })}
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.refs && campaignPatterElement.refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4, marginBottom: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start"><span className="text-muted">Список ссылок на файловые объекты или директории содержащиеся внутри данной директории:</span></Grid>
                </Grid>
                {showDirectoryList(campaignPatterElement.refs, campaignPatterElement.id, 0, handlerClick)}
            </React.Fragment>:
            ""}
    </React.Fragment>);
}

CreateDirectoryPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerPath: PropTypes.func.isRequired,
    handlerClick: PropTypes.func.isRequired,
};

import React from "react";
import {
    Grid,
    Link,
    List,
    ListItem,
    ListItemText,
    TextField,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import { useState } from "react";

export default function CreateDirectoryPatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerPath,
    } = props;

    console.log("func 'CreateDirectoryPatternElements', campaignPatterElement:", campaignPatterElement);

    let [ isInvalidPath, setIsInvalidPath ] = React.useState(((typeof campaignPatterElement.path === "undefined") || (campaignPatterElement.path === "")));

    /**
     * 
     * Надо проверить!!!
     * 
     */

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Директория файловой системы:</span></Grid>
            <Grid item container md={8}>
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
            <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Кодировка для пути (указывается, если путь хранится в кодировке, отличной от Unicode):</span></Grid>
                <Grid item container md={8} justifyContent="flex-start">{campaignPatterElement.path_enc}</Grid>
            </Grid>:
            ""}

        {campaignPatterElement.ctime && campaignPatterElement.ctime !== "0001-01-01T00:00:00Z"?
            <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Время создания директории:</span></Grid>
                <Grid item container md={8} justifyContent="flex-start">
                    {helpers.convertDateFromString(new Date(campaignPatterElement.ctime).toISOString(), { monthDescription: "long", dayDescription: "numeric" })}
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.mtime && campaignPatterElement.mtime !== "0001-01-01T00:00:00Z"?
            <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Время модификации или записи в директорию:</span></Grid>
                <Grid item container md={8} justifyContent="flex-start">
                    {helpers.convertDateFromString(new Date(campaignPatterElement.mtime).toISOString(), { monthDescription: "long", dayDescription: "numeric" })}
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.atime && campaignPatterElement.atime !== "0001-01-01T00:00:00Z"?
            <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Время последнего обращения к директории:</span></Grid>
                <Grid item container md={8} justifyContent="flex-start">
                    {helpers.convertDateFromString(new Date(campaignPatterElement.atime).toISOString(), { monthDescription: "long", dayDescription: "numeric" })}
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.contains_refs && campaignPatterElement.contains_refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start"><span className="text-muted">Список файловых объектов или директорий содержащихся внутри директории:</span></Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <div>
                            {<List dense>
                                {campaignPatterElement.contains_refs.map((elem, num) => {
                                    return (<ListItem key={`item_file_num_${num}`}>{++num}. <ListItemText primary={elem} /></ListItem>);
                                })}
                            </List>}
                        </div>
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}
    </React.Fragment>);
}

CreateDirectoryPatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerPath: PropTypes.func.isRequired,
};
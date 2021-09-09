import React from "react";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

export default function CreateChipList(props) {
    let { variant, chipData, handleDelete } = props;

    const classes = useStyles();
    const deleting = (item) => {
        handleDelete(item);
    };

    if(chipData.length === 0){
        return null;
    }

    return chipData.map((item, num) => {
        return (<Tooltip title={item.title} key={`key_tooltip_chip_${num}`}>
            <Chip
                key={`key_chip_${item.data}_${num}`}
                label={item.data}
                onDelete={deleting.bind(null, item.data)}
                variant={variant}
                className={classes.chip} />
        </Tooltip>);
    });
}

CreateChipList.propTypes = {
    variant: PropTypes.string.isRequired,
    chipData: PropTypes.array.isRequired,
    handleDelete: PropTypes.func.isRequired,
};
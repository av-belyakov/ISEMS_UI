import React from "react";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";

export default function CreateChipList(props) {
    let { variant, style, chipData, handleDelete } = props;
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
                style={style} />
        </Tooltip>);
    });
}

CreateChipList.propTypes = {
    variant: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
    chipData: PropTypes.array.isRequired,
    handleDelete: PropTypes.func.isRequired,
};
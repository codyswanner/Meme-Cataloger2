import * as React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

const handleChange = (props) => {
    const checkboxLabel = props.text;
    const socket = props.socket;
    const selectionMessage = "FilterCheckbox: selected " + props.tagId;
    console.log(selectionMessage);
    socket.send(JSON.stringify({'type':'filterChange', 'filterName': checkboxLabel, "filterId": props.tagId}));
};

function FilterCheckbox(props) {
    return(
        <FormControlLabel control={<Checkbox/>}
        label={props.text}
        sx={{ width: 1}}
        onChange={() => handleChange(props)}/>
    );
    
}


export default FilterCheckbox;

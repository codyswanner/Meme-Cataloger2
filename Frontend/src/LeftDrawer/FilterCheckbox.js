import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

import filterSocket from '../SupportingModules/FilterSocket';


/**
 * Detects when a FilterCheckbox is clicked, and sends a message to backend with updated state of filter.
 * 
 * @param {object} props Contains props passed to the component.
 * @param {string} props.text String label of the checkbox; matches name of tag to filter.
 * @param {number} props.tagId The numerical tag ID to filter for when this box is checked.
 * @param {event} event Detects when box has been clicked (checked or unchecked).
 */
const handleChange = (props, event) => {
    const checkboxLabel = props.text;
    const socket = filterSocket;
    socket.send(JSON.stringify({
        'type':'filterChange',
        'filterName': checkboxLabel,
        'filterId': props.tagId,
        'filterState': (event.target.checked ? "on" : "off")
    }));
};

/**
 * Renders a checkbox that allows (de)selection of a tag for image filtering.
 * 
 * @param {object} props Contains props passed to the component.
 * @param {string} props.text String label of the checkbox; matches name of tag to filter.
 * @param {number} props.tagId The numerical tag ID to filter for when this box is checked.
 * @returns The FilterCheckbox component to be rendered in the app.
 */
function FilterCheckbox(props) {
    return(
        <FormControlLabel control={<Checkbox/>}
        label={props.text}
        sx={{ width: 1 }} // Future: Change with screen width
        onChange={(event) => handleChange(props, event)}/>
    );
};

export default FilterCheckbox;
 
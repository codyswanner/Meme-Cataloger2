import { useEffect, useState } from 'react';

import filterSocket from './FilterSocket';


// update pictures when data is received from WebSocket
function useFilterSocket(props) {
    const [appData, setAppData] = useState(props.apiData);
    const [activeFilters, setActiveFilters] = useState([]);
    
    function handleFilterChange (response, socket) {
        if (response.filterState == "on") {
            setActiveFilters(
            filters => {
                filters.push(response.filterId)
                return filters;
            });
        } else if (response.filterState == "off") {
            setActiveFilters(
            filters => {
                const i = filters.indexOf(response.filterId);
                filters.splice(i, 1);
                return filters;
            });
        };
        
        // Send filters to Django to make query and return picture ids to display
        // Add user id to this
        socket.send(JSON.stringify({'type': 'activeFilters', 'activeFilters': activeFilters}));
    };

    function handleApplyFilters (response) {
        const results = response.results;
                let imagesToRender = [];
                if (results.length == 0) {
                    console.log("No matching photos!");
                    setAppData([[], props.apiData[1], props.apiData[2]]);
                } else {
                    props.apiData[0].forEach(image => {
                        if (results.includes(image.id)) {imagesToRender.push(image);};
                    });
                    const newData = [imagesToRender, props.apiData[1], props.apiData[2]];
                    setAppData(newData);
                };
    }

    function handleTagAdded (response) {
        const objectId = response.id; // This is the id of the imageTag object just created
        const imageId = response.imageId; // id of the target image
        const tagId = response.tagId; // id of the target tag

        const modifiedAppData = {...appData}; // Create a mutable copy
        // Use response to locate relevant object in appData[0]
        const findInAppData = (id) => modifiedAppData[0].find(element => element.id == id); 
        const imageObject = findInAppData(imageId);
        // Modify object in image object array to match updates
        imageObject.tags.push(tagId);
        
        
        // Add imageTag object to appData[2] to reflect updates
        const newImageTag = {'id': objectId, 'image_id': imageId, 'tag_id': tagId};
        modifiedAppData[2].push(newImageTag);

        setAppData(modifiedAppData); // push updates to state
    };

    function handleTagRemoved (response) {
        const objectId = response.id; // This is the id of the imageTag object to be removed
        const imageId = response.imageId; // id of the target image
        const tagId = response.tagId; // id of the target tag

        const modifiedAppData = {...appData}; // Create a mutable copy

        // Use response to locate relevant objects in appData
        const findImage = (id) => modifiedAppData[0].find(element => element.id == id);
        const imageObject = findImage(imageId);
        
        // in tags array of target image, remove target tag by id
        var tagArray = imageObject['tags']; // Create a mutable copy
        tagArray = tagArray.filter(function(item) {return item !== tagId});
        imageObject['tags'] = tagArray; // push updates to array

        // in imageTag object, delete relevant object.
        const imageTagData = modifiedAppData[2]
        for (const [key, value] of Object.entries(imageTagData)) {
            if (value.id === objectId) {
                delete imageTagData[key];
            };
        };

        setAppData(modifiedAppData); // push updates and re-render
    };

    function handleImageDeleted (response) {
        const imageId = response.id;
        console.log("imageDeleted message received for image " + imageId)

        const modifiedAppData = {...appData}; // Create a mutable copy

        // Delete image from the image array
        var imageArray = modifiedAppData[0];
        imageArray = imageArray.filter(function(item) {
            return item.id !== imageId
        });
        modifiedAppData[0] = imageArray;

        // Delete any tag association records for image
        const imageTagData = modifiedAppData[2];
        for (const [key, value] of Object.entries(imageTagData)) {
            if (value.image_id === imageId) {
                delete imageTagData[key];
            };
        };

        setAppData(modifiedAppData);
    };

    useEffect(() => {
        const socket = filterSocket;
    
        const receiveMessage = (e) => {
            const response = JSON.parse(e.data);
            if (response.type == "filterChange") {
                handleFilterChange(response, socket);
            } else if (response.type == "applyFilters") {
                handleApplyFilters(response);
            } else if (response.type == "tagAdded") {
                handleTagAdded(response);
            } else if (response.type == "tagRemoved") {
                handleTagRemoved(response);
            } else if (response.type == "imageDeleted") {
                handleImageDeleted(response);
            } else {
                console.log("Unexpected websocket message type received!")
            };
        };
    
        socket.addEventListener('message', receiveMessage);
    
        return () => {socket.removeEventListener('message', receiveMessage);}
      }, []);

      return appData;
};

export default useFilterSocket;

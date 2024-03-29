import React, { useState } from 'react';
import { Box } from "@mui/material";

import ImageTopToolbar from './ImageTopToolbar';
import ImageBottomToolbar from './ImageBottomToolbar';


function ReactivePictureFrame(props) {
  const [imageHovered, setImageHovered] = useState(false);

  const handleImageMouseEnter = () => {
    setImageHovered(true);
  };

  const handleImageMouseLeave = () => {
    setImageHovered(false);
  };

  var toolbarVisible = imageHovered;

  const toolbarStyles = {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2,
    opacity: toolbarVisible ? 1 : 0,
    bgcolor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "space-between"
  };

  return (
    <Box>
      {/* Outer div detects mouseEnter/mouseLeave */}
      <div
        style={{ position: "relative" }}
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
      >
        {/* Picture top toolbar, includes description and share/archive/trash buttons */}
        <ImageTopToolbar toolbarStyles = {toolbarStyles} {...props}/>

        {/* Actual image to be displayed */}
        <div>
          <img src={props.src} style={{ maxWidth: props.maxWidth }}/>
        </div>

        {/* Picture lower toolbar, includes Tag(s) and AddTagButton */}
        <ImageBottomToolbar toolbarStyles={toolbarStyles} {...props}/>
      </div>
    </Box>
  );
};

export default ReactivePictureFrame;

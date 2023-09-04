import React from 'react';
import { Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
//import Picture from "./picture";
import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";

function AddTag(props) {
  const handleButtonClick = (buttonType, props) => {
    console.log(`Clicked ${buttonType} on image ${props.index}`);
  }

  return (
    <IconButton style={{ color: "white" }} onClick={() => handleButtonClick("Add Tag", props)}>
      <p>+</p>
    </IconButton>
  );
}

function Tag(props) {
  if (props.tag === 0) {
    return(
      <div style={{ fontSize: "0.7rem", color: "white" }}>
        <p>{'Add tag'}</p>
      </div>
    );
  } else {
    const tagId = props.tag;
    const tagName = tagId ? props.tagNames.find(tagData => tagData.id === tagId)['name'] : 'Add Tag';
    return (
      <div style={{ fontSize: "0.7rem", color: "white" }}>
        <p>{tagName}</p>
      </div>
    );
  };
}

function ReactivePictureFrame(props) {
  const [imageHovered, setImageHovered] = useState(false);

  const handleImageMouseEnter = () => {
    setImageHovered(true);
  };

  const handleImageMouseLeave = () => {
    setImageHovered(false);
  };

  const handleButtonClick = (buttonType, props) => {
    console.log(`Clicked ${buttonType} on image ${props.index}`);
  }

  const generateTags = (tags, tagNames) => {
    return tags.length === 0 ? (
      <Tag tag={0} key={0} tagNames={tagNames} />
    ) : (
      tags.map((tag) => (
        <Tag tag={tag} key={tag} tagNames={tagNames} />
      ))
    );
  }

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
      <div
        style={{ position: "relative" }}
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
      >
        <Toolbar sx={toolbarStyles}>
          <Typography sx={{ fontSize: "0.9rem", color: "white" }}>
            Text Description
          </Typography>
          <div style={{ marginLeft: "auto" }}>
            <Toolbar disableGutters>
              <IconButton onClick={() => handleButtonClick("Share", props)}>
                <ShareIcon sx={{ color: "white" }} />
              </IconButton>
              <IconButton onClick={() => handleButtonClick("Archive", props)}>
                <ArchiveIcon sx={{ color: "white" }} />
              </IconButton>
              <IconButton onClick={() => handleButtonClick("Delete", props)}>
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
            </Toolbar>
          </div>
        </Toolbar>
        <div>
          <img src={props.src} style={{ maxWidth: 500 }}/>
        </div>
        <div>
          <Toolbar sx={[toolbarStyles, { bottom: 6.5 }]}>
            {generateTags(props.tags, props.tagNames)}
            <AddTag index={props.index} style={{ marginLeft: "auto" }}/>
          </Toolbar>
        </div>
      </div>
    </Box>
  );
}

export default ReactivePictureFrame;

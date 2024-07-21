import React, { useContext } from 'react';

import ImageTopToolbar from './ImageFrame/ImageTopToolbar';
import ImageBottomToolbar from './ImageFrame/ImageBottomToolbar';
import useFilterSocket from './SupportingModules/useFilterSocket';
import ImageDataContext from './SupportingModules/ImageDataContext';
import AppDataContext from './SupportingModules/AppDataContext';


export default function FullScreenPictureFrame(props) {
  const appData = useFilterSocket(props.apiData);
  const imageData = useContext(ImageDataContext);
  console.log(imageData);
  const toolbarStyles = {
    display: "flex",
    justifyContent: "space-between"
  };

  return (
    <AppDataContext.Provider value={appData}>
      <ImageTopToolbar toolbarStyles={toolbarStyles}/>
        <img src={imageData.source} style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}/>
      <ImageBottomToolbar toolbarStyles={toolbarStyles}/>
    </AppDataContext.Provider>
  );

};

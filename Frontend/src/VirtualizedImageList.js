/**
* This module adapted from react-virtuoso docs
* https://virtuoso.dev/grid-responsive-columns/
*/

import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Thumbnail from './Thumbnail';
import AppDataContext from './SupportingModules/AppDataContext';


export default function VirtuosoGridWrapper (props) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const mediumScreen = useMediaQuery(theme.breakpoints.only('md'));
  const largeScreen = useMediaQuery(theme.breakpoints.only('lg'));
  const hugeScreen = useMediaQuery(theme.breakpoints.only('xl'));
  const [itemWidth, setItemWidth] = useState('33%');

  const handleResize = () => {
    if (smallScreen) {
      setItemWidth('33%');  // 100% / 3 columns = 33%
    } else if (mediumScreen) {
      setItemWidth('25%');  // 100% / 4 columns = 25%
    } else if (largeScreen) {
      setItemWidth('20%');  // 100% / 5 columns = 20%
    } else if (hugeScreen) {
      setItemWidth('14.28%'); // 100% / 7 columns = ~14.28%
    } else {
      setItemWidth('33%'); // If unclear, default to small size
    };
  };

  useEffect(() => {handleResize();}, [smallScreen, mediumScreen, largeScreen, hugeScreen])


  // Ensure that this stays out of the component, 
  // Otherwise the grid will remount with each render due to new component instances.
  const gridComponents = {
    List: forwardRef(({ style, children, ...props }, ref) => (
      <div
        ref={ref}
        {...props}
        style={{
          display: "flex",
          flexWrap: "wrap",
          ...style,
        }}
      >
        {children}
      </div>
    )),
    Item: ({ children, ...props }) => (
      <div
        {...props}
        style={{
          padding: "0",
          width: itemWidth,
          display: "flex",
          flex: "none",
          alignContent: "stretch",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    )
  }

  const ItemWrapper = ({ children, ...props }) => (
    <div
      {...props}
      style={{
        display: "flex",
        flex: 1,
        textAlign: "center",
        padding: "0.5rem 0.5rem",
        border: "0px dashed red",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );

  function VirtualizedImageList() {
    const {appData} = useContext(AppDataContext);
    const imageList = appData.imageData;

    return (
        <VirtuosoGrid
          style={{ height: "100vh" }}
          totalCount={imageList.length}
          components={gridComponents}
          itemContent={(index) => 
            <ItemWrapper>
              <Thumbnail src={imageList[index].source} id={imageList[index].id}/>
            </ItemWrapper>
          }
        />
    );
  };

  return <VirtualizedImageList imageList={props.imageList}/>;
};

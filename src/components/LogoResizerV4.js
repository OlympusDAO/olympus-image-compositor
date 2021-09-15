import React from 'react';

import {
  Box,
  Typography,
  Button
} from "@material-ui/core";

import SizeSlider from './SizeSlider';

export default function LogoResizer(props) {

  return (
    <div style={props.medScreen ? (
      {marginLeft: "1rem", marginRight: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", height: props.containerHeight}
    ): (
      {display: "flex", flexDirection: "column", alignItems: "center"}
    )}>
      {/* TODO (appleseed): do you want click to replace option on POF? */}
      <Typography className="direction-text">{props.directionText}</Typography>
      <img
        src={props.stampSrc}
        height={props.stampHeight}
        width={props.stampWidth}
        style={props.imgStyle}
        alt="stamp"
        onClick={props.onStampClick}
      />
      <SizeSlider
        valueLabelDisplay="auto"
        aria-label="size slider"
        defaultValue={props.stampWidth}
        min={props.minSize}
        max={props.maxSize}
        onChange={props.resizeStamp}
      />
      {/*showCanvas && */}
      <Box display="flex" style={props.buttonsContainerStyle} textAlign='center'>
        
        <Box style={{marginBottom: "1rem"}}>
          <Button
            id="download-pfp-button"
            variant="contained"
            className="ohmie-button"
            onClick={props.downloadImage}
          >
            <Typography className="btn-text">{props.downloadText}</Typography>
          </Button>
        </Box>
        <Box>
          <Button
            id="back-button"
            variant="outlined"
            className="outlined-ohmie-button"
            onClick={props.goBackToStart}
          >
            <Typography className="btn-text">Start Over</Typography>
          </Button>
        </Box>
        {/*<Button variant="outlined" color="primary" style={props.outlineButton}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={props.downloadImage} style={props.containerButton}>
          Download pfp
        </Button>*/}
      </Box>
    </div>
  );
}
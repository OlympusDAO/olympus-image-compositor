import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
  Button
} from "@material-ui/core";

import CloudUploadIcon from "./CloudUploadIcon";

import SizeSlider from './SizeSlider';

function LogoResizer(props) {

  return (
    <Box style={props.medScreen ? (
      {marginLeft: "1rem", marginRight: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", height: props.containerHeight}
    ): (
      {display: "flex", flexDirection: "column", alignItems: "center"}
    )}>
      {/* TODO (appleseed): do you want click to replace option on POF? */}
      <Typography className={props.isPfp ? ("direction-text pfp-dt") : ("direction-text pof-dt")} >{props.directionText}</Typography>
      {props.isPfp ? (
        <Box className="pfp-mask pfp-box" display="flex" onClick={props.onStampClick}>
          <Box style={{position: "absolute"}}><CloudUploadIcon viewBox="0 0 102 48"/></Box>
          <img
            src={props.stampSrc}
            height={props.stampHeight}
            width={props.stampWidth}
            style={props.imgStyle}
            alt="stamp"
          />
        </Box>
      ) : (
        <Box className="pfp-box" display="flex">
          <img
            src={props.stampSrc}
            height={props.stampHeight}
            width={props.stampWidth}
            style={props.imgStyle}
            alt="stamp"
          />
        </Box>
      )}
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
      </Box>
    </Box>
  );
}

LogoResizer.propTypes = {
  buttonsContainerStyle: PropTypes.object.isRequired,
  downloadText: PropTypes.string.isRequired,
  downloadImage: PropTypes.func.isRequired,
  containerHeight: PropTypes.number,
  goBackToStart: PropTypes.func.isRequired,
  directionText: PropTypes.string.isRequired,
  medScreen: PropTypes.bool,
  resizeStamp: PropTypes.func.isRequired,
  onStampClick: PropTypes.func,
  maxSize: PropTypes.number.isRequired,
  minSize: PropTypes.number.isRequired,
  stampSrc: PropTypes.any.isRequired,
  stampHeight: PropTypes.number.isRequired,
  stampWidth: PropTypes.number.isRequired,
  defaultSize: PropTypes.number,
  isPfp: PropTypes.bool,
};

export default LogoResizer;
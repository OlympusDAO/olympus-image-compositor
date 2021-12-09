import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
  Button
} from "@material-ui/core";

import CloudUploadIcon from "./CloudUploadIcon";

import SizeSlider from './SizeSlider';

function FohmoDownloader(props) {

  return (
    <Box style={props.medScreen ? (
      // {margin: "1rem 0rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around"}
      {width: "100%"}
    ): (
      {display: "flex", flexDirection: "column", alignItems: "center"}
    )}>
      {/* TODO (appleseed): do you want click to replace option on POF? */}
      {/*showCanvas && */}
      <Box id="button container" display="flex" style={props.buttonsContainerStyle} textAlign='center'>
        
        <Box style={{marginBottom: "10px"}}>
          <Button
            id="download-pfp-button"
            variant="contained"
            className="ohmie-button"
            onClick={props.downloadImage}
          >
            <Typography className="btn-text">{props.downloadText}</Typography>
          </Button>
        </Box>
        <Box style={{marginBottom: "10px"}}>
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

FohmoDownloader.propTypes = {
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

export default FohmoDownloader;
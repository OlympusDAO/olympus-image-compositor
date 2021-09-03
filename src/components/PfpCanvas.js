// PfpCanvas = Background Canvas
//
// Allows user to upload & position a background onto a canvas
import React from 'react';
import PropTypes from 'prop-types';

import {
  // Grid,
  Box,
  // Paper,
  // Typography,
  // Button,
  // CircularProgress,
  // Zoom,
} from "@material-ui/core";

import LogoResizer from "./LogoResizer";


const PfpCanvas = React.forwardRef((props, ref) => {
  const { stampInputRef } = ref;

  const resizeStamp = (e, value) => {
    props.setStampSize({height: value, width: value});
  }

  const onStampClick = () => {
    stampInputRef.current.click();
  }

  const uploadStamp = (e) => {
    var files = stampInputRef.current.files;
    if (files.length > 0) {
      props.setStampFile(URL.createObjectURL(files[0]));
    }
  }
  
  return (
    <Box>
      {/* Logo Resizing */}
      <Box>
        <LogoResizer
          stampSrc={props.stampFile}
          stampHeight={props.stampSize.height}
          stampWidth={props.stampSize.width}
          defaultSize={props.sOhmSize}
          resizeStamp={resizeStamp}
          minSize={24}
          maxSize={400}
          onStampClick={onStampClick}
          imgStyle={{cursor: "pointer"}}
        />
        <input
          id="logoFile"
          ref={stampInputRef}
          type="file"
          style={{display: "none"}}
          accept="image/*"
          onChange={uploadStamp}
        />
      </Box>

    </Box>
  );
});

PfpCanvas.propTypes = {
  setStampSize: PropTypes.func.isRequired,
  setStampFile: PropTypes.func.isRequired,
  stampFile: PropTypes.string.isRequired,
  stampSize: PropTypes.object.isRequired,
  sOhmSize: PropTypes.number.isRequired,

};

export default PfpCanvas
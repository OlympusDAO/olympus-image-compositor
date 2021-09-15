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

import LogoResizerV4 from "./LogoResizerV4";
import classifyImage from "../helpers/classifyImage";

const PfpCanvas = React.forwardRef((props, ref) => {
  const { stampInputRef } = ref;

  const resizeStamp = (e, value) => {
    props.setStampSize({
      width: value*props.stampFile.aspectRatio,
      height: value,
    });
  }

  const onStampClick = () => {
    stampInputRef.current.click();
  }

  const uploadStamp = (e) => {
    var files = stampInputRef.current.files;
    if (files.length > 0) {
      console.log("files", files[0]);
      let image = new Image();
      const maxWdth = 400;
      const mobile = false;
      image.onload = () => {
        image = classifyImage(image, maxWdth, props.maxHt, mobile);
        console.log(image);

        // set to whatever size == height = max canvas height
        props.setStampSize({
          width: props.maxHt*image.aspectRatio,
          height: props.maxHt
        });
      }
      image.src = URL.createObjectURL(files[0]);
      props.setStampFile(image);
    }
  }
  
  return (
    <Box>
      {/* Logo Resizing */}
      <Box>
        <LogoResizerV4
          stampSrc={props.stampFile.src}
          stampHeight={props.stampSize.height}
          stampWidth={props.stampSize.width}
          resizeStamp={resizeStamp}
          minSize={24}
          maxSize={props.maxHt*1.25}
          onStampClick={onStampClick}
          imgStyle={{cursor: "pointer"}}
          goBackOneStep={props.goBackOneStep}
          downloadImage={props.downloadImage}
          downloadText={props.downloadText}
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
  goBackOneStep: PropTypes.func.isRequired,
  downloadImage: PropTypes.func.isRequired,
  downloadText: PropTypes.string.isRequired,
  stampFile: PropTypes.string.isRequired,
  stampSize: PropTypes.object.isRequired,
  sOhmSize: PropTypes.number.isRequired,

};

export default PfpCanvas
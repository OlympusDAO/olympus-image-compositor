// BgCanvas = Background Canvas
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

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { classifyOhmieImage } from "../helpers/classifyImage";
import {heightFromAspectRatio} from "../helpers/index.js";

const BgCanvas = React.forwardRef((props, ref) => {
  const fileImage = props.fileImage;

  // potential canvasContainerRef should just be a prop...
  const { cropperRef } = ref;

  const cropperCanvasSettings = {
    imageSmoothingQuality: "high",
  };

  

  const onCrop = () => {
    // cropperContainerRef may not exist since we hide areas in different steps
    // if (viewContainerRef.current) {
      const imageElement = cropperRef?.current;
      const cropper = imageElement?.cropper;
      // console.log(cropper.getCroppedCanvas().toDataURL());
      let image = new Image();
      image.onload = () => {

        // this .onload() is running on dropzone, too... so skip out with the if
        // if (viewContainerRef.current) {
          // image = classifyImage(image, viewContainerRef.current.offsetWidth, heightFromAspectRatio(viewContainerRef.current.offsetWidth));
          image = classifyOhmieImage(image, fileImage.parentWidth, heightFromAspectRatio(fileImage.parentWidth, props.aspectRatio));
          console.log("cropped", image);
          props.setCroppedBg(image);
        // }
      };
      image.src = cropper.getCroppedCanvas(cropperCanvasSettings).toDataURL(props.fileImageType, 1);
    // }
  };

  return (
    <Box style={props.containerStyle}>
      <Box id="cropBoxContainer">
        <Cropper
          src={fileImage.src}
          style={{ margin: "20px", height: fileImage.governing_height, width: fileImage.governing_width }}
          // style={props.cropperContainerStyle}
          // Cropper.js options
          aspectRatio={props.aspectRatio}
          cropBoxResizable={false}
          dragMode={"crop"}
          guides={false}
          autoCropArea={1}
          crop={onCrop}
          ready={props.imageLoaded}
          ref={cropperRef}
        />
      </Box>
    </Box>
    
  );
});

BgCanvas.propTypes = {
  imageLoaded: PropTypes.func.isRequired,
  setCroppedBg: PropTypes.func.isRequired,
  goBackOneStep: PropTypes.func.isRequired,
  goToPfpStep: PropTypes.func.isRequired,
  fileImage: PropTypes.instanceOf(HTMLImageElement).isRequired,
  outlineButtonStyle: PropTypes.object.isRequired,
  containerButtonStyle: PropTypes.object.isRequired,
  cropperContainerStyle: PropTypes.object.isRequired,
  areaHt: PropTypes.number.isRequired,
  fileImageType: PropTypes.string.isRequired,
  containerStyle: PropTypes.object.isRequired,
  aspectRatio: PropTypes.number.isRequired
};

export default BgCanvas
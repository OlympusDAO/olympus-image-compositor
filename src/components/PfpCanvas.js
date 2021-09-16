// PfpCanvas = Background Canvas
//
// Allows user to upload & position a background onto a canvas
import React, {useState, useEffect, useCallback} from 'react';
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
  const pfpDropZoneRef = React.useRef(null);
  const [dragCounter, setDragCounter] = useState(0);
  const [dragging, setDraggging] = useState(false);

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
      saveStamp(files[0]);
    }
  }

  const saveStamp = (file) => {
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
    image.src = URL.createObjectURL(file);
    props.setStampFile(image);
  };

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragIn = (e) => {
    console.log('dragin');
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev+1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDraggging(true);
    }
  }
  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev-1);
    if (dragCounter === 0) {
      setDraggging(false);
    }
  }, [dragCounter]);

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // TODO handle dis
      // this.props.handleDrop(e.dataTransfer.files)
      saveStamp(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      setDragCounter(0);
    }
  }, [saveStamp]);

  useEffect(() => {
    console.log('firing');
    let div = pfpDropZoneRef.current
    div.addEventListener('dragenter', handleDragIn)
    div.addEventListener('dragleave', handleDragOut)
    div.addEventListener('dragover', handleDrag)
    div.addEventListener('drop', handleDrop)
  }, [handleDragOut, handleDrop])
  
  return (
    <Box>
      {/* Logo Resizing */}
      <Box ref={pfpDropZoneRef}>
        <LogoResizerV4
          // stampInputRef={stampInputRef}
          stampSrc={props.stampFile.src}
          stampHeight={props.stampSize.height}
          stampWidth={props.stampSize.width}
          resizeStamp={resizeStamp}
          minSize={24}
          maxSize={props.maxHt*1.25}
          onStampClick={onStampClick}
          imgStyle={{cursor: "pointer"}}
          directionText={"Personalized Character"}
          goBackToStart={props.goBackToStart}
          downloadImage={props.downloadImage}
          downloadText={props.downloadText}
          buttonsContainerStyle={{flexFlow: "row wrap", justifyContent: "space-around", width: "100%"}}
          isPfp={true}
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
  goBackToStart: PropTypes.func.isRequired,
  downloadImage: PropTypes.func.isRequired,
  downloadText: PropTypes.string.isRequired,
  stampFile: PropTypes.any.isRequired,
  stampSize: PropTypes.object.isRequired,
  // sOhmSize: PropTypes.number.isRequired,

};

export default PfpCanvas
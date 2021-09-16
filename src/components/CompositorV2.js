import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Zoom,
} from "@material-ui/core";
import {
  isIOS,
  isMobile,
  isMobileSafari,
  // browser,
  // getUA,
  // deviceDetect,
  // browserName
} from "react-device-detect";

import React, {useState, useCallback} from 'react';

import LogoResizer from "./LogoResizer.js"

import {useDropzone} from 'react-dropzone';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "./stake.scss";

import sOhm from '../assets/token_sOHM.png';
import classifyImage from "../helpers/classifyImage";

import useWindowSize from "../hooks/useWindowSize";
import { useEffect } from "react";

// var UAParser = require('ua-parser-js/dist/ua-parser.min');
// var UA = new UAParser();

// import { dark } from "../themes/dark";

const canvasContainer = {
  // display: 'flex',
  // flexDirection: 'row',
  // flexWrap: 'wrap',
  // marginTop: 16,
  margin: 'auto',
  width: "100%"
};

const canvasStyle = {
  margin: "auto",
  display: "block"
}

const dropContainerStyle = {
  display: "flex",
  flexFlow: "column wrap",
  justifyContent: "center"
  // backgroundColor: shade(dark.palette.background.paperBg, 0.5)
}

function CompositorV2(props) {

  const sOhmSize = 60;

  const canvasRef = React.useRef(null);
  const finalCanvas = React.useRef(null);

  const windowSize = useWindowSize();

  const areaHt = (windowSize.height*0.7 ) || 0;

  const compositorPaper = {
    padding: "15px",
    textAlign: "center",
    // marginBottom: "20px",
  }

  const dropZoneReg = {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    cursor: "pointer",
    height: areaHt
  }

  const outlineButton = {
    height: "33px",
    marginLeft: "0.25rem",
    marginRight: "0.25rem",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
  }

  const containerButton = {
    height: "33px",
    marginLeft: "0.25rem",
    marginRight: "0.25rem",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
  }

  const hiddenButton = {
    ...containerButton,
    ...{visibility: "hidden"}
  }

  const [fileImage, setfileImage] = useState(false);
  const [fileImageType, setfileImageType] = useState("image/png");
  const [fileCropped, setfileCropped] = useState(false);
  const [uiStep, setuiStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stampSize, setStampSize] = useState({
    height: sOhmSize,
    width: sOhmSize,
  });

  const setCanvasListeners = useCallback(
    () => {
      var canvasOnly = canvasRef.current;
      var ctx = canvasOnly.getContext('2d');

      var logo = new Image();
      logo.src = sOhm;

      // When true, moving the mouse draws on the canvas
      let isDrawing = false;
      
      //////////// HISTORY
      var history = {
        restoreState: function() {
          ctx.clearRect(0, 0, fileCropped.governing_width, fileCropped.governing_height);
          ctx.drawImage(fileCropped, 0, 0, fileCropped.governing_width, fileCropped.governing_height);  
        }
      }
      ///////////////
      
      // Add the event listeners for mousedown, mousemove, and mouseup
      canvasOnly.addEventListener('mousedown', e => {
        isDrawing = true;
      });

      // drawImage usage
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      canvasOnly.addEventListener('mousemove', e => {
        if (isDrawing === true) {
          // ctx.drawImage(image, dx, dy, dWidth, dHeight);
          // history.undo(canvasOnly, ctx);
          if (fileCropped) history.restoreState();
          ctx.drawImage(logo, (e.offsetX-(stampSize.width/2)), (e.offsetY-(stampSize.height/2)), stampSize.width, stampSize.height);
          // drawLine(context, x, y, e.offsetX, e.offsetY);
          // x = e.offsetX;
          // y = e.offsetY;
        }
      });

      window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
          // history.undo(canvasOnly, ctx);
          if (fileCropped) history.restoreState();

          ctx.drawImage(logo, (e.offsetX-(stampSize.width/2)), (e.offsetY-(stampSize.height/2)), stampSize.width, stampSize.height);
          // drawLine(context, x, y, e.offsetX, e.offsetY);
          // x = 0;
          // y = 0;
          isDrawing = false;
        }
      });
    }, [stampSize.height, stampSize.width, fileCropped]
  );
    
  const step1Direction = {row: ""};
  // const [secondaryDirection, setSecondaryDirection] = useState({row: ""});
  
  // uiSteps
  // 1. Click to start
  // 2. take user's image to cropper
  // 3. take user's cropped image to stamper

  const goToStepTwo = (image) => {
    setfileImage(image);
    // setTextPromptState("Start Over");
    setIsLoading(true);
    setuiStep(2);
  }

  const goToStepThree = (sameCanvas) => {
    // clear the canvas...
    if (sameCanvas !== true) {
      clearTheCanvas();
      drawCroppedCanvas();
    }
    setuiStep(3);
  }

  // this only happens for iOSMobile, non-Safari users
  const goToStepFour = () => {
    // must set display.none rather than height 0
    // height 0 doesn't allow the image to be created...
    canvasRef.current.style.display="none";
    setuiStep(4);
  }

  const goBackOneStep = () => {
    if (uiStep === 3) {
      // go to step 2
      clearTheCanvas();
      goToStepTwo(fileImage);
    } else if (uiStep === 2) {
      clearTheCanvas();
      setuiStep(1);
    } else if (uiStep === 4) {
      // make the canvas show again
      canvasRef.current.style.display="block";
      goToStepThree(true);
    }
  }

  // STEP 1
  // dropzone handling
  const {getRootProps, getInputProps} = useDropzone({
    // heic/heif images aren't allowable...
    accept: 'image/*',
    multiple: false,
    onDrop: acceptedFiles => {
      // console.log(acceptedFiles);
      var previewUrl = null;
      if (acceptedFiles.length > 0) {
        // console.log('dropzone', acceptedFiles[0])
        // keep jpegs as pngs for transparent background
        if (acceptedFiles[0].type === "image/jpeg") {
          setfileImageType("image/png");
        } else {
          setfileImageType(acceptedFiles[0].type);
        }
        previewUrl = URL.createObjectURL(acceptedFiles[0]);
      }
      let image = new Image();
      // console.log('on drop');
      image.onload = () => {
        // handle mobile low mem
        // CROPPER IS very slow on MOBILE...
        // ... so we need to resize the image
        var maxHt = areaHt;
        var maxWdth = finalCanvas.current.offsetWidth;

        var mobile = false;
        if (isIOS) {
          // set max height so as not to overload ios Memory, per:
          // https://github.com/fengyuanchen/cropperjs#known-issues
          if (1024 < maxWdth) {
            maxWdth = 1024;
          }
          if (1024 < maxHt) {
            maxHt = 1024;
          }
          mobile = true;

        }
        image = classifyImage(image, maxWdth, maxHt, mobile);
        goToStepTwo(image);

      };
      image.src = previewUrl;
    }
  });

  // react-cropper
  const cropperRef = React.useRef(null);
  const cropperCanvasSettings = {
    imageSmoothingQuality: "high",
  };
  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    // console.log(cropper.getCroppedCanvas().toDataURL());
    let image = new Image();
    image.onload = () => {
      image = classifyImage(image, finalCanvas.current.offsetWidth, areaHt, false);
      setfileCropped(image);
    };

    image.src = cropper.getCroppedCanvas(cropperCanvasSettings).toDataURL(fileImageType, 1);
  };

  const clearTheCanvas = () => {
    var canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');
    if (fileCropped) ctx.clearRect(0, 0, fileCropped.governing_width, fileCropped.governing_height);
    canvas.height = 0;
    canvas.style.height = 0;
  }

  // PIXELATED logo issue:
  // Canvases have two different 'sizes': their DOM width/height and their CSS width/height...
  // You can increase a canvas' resolution by increasing the DOM size while keeping the CSS size...
  // fixed, and then using the .scale() method to scale all of your future draws to the new bigger size.
  // https://stackoverflow.com/questions/14488849/higher-dpi-graphics-with-html5-canvas/26047748
  const drawCroppedCanvas = useCallback( () => {
    if (fileCropped) {
      // console.log('drawCroppedCanvas', image);
      // handle the click event
      var canvasOnly = canvasRef.current;
      // console.log(canvasOnly);
      var ctx = canvasOnly.getContext('2d');

      // console.log(image.governing_width, image.governing_height)
      // set canvas dims based on classifyImage results
      canvasOnly.style.height = fileCropped.governing_height + "px";
      canvasOnly.style.width = fileCropped.governing_width + "px";
      canvasOnly.height = fileCropped.governing_height;
      canvasOnly.width = fileCropped.governing_width;

      ctx.drawImage(fileCropped, 0, 0, fileCropped.governing_width, fileCropped.governing_height);
      setDPI();
      setCanvasListeners();
    }
    
  }, [setCanvasListeners, fileCropped]);

  function setDPI() {
    var canvas = canvasRef.current;
    // var dpi = 96*3;
    // var scaleFactor = dpi / 96;
    var scaleFactor = 3;
    
    // Set up CSS size.
    canvas.style.width = canvas.style.width || canvas.width + 'px';
    canvas.style.height = canvas.style.height || canvas.height + 'px';

    // console.log('setDpi', canvas.style.width, canvas.style.height);
    // Get size information.
    var width = parseFloat(canvas.style.width);
    var height = parseFloat(canvas.style.height);

    // Backup the canvas contents.
    var oldScale = canvas.width / width;
    var backupScale = scaleFactor / oldScale;
    var backup = canvas.cloneNode(false);
    backup.getContext('2d').drawImage(canvas, 0, 0);

    // Resize the canvas.
    var ctx = canvas.getContext('2d');
    canvas.width = Math.ceil(width * scaleFactor);
    canvas.height = Math.ceil(height * scaleFactor);

    // Redraw the canvas image and scale future draws.
    ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
    ctx.drawImage(backup, 0, 0);
    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
}

  const downloadImage = () => {
    console.log("downloadImage");
    // if an iOS non-safari browser tries to download then canvas.toBlob opens a new tab
    // this works for Chrome mobile, but not Brave since brave uses WebKit...
    if (isIOS && isMobile && !isMobileSafari) {
      // take us to uiStep(4)
      goToStepFour();
    } else {
      // polyfill for browsers...
      // using blueimp-canvas-to-blob
      console.log(canvasRef.current.toBlob);
      if (canvasRef.current.toBlob) {
        canvasRef.current.toBlob(function (blob) {
          console.log(blob);
          const anchor = document.createElement('a');
          anchor.download = 'sOhm-pfp'; // optional, but you can give the file a name
          anchor.href = URL.createObjectURL(blob);
          console.log(anchor);
          anchor.click();
          URL.revokeObjectURL(anchor.href); // remove it from memory
        }, fileImageType, 1);
      }
    }
  }

  const resizeStamp = (e, value) => {
    setStampSize({height: value, width: value});
  }

  const imageLoaded = () => {
    // this isn't quite working
    setIsLoading(false);
  }

  useEffect(() => {
    // needs to run when stampSize changes
    setCanvasListeners();
  }, [stampSize, setCanvasListeners, fileCropped]);

  return (
    <Zoom in={true}>
      <Paper className={`ohm-card`} elevation={3} style={compositorPaper}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Welcome, Incooohmer</Typography>
            </div>
          </Grid>
        </Grid>

        {/* Logo Resizing */}
        {uiStep === 3 &&
          <LogoResizer
            stampSrc={sOhm}
            stampHeight={stampSize.height}
            stampWidth={stampSize.width}
            defaultSize={sOhmSize}
            minSize={24}
            maxSize={200}
            resizeStamp={resizeStamp}
            imgStyle={{}}
          />
        }
        
        {/* working on loader */}
        {isLoading &&
          <CircularProgress />
        }

        {uiStep === 1 &&
          <div className="dropContainer" style={dropContainerStyle}>
            <div {...getRootProps({style: dropZoneReg})}>
              <input {...getInputProps()} />
              <Typography variant="h5" color="textSecondary">Set your pfp here. Click to Start.</Typography>
            </div>
          </div>
        }

        {uiStep === 2 && fileImage &&
          <div>
            <Cropper
              src={fileImage.src}
              style={{ margin: "auto", height: fileImage.governing_height, width: fileImage.governing_width }}
              // Cropper.js options
              aspectRatio={1}
              cropBoxResizable={false}
              dragMode={"crop"}
              guides={false}
              autoCropArea={1}
              crop={onCrop}
              ready={imageLoaded}
              ref={cropperRef}
            />
            <Box textAlign='center'>
              <Button variant="outlined" color="primary" onClick={goBackOneStep} style={outlineButton}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={goToStepThree} style={containerButton}>
                Crop pfp
              </Button>
            </Box>
          </div>
        }

        {/* Image Resizer was here... but didn't look right */}  
        {/* 
          Notes for below (Step 3): 
          1. canvas must ALWAYS be on screen
          2. when we don't want the CroppedCanvas to appear we change height to 0
        */}
        <div style={canvasContainer} ref={finalCanvas}>
          <canvas
            id="canvas"
            ref={canvasRef}
            style={canvasStyle}
            // className="canvasRendering"
            // width={window.innerWidth-10}
            height="0"
          >
          </canvas>
          {uiStep === 3 && fileCropped &&
            // {/*showCanvas && */}
            <Box textAlign='center'>
              <Button variant="outlined" color="primary" onClick={goBackOneStep} style={outlineButton}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={downloadImage} style={containerButton}>
                Download pfp
              </Button>
            </Box>
          }

          {uiStep === 4 &&
            <div>
              <img
                alt="finalImage"
                src={canvasRef.current.toDataURL(fileImageType, 1)}
                style={{
                  height: canvasRef.current.style.height,
                  width: canvasRef.current.style.width,
                }}
              />
              <Box textAlign='center' style={{marginTop: "-0.13rem"}}>
                <Button variant="outlined" color="primary" onClick={goBackOneStep} style={outlineButton}>
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={downloadImage} style={hiddenButton}>
                  Download pfp
                </Button>
              </Box>
            </div>
          }

          {/* below is screen size notation for debugging */}
          {/*<div>
            {windowSize.width}px / {windowSize.height}px
            {console.log(browser)}
            {console.log(UA)}
            {console.log(getUA)}
          </div>
          <div>
            <p>isIOS: {isIOS.toString()}</p>
            <p>isMobile: {isMobile.toString()}</p>
            <p>browserName: {browserName}</p>
            <p>isMobileSafariNotTrue: {(isMobileSafari !== true).toString()}</p>
          </div>
          
          <div style={{overflowWrap: "anywhere"}}>
            <p>{JSON.stringify(deviceDetect())}</p>
          </div>
          */}

        </div>
      </Paper>
    </Zoom>
  );
}

export default CompositorV2;
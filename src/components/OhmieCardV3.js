// OhmieCardV3.js
//
// OhmieCardV3 should be the compositor. Combines the three canvas layers:
// 1. BgCanvas.js
// 2. PfpCanvas.js
// 3. TextCanvas.js
//
// should allow users to turn on/off each of the three layers
// should allow users to switch back & forth to editing each of the three layers
//   - editing should occur within each layer.js component
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

import {useDropzone} from 'react-dropzone';

import "./stake.scss";

// import zeusImg from '../assets/Zeus_Full_Body.png';
import sOhm from '../assets/token_sOHM.png';
import classifyImage from "../helpers/classifyImage";

import useWindowSize from "../hooks/useWindowSize";
import { useEffect } from "react";

import PfpCanvas from "./PfpCanvas";
import BgCanvas from "./BgCanvas";

// var UAParser = require('ua-parser-js/dist/ua-parser.min');
// var UA = new UAParser();

// import { dark } from "../themes/dark";

const canvasContainer = {
  // display: 'flex',
  // flexDirection: 'row',
  // flexWrap: 'wrap',
  // marginTop: 16,
  margin: 'auto',
  width: "100%",
  position: "relative",
};

const canvasStyle = {
  margin: "auto",
  position: "absolute",
  top: 0,
  left: 0,
}

const dropContainerStyle = {
  display: "flex",
  flexFlow: "column wrap",
  justifyContent: "center"
  // backgroundColor: shade(dark.palette.background.paperBg, 0.5)
}

function CompositorV3(props) {

  const [stampFile, setStampFile] = useState(sOhm); 
  const sOhmSize = 60;

  const viewContainerRef = React.useRef(null);
  const bgCanvasRef = React.useRef(null);
  const pfpCanvasRef = React.useRef(null);
  const finalCanvasRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);
  const stampInputRef = React.useRef(null);

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
    alignItems: "center",
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
  const [croppedBg, setCroppedBg] = useState(false);
  const [uiStep, setuiStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stampSize, setStampSize] = useState({
    height: sOhmSize,
    width: sOhmSize,
  });

  const getViewWidth = () => {
    var element = viewContainerRef.current;
    var styles = window.getComputedStyle(element);
    var padding = parseFloat(styles.paddingLeft) +
                  parseFloat(styles.paddingRight);

    return element.clientWidth - padding;
  }
  // allows detects clicking on canvas & places image
  // will need to pass in:
  // whichCanvas
  // which image is drawn...
  const setCanvasListeners = useCallback(
    () => {
      var canvasOnly = pfpCanvasRef.current;
      var ctx = canvasOnly.getContext('2d');

      var logo = new Image();
      logo.src = stampFile;

      // When true, moving the mouse draws on the canvas
      let isDrawing = false;
      
      //////////// HISTORY
      // TODO (appleseed):
      // 1. height & width are fixed aspect ratio now...
      // 2. also won't want to redraw since this will apply to the pfpCanvas only. Just empty it
      var history = {
        restoreState: function() {
          ctx.clearRect(0, 0, croppedBg.governing_width, croppedBg.governing_height);
          // ctx.drawImage(croppedBg, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
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

          if (croppedBg) history.restoreState();
          ctx.drawImage(logo, (e.offsetX-(stampSize.width/2)), (e.offsetY-(stampSize.height/2)), stampSize.width, stampSize.height);

        }
      });

      window.addEventListener('mouseup', e => {
        if (isDrawing === true) {

          if (croppedBg) history.restoreState();

          ctx.drawImage(logo, (e.offsetX-(stampSize.width/2)), (e.offsetY-(stampSize.height/2)), stampSize.width, stampSize.height);

          isDrawing = false;
        }
      });
    }, [stampSize.height, stampSize.width, croppedBg, stampFile]
  );
    
  const step1Direction = {row: ""};
  const [directionState, setdirectionState] = useState(step1Direction);
  // const [secondaryDirection, setSecondaryDirection] = useState({row: ""});
  
  // uiSteps
  // 1. Click to start
  // 2. take user's image to cropper
  // 3. take user's cropped image to stamper
  // TODO fix these:
  // 4. Text setting
  // 5. download

  const goToStepTwo = (image) => {
    setfileImage(image);
    // setTextPromptState("Start Over");
    setdirectionState({row: "Crop your image, then click 'Crop pfp' at the bottom"});
    setIsLoading(true);
    canvasOrdering(2);
    setuiStep(2);
  }

  const canvasOrdering = (stepNumber) => {
    switch (stepNumber) {
      case 2:
        bgCanvasRef.current.style.zIndex=400;
        pfpCanvasRef.current.style.zIndex=300;
        // textCanvasRef.current.style.zIndex=200;
        canvasContainerRef.current.style.display = "none";
        break;
      case 3:
        pfpCanvasRef.current.style.zIndex=400;
        // textCanvasRef.current.style.zIndex=300;
        bgCanvasRef.current.style.zIndex=200;
        canvasContainerRef.current.style.display = "block";
        break;
      case 4:
        // textCanvasRef.current.style.zIndex=400;
        pfpCanvasRef.current.style.zIndex=300;
        bgCanvasRef.current.style.zIndex=200;
        canvasContainerRef.current.style.display = "block";
        break;
      default:
        // texCanvasRef.current.style.zIndex=400;
        pfpCanvasRef.current.style.zIndex=300;
        bgCanvasRef.current.style.zIndex=200;
        canvasContainerRef.current.style.display = "block";
    }
  }

  const goToStepThree = (sameCanvas) => {
    // setdirectionState({
    //   row: "Three steps here, fren:",
    //   row2: "1. Resize your logo w/ the slider",
    //   row3: "2. Click to place your logo",
    //   row4: "3. Click 'Download pfp' at the bottom",
    // });
    setdirectionState({
      row: "Click to place your logo, then click 'Download pfp' at the bottom"
    });

    // which canvas should be shown?
    // pfpCanvas on top textCanvas on top of BgCanvas
    canvasOrdering(3);

    // clear the canvas...
    if (sameCanvas !== true) {
      clearTheCanvas();
      drawCroppedCanvas();
    }
    setuiStep(3);
  }

  // this only happens for iOSMobile, non-Safari users
  const goToStepFour = () => {
    setdirectionState({row: "Long-press to save, Incooohmer"});
    // must set display.none rather than height 0
    // height 0 doesn't allow the image to be created...
    bgCanvasRef.current.style.display="none";
    pfpCanvasRef.current.style.display="none";
    canvasOrdering(4);
    setuiStep(4);
  }

  const goBackOneStep = () => {
    if (uiStep === 3) {
      // go to step 2
      clearTheCanvas();
      goToStepTwo(fileImage);
    } else if (uiStep === 2) {
      clearTheCanvas();
      setdirectionState(step1Direction);
      setuiStep(1);
    } else if (uiStep === 4) {
      // make the canvas show again
      bgCanvasRef.current.style.display="block";
      pfpCanvasRef.current.style.display="block";
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
        // var maxWdth = canvasContainerRef.current.offsetWidth;
        var maxWdth = getViewWidth();

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
  const cropperContainerRef = React.useRef(null);
  
  // PIXELATED logo issue:
  // Canvases have two different 'sizes': their DOM width/height and their CSS width/height...
  // You can increase a canvas' resolution by increasing the DOM size while keeping the CSS size...
  // fixed, and then using the .scale() method to scale all of your future draws to the new bigger size.
  // https://stackoverflow.com/questions/14488849/higher-dpi-graphics-with-html5-canvas/26047748
  const drawCroppedCanvas = useCallback( () => {

    // set all Canvases to the backgrounds SIZE
    const setCanvasDims = () => {
      // set container height
      canvasContainerRef.current.style.height = croppedBg.governing_height + "px";

      bgCanvasRef.current.style.height = croppedBg.governing_height + "px";
      bgCanvasRef.current.style.width = croppedBg.governing_width + "px";
      bgCanvasRef.current.height = croppedBg.governing_height;
      bgCanvasRef.current.width = croppedBg.governing_width;
      
      
      // set other canvas heights
      pfpCanvasRef.current.style.height = bgCanvasRef.current.style.height;
      pfpCanvasRef.current.style.width = bgCanvasRef.current.style.width;
      pfpCanvasRef.current.height = bgCanvasRef.current.height;
      pfpCanvasRef.current.width = bgCanvasRef.current.width;
      finalCanvasRef.current.style.height = bgCanvasRef.current.style.height;
      finalCanvasRef.current.style.width = bgCanvasRef.current.style.width;
      finalCanvasRef.current.height = bgCanvasRef.current.height;
      finalCanvasRef.current.width = bgCanvasRef.current.width;

    }

    if (croppedBg) {
      // console.log('drawCroppedCanvas', image);
      // handle the click event
      // console.log(canvasOnly);
      var ctx = bgCanvasRef.current.getContext('2d');

      // console.log(image.governing_width, image.governing_height)
      // set canvas dims based on classifyImage results
      setCanvasDims();

      ctx.drawImage(croppedBg, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
      setDPI();
      setCanvasListeners();
    }
    
  }, [setCanvasListeners, croppedBg]);

  // TODO (appleseed):
  // I think we'll want to setDPI on pfpCanvasRef
  // ... but size based on bgCanvasRef
  function setDPI() {
    var pfpCanvas = pfpCanvasRef.current;
    var bgCanvas = bgCanvasRef.current;
    // var dpi = 96*3;
    // var scaleFactor = dpi / 96;
    var scaleFactor = 3;
    
    // Set up CSS size.
    pfpCanvas.style.width = bgCanvas.style.width || bgCanvas.width + 'px';
    pfpCanvas.style.height = bgCanvas.style.height || bgCanvas.height + 'px';

    // console.log('setDpi', canvas.style.width, canvas.style.height);
    // Get size information.
    var width = parseFloat(pfpCanvas.style.width);
    var height = parseFloat(pfpCanvas.style.height);

    // Backup the canvas contents.
    var oldScale = pfpCanvas.width / width;
    var backupScale = scaleFactor / oldScale;
    var backup = pfpCanvas.cloneNode(false);
    backup.getContext('2d').drawImage(pfpCanvas, 0, 0);

    // Resize the canvas.
    var ctx = pfpCanvas.getContext('2d');
    pfpCanvas.width = Math.ceil(width * scaleFactor);
    pfpCanvas.height = Math.ceil(height * scaleFactor);

    // Redraw the canvas image and scale future draws.
    ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
    ctx.drawImage(backup, 0, 0);
    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
  }

  // for bgCanvas
  // or maybe multiple?
  const clearTheCanvas = () => {
    // var canvas = canvasRef.current;
    var ctx = bgCanvasRef.current.getContext('2d');
    if (croppedBg) ctx.clearRect(0, 0, croppedBg.governing_width, croppedBg.governing_height);
    bgCanvasRef.current.height = 0;
    bgCanvasRef.current.style.height = 0;
  }

  const drawFinalCanvas = () => {
    var ctx = finalCanvasRef.current.getContext('2d');
    ctx.drawImage(bgCanvasRef.current, 0, 0, finalCanvasRef.current.width, finalCanvasRef.current.height);
    ctx.drawImage(pfpCanvasRef.current, 0, 0, finalCanvasRef.current.width, finalCanvasRef.current.height);
    // draw Text
  }

  const downloadImage = () => {
    // first combine the canvases onto finalCanvasRef
    drawFinalCanvas();
    // if an iOS non-safari browser tries to download then canvas.toBlob opens a new tab
    // this works for Chrome mobile, but not Brave since brave uses WebKit...
    if (isIOS && isMobile && !isMobileSafari) {
      // take us to uiStep(4)
      goToStepFour();
    } else {
      // polyfill for browsers...
      // using blueimp-canvas-to-blob
      if (finalCanvasRef.current.toBlob) {
        finalCanvasRef.current.toBlob(function (blob) {
          const anchor = document.createElement('a');
          anchor.download = "ohmie-card"; // optional, but you can give the file a name
          anchor.href = URL.createObjectURL(blob);
          anchor.click();
          URL.revokeObjectURL(anchor.href); // remove it from memory
        }, fileImageType, 1);
      }
    }
  }

  const imageLoaded = () => {
    // this isn't quite working
    setIsLoading(false);
  }

  useEffect(() => {
    // needs to run when stampSize changes
    setCanvasListeners();
  }, [stampSize, setCanvasListeners, croppedBg, stampFile]);

  return (
    <Zoom in={true}>
      <Paper ref={viewContainerRef} className={`ohm-card`} elevation={3} style={compositorPaper}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Welcome, Incooohmer</Typography>
            </div>
          </Grid>
        </Grid>

        {/* direction text */}
        {Object.entries(directionState).map(([key, value]) => (
          <Typography key={key} variant="h5" color="textSecondary" style={{marginBottom: "0.5rem"}}>{value}</Typography>
        ))}

        {/* Logo Resizing */}
        {uiStep === 3 &&
          <PfpCanvas
            ref={{stampInputRef: stampInputRef}}
            setStampSize={setStampSize}
            setStampFile={setStampFile}
            stampFile={stampFile}
            stampSize={stampSize}
            sOhmSize={sOhmSize}
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
              <div  style={{flexGrow: "1", display: "flex", alignItems: "center"}}>
                <Typography variant="h5" color="textSecondary">Upload your background. Click to Start.</Typography>
              </div>
              
              <div style={{flexGrow: "0"}}>
                <div style={{display: "flex", flexFlow: "column wrap"}}>
                  <Typography variant="body1" style={{marginTop: "0.25rem"}}>Optimal Aspect Ratio: 1013/446 (width/height).</Typography>
                  <Typography variant="body1" style={{margin: "0.1rem"}}>Don't worry, fren. You can crop on next step.</Typography>
                </div>
              </div>
            </div>
          </div>
        }

        {uiStep === 2 && fileImage &&
          <BgCanvas
            ref={{cropperRef: cropperRef, cropperContainerRef: cropperContainerRef}}
            imageLoaded={imageLoaded}
            setCroppedBg={setCroppedBg}
            goBackOneStep={goBackOneStep}
            goToStepThree={goToStepThree}
            fileImage={fileImage}
            outlineButtonStyle={outlineButton}
            containerButtonStyle={containerButton}
            areaHt={areaHt}
            fileImageType={fileImageType}
            containerStyle={dropContainerStyle}
          />
        }

        {/* Image Resizer was here... but didn't look right */}  
        {/* 
          Notes for below (Step 3): 
          1. canvas must ALWAYS be on screen
          2. when we don't want the CroppedCanvas to appear we change height to 0
        */}
        <Box style={canvasContainer} ref={canvasContainerRef}>
          <canvas
            id="bgCanvas"
            ref={bgCanvasRef}
            style={canvasStyle}
            // className="canvasRendering"
            // width={window.innerWidth-10}
            height="0"
          ></canvas>
          <canvas
            id="pfpCanvas"
            ref={pfpCanvasRef}
            style={canvasStyle}
            // className="canvasRendering"
            // width={window.innerWidth-10}
            height="0"
          ></canvas>
          <canvas
            id="canvas"
            ref={finalCanvasRef}
            style={canvasStyle}
            // className="canvasRendering"
            // width={window.innerWidth-10}
            height="0"
          ></canvas>
        </Box>
        {uiStep === 3 && croppedBg &&
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
              src={finalCanvasRef.current.toDataURL(fileImageType, 1)}
              style={{
                height: finalCanvasRef.current.style.height,
                width: finalCanvasRef.current.style.width,
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
      </Paper>
    </Zoom>
  );
}

export default CompositorV3;
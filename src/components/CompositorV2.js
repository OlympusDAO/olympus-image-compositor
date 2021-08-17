import {
  Grid,
  Box,
  Paper,
  Typography,
  // FormControl,
  // InputAdornment,
  // InputLabel,
  // OutlinedInput,
  Button,
  // SvgIcon,
  // Tab,
  // Tabs,
  // TableHead,
  // TableCell,
  // TableBody,
  // Table,
  // TableRow,
  // TableContainer,
  // Link,
  Zoom,
} from "@material-ui/core";
import {
  isIOS,
} from "react-device-detect";

import React, {useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "./stake.scss";

import zeusImg from '../assets/Zeus_Full_Body.png';
import sOhm from '../assets/token_sOHM.png';
import classifyImage from "../helpers/classifyImage";

import useWindowSize from "../hooks/useWindowSize";
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

  function draw(baseImg) {
    if (baseImg === undefined) {
      baseImg = zeusImg;
    };
    var canvasOnly = canvasRef.current
    var ctx = canvasOnly.getContext('2d');
    
    //////////// HISTORY
    var history = {
      redo_list: [],
      undo_list: [],
      restoreState: function() {
        ctx.clearRect(0, 0, baseImg.governing_width, baseImg.governing_height);
        ctx.drawImage(baseImg, 0, 0, baseImg.governing_width, baseImg.governing_height);  
      }
    }
    ///////////////

    var logo = new Image();
    logo.src = sOhm;

    // When true, moving the mouse draws on the canvas
    let isDrawing = false;
    // let x = 0;
    // let y = 0;

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
        history.restoreState();
        ctx.drawImage(logo, e.offsetX-30, e.offsetY-30, sOhmSize, sOhmSize);
        // drawLine(context, x, y, e.offsetX, e.offsetY);
        // x = e.offsetX;
        // y = e.offsetY;
      }
    });

    window.addEventListener('mouseup', e => {
      if (isDrawing === true) {
        // history.undo(canvasOnly, ctx);
        history.restoreState();

        ctx.drawImage(logo, e.offsetX-30, e.offsetY-30, sOhmSize, sOhmSize);
        // drawLine(context, x, y, e.offsetX, e.offsetY);
        // x = 0;
        // y = 0;
        isDrawing = false;
      }
    });
  }

  const canvasRef = React.useRef(null);
  const finalCanvas = React.useRef(null);

  const windowSize = useWindowSize();

  const areaHt = (windowSize.height*0.7 ) || 0;

  const compositorPaper = {
    padding: "15px",
    textAlign: "center",
    // marginBottom: "20px",
  }

  const stakeStyle = {
    justifyContent: "start",
    overflow: "auto",
    height: windowSize.height
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

  const [fileImage, setfileImage] = useState(false);
  const [fileImageType, setfileImageType] = useState("image/png");
  const [fileCropped, setfileCropped] = useState(false);
  const [uiStep, setuiStep] = useState(1);
  const step1Text = "Set your pfp here. Click to Start.";
  const step1Direction = "";
  // const [textPromptState, setTextPromptState] = useState(step1Text);
  const [directionState, setdirectionState] = useState(step1Direction);
  
  // uiSteps
  // 1. Click to start
  // 2. take user's image to cropper
  // 3. take user's cropped image to stamper

  const goToStepTwo = (image) => {
    setfileImage(image);
    // setTextPromptState("Start Over");
    setdirectionState("Crop your image, then click 'Crop pfp' at the bottom");
    setuiStep(2);
  }

  const goToStepThree = () => {
    // setTextPromptState("Back to Cropping");
    setdirectionState("Click to place sOHM Logo, then click 'Download pfp' at the bottom");
    // clear the canvas...
    clearTheCanvas(fileCropped);
    drawCroppedCanvas(fileCropped);
    setuiStep(3);
  }

  const goBackOneStep = () => {
    if (uiStep === 3) {
      // go to step 2
      clearTheCanvas(fileCropped);
      goToStepTwo(fileImage);
    } else if (uiStep === 2) {
      clearTheCanvas(fileCropped);
      setdirectionState(step1Direction);
      setuiStep(1);
      
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
        // console.log('img load');

        // handle mobile low mem
        // CROPPER IS very slow on MOBILE...
        // ... so we need to resize the image
        var maxHt = areaHt;
        var maxWdth = finalCanvas.current.offsetWidth;
        console.log('maxwdith', maxWdth);
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

  const clearTheCanvas = (image) => {
    var canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, image.governing_width, image.governing_height);
    canvas.height = 0;
    canvas.style.height = 0;
  }

  // PIXELATED logo issue:
  // Canvases have two different 'sizes': their DOM width/height and their CSS width/height...
  // You can increase a canvas' resolution by increasing the DOM size while keeping the CSS size...
  // fixed, and then using the .scale() method to scale all of your future draws to the new bigger size.
  // https://stackoverflow.com/questions/14488849/higher-dpi-graphics-with-html5-canvas/26047748
  const drawCroppedCanvas = (image) => {
    // console.log('drawCroppedCanvas', image);
    // handle the click event
    var canvasOnly = canvasRef.current;
    // console.log(canvasOnly);
    var ctx = canvasOnly.getContext('2d');

    // console.log(image.governing_width, image.governing_height)
    // set canvas dims based on classifyImage results
    canvasOnly.style.height = image.governing_height + "px";
    canvasOnly.style.width = image.governing_width + "px";
    canvasOnly.height = image.governing_height;
    canvasOnly.width = image.governing_width;

    ctx.drawImage(image, 0, 0, image.governing_width, image.governing_height);
    setDPI();
    draw(image);
  }

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
    // var link = document.createElement('a');
    // link.download = 'sOhmTag.png';
    // console.log('download', canvasRef.current.toDataURL(fileImageType, 1));
    // link.style.display = 'none';
    

    // link.href = canvasRef.current.toDataURL(fileImageType, 1);

    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    ////// OLD WAY ^^^^
    ////// NEW WAY
    // using blueimp-canvas-to-blob
    if (canvasRef.current.toBlob) {
      canvasRef.current.toBlob(function (blob) {
        const anchor = document.createElement('a');
        anchor.download = 'sOhm-pfp.jpg'; // optional, but you can give the file a name
        anchor.href = URL.createObjectURL(blob);

        anchor.click(); // ✨ magic!

        URL.revokeObjectURL(anchor.href); // remove it from memory and save on memory! 😎
      }, fileImageType, 1);
    }  
  }

  useEffect(() => {
    // adding canvas-to-blob script    
    const script = document.createElement('script');
    script.src = "../assets/js/canvas-to-blob.min.js";
    script.type = "text/jsx";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }

    // controlling when re-render occurs (only via uiStep state change)
  }, [uiStep]);

  return (
    <div id="stake-view" style={stakeStyle}>
      <Zoom in={true}>
        <Paper className={`ohm-card`} elevation={3} style={compositorPaper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Welcome, Incooohmer</Typography>
              </div>
            </Grid>
          </Grid>

          <Typography variant="h5" color="textSecondary" style={{marginBottom: "0.5rem"}}>{directionState}</Typography>
          
          {uiStep === 1 &&
            <div className="dropContainer" style={dropContainerStyle}>
              <div {...getRootProps({style: dropZoneReg})}>
                <input {...getInputProps()} />
                <Typography variant="h5" color="textSecondary">{step1Text}</Typography>
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

            {/* below is screen size notation for debugging */}
            <div>
              {windowSize.width}px / {windowSize.height}px
            </div>

          </div>
        </Paper>
      </Zoom>
    </div>
  );
}

export default CompositorV2;
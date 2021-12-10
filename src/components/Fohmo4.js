import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Fade,
} from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
  isIOS,
  isMobile,
  isMobileSafari,
  // browser,
  // getUA,
  // deviceDetect,
  // browserName
} from "react-device-detect";

import React, { useState, useCallback } from 'react';

import { useHistory } from "react-router-dom";

import FohmoDownloader from "./FohmoDownloader.js";
import WelcomeHeadline from "./WelcomeHeadline.js";
import CloudUploadIcon from "./CloudUploadIcon.js";
import ShareOnTwitter from "./ShareOnTwitter.js";


import { useDropzone } from 'react-dropzone';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "./stake.scss";

import sOhm from '../assets/token_Ohm.svg';
import fohmoCircle from '../assets/Fohmo4_Circle.svg';

import classifyImage, { classifyOhmieImage } from "../helpers/classifyImage";
import { getViewWidth } from "../helpers/index.js";

import useWindowSize from "../hooks/useWindowSize";
import { useEffect } from "react";

// var UAParser = require('ua-parser-js/dist/ua-parser.min');
// var UA = new UAParser();

const canvasStyle = {
  margin: "auto",
  display: "block",
  // position: "absolute",
  // top: 0,
  // left: 0,
  borderRadius: "16px",
};

const dropContainerStyle = {
  display: "flex",
  flexFlow: "column wrap",
  justifyContent: "center",
  // width: "100%",
  alignItems: "center",
  // backgroundColor: shade(dark.palette.background.paperBg, 0.5)
}

function Fohmo(props) {
  let history = useHistory();
  // TODO verify screen queries
  const medScreen = useMediaQuery('(min-width:800px)');

  const [fadeTransition, setFadeTransition] = useState(true);
  const fadeOutMs = 333;
  const sOhmSize = 120;

  const viewContainerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const finalCanvas = React.useRef(null);

  const windowSize = useWindowSize();

  const areaHt = (windowSize.height * 0.6) || 0;
  const areaMaxWd = windowSize.width * 0.8;
  var areaWd;
  if (medScreen) {
    areaWd = areaHt;
  } else {
    areaWd = areaMaxWd;
  }


  const canvasContainer = {
    display: 'flex',
    flexDirection: 'row',
    // flexWrap: 'wrap',
    // marginTop: 16,
    // margin: 'auto',
    // width: (areaWd-20),
    // marginRight: "10px",
  };

  const cropperCanvasContainer = {
    width: (areaWd + 20),
    margin: "10px",
    borderRadius: "16px",
  };

  const dropZoneReg = {
    display: "flex",
    flexFlow: "column wrap",
    cursor: "pointer",
    height: areaHt,
    width: areaWd,
    alignItems: "center",
  };

  const getDropZoneStyle = () => {
    if (!medScreen) {
      return dropZoneReg;
    } else {
      return  Object.assign({}, dropZoneReg, {justifyContent: "center"});
    }
  };

  const [fileImage, setfileImage] = useState(false);
  const [fileImageType, setfileImageType] = useState("image/png");
  const [fileCropped, setfileCropped] = useState(false);
  const [uiStep, setuiStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // todo (appleseed) unnecessary
  const [stampSize, setStampSize] = useState({
    height: sOhmSize,
    width: sOhmSize,
  });

  // const setCanvasListeners = useCallback(
  //   () => {
  //     var canvasOnly = canvasRef.current;
  //     var ctx = canvasOnly.getContext('2d');

  //     var logo = new Image();
  //     logo.src = sOhm;

  //     // When true, moving the mouse draws on the canvas
  //     let isDrawing = false;

  //     //////////// HISTORY
  //     var history = {
  //       restoreState: function() {
  //         ctx.clearRect(0, 0, fileCropped.governing_width, fileCropped.governing_height);

  //         ctx.imageSmoothingEnabled = true;
  //         ctx.imageSmoothingQuality = "high";
  //         ctx.drawImage(fileCropped, 0, 0, 2 * fileCropped.governing_width, 2 * fileCropped.governing_height);  
  //       }
  //     }
  //     ///////////////

  //     // Add the event listeners for mousedown, mousemove, and mouseup
  //     canvasOnly.addEventListener('mousedown', e => {
  //       isDrawing = true;
  //     });

  //     // drawImage usage
  //     // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  //     canvasOnly.addEventListener('mousemove', e => {
  //       if (isDrawing === true) {
  //         // ctx.drawImage(image, dx, dy, dWidth, dHeight);
  //         // history.undo(canvasOnly, ctx);
  //         if (fileCropped) history.restoreState();

  //         ctx.imageSmoothingEnabled = true;
  //         ctx.imageSmoothingQuality = "high";
  //         ctx.drawImage(logo, 2 * (e.offsetX-(stampSize.width/2)), 2 * (e.offsetY-(stampSize.height/2)), 2 * stampSize.width, 2 * stampSize.height);
  //         // drawLine(context, x, y, e.offsetX, e.offsetY);
  //         // x = e.offsetX;
  //         // y = e.offsetY;
  //       }
  //     });

  //     window.addEventListener('mouseup', e => {
  //       if (isDrawing === true) {
  //         // history.undo(canvasOnly, ctx);
  //         if (fileCropped) history.restoreState();

  //         ctx.imageSmoothingEnabled = true;
  //         ctx.imageSmoothingQuality = "high";
  //         ctx.drawImage(logo, 2 * (e.offsetX-(stampSize.width/2)), 2 * (e.offsetY-(stampSize.height/2)), 2 * stampSize.width, 2 * stampSize.height);
  //         // drawLine(context, x, y, e.offsetX, e.offsetY);
  //         // x = 0;
  //         // y = 0;
  //         isDrawing = false;
  //       }
  //     });
  //   }, [stampSize.height, stampSize.width, fileCropped]
  // );

  // react-cropper
  const cropperRef = React.useRef(null);
  const cropperCanvasSettings = {
    imageSmoothingQuality: "high",
  };

  // uiSteps
  // 1. Click to start
  // 2. take user's image to cropper
  // 3. take user's cropped image to stamper

  const goToStepTwo = (image) => {
    setfileImage(image);
    // setTextPromptState("Start Over");
    // setIsLoading(true);
    // setuiStep(2);
    goToStepThree();
  }

  const goToStepThree = (sameCanvas) => {
    // clear the canvas...
    if (sameCanvas !== true) {
      // clearTheCanvas();
      drawCroppedCanvas();
    }
    setuiStep(3);
  }

  // this only happens for iOSMobile, non-Safari users
  const goToStepFour = () => {
    // must set display.none rather than height 0
    // height 0 doesn't allow the image to be created...
    canvasRef.current.style.display = "none";
    setuiStep(4);
  }

  const goBackOneStep = () => {
    if (uiStep === 3) {
      // go to step 2
      // clearTheCanvas();
      goToStepTwo(fileImage);
    } else if (uiStep === 2) {
      // clearTheCanvas();
      setuiStep(1);
    } else if (uiStep === 4) {
      // make the canvas show again
      canvasRef.current.style.display = "block";
      goToStepThree(true);
    }
  }

  // STEP 1
  // dropzone handling
  const { getRootProps, getInputProps } = useDropzone({
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
        // var maxWdth = finalCanvas.current.offsetWidth;
        // var maxWdth = areaMaxWd;
        var maxWdth = getViewWidth(viewContainerRef);

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

  const getRoundedCanvas = (sourceCanvas) => {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    // var canvas = canvasRef.current;
    // var context = canvas.getContext('2d');
    var width = sourceCanvas.width * 0.95;
    var height = sourceCanvas.height * 0.95;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }

  const onCrop = () => {
    console.log("on crop");
    // const imageElement = cropperRef?.current;
    const cropper = cropperRef?.current?.cropper;
    console.log("cropper", cropper);
    // console.log(cropper.getCroppedCanvas().toDataURL());
    let image = new Image();
    image.onload = () => {
      // image = classifyImage(image, finalCanvas.current.offsetWidth, areaHt, false);
      // image = classifyImage(image, areaMaxWd, areaHt, false);
      // should be the smaller of areaMaxWd & fixedWidth
      // let governingWidth;
      // if (areaMaxWd > fixedWidth) {
      //   governingWidth = fixedWidth;
      // } else {
      //   governingWidth = areaMaxWd;
      // }
      console.log("parent", fileImage);
      image = classifyOhmieImage(image, fileImage.parentWidth * 0.9, fileImage.parentWidth * 0.9, false);
      setfileCropped(image);
    };

    // image.src = cropper.getCroppedCanvas(cropperCanvasSettings).toDataURL(fileImageType, 1);
    let croppedCanvas = cropper.getCroppedCanvas(cropperCanvasSettings);
    if (croppedCanvas.width !== 0 & croppedCanvas.height !== 0) {
      image.src = getRoundedCanvas(croppedCanvas).toDataURL(fileImageType, 1);
    }

  };

  // const clearTheCanvas = () => {
  //   var canvas = canvasRef.current;
  //   var ctx = canvas.getContext('2d');
  //   if (fileCropped) ctx.clearRect(0, 0, fileCropped.governing_width, fileCropped.governing_height);
  //   if (medScreen) {
  //     canvas.width = 0;
  //     canvas.style.width = 0;
  //   } else {
  //     canvas.height = 0;
  //     canvas.style.height = 0;
  //   }

  // }

  // PIXELATED logo issue:
  // Canvases have two different 'sizes': their DOM width/height and their CSS width/height...
  // You can increase a canvas' resolution by increasing the DOM size while keeping the CSS size...
  // fixed, and then using the .scale() method to scale all of your future draws to the new bigger size.
  // https://stackoverflow.com/questions/14488849/higher-dpi-graphics-with-html5-canvas/26047748
  const drawCroppedCanvas = useCallback(() => {
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
      canvasOnly.height = 2 * fileCropped.governing_height;
      canvasOnly.width = 2 * fileCropped.governing_width;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      let percentW = 1.8;
      let percentP = (2 - percentW) / 2;


      ctx.drawImage(fileCropped, percentP * fileCropped.governing_width, percentP * fileCropped.governing_height, percentW * fileCropped.governing_width, percentW * fileCropped.governing_height);
      // setCanvasListeners();
      // placeBorderSvg();
      var logo = new Image();
      logo.src = fohmoCircle;
      logo.onload = () => {

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(logo, 0, 0, 2 * fileCropped.governing_width, 2 * fileCropped.governing_height);
        
      }

    }

  }, [fileCropped]);

  const downloadImage = () => {
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
    setStampSize({ height: value, width: value });
  }

  const imageLoaded = () => {
    // this isn't quite working
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.zoom(0.1);
    setIsLoading(false);
  };

  const objectFromScreenWidth = () => {
    console.log("objectFromScreenWidth")
    if (medScreen) {
      return 0;
    } else {
      return areaWd - 20;
    }
  };

  const objectFromScreenHeight = () => {
    if (medScreen) {
      return areaHt - 20;
    } else {
      return 0;
    }
  };

  // const rightSideContainerWidth = () => {
  //   // console.log('width', parseFloat(canvasRef.current.style.width)*3/4);
  //   return parseFloat(canvasRef.current.style.width) * 7 / 8;
  // }

  const goBackToRoot = () => {
    setFadeTransition(false);
    setTimeout(() => {
      // setFadeTransition(true);
      history.push("/");
    }, fadeOutMs * 0.75);
  };

  const goBackToStart = () => {
    setFadeTransition(false);
    setTimeout(() => {
      // setFadeTransition(true);
      window.location.reload();
    }, fadeOutMs * 0.33);
  };

  // useEffect(() => {
  //   // needs to run when stampSize changes
  //   placeBorderSvg();
  // }, [stampSize, placeBorderSvg, fileCropped]);

  useEffect(() => {
    if (uiStep === 3) {
      function handleResize() {
        drawCroppedCanvas();
      }
      window.addEventListener('resize', handleResize);
    }
  }, [drawCroppedCanvas, uiStep]);

  useEffect(() => {
    if (uiStep === 3) {
      drawCroppedCanvas();
        function handleResize() {
          drawCroppedCanvas();
        }
        window.addEventListener('resize', handleResize);
    }
  }, [drawCroppedCanvas, fileCropped, uiStep]);


  return (
    <Fade in={fadeTransition} timeout={{ enter: fadeOutMs, exit: fadeOutMs }}>
      <Box id="fohmo-container" display="flex" flexDirection="column">
        <WelcomeHeadline headline={"Proof of Fohmo"} subText={"Get ready for Fohmo ohmie."} />

        {/*<Box className="card-nav" elevation={3} style={compositorPaper}>*/}
        <Box id="outer-wrap" display="flex" justifyContent="center" className={uiStep === 3 ? ("module-border-wrap bg-colored") : ("module-border-wrap circle-div")} style={{alignSelf: "center" }}>
          <Box display="flex" alignItems="center" className={uiStep === 3 ? ("module bg-colored") : ("module circle-div")}>
            <Box className="pof-box">
              <Box
                id="viewContainer"
                ref={viewContainerRef}
                // className={medScreen && uiStep === 3 ? (
                //   "inner-pof-box rectangle-2-backdrop row-reverse-div bg-colored"
                // ) : medScreen ? (
                //   "inner-pof-box rectangle-2-backdrop row-reverse-div circle-div"
                // ) : uiStep === 3 ? (
                //   "inner-pof-box rectangle-2-backdrop column-flow-div bg-colored"
                // ) : (
                //   "inner-pof-box rectangle-2-backdrop column-flow-div circle-div"
                // )}
                className={uiStep === 3 ? (
                  "inner-pof-box rectangle-2-backdrop column-flow-div bg-colored"
                ) : (
                  "inner-pof-box rectangle-2-backdrop column-flow-div circle-div"
                )}
                // style={medScreen ? ({flexFlow: "row-reverse"}) : ({flexFlow: "column", justifyContent: "space-between"})}
                style={uiStep === 1 ? (
                  {maxWidth: areaWd, maxHeight: areaWd }
                ) : ({display: "flex"})}
              >

                {/* working on loader */}
                {isLoading &&
                  <CircularProgress />
                }

                {uiStep === 1 &&
                  <div className="dropContainer" style={dropContainerStyle}>
                    <div id="dropzone-reg" {...getRootProps({ style: getDropZoneStyle() })}>
                      <input {...getInputProps()} />
                      <Box className="dropzone-interior-container vertical-centered-flex">
                        <Box><CloudUploadIcon viewBox="0 0 102 48" /></Box>
                        <Box className="vertical-centered-flex">
                          <Typography className="pof-dropbox-text">Drag and Drop here</Typography>
                          {/* <Typography className="pof-dropbox-text">or</Typography> */}
                        </Box>
                        {/*<Button
                          id="upload-pfp-button"
                          variant="contained"
                          className="ohmie-button"
                        >
                          <Typography className="btn-text">Upload file</Typography>
                        </Button>*/}
                      </Box>
                    </div>
                  </div>
                }

                {uiStep === 3 && fileImage && !fileCropped &&
                  <div>
                    <Cropper
                      id="cropper-js"
                      src={fileImage.src}
                      // style={{ margin: "auto", height: fileImage.governing_height, width: fileImage.governing_width }}
                      style={cropperCanvasContainer}
                      // Cropper.js options
                      aspectRatio={1}
                      cropBoxResizable={false}
                      // cropBoxMovable={false}
                      dragMode={"crop"}
                      guides={false}
                      autoCropArea={1}
                      crop={onCrop}
                      ready={imageLoaded}
                      ref={cropperRef}
                    />
                  </div>
                }

                {/* Image Resizer was here... but didn't look right */}
                {/* 
                  Notes for below (Step 3): 
                  1. canvas must ALWAYS be on screen
                  2. when we don't want the CroppedCanvas to appear we change height to 0
                */}
                <div id="pof-canvas-container" display="flex" style={canvasContainer} ref={finalCanvas}>
                  <canvas
                    id="canvas"
                    ref={canvasRef}
                    style={canvasStyle}
                    className="canvasRendering"
                    width={objectFromScreenWidth()}
                    height={objectFromScreenHeight()}
                  >
                  </canvas>

                  {uiStep === 4 &&
                    <Box display="flex" className="vertical-centered-flex">
                      <img
                        alt="finalImage"
                        src={canvasRef.current.toDataURL(fileImageType, 1)}
                        style={{
                          height: canvasRef.current.style.height,
                          width: canvasRef.current.style.width,
                          borderRadius: "16px",
                        }}
                      />
                      <Box display="flex" className="vertical-centered-flex">
                        <Box className="vertical-centered-flex">
                          <Typography className="pof-dropbox-text">Long Press / Right Click</Typography>
                          <Typography className="pof-dropbox-text">to save, Incooohmer</Typography>
                        </Box>
                        <Button
                          id="upload-pfp-button"
                          variant="outlined"
                          className="outlined-ohmie-button"
                          onClick={goBackOneStep}
                        >
                          <Typography className="btn-text">Back</Typography>
                        </Button>
                      </Box>
                    </Box>
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
                {/* Logo Resizing */}
              </Box>
            </Box>
          </Box>
        </Box>
        {uiStep === 1 &&
          <Box className="two-btns-horizontal">
            <Button
              id="upload-pfp-button"
              variant="contained"
              className="ohmie-button"
              onClick={goBackToRoot}
            >
              <Typography className="btn-text">Take Me Back Ser</Typography>
            </Button>
          </Box>
        }
        {uiStep === 2 && fileImage &&
          <Box className="two-btns-horizontal">
            <Button
              id="upload-pfp-button"
              variant="contained"
              className="ohmie-button"
              onClick={goBackOneStep}
            >
              <Typography className="btn-text">Take Me Back Ser</Typography>
            </Button>
            <Button
              id="upload-pfp-button"
              variant="contained"
              className="ohmie-button"
              onClick={goToStepThree}
            >
              <Typography className="btn-text">Confirm</Typography>
            </Button>
          </Box>
        }
        {uiStep === 3 &&
          <>
            <Box id="stamper-box" display="flex" className="share-btns">
              <FohmoDownloader
                stampSrc={sOhm}
                stampHeight={stampSize.height}
                stampWidth={stampSize.width}
                defaultSize={sOhmSize}
                minSize={24}
                maxSize={200}
                resizeStamp={resizeStamp}
                medScreen={medScreen}
                directionText={"Resize and place your sOHM"}
                goBackToStart={goBackToStart}
                downloadImage={downloadImage}
                downloadText={"Download"}
                containerHeight={objectFromScreenHeight() * 0.80}
                buttonsContainerStyle={!medScreen ? (
                  {flexFlow: "column wrap", justifyContent: "center" }
                ) : (
                  {flexFlow: "row wrap", justifyContent: "space-evenly" }
                )}
              />
            </Box>
            <ShareOnTwitter inOhmieCard={false} />
          </>
        }
      </Box>
    </Fade>
  );
}

export default Fohmo;

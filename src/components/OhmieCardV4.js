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
  Box,
  Typography,
  Button,
  CircularProgress,
  Fade
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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloudUploadIcon from "./CloudUploadIcon.js";
import ShareOnTwitter from "./ShareOnTwitter.js";

import React, {useState, useEffect, useCallback} from 'react';
import { useHistory } from "react-router-dom";

import {useDropzone} from 'react-dropzone';

import "./stake.scss";
import "./figma.scss";

// import sOhm from '../assets/token_sOHM.png';
// import sOhm from '../assets/token_Ohm.svg';
import sOhm from '../assets/token_sOHM-transparent.png';
import whiteBg from '../assets/whiteBg.png';
import classifyImage, { classifyOhmieImage } from "../helpers/classifyImage";
import RGB2Hex from "../helpers/RGB2Hex";
import {setDPI, drawFinalCanvas} from "../helpers/drawCanvas.js";
import {getViewWidth, heightFromAspectRatio} from "../helpers/index.js";

import useWindowSize from "../hooks/useWindowSize";

import PfpCanvas from "./PfpCanvas";
import BgCanvas from "./BgCanvas";
import TextCanvas from "./TextCanvas";
import WelcomeHeadline from "./WelcomeHeadline";

// var UAParser = require('ua-parser-js/dist/ua-parser.min');
// var UA = new UAParser();

const canvasStyle = {
  margin: "auto",
  position: "absolute",
  top: 0,
  left: 0,
  borderRadius: "16px",
}

const dropContainerStyle = {
  display: "flex",
  flexFlow: "column wrap",
  justifyContent: "center"
  // backgroundColor: shade(dark.palette.background.paperBg, 0.5)
}

function OhmieCardV4(props) {
  let history = useHistory();

  const medScreen = useMediaQuery('(min-width:960px)');
  const [fadeTransition, setFadeTransition] = useState(true);  
  const fadeOutMs = 333;

  // const [viewContainerWidth, setViewContainerWidth] = useState(undefined);

  
  useEffect(() => {
    console.log("first effect");
    var sOhmImg = new Image();
    sOhmImg.src = sOhm;
    sOhmImg = classifyImage(sOhmImg);
    setStampFile(sOhmImg);
  }, []);

  const [stampFile, setStampFile] = useState(undefined);
  const sOhmSize = 60;
  const fixedWidth = 1013;
  const fixedHeight = 446;

  const viewContainerRef = React.useRef(null);
  const bgCanvasRef = React.useRef(null);
  const pfpCanvasRef = React.useRef(null);
  const textCanvasRef = React.useRef(null);
  const finalCanvasRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);
  const stampInputRef = React.useRef(null);

  const windowSize = useWindowSize();

  const areaHt = (windowSize.height*0.7 ) || 0;
  // TODO (appleseed): fix areaWd;
  const areaWd = windowSize.width*0.8;
  const areaMaxWd = 1100;

  const objectFromScreenWidth = () => {
    if (medScreen) {
      return 0;
    } else {
      return areaWd-20;
    }
  };
  
  const objectFromScreenHeight = () => {
    if (medScreen) {
      return areaHt-20;
    } else {
      return 0;
    }
  };

  // const dropContainerStyleR1 = {
  //   display: "flex",
  //   flexFlow: "column wrap",
  //   justifyContent: "center",
  //   // width: objectFromScreenWidth(),
  //   width: "100%",
  // }

  // const canvasContainer = {
  //   // display: 'flex',
  //   // flexDirection: 'row',
  //   // flexWrap: 'wrap',
  //   // marginTop: 16,
  //   // margin: 'auto',
  //   // width: "100%",
  //   // position: "relative",
  // };

  const cropperCanvasContainer = {
    width: (areaWd+20),
    margin: "10px",
    borderRadius: "16px",
  };

  // const dropZoneReg = {
  //   display: "flex",
  //   flexFlow: "column wrap",
  //   alignItems: "center",
  //   cursor: "pointer",
  //   height: areaHt
  // }
  const dropZoneReg = {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    cursor: "pointer",
    // maxHeight: "450px",
    height: areaHt,
    width: areaWd,
    // TODO (appleseed): this width needs to be capped on mobile
    // ... also should handle border correctly
    maxWidth: areaMaxWd,
    alignItems: "center",
  };

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
  const [croppedBg, setCroppedBg] = useState(false);
  const [disabledImageButton, setDisabledImageButton] = useState(false);
  const [uiStep, setuiStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stampSize, setStampSize] = useState({
    height: sOhmSize,
    width: sOhmSize,
  });
  const [stampPosition, setStampPosition] = useState({x: undefined, y:undefined});
  // const [textListenersApplied, setTextListenersApplied] = useState(false);
  const [userName, setUserName] = useState("[your name]");
  const [textColor, setTextColor] = useState({
    hex: "#000000",
    rgb: {r: 0, g: 0, b: 0, a: 100},
  });
  const [textPosition, setTextPosition] = useState("left");
  // default white
  const [buttonColor, setButtonColor] = useState({
    hex: "#FFFFFF",
    rgb: {r: 255, g: 255, b: 255, a: 100},
  });
  const [currentAPY, setCurrentAPY] = useState("5,000");

  /**
   * backgroundColor has two keys, denoted as params below
   * @param {*} fill: true if we want to fill the background
   * @param {*} color: the color to be used with react-color
  */
  const [backgroundColor, setBackgroundColor] = useState({
    fill: false,
    color: {
      hex: "#FFFFFF",
      rgb: {r: 255, g: 255, b: 255, a: 100},
    },
  });

  // var canvasOnly = pfpCanvasRef.current;
  //   var ctx = canvasOnly.getContext('2d');
  //   var logo = new Image();
  //   logo.src = stampFile.src;
    // drawStamp(ctx, logo, e.offsetX, e.offsetY);
  const drawStamp = useCallback((ctx, logo, x, y) => {
    ctx.drawImage(logo, (x-(stampSize.width/2)), (y-(stampSize.height/2)), stampSize.width, stampSize.height);
    setStampPosition({x: x, y: y});
  }, [stampSize.height, stampSize.width]);

  // allows detects clicking on canvas & places image
  // will need to pass in:
  // whichCanvas
  // which image is drawn...
  const setCanvasListeners = useCallback(
    () => {
      var canvasOnly = pfpCanvasRef.current;
      var ctx = canvasOnly.getContext('2d');

      var logo = new Image();
      logo.src = stampFile.src;

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
        // console.log("mousedown");
        isDrawing = true;
      });

      // drawImage usage
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      canvasOnly.addEventListener('mousemove', e => {
        if (isDrawing === true) {
          if (croppedBg) history.restoreState();
          drawStamp(ctx, logo, e.offsetX, e.offsetY);
        }
      });

      window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
          if (croppedBg) history.restoreState();
          isDrawing = false;
          drawStamp(ctx, logo, e.offsetX, e.offsetY);
        }
      });
    }, [stampFile, croppedBg, drawStamp]
  );

  /**
   * @param {string} leftRight should be `left` or `right`
   */
  const applyTextLocation = useCallback(
    (leftRight) => {
      // if you already set the listeners... you can stop
      // if (textListenersApplied === true) return;

      // scalingRatio for scaling text size on mobile...
      const scalingRatio = fixedHeight / croppedBg.governing_height;

      // var redHatFont = new FontFace("RedHatDisplay", "../assets/fonts/");
      // redHatFont.load().then(function(font){
      //   // with canvas, if this is ommited won't work
      //   document.fonts.add(font);
      //   console.log('Font loaded');
      // });

      var canvasOnly = textCanvasRef.current;
      var ctx = canvasOnly.getContext('2d');

      // When true, moving the mouse draws on the canvas
      // let isDrawing = false;
      
      // //////////// HISTORY
      // // NOTE (appleseed):
      // // 1. height & width are fixed aspect ratio now...
      // // 2. also won't want to redraw since this will apply to the textCanvas only. Just empty it
      var history = {
        restoreState: function() {
          ctx.clearRect(0, 0, croppedBg.governing_width, croppedBg.governing_height);
          // ctx.drawImage(croppedBg, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
        }
      }
      ///////////////

      /**
       * used in conjunction with `canvasOnly.width to determine whether user clicked on left half or right half
       * @param {integer} offsetX position where user clicked
       * @param {float} fontSize used to determine ht of 1st row
       * @returns {array} x position, y position
       */
      const setTextLeftOrRight = (leftRight, fontSize) => {
        // newY should be scaled based on canvasOnly.height
        // const newY = 67 + fontSize;
        var newY = 75/950 * canvasOnly.height;
        var newX;
        // console.log("offsetX", offsetX, parseFloat(canvasOnly.style.width)/2, canvasOnly.style.width);
        if ( leftRight === "left" ) {
          console.log("l");
          // left
          // newX = 67;
          newX = 67/2154 * canvasOnly.width;

        } else {
          console.log("r");

          // right
          // desired: [x, y] = [375, 75] on [w, h] = [2154, 950]
          // x/w === 375/2154
          // y/h === 75/950
          newX = 375/2154 * canvasOnly.width;
          // newX = canvasOnly.width - 67;

        }
        console.log("return");

        return [newX, newY];
      }

      let name = userName;
      let nameString = "Meet " + name;
      let useTextColor = textColor.hex;
      let useButtonColor = buttonColor.hex;
      
      const textToApply = (leftRight) => {
        var fontSize;
        fontSize = (29/scalingRatio);
        console.log("offsetX");
        var [newX, newY] = setTextLeftOrRight(leftRight, fontSize);
        console.log("r", newX, newY);
        // return undefined;
        // var [newX, newY] = [e.offsetX, e.offsetY];

        // let lineIndex = 0;
        // 32 tall in total
        // let fontSize = (32/scalingRatio);
        
        // let fontSize = 19;

        // console.log(scalingRatio, "fontSize", fontSize);
        ctx.fillStyle = useTextColor;
        ctx.font = "500 "+fontSize+"px RedHatDisplay";
        ctx.fillText(nameString, newX, newY);

        // lineIndex 1 & 2 are 128 tall in total
        // lineIndex = 1;
        let linePosition = 64/scalingRatio;
        fontSize = (48/scalingRatio);
        ctx.font = "bold "+fontSize+"px RedHatDisplay";
        ctx.fillText("They are earning", newX, newY+linePosition);
        // lineIndex = 2;
        linePosition = 64/scalingRatio + linePosition;
        ctx.fillText(currentAPY+"% APY.", newX, newY+linePosition);

        // lineIndex 3 & 4 are 48 tall in total
        // lineIndex = 3;
        linePosition = 36/scalingRatio + linePosition;
        ctx.font = "normal "+(21/scalingRatio)+"px RedHatDisplay";
        ctx.fillText("When you’re ready, we’re ready with your", newX, newY+linePosition);
        // lineIndex = 4;
        linePosition = 26/scalingRatio + linePosition;
        ctx.fillText("Ohmie account. Earn rewards every 8 hours.", newX, newY+linePosition);

        ///////////////////////////// BUTTON /////////////////////////////
        // button -> top left corner @ linePosition
        linePosition = 31/scalingRatio + linePosition;
        // ctx.drawImage(button, newX, newY+linePosition)
        let radius = 28/scalingRatio;
        let x = newX+radius;
        let y = newY+linePosition+radius;
        let length = 182/scalingRatio;
        
        // left semi-circle
        // ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
        ctx.beginPath();
        ctx.arc(x, y, radius, (Math.PI/2), (3*Math.PI/2), false)
        ctx.fill();
        ctx.closePath();

        // rect in middle
        ctx.beginPath();
        ctx.moveTo(x, y-radius);
        ctx.fillRect(x, y-radius, length, radius*2);
        ctx.closePath();

        // rect in gaps
        ctx.beginPath();
        ctx.moveTo(x-1, y-radius+1);
        ctx.fillRect(x-1, y-radius+1, 2, radius*2-1);
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(x+length-1, y-radius+1);
        ctx.fillRect(x+length-1, y-radius+1, 2, radius*2-1);
        ctx.closePath();
        
        // right semi-circle
        ctx.beginPath();
        ctx.arc(x+length, y, radius, (Math.PI/2), (3*Math.PI/2), true)
        ctx.fill();
        ctx.closePath();

        // letters in button
        ctx.fillStyle = useButtonColor;
        ctx.font = "500 "+20/scalingRatio+"px RedHatDisplay";
        ctx.fillText("olympusdao.finance", x, y+(6/scalingRatio));
        ///////////////////////////// BUTTON /////////////////////////////
        // setLastTextEvent(e);
      }

      history.restoreState();
      textToApply(leftRight);
      console.log("text to apply");
    }, [croppedBg, userName, textColor, buttonColor, currentAPY]
  );
    
  // uiSteps
  // 1. Click to start
  // 2. take user's image to cropper
  // 3. take user's cropped image to stamper
  // TODO fix these:
  // 4. Text setting
  // 5. download

  const goToBgStep = (image) => {
    if (image) setfileImage(image);
    // setTextPromptState("Start Over");
    setIsLoading(true);
    canvasOrdering("bg");
    setuiStep("bg");
  }

  const canvasOrdering = (stepNumber) => {
    switch (stepNumber) {
      case "bg":
        bgCanvasRef.current.style.zIndex=1;
        pfpCanvasRef.current.style.zIndex=0;
        textCanvasRef.current.style.zIndex=-1;
        canvasContainerRef.current.style.display = "none";
        break;
      case "pfp":
        pfpCanvasRef.current.style.zIndex=1;
        textCanvasRef.current.style.zIndex=0;
        bgCanvasRef.current.style.zIndex=-1;
        canvasContainerRef.current.style.display = "block";
        break;
      case "long-press":
      case "text":
        textCanvasRef.current.style.zIndex=1;
        pfpCanvasRef.current.style.zIndex=0;
        bgCanvasRef.current.style.zIndex=-1;
        canvasContainerRef.current.style.display = "block";
        break;
      default:
        textCanvasRef.current.style.zIndex=1;
        pfpCanvasRef.current.style.zIndex=0;
        bgCanvasRef.current.style.zIndex=-1;
        canvasContainerRef.current.style.display = "block";
    }
  }

  const goToPfpStep = (sameCanvas, disabledImage) => {
    // which canvas should be shown?
    // pfpCanvas on top textCanvas on top of BgCanvas
    canvasOrdering("pfp");

    // // clear the canvas...
    if (sameCanvas !== true) {
      clearTheCanvas(bgCanvasRef);
      drawCroppedCanvas();
    }
    setuiStep("pfp");
  }

  // const goToTextStep = () => {
  //   setDPI(textCanvasRef, "text", bgCanvasRef);
  //   // applyTextListeners();
  //   canvasOrdering("text");
  //   setuiStep("text");
  // }

  // this only happens for iOSMobile, non-Safari users
  const goToLongPress = () => {
    // must set display.none rather than height 0
    // height 0 doesn't allow the image to be created...
    bgCanvasRef.current.style.display="none";
    pfpCanvasRef.current.style.display="none";
    textCanvasRef.current.style.display="none";
    finalCanvasRef.current.style.display="none";
    canvasContainerRef.current.style.height = 0;
    canvasOrdering("long-press");
    setuiStep("long-press");
  }

  const goBackOneStep = () => {
    if (uiStep === "text") {
      goToPfpStep(true);
    } else if (uiStep === "pfp") {
      // go to step 2
      clearTheCanvas(pfpCanvasRef);
      goToBgStep();
    } else if (uiStep === "bg") {
      clearTheCanvas(bgCanvasRef);
      setuiStep(1);
    } else if (uiStep === "long-press") {
      // make the canvas show again
      bgCanvasRef.current.style.display="block";
      pfpCanvasRef.current.style.display="block";
      textCanvasRef.current.style.display="block";
      finalCanvasRef.current.style.display="block";
      canvasContainerRef.current.style.height = croppedBg.governing_height + "px";
      // goToStepThree(true);
      clearTheCanvas(finalCanvasRef);
      goToPfpStep(true);
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
        // TODO here
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
        // set viewContainerWidth for image size calcs since cropper will shrink our window depending
        // on image size
        // setViewContainerWidth(maxWdth);
        image = classifyImage(image, maxWdth, maxHt, mobile);
        goToBgStep(image);

      };
      image.src = previewUrl;
    }
  });

  // react-cropper
  const cropperRef = React.useRef(null);
  
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
      canvasContainerRef.current.style.width = croppedBg.governing_width + "px";
      // viewContainerRef.current.style.width = croppedBg.governing_width + "px";

      bgCanvasRef.current.style.height = croppedBg.governing_height + "px";
      bgCanvasRef.current.style.width = croppedBg.governing_width + "px";
      bgCanvasRef.current.height = croppedBg.governing_height;
      bgCanvasRef.current.width = croppedBg.governing_width;
      
      // set other canvas heights
      pfpCanvasRef.current.style.height = bgCanvasRef.current.style.height;
      pfpCanvasRef.current.style.width = bgCanvasRef.current.style.width;
      pfpCanvasRef.current.height = bgCanvasRef.current.height;
      pfpCanvasRef.current.width = bgCanvasRef.current.width;
      textCanvasRef.current.style.height = bgCanvasRef.current.style.height;
      textCanvasRef.current.style.width = bgCanvasRef.current.style.width;
      textCanvasRef.current.height = bgCanvasRef.current.height;
      textCanvasRef.current.width = bgCanvasRef.current.width;

      // finalCanvasRef.current.style.height = bgCanvasRef.current.style.height;
      // finalCanvasRef.current.style.width = bgCanvasRef.current.style.width;
      finalCanvasRef.current.style.height = croppedBg.height + "px";
      finalCanvasRef.current.style.width = croppedBg.width + "px";
      finalCanvasRef.current.height = bgCanvasRef.current.height;
      finalCanvasRef.current.width = bgCanvasRef.current.width;

    }

    if (croppedBg) {
      // console.log('drawCroppedCanvas', image);
      // handle the click event
      // console.log(canvasOnly);

      // console.log(image.governing_width, image.governing_height)
      // set canvas dims based on classifyImage results
      setCanvasDims();

      setDPI(bgCanvasRef, false, bgCanvasRef);
      var ctx = bgCanvasRef.current.getContext('2d');
      ctx.drawImage(croppedBg, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
      setDPI(pfpCanvasRef, false, bgCanvasRef);
      setDPI(textCanvasRef, false, bgCanvasRef);
      setDPI(finalCanvasRef, false, bgCanvasRef);
      setCanvasListeners();
    }
    
  }, [setCanvasListeners, croppedBg]);

  // for bgCanvas
  // or maybe multiple?
  const clearTheCanvas = (thisCanvas) => {
    console.log("clearTheCanvas");
    // var canvas = canvasRef.current;
    var ctx = thisCanvas.current.getContext('2d');
    if (croppedBg) ctx.clearRect(0, 0, croppedBg.governing_width, croppedBg.governing_height);
    thisCanvas.current.height = 0;
    thisCanvas.current.style.height = 0;
    drawCroppedCanvas();
  };

  function pick(event) {
    var x = event.layerX;
    var y = event.layerY;
    var pixel = finalCanvasRef.current.getContext("2d").getImageData(x, y, 1, 1);
    var data = pixel.data;
  
    // const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    // destination.style.background = rgba;
    // destination.textContent = rgba;
    // console.log(rgba);
    const hex = RGB2Hex(data[0], data[1], data[2]);
    // console.log(hex);
    const colorHash = {
      hex: hex,
      rgb: {r: data[0], g: data[1], b: data[2], a: 100},
    }
    return colorHash;
  };

  const getCanvasColor = (e) => {
    // console.log("mouse", e);
    finalCanvasRef.current.style.zIndex = -3;
    var colorHash = pick(e);
    // console.log(colorHash);
    return colorHash;
  };

  /**
   * TextMouseUp, ButtonMouseUp, BackgroundMouseUp are repeated 3 times bc we couldn't find a way to pass "whichColor"
   * through the eventListener properly
   */
  /**
   * 
   * @param {*} e 
   * @param {String} whichColor "text", "button", or "background", denoting which color we are picking for
   */
  const textMouseUp = (e) => {
    var colorHash = getCanvasColor(e);
    finalCanvasRef.current.removeEventListener('mouseup', textMouseUp);
    setTextColor(colorHash);
  };

  /**
   * 
   * @param {*} e 
   * @param {String} whichColor "text", "button", or "background", denoting which color we are picking for
   */
  const buttonMouseUp = (e) => {
    var colorHash = getCanvasColor(e);
    finalCanvasRef.current.removeEventListener('mouseup', buttonMouseUp);
    setButtonColor(colorHash);
  };

  /**
   * 
   * @param {*} e 
   * @param {String} whichColor "text", "button", or "background", denoting which color we are picking for
   */
  const backgroundMouseUp = (e) => {
    var colorHash = getCanvasColor(e);
    finalCanvasRef.current.removeEventListener('mouseup', backgroundMouseUp);
    setBackgroundColor({fill: true, color: colorHash});
  };

  /**
   * 
   * @param {String} whichColor "text", "button", or "background", denoting which color we are picking for
   */
  const previewFinalCanvas = (whichColor) => {
    // 1A. draw pickerCanvas (background + pfp) set z-index = 2
    // 1B. set cursor: "crosshair"
    // 2. addEventListener "click" (to picker canvas)

    // drawFinalCanvas(true);
    drawFinalCanvas(true, croppedBg, finalCanvasRef, bgCanvasRef, [bgCanvasRef, pfpCanvasRef, textCanvasRef], fixedWidth, fixedHeight);
    // setDPI(finalCanvasRef, false);
    // var ctx = finalCanvasRef.current.getContext('2d');
    // ctx.drawImage(bgCanvasRef.current, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
    // ctx.drawImage(pfpCanvasRef.current, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
    // // draw Text
    // ctx.drawImage(textCanvasRef.current, 0, 0, croppedBg.governing_width, croppedBg.governing_height);

    finalCanvasRef.current.style.zIndex = 3;
    finalCanvasRef.current.style.cursor = "crosshair";

    // console.log(whichColor);
    switch (whichColor) {
      case "text":
        finalCanvasRef.current.addEventListener('mouseup', textMouseUp);
        break;
      case "button":
        finalCanvasRef.current.addEventListener('mouseup', buttonMouseUp);
        break;
      case "background":
        finalCanvasRef.current.addEventListener('mouseup', backgroundMouseUp);
        break;
      default:
        console.warn("You MUST pass a whichColor param");
    }
  }

  

  const downloadImage = () => {
    // first combine the canvases onto finalCanvasRef
    // drawFinalCanvas();
    drawFinalCanvas(false, croppedBg, finalCanvasRef, bgCanvasRef, [bgCanvasRef, pfpCanvasRef, textCanvasRef], fixedWidth, fixedHeight);
    // if an iOS non-safari browser tries to download then canvas.toBlob opens a new tab
    // this works for Chrome mobile, but not Brave since brave uses WebKit...

    if (isIOS && isMobile && !isMobileSafari) {
      // take us to uiStep(4)
      goToLongPress();
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
        // clearTheCanvas(finalCanvasRef);
        // canvasOrdering("pfp");
        goToPfpStep();
      }
    }
  };

  const imageLoaded = () => {
    // this isn't quite working
    setIsLoading(false);
  };

  const goBackToRoot = () => {
    setFadeTransition(false);
    setTimeout(() => {
      // setFadeTransition(true);
      history.push("/");
    }, fadeOutMs*0.75);
  };

  const goBackToStart = () => {
    setFadeTransition(false);
    setTimeout(() => {
      // setFadeTransition(true);
      window.location.reload();
    }, fadeOutMs*0.33);
  };

  const skipBgStep = () => {
    // should just create a white background
    let image = new Image();
    image.onload = () => {
      image = classifyOhmieImage(image, getViewWidth(viewContainerRef), heightFromAspectRatio(getViewWidth(viewContainerRef), (fixedWidth / fixedHeight)));
      setCroppedBg(image);
      setDisabledImageButton(true);
      goToPfpStep(true);
    };
    image.src = whiteBg;
  };

  const goToLastStep = (e) => {
    e.preventDefault();
    // console.log('go to last step');
    skipBgStep();
    e.stopPropagation();
  };

  // useEffect(() => {
  //   // needs to run when stampSize changes
  //   applyTextListeners();
  // }, [userName, applyTextListeners, textColor, buttonColor]);

  useEffect(() => {
    if (backgroundColor.fill === true) {
      // console.log(backgroundColor);
      var ctx = bgCanvasRef.current.getContext('2d')
      ctx.fillStyle = backgroundColor.color.hex;
      ctx.rect(0, 0, bgCanvasRef.current.width, bgCanvasRef.current.height);
      ctx.fill();
    } else {
      // restore to image
      drawCroppedCanvas();
    }
  }, [backgroundColor, drawCroppedCanvas]);

  useEffect(() => {
    // needs to run when stampSize changes
    // drawCroppedCanvas();
    if (uiStep === "pfp") {
      setCanvasListeners();
      applyTextLocation(textPosition);
    }
    
  }, [uiStep, stampSize, setCanvasListeners, croppedBg, stampFile, drawCroppedCanvas, applyTextLocation, textPosition]);

  useEffect(() => {
    function handleResize() {
      drawCroppedCanvas();
      applyTextLocation(textPosition);
      // draw stamp
      var canvasOnly = pfpCanvasRef.current;
      var ctx = canvasOnly.getContext('2d');
      var logo = new Image();
      logo.src = stampFile.src;
      drawStamp(ctx, logo, stampPosition.x, stampPosition.y);
    }
    // if (isMobile) return;
    if (uiStep === "pfp") {
      window.addEventListener('resize', handleResize);
    } else {
      window.removeEventListener('resize', handleResize);
    }
  }, [applyTextLocation, drawCroppedCanvas, drawStamp, setCanvasListeners, stampFile, stampPosition, textPosition, uiStep]);

  return (
    <Fade in={fadeTransition} timeout={{enter: fadeOutMs, exit: fadeOutMs}} style={{width: "100%"}}>
      <Box display="flex" style={{flexFlow: "column", alignItems: "center"}}>
        <WelcomeHeadline headline={"Ohmie Card"} subText={"Personalized card to show off your gains."}/>
        {/*<Box className="card-nav" elevation={3} style={compositorPaper}>*/}
        <Box id="outer-wrap" className="module-border-wrap" style={{maxWidth: "1100px", alignSelf: "center"}}>
          {/*<Box display="flex" alignItems="center" className="module">*/}
          <Box display="flex" alignItems="center" className="module">
            <Box className="pof-box" style={{width: "100%"}}>
              <Box
                id="viewContainer"
                ref={viewContainerRef} 
                className="inner-pof-box rectangle-2-backdrop"
                style={{
                  flexFlow: "column",
                  justifyContent: "space-between",
                  maxWidth: "1100px",
                  // height: areaHt,
                  // width: areaWd,
                  // // TODO (appleseed): this width needs to be capped on mobile
                  // // ... also should handle border correctly
                  // maxWidth: areaMaxWd,
                }}
              >
                {/* working on loader */}
                {isLoading &&
                  <CircularProgress />
                }

                {uiStep === 1 &&
                  <div className="dropContainer" style={dropContainerStyle}>
                    <div {...getRootProps({style: dropZoneReg})}>
                      <input {...getInputProps()} />
                      <Box className="dropzone-interior-container vertical-centered-flex">
                        <Box><CloudUploadIcon viewBox="0 0 102 48"/></Box>
                        <Box className="vertical-centered-flex">
                          <Typography className="pof-dropbox-text">Drag and Drop here</Typography>
                          <Typography className="pof-dropbox-text">or</Typography>
                        </Box>
                        <Button
                          id="upload-pfp-button"
                          variant="contained"
                          className="ohmie-button"
                        >
                          <Typography className="btn-text">Upload file</Typography>
                        </Button>
                        <Box className="vertical-centered-flex ">
                          <Typography className="pof-dropbox-text">or</Typography>
                        </Box>
                        <Button
                          id="upload-pfp-button"
                          variant="contained"
                          className="ohmie-button"
                          onClick={goToLastStep}
                        >
                          <Typography className="btn-text">I don't want a Bg Image Ser</Typography>
                        </Button>
                      </Box>
                      <div style={{flexGrow: "0", bottom: "0", position: "absolute", paddingBottom: "10px"}}>
                        <div style={{display: "flex", flexFlow: "column wrap"}}>
                          <Typography variant="body1" style={{fontFamily: "RedHatDisplay", marginTop: "0.25rem"}}>Optimal Aspect Ratio: {fixedWidth}/{fixedHeight} (width/height).</Typography>
                          <Typography variant="body1" style={{fontFamily: "RedHatDisplay", margin: "0.1rem"}}>Don't worry, fren. You can crop on next step.</Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {/*<Box id="mainContainer">*/}
                {/* Background Cropper */}
                {uiStep === "bg" && fileImage &&
                  <BgCanvas
                    ref={{cropperRef: cropperRef}}
                    imageLoaded={imageLoaded}
                    setCroppedBg={setCroppedBg}
                    goBackOneStep={goBackOneStep}
                    goToPfpStep={goToPfpStep}
                    fileImage={fileImage}
                    outlineButtonStyle={outlineButton}
                    containerButtonStyle={containerButton}
                    cropperContainerStyle={cropperCanvasContainer}
                    areaHt={areaHt}
                    fileImageType={fileImageType}
                    containerStyle={dropContainerStyle}
                    aspectRatio={fixedWidth / fixedHeight}
                  />
                }

                {/* Image Resizer was here... but didn't look right */}  
                {/* 
                  Notes for below (Step 3): 
                  1. canvas must ALWAYS be on screen
                  2. when we don't want the CroppedCanvas to appear we change height to 0
                */}
                {/*<Box style={canvasContainer} ref={canvasContainerRef}>*/}
                <Box ref={canvasContainerRef} style={{position: "relative", alignSelf: "start"}}>
                  <canvas
                    id="bgCanvas"
                    ref={bgCanvasRef}
                    style={canvasStyle}
                    width={objectFromScreenWidth()}
                    height={objectFromScreenHeight()}
                  ></canvas>
                  <canvas
                    id="pfpCanvas"
                    ref={pfpCanvasRef}
                    style={canvasStyle}
                    width={objectFromScreenWidth()}
                    height={objectFromScreenHeight()}
                  ></canvas>
                  <canvas
                    id="textCanvas"
                    ref={textCanvasRef}
                    style={canvasStyle}
                    width={objectFromScreenWidth()}
                    height={objectFromScreenHeight()}
                  ></canvas>
                  <canvas
                    id="canvas"
                    ref={finalCanvasRef}
                    style={canvasStyle}
                    width={objectFromScreenWidth()}
                    height={objectFromScreenHeight()}
                  ></canvas>
                </Box>

                
                {/* Logo Resizing */}
                {(uiStep === "pfp" || uiStep === "text") &&
                  <Box id="editable-features" display="flex">
                    <Box className="ef-container">
                      <TextCanvas
                        setUserName={setUserName}
                        // applyTextListeners={applyTextListeners}
                        textColor={textColor}
                        setTextColor={setTextColor}
                        buttonColor={buttonColor}
                        setButtonColor={setButtonColor}
                        backgroundColor={backgroundColor}
                        setBackgroundColor={setBackgroundColor}
                        previewFinalCanvas={previewFinalCanvas}
                        applyTextLocation={applyTextLocation}
                        setCurrentAPY={setCurrentAPY}
                        textPosition={textPosition}
                        setTextPosition={setTextPosition}
                        disabledImageButton={disabledImageButton}
                      />
                    </Box>
                    <Box className="ef-container">
                      <PfpCanvas
                        ref={{stampInputRef: stampInputRef}}
                        setStampSize={setStampSize}
                        setStampFile={setStampFile}
                        stampFile={stampFile}
                        stampSize={stampSize}
                        // maxHt = {parseFloat(bgCanvasRef.current.style.height)}
                        defaultSize = {parseFloat(bgCanvasRef.current.style.height)}
                        maxHt = {700}
                        downloadText={"Download Card"}
                        downloadImage={downloadImage}
                        goBackToStart={goBackToStart}
                      />
                    </Box>
                  </Box>
                }
                
                {/* TODO needs styles */}
                {uiStep === "long-press" &&
                  <Box display="flex" style={{flexFlow: "column wrap"}}>
                    <img
                      alt="finalImage"
                      src={finalCanvasRef.current.toDataURL(fileImageType, 1)}
                      style={{
                        height: finalCanvasRef.current.style.height,
                        width: finalCanvasRef.current.style.width,
                        borderRadius: "16px",
                      }}
                    />
                    <Box display="flex" style={{flexFlow: "row wrap", justifyContent: "center", margin: "15px"}}>
                      <Button
                        id="upload-pfp-button"
                        variant="outlined"
                        className="outlined-ohmie-button"
                        onClick={goBackOneStep}
                      >
                        <Typography className="btn-text">Back</Typography>
                      </Button>
                      <Box className="vertical-centered-flex">
                        <Typography className="pof-dropbox-text">Long Press / Right Click</Typography>
                        <Typography className="pof-dropbox-text">to save, Incooohmer</Typography>
                      </Box>
                    </Box>
                  </Box>
                }
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
        {uiStep === "bg" && fileImage &&
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
              onClick={goToPfpStep}
            >
              <Typography className="btn-text">Confirm</Typography>
            </Button>
          </Box>
        }

        {(uiStep === "pfp" || uiStep === "text") &&
          <ShareOnTwitter inOhmieCard={true} />
        }

        {/* hiding text so that it is preloaded for canvas */}
        <Box style={{overflow: "hidden", position: "relative"}}>
          <Typography variant="body1" style={{fontFamily: "RedHatDisplay", fontWeight: "normal", position: "absolute", bottom: "-100px"}}>Test</Typography>
          <Typography variant="body1" style={{fontFamily: "RedHatDisplay", fontWeight: "500", position: "absolute", bottom: "-100px"}}>Test</Typography>
          <Typography variant="body1" style={{fontFamily: "RedHatDisplay", fontWeight: "bold", position: "absolute", bottom: "-100px"}}>Test</Typography>
        </Box>
      </Box>
    </Fade>
  );
}

export default OhmieCardV4;
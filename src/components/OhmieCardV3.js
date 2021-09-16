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

import React, {useState, useEffect, useCallback} from 'react';

import {useDropzone} from 'react-dropzone';

import "./stake.scss";

import sOhm from '../assets/token_sOHM.png';
import classifyImage from "../helpers/classifyImage";
import RGB2Hex from "../helpers/RGB2Hex";

import useWindowSize from "../hooks/useWindowSize";

import PfpCanvas from "./PfpCanvas";
import BgCanvas from "./BgCanvas";
import TextCanvas from "./TextCanvas";

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
  var sOhmImg = new Image();
  sOhmImg.src = sOhm;
  sOhmImg = classifyImage(sOhmImg);
  const [stampFile, setStampFile] = useState(sOhmImg); 
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
  // const [textListenersApplied, setTextListenersApplied] = useState(false);
  const [userName, setUserName] = useState("[your name]");
  const [textColor, setTextColor] = useState({
    hex: "#000000",
    rgb: {r: 0, g: 0, b: 0, a: 100},
  });
  // default white
  const [buttonColor, setButtonColor] = useState({
    hex: "#FFFFFF",
    rgb: {r: 255, g: 255, b: 255, a: 100},
  });

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
  const [lastTextEvent, setLastTextEvent] = useState(null);

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

  // allows detects clicking on canvas & places text
  const applyTextListeners = useCallback(
    () => {
      // if you already set the listeners... you can stop
      // if (textListenersApplied === true) return;

      // scalingRatio for scaling text size on mobile...
      const scalingRatio = fixedHeight/croppedBg.governing_height;

      // var redHatFont = new FontFace("RedHatDisplay", "../assets/fonts/");
      // redHatFont.load().then(function(font){
      //   // with canvas, if this is ommited won't work
      //   document.fonts.add(font);
      //   console.log('Font loaded');
      // });

      var canvasOnly = textCanvasRef.current;
      var ctx = canvasOnly.getContext('2d');

      // When true, moving the mouse draws on the canvas
      let isDrawing = false;
      
      //////////// HISTORY
      // NOTE (appleseed):
      // 1. height & width are fixed aspect ratio now...
      // 2. also won't want to redraw since this will apply to the textCanvas only. Just empty it
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
      const setTextLeftOrRight = (offsetX, fontSize) => {
        // newY should be scaled based on canvasOnly.height
        // const newY = 67 + fontSize;
        var newY = 75/950 * canvasOnly.height;
        var newX;
        console.log("offsetX", offsetX, parseFloat(canvasOnly.style.width)/2, canvasOnly.style.width);
        if ( offsetX < parseFloat(canvasOnly.style.width)/2 ) {
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
      
      const textToApply = (e) => {
        var fontSize;
        fontSize = (29/scalingRatio);
        console.log("offsetX", e.offsetX, e.offsetY);
        var [newX, newY] = setTextLeftOrRight(e.offsetX, fontSize);
        console.log("r", newX, newY, e.offsetX, e.offsetY);
        // return undefined;
        // var [newX, newY] = [e.offsetX, e.offsetY];

        // let lineIndex = 0;
        // 32 tall in total
        // let fontSize = (32/scalingRatio);
        
        // let fontSize = 19;

        // console.log(scalingRatio, "fontSize", fontSize);
        ctx.fillStyle = useTextColor;
        ctx.font = fontSize+"px RedHatDisplay";
        ctx.fillText(nameString, newX, newY);

        // lineIndex 1 & 2 are 128 tall in total
        // lineIndex = 1;
        let linePosition = 64/scalingRatio;
        fontSize = (48/scalingRatio);
        ctx.font = "bold "+fontSize+"px RedHatDisplay";
        ctx.fillText("They are earning", newX, newY+linePosition);
        // lineIndex = 2;
        linePosition = 64/scalingRatio + linePosition;
        ctx.fillText("5,000+% APY.", newX, newY+linePosition);

        // lineIndex 3 & 4 are 48 tall in total
        // lineIndex = 3;
        linePosition = 36/scalingRatio + linePosition;
        ctx.font = (21/scalingRatio)+"px RedHatDisplay";
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
        ctx.font = 20/scalingRatio+"px RedHatDisplay";
        ctx.fillText("olympusdao.finance", x, y+(6/scalingRatio));
        ///////////////////////////// BUTTON /////////////////////////////
        setLastTextEvent(e);
      }

      // Add the event listeners for mousedown, mousemove, and mouseup
      const handleMouseDown = () => {
        console.log("down");
        isDrawing = true;
      }
      // remove old listeners
      canvasOnly.removeEventListener('mousedown', handleMouseDown);
      canvasOnly.addEventListener('mousedown', handleMouseDown);

      const handleMouseMove = (e) => {
        if (isDrawing === true) {

          if (croppedBg) history.restoreState();
          textToApply(e);
          // ctx.drawImage(logo, (e.offsetX-(stampSize.width/2)), (e.offsetY-(stampSize.height/2)), stampSize.width, stampSize.height);

        }
      }

      // drawImage usage
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      canvasOnly.removeEventListener('mousemove', handleMouseMove);
      canvasOnly.addEventListener('mousemove', handleMouseMove);

      const handleMouseUp = e => {
        if (isDrawing === true) {

          if (croppedBg) history.restoreState();

          textToApply(e);

          isDrawing = false;
        }
      }
      canvasOnly.removeEventListener('mouseup', handleMouseUp);
      canvasOnly.addEventListener('mouseup', handleMouseUp);

      // setTextListenersApplied(true);
      if (lastTextEvent) {
        if (croppedBg) history.restoreState();
        textToApply(lastTextEvent);
      }
    }, [croppedBg, userName, textColor, buttonColor, lastTextEvent]
  );
    
  const step1Direction = {row: ""};
  // const [secondaryDirection, setSecondaryDirection] = useState({row: ""});
  
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

  const goToPfpStep = (sameCanvas) => {
    // which canvas should be shown?
    // pfpCanvas on top textCanvas on top of BgCanvas
    canvasOrdering("pfp");

    // // clear the canvas...
    if (sameCanvas !== true) {
      clearTheCanvas();
      drawCroppedCanvas();
    }
    setuiStep("pfp");
  }

  const goToTextStep = () => {
    setDPI(textCanvasRef, "text");
    // applyTextListeners();
    canvasOrdering("text");
    setuiStep("text");
  }

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
      clearTheCanvas();
      goToBgStep();
    } else if (uiStep === "bg") {
      clearTheCanvas();
      setuiStep(1);
    } else if (uiStep === "long-press") {
      // make the canvas show again
      bgCanvasRef.current.style.display="block";
      pfpCanvasRef.current.style.display="block";
      textCanvasRef.current.style.display="block";
      finalCanvasRef.current.style.display="block";
      canvasContainerRef.current.style.height = croppedBg.governing_height + "px";
      // goToStepThree(true);
      goToTextStep();
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
        goToBgStep(image);

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

      setDPI(bgCanvasRef, false);
      var ctx = bgCanvasRef.current.getContext('2d');
      ctx.drawImage(croppedBg, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
      setDPI(pfpCanvasRef, false);
      setDPI(textCanvasRef, false);
      setDPI(finalCanvasRef, false);
      setCanvasListeners();
    }
    
  }, [setCanvasListeners, croppedBg]);

  // TODO (appleseed):
  // I think we'll want to setDPI on pfpCanvasRef
  // ... but size based on bgCanvasRef
  function setDPI(thisCanvasRef, type) {
    var thisCanvas = thisCanvasRef.current;
    var bgCanvas = bgCanvasRef.current;
    // var dpi = 96*3;
    // var scaleFactor = dpi / 96;
    var scaleFactor;
    if (type === "text") {
      scaleFactor = 3;
    } else if (type === "final") {
      scaleFactor = 12;
    } else {
      scaleFactor = 3;
    }
    
    // Set up CSS size.
    thisCanvas.style.width = bgCanvas.style.width || bgCanvas.width + 'px';
    thisCanvas.style.height = bgCanvas.style.height || bgCanvas.height + 'px';

    // console.log('setDpi', canvas.style.width, canvas.style.height);
    // Get size information.
    var width = parseFloat(thisCanvas.style.width);
    var height = parseFloat(thisCanvas.style.height);

    // Backup the canvas contents.
    var oldScale = thisCanvas.width / width;
    var backupScale = scaleFactor / oldScale;
    var backup = thisCanvas.cloneNode(false);
    backup.getContext('2d').drawImage(thisCanvas, 0, 0);

    // Resize the canvas.
    var ctx = thisCanvas.getContext('2d');
    thisCanvas.width = Math.ceil(width * scaleFactor);
    thisCanvas.height = Math.ceil(height * scaleFactor);

    // Redraw the canvas image and scale future draws.
    ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
    ctx.drawImage(backup, 0, 0);
    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
  };

  const resizeAndExport = (preview) => {
    var thisCanvas = finalCanvasRef.current;
    if (thisCanvas.width !== fixedWidth) {
      var backup = thisCanvas.cloneNode(false);
      backup.getContext('2d').drawImage(thisCanvas, 0, 0);

      if (preview) {
        thisCanvas.width = croppedBg.governing_width;
        thisCanvas.height = croppedBg.governing_height;
  
        thisCanvas.getContext('2d').drawImage(backup, 0,0, croppedBg.governing_width, croppedBg.governing_height);  
      } else {
        thisCanvas.width = fixedWidth;
        thisCanvas.height = fixedHeight;
  
        thisCanvas.getContext('2d').drawImage(backup, 0,0, backup.width, backup.height, 0, 0, fixedWidth, fixedHeight);  
      }
    }
  };

  // for bgCanvas
  // or maybe multiple?
  const clearTheCanvas = () => {
    // var canvas = canvasRef.current;
    var ctx = bgCanvasRef.current.getContext('2d');
    if (croppedBg) ctx.clearRect(0, 0, croppedBg.governing_width, croppedBg.governing_height);
    bgCanvasRef.current.height = 0;
    bgCanvasRef.current.style.height = 0;
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

    drawFinalCanvas(true);
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

  /**
   * 
   * @param {bool} preview is optional
   */
  const drawFinalCanvas = (preview) => {
    var dpiType = "final";
    // if (preview) dpiType = "preview";
    setDPI(finalCanvasRef, dpiType);

    // // ratio of screen height to original
    // var scaleFactor = croppedBg.governing_height/croppedBg.height;

    // // setting back to original height & width
    // finalCanvasRef.current.width = croppedBg.width;
    // finalCanvasRef.current.height = croppedBg.height;
    // var ctx = finalCanvasRef.current.getContext('2d');
    // ctx.drawImage(bgCanvasRef.current, 0, 0, croppedBg.governing_width/scaleFactor, croppedBg.governing_height/scaleFactor);
    // ctx.drawImage(pfpCanvasRef.current, 0, 0, croppedBg.governing_width/scaleFactor, croppedBg.governing_height/scaleFactor);
    // // draw Text
    // ctx.drawImage(textCanvasRef.current, 0, 0, croppedBg.governing_width/scaleFactor, croppedBg.governing_height/scaleFactor);
    
    var ctx = finalCanvasRef.current.getContext('2d');
    ctx.drawImage(bgCanvasRef.current, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
    ctx.drawImage(pfpCanvasRef.current, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
    // draw Text
    ctx.drawImage(textCanvasRef.current, 0, 0, croppedBg.governing_width, croppedBg.governing_height);

    // setting back to original height & width
    // finalCanvasRef.current.width = croppedBg.width;
    // finalCanvasRef.current.height = croppedBg.height;
    // finalDPI(finalCanvasRef);
    resizeAndExport(preview);
  };

  const downloadImage = () => {
    // first combine the canvases onto finalCanvasRef
    drawFinalCanvas();
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
      }
    }
  };

  const imageLoaded = () => {
    // this isn't quite working
    setIsLoading(false);
  };

  useEffect(() => {
    // needs to run when stampSize changes
    applyTextListeners();
  }, [userName, applyTextListeners, textColor, buttonColor]);

  useEffect(() => {
    // needs to run when stampSize changes
    if (backgroundColor.fill === true) {
      // console.log(backgroundColor);
      var ctx = bgCanvasRef.current.getContext('2d')
      ctx.fillStyle = backgroundColor.color.hex;
      ctx.rect(0, 0, bgCanvasRef.current.width, bgCanvasRef.current.height);
      ctx.fill();
    }
  }, [backgroundColor]);

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
                  <Typography variant="body1" style={{fontFamily: "RedHatDisplay", marginTop: "0.25rem"}}>Optimal Aspect Ratio: {fixedWidth}/{fixedHeight} (width/height).</Typography>
                  <Typography variant="body1" style={{fontFamily: "RedHatDisplay", margin: "0.1rem"}}>Don't worry, fren. You can crop on next step.</Typography>
                </div>
              </div>
            </div>
          </div>
        }

        {/* Background Cropper */}
        {uiStep === "bg" && fileImage &&
          <BgCanvas
            ref={{cropperRef: cropperRef, cropperContainerRef: cropperContainerRef}}
            imageLoaded={imageLoaded}
            setCroppedBg={setCroppedBg}
            goBackOneStep={goBackOneStep}
            goToPfpStep={goToPfpStep}
            fileImage={fileImage}
            outlineButtonStyle={outlineButton}
            containerButtonStyle={containerButton}
            areaHt={areaHt}
            fileImageType={fileImageType}
            containerStyle={dropContainerStyle}
            aspectRatio={fixedWidth/fixedHeight}
          />
        }

        {/* Logo Resizing */}
        {uiStep === "pfp" &&
          <PfpCanvas
            ref={{stampInputRef: stampInputRef}}
            setStampSize={setStampSize}
            setStampFile={setStampFile}
            stampFile={stampFile}
            stampSize={stampSize}
            maxHt = {parseFloat(bgCanvasRef.current.style.height)}
          />
        }

        {/* Logo Resizing */}
        {uiStep === "text" &&
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
            height="0"
          ></canvas>
          <canvas
            id="pfpCanvas"
            ref={pfpCanvasRef}
            style={canvasStyle}
            height="0"
          ></canvas>
          <canvas
            id="textCanvas"
            ref={textCanvasRef}
            style={canvasStyle}
            height="0"
          ></canvas>
          <canvas
            id="canvas"
            ref={finalCanvasRef}
            style={canvasStyle}
            height="0"
          ></canvas>
        </Box>
        {uiStep === "pfp" && croppedBg &&
          <Box textAlign='center'>
            <Button variant="outlined" color="primary" onClick={goBackOneStep} style={outlineButton}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={goToTextStep} style={containerButton}>
              Next
            </Button>
            <div style={{flexGrow: "0"}}>
                <div style={{display: "flex", flexFlow: "column wrap"}}>
                  <Typography variant="body1" style={{fontFamily: "RedHatDisplay", marginTop: "0.25rem"}}>Don't like your background?</Typography>
                  <Typography variant="body1" style={{fontFamily: "RedHatDisplay", margin: "0.1rem"}}>Don't worry, fren. You can bucket fill it on next step.</Typography>
                </div>
              </div>
          </Box>
          
        }

        {uiStep === "text" && 
          <Box textAlign='center'>
            <Button variant="outlined" color="primary" onClick={goBackOneStep} style={outlineButton}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={downloadImage} style={containerButton}>
              Download Ohmie Card
            </Button>
          </Box>
        }

        {uiStep === "long-press" &&
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
              Download Ohmie Card
              </Button>
            </Box>
          </div>
        }
      </Paper>
    </Zoom>
  );
}

export default CompositorV3;
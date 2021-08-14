import {
  // Grid,
  Box,
  Paper,
  // Typography,
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

import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';

import "./stake.scss";

import zeusImg from '../assets/Zeus_Full_Body.png';
import sOhm from '../assets/token_sOHM.png';
import classifyImage from "../helpers/classifyImage";

import useWindowSize from "../hooks/useWindowSize";

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

function CompositorV2(props) {
  
  const sOhmSize = 60;
  function draw(baseImg) {
    if (baseImg === undefined) {
      baseImg = zeusImg;
    };
    var canvasOnly = canvasRef.current
    var ctx = canvasOnly.getContext('2d');

    //// trying to remove pixelated images...
    // ctx.imageSmoothingEnabled = false;
    //get DPI
    // let dpi = window.devicePixelRatio;
    // // canvasOnly.width = Math.floor(size * scale);
    // ctx.scale = (dpi, dpi);

    // function fix_dpi() {
    //   //get CSS height
    //   //the + prefix casts it to an integer
    //   //the slice method gets rid of "px"
    //   let style_height = +getComputedStyle(canvasOnly).getPropertyValue("height").slice(0, -2);
    //   //get CSS width
    //   let style_width = +getComputedStyle(canvasOnly).getPropertyValue("width").slice(0, -2);
    //   //scale the canvas
    //   canvasOnly.setAttribute('height', style_height * dpi);
    //   canvasOnly.setAttribute('width', style_width * dpi);
    // }
    // fix_dpi();
    
    //////////// HISTORY
    var history = {
      redo_list: [],
      undo_list: [],
      restoreState: function() {
        console.log('restorState');
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

  const windowSize = useWindowSize();

  const dropZoneSm = {
    cursor: 'pointer'
  }

  const areaHt = (windowSize.height*0.8);

  const dropZoneReg = {
    cursor: "pointer",
    height: areaHt
  }

  const [showCanvas, setshowCanvas] = useState(false);
  
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: acceptedFiles => {
      console.log(acceptedFiles);
      var previewUrl = null;
      if (acceptedFiles.length > 0) {
        console.log(acceptedFiles[0]);
        previewUrl = URL.createObjectURL(acceptedFiles[0]);
      }
      let image = new Image();
      console.log('on drop');
      image.onload = () => {
        console.log('img load');
        sizeImgDom(image);
        setshowCanvas(true);

      };
      image.src = previewUrl;

    }
  });

  const sizeImgDom = (image) => {

    console.log('sizeImgDom', image);
    // handle the click event
    var canvasOnly = canvasRef.current;
    var ctx = canvasOnly.getContext('2d');
    // let image = new Image();
    // image.src = file_preview;

    image = classifyImage(image, canvasOnly.parentElement, areaHt);
    console.log(image.governing_height, image.governing_width)
    // set canvas dims based on classifyImage results
    canvasOnly.height = image.governing_height;
    canvasOnly.width = image.governing_width;
    // image.onload = () => {
    ctx.drawImage(image, 0, 0, image.governing_width, image.governing_height);
    // };

    draw(image);
  }

  const downloadImage = () => {
    var link = document.createElement('a');
    link.download = 'sOhmTag.png';
    link.href = canvasRef.current.toDataURL()
    link.click();
  }
  // drawFile draws in canvas
  // const drawFile = useCallback((file) => {
  //   console.log('drawfile', file);
  //   // handle the click event
  //   // function drawFile(file) {
  //   var canvasOnly = canvasRef.current;
  //   var ctx = canvasOnly.getContext('2d');
  //   let image = new Image();
  //   image.src = file.preview;

  //   image = classifyImage(image, canvasOnly.parentElement);

  //   // set canvas dims based on classifyImage results
  //   canvasOnly.height = image.governing_height;
  //   canvasOnly.width = image.governing_width;
  //   image.onload = () => {
  //     ctx.drawImage(image, 0, 0, image.governing_width, image.governing_height);
  //   };

  //   draw(image);

  // }, []);  

  return (
    <div id="stake-view">
      <Zoom in={true}>
        <Paper className={`ohm-card`}>
          {/*<Grid container direction="column" spacing={2}></Grid>*/}
          <div className="dropContainer">
            <div {...getRootProps({style: showCanvas ? (dropZoneSm) : (dropZoneReg)})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files. Then click on the image to place the logo.</p>
            </div>
          </div>

          <div style={canvasContainer}>
            <canvas
              id="canvas"
              ref={canvasRef}
              style={canvasStyle}
              className="canvas"
              // width={window.innerWidth-10}
              height="0"
            >
            </canvas>
            {showCanvas &&
              <Box textAlign='center' m="1rem">
                {/*<img
                  src={sOhm}
                  alt="sOhmLogo"
                  width={sOhmSize}
                  height={sOhmSize}
                />*/}
                <Button variant="contained" color="primary" onClick={downloadImage} >
                  Download Image
                </Button>
              </Box>
            }
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
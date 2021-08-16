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

import React, {useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';

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

  const windowSize = useWindowSize();

  const areaHt = (windowSize.height*0.7) || 0;

  const compositorPaper = {
    padding: "15px",
    textAlign: "center",
    marginBottom: "20px",
    overflow: "auto",
    height: windowSize.height*0.9
  }

  const dropZoneReg = {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    cursor: "pointer",
    height: areaHt
  }

  const dropZoneSm = {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    cursor: 'pointer'
  }

  const [showCanvas, setshowCanvas] = useState(false);
  const [textPromptState, setTextPromptState] = useState("Set your pfp here. Then click to place the logo.");
  
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
        setTextPromptState("Click here if you need to start over, Incooohmer");
        setshowCanvas(true);

      };
      image.src = previewUrl;

    }
  });

  // PIXELATED logo issue:
  // Canvases have two different 'sizes': their DOM width/height and their CSS width/height...
  // You can increase a canvas' resolution by increasing the DOM size while keeping the CSS size...
  // fixed, and then using the .scale() method to scale all of your future draws to the new bigger size.
  // https://stackoverflow.com/questions/14488849/higher-dpi-graphics-with-html5-canvas/26047748
  const sizeImgDom = (image) => {
    console.log('sizeImgDom', image);
    // handle the click event
    var canvasOnly = canvasRef.current;
    var ctx = canvasOnly.getContext('2d');

    // let image = new Image();
    // image.src = file_preview;

    image = classifyImage(image, canvasOnly.parentElement, areaHt);
    console.log(image.governing_width, image.governing_height)
    // set canvas dims based on classifyImage results
    canvasOnly.height = image.governing_height;
    canvasOnly.width = image.governing_width;
    // image.onload = () => {
    ctx.drawImage(image, 0, 0, image.governing_width, image.governing_height);
    // };
    setDPI();

    draw(image);
  }

  function setDPI() {
    var canvas = canvasRef.current;
    var dpi = 96*10;
    // Set up CSS size.
    canvas.style.width = canvas.style.width || canvas.width + 'px';
    canvas.style.height = canvas.style.height || canvas.height + 'px';

    console.log('setDpi', canvas.style.width, canvas.style.height);
    // Get size information.
    var scaleFactor = dpi / 96;
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

  useEffect(() => {
    console.log('useeffect');
    if (showCanvas) {
    }
  }, [showCanvas]);

  return (
    <div id="stake-view">
      <Zoom in={true}>
        <Paper className={`ohm-card`} elevation={3} style={compositorPaper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Welcome Incooohmer</Typography>
              </div>
            </Grid>
          </Grid>
          <div className="dropContainer" style={dropContainerStyle}>
            <div {...getRootProps({style: showCanvas ? (dropZoneSm) : (dropZoneReg)})}>
              <input {...getInputProps()} />
              <Typography variant="h5" color="textSecondary">{textPromptState}</Typography>
            </div>
          </div>

          <div style={canvasContainer}>
            <canvas
              id="canvas"
              ref={canvasRef}
              style={canvasStyle}
              // className="canvasRendering"
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
                  Download pfp
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
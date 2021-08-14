import {
  Grid,
  // Box,
  Paper,
  // Typography,
  // FormControl,
  // InputAdornment,
  // InputLabel,
  // OutlinedInput,
  // Button,
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
      // saveState: function(canvasOnly, list, keep_redo) {
      //   keep_redo = keep_redo || false;
      //   if(!keep_redo) {
      //     this.redo_list = [];
      //   }
        
      //   (list || this.undo_list).push(canvasOnly.toDataURL());   
      // },
      // undo: function(canvasOnly, ctx) {
      //   this.restoreState(canvasOnly, ctx);
      // },
      restoreState: function() {
        console.log('restorState');
        // if(pop.length) {
          // this.saveState(canvasOnly, push, true);
          ctx.clearRect(0, 0, baseImg.governing_width, baseImg.governing_height);
          ctx.drawImage(baseImg, 0, 0, baseImg.governing_width, baseImg.governing_height);  
        // }
      }
    }
    ///////////////

    // var img = new Image();

    // img.src = baseImg;
    var logo = new Image();
    logo.src = sOhm;

    // When true, moving the mouse draws on the canvas
    let isDrawing = false;
    // let x = 0;
    // let y = 0;

    // Add the event listeners for mousedown, mousemove, and mouseup
    canvasOnly.addEventListener('mousedown', e => {
      // x = e.offsetX;
      // y = e.offsetY;
      isDrawing = true;
    });

    // drawImage usage
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    canvasOnly.addEventListener('mousemove', e => {
      if (isDrawing === true) {
        // ctx.drawImage(image, dx, dy, dWidth, dHeight);
        // history.undo(canvasOnly, ctx);
        history.restoreState();
        ctx.drawImage(logo, e.offsetX, e.offsetY, 20, 20);
        // drawLine(context, x, y, e.offsetX, e.offsetY);
        // x = e.offsetX;
        // y = e.offsetY;
      }
    });

    window.addEventListener('mouseup', e => {
      if (isDrawing === true) {
        // history.undo(canvasOnly, ctx);
        history.restoreState();

        ctx.drawImage(logo, e.offsetX, e.offsetY, 20, 20);
        // drawLine(context, x, y, e.offsetX, e.offsetY);
        // x = 0;
        // y = 0;
        isDrawing = false;
      }
    });
  }

  const canvasRef = React.useRef(null);

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
      setshowCanvas(false);
      let image = new Image();
      console.log('on drop');
      image.onload = () => {
        console.log('img load');
        sizeImgDom(image);
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

    image = classifyImage(image, canvasOnly.parentElement);
    console.log(image.governing_height, image.governing_width)
    // set canvas dims based on classifyImage results
    canvasOnly.height = image.governing_height;
    canvasOnly.width = image.governing_width;
    // image.onload = () => {
      ctx.drawImage(image, 0, 0, image.governing_width, image.governing_height);
    // };

    draw(image);
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
          <Grid container direction="column" spacing={2}></Grid>
          <div className="dropContainer">
            <div {...getRootProps({className: !showCanvas ? ('dropZone') : ('dropZone-sm')})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files. Then click on the image to place the logo.</p>
            </div>
            
            
            <div style={canvasContainer}>
              <canvas
                id="canvas"
                ref={canvasRef}
                style={canvasStyle}
                // width={window.innerWidth-10}
                // height={window.innerHeight-10}
              >
              </canvas>
            </div>
          </div>
        </Paper>
      </Zoom>
    </div>
  );
}

export default CompositorV2;
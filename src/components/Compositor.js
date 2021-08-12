// import React, {useEffect, useCallback} from 'react';
import React, {useCallback} from 'react';

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

import {useDropzone} from 'react-dropzone'

import "./stake.scss";
import zeusImg from '../assets/Zeus_Full_Body.png';
import sOhm from '../assets/token_sOHM.png';

function Compositor() {

  function draw(baseImg) {
    if (baseImg === undefined) {
      baseImg = zeusImg;
    };
    var canvasOnly = document.getElementById('canvas')
    var ctx = canvasOnly.getContext('2d');
    var img = new Image();

    img.src = baseImg;
    var logo = new Image();
    logo.src = sOhm;
    
    console.log("img.naturalHeight");
    console.log(img.naturalHeight);
    ctx.canvas.height = img.naturalHeight;
    ctx.canvas.width = img.naturalWidth;

    img.onload = function() {
      console.log('onload');
      console.log(img);
      ctx.drawImage(img, 0, 0);
      // ctx.drawImage(logo, 10, 10, 20, 20);
    };

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
        ctx.drawImage(logo, e.offsetX, e.offsetY, 20, 20);
        // drawLine(context, x, y, e.offsetX, e.offsetY);
        // x = e.offsetX;
        // y = e.offsetY;
      }
    });

    window.addEventListener('mouseup', e => {
      if (isDrawing === true) {
        ctx.drawImage(logo, e.offsetX, e.offsetY, 20, 20);
        // drawLine(context, x, y, e.offsetX, e.offsetY);
        // x = 0;
        // y = 0;
        isDrawing = false;
      }
    });
  }

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files

    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        // const binaryStr = reader.result
        // console.log(binaryStr)
        // draw(binaryStr);

        // convert image file to base64 string
        console.log('load');
        var canvasOnly = document.getElementById('canvas')
        var ctx = canvasOnly.getContext('2d');
        var img = new Image();

        console.log("img.naturalHeight");
        console.log(img.naturalHeight);
        ctx.canvas.height = img.naturalHeight || 100;
        ctx.canvas.width = img.naturalWidth || 100;

        img.src = reader.result;

        console.log(img);
        ctx.drawImage(img, 0, 0);
      }
      // reader.readAsDataURL(file)

      // reader.addEventListener("load", function () {
        
      // }, false);
  
      if (file) {
        console.log('if file');
        reader.readAsDataURL(file);
      }
    });

  }, [])

  // const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  // useEffect(() => {
  //   console.log('useeffect');
  //   // draw();
  //   setupDropZone();
  // }, []);
    
    return (
    <div id="stake-view">
      <Zoom in={true}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <canvas
                id="canvas"
              ></canvas>
          </Grid>
        </Paper>
      </Zoom>
        {/*<button onClick={jimpImages}>Click to Jimp</button>*/}
        <button onClick={draw}>Click to draw</button>
        <Paper
          elevation={3}
        />
        <div>
          {/*<img
            id="image"
            src={zeusImg}
            alt='zeus'
            style={{ cursor: 'url('+{sOhm}+'),auto' }}
          />*/}
          
        </div>
        {/* <img src={sOhm} alt='sOhm' /> */}

    </div>
  );
}
export default Compositor;
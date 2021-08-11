import React from 'react';

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
import zeusImg from '../assets/Zeus_Full_Body.png';
import sOhm from '../assets/token_sOHM.png';

function Compositor() {

  function draw() {
    var canvasOnly = document.getElementById('canvas')
    var ctx = canvasOnly.getContext('2d');
    var img = new Image();
    img.src = zeusImg;
    var logo = new Image();
    logo.src = sOhm;
    
    console.log("img.naturalHeight");
    console.log(img.naturalHeight);
    ctx.canvas.height = img.naturalHeight;
    ctx.canvas.width = img.naturalWidth;
    img.onload = function() {
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

  return (
    <div id="stake-view">
      <Zoom in={true}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <div>Dropzone will be here</div>
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
          <canvas
            id="canvas"
          ></canvas>
        </div>
        {/* <img src={sOhm} alt='sOhm' /> */}

    </div>
  );
}
export default Compositor;
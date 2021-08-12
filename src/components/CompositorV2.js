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

import React, {useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';

import "./stake.scss";

import zeusImg from '../assets/Zeus_Full_Body.png';
import sOhm from '../assets/token_sOHM.png';

const canvasContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

// const canvasStyle = {
//   display: 'inline-flex',
//   borderRadius: 2,
//   border: '1px solid #eaeaea',
//   marginBottom: 8,
//   marginRight: 8,
//   width: 350,
//   height: 350,
//   padding: 4,
//   boxSizing: 'border-box'
// };

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 350,
  height: 350,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const imgStyle = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


function CompositorV2(props) {

  function draw(baseImg) {
    if (baseImg === undefined) {
      baseImg = zeusImg;
    };
    var canvasOnly = canvasRef.current
    var ctx = canvasOnly.getContext('2d');
    // var img = new Image();

    // img.src = baseImg;
    var logo = new Image();
    logo.src = sOhm;
    
    // console.log("img.naturalHeight");
    // console.log(img.naturalHeight);
    // ctx.canvas.height = img.naturalHeight;
    // ctx.canvas.width = img.naturalWidth;

    // img.onload = function() {
    //   console.log('onload');
    //   console.log(img);
    //   ctx.drawImage(img, 0, 0);
    //   // ctx.drawImage(logo, 10, 10, 20, 20);
    // };

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

  const canvasRef = React.useRef(null);
  // const imageRef = React.useRef(null);

  const [files, setFiles] = useState([]);
  const [showCanvas, setshowCanvas] = useState(false);
  
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {

      setshowCanvas(false);
      loadFile(acceptedFiles[0]);
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));

      
    }
  });
  
  const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={imgStyle}
            alt='whatever'
            onClick={e => {
              console.log(e);
              files.forEach(file => loadFile(file));
              setshowCanvas(true);
            }}
          />
        </div>
      </div>
  ));

  const loadFile = useCallback((file) => {
    // handle the click event
    console.log('load file');
    // function loadFile(file) {
    console.log(file);
    var canvasOnly = canvasRef.current;
    var ctx = canvasOnly.getContext('2d');
    const image = new Image();
    image.src = file.preview;

    ctx.canvas.height = image.naturalHeight || 100;
    ctx.canvas.width = image.naturalWidth || 100;

    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvasOnly.width, canvasOnly.height);
    };

    draw(image);

  }, []);  

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
    // files.forEach(file => loadFile(file));

  }, [files]);

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
            {!showCanvas &&
              <div style={thumbsContainer}>
                {thumbs}
              </div>
            }
            
            <div style={canvasContainer}>
              <canvas
                id="canvas"
                ref={canvasRef}
                width={window.innerWidth-10}
                height={window.innerHeight-10}
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
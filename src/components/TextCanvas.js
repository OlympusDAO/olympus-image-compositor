// TextCanvas = Background Canvas
//
// Allows user to upload & position a background onto a canvas
import React, {useState} from 'react';

import {
  Grid,
  Box,
  TextField,
  Typography,
  // Paper,
  // Typography,
  // Button,
  // CircularProgress,
  // Zoom,
} from "@material-ui/core";
import { SketchPicker } from 'react-color';

export default function TextCanvas(props) {

  const buttonColorRef = React.useRef(null);
  const textColorRef = React.useRef(null);
  // const textColorString = props.textColor;
  // const buttonColorString = props.buttonColor;
  const [displayTextPicker, setDisplayTextPicker] = useState(false);
  const [displayButtonPicker, setDisplayButtonPicker] = useState(false);

  const handleChange = (e) => {
    var t;
    clearTimeout(t);
    t = setTimeout(function() {
      console.log("handleChange", e.target.value);
      props.setUserName(e.target.value);
    }, 300);
  };

  const handleButtonColor = (color) => {
    console.log("buttonColor", color);
    // buttonColorRef.current.value = color;
    props.setButtonColor(color);
  };

  const handleTextColor = (color) => {
    console.log("textColor", color);
    // textColorRef.current.value = color;
    props.setTextColor(color);
  };

  const colorStyle = (whichSwatch) => {
    const baseStyles = {
      width: '36px',
      height: '14px',
      borderRadius: '2px',
    };
    var backgroundStyles;
    if (whichSwatch === "text") {
      backgroundStyles = {
        background: `rgba(${ props.textColor.rgb.r }, ${ props.textColor.rgb.g }, ${ props.textColor.rgb.b }, ${ props.textColor.rgb.a })`,
      };
    } else {
      backgroundStyles = {
        background: `rgba(${ props.buttonColor.rgb.r }, ${ props.buttonColor.rgb.g }, ${ props.buttonColor.rgb.b }, ${ props.buttonColor.rgb.a })`,
      };
    }

    return {
      ...baseStyles,
      ...backgroundStyles,
    };
  };

  const swatchStyle = {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  };

  const popoverStyle = {
    position: 'absolute',
    zIndex: '2',
  };

  const coverStyle = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };

  const clickTextSwatch = () => {
    console.log('clicked');
    setDisplayTextPicker(true);
  };
  
  const closeTextSwatch = () => {
    console.log('clicked');
    setDisplayTextPicker(false);
  };

  const clickButtonSwatch = () => {
    console.log('clicked');
    setDisplayButtonPicker(true);
  };

  const closeButtonSwatch = () => {
    console.log('clicked');
    setDisplayButtonPicker(false);
  };

  return (
    <Box style={{marginBottom: "1em"}}>
      <TextField
        id="your-name"
        label="Your Name"
        variant="filled"
        onChange={handleChange} />

      <Grid component="label" container justifyContent="center" alignItems="center" spacing={1}>
        <Grid item>
          <Typography>Text Color</Typography>
          <Box style={ swatchStyle } onClick={ clickTextSwatch }>
            <Box style={ colorStyle("text") } />
          </Box>
        </Grid> 
        <Grid item>
        <Typography>Button Text</Typography>
          <Box style={ swatchStyle } onClick={ clickButtonSwatch }>
            <Box style={ colorStyle("button") } />
          </Box>
        </Grid>
      </Grid>
  
      <Box>
        { displayTextPicker ? (
            <div style={ popoverStyle }>
              <div style={ coverStyle } onClick={ closeTextSwatch }/>
              <SketchPicker
                id="text-color"
                ref={textColorRef}
                name='color'
                color={props.textColor}
                // value={textColorString}
                onChangeComplete={handleTextColor}
              />
            </div>
          ) : (null)
        }
        { displayButtonPicker ? (
            <div style={ popoverStyle }>
              <div style={ coverStyle } onClick={ closeButtonSwatch }/>
              <SketchPicker
                id="button-color"
                ref={buttonColorRef}
                name='color'
                // defaultValue={buttonColorString}
                color={props.buttonColor}
                onChangeComplete={handleButtonColor}
              />
            </div>
          ) : (null)
        }
      </Box>
    </Box>
  );
}
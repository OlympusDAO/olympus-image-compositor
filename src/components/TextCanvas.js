// TextCanvas = Background Canvas
//
// Allows user to upload & position a background onto a canvas
import React, {useState, useEffect} from 'react';

import {
  Box,
  TextField,
  // Typography,
  MenuItem,
  // Paper,
  // Typography,
  // Button,
  // CircularProgress,
  // Zoom,
} from "@material-ui/core";
// import useMediaQuery from '@material-ui/core/useMediaQuery';

import { SketchPicker } from "react-color";
import EyeDropper from "./EyeDropper";

export default function TextCanvas(props) {
  // const small = useMediaQuery('(min-width:600px)');
  const buttonColorRef = React.useRef(null);
  const textColorRef = React.useRef(null);
  const backgroundColorRef = React.useRef(null);
  // const textColorString = props.textColor;
  // const buttonColorString = props.buttonColor;
  const [displayTextPicker, setDisplayTextPicker] = useState(false);
  const [displayButtonPicker, setDisplayButtonPicker] = useState(false);
  const [displayBackgroundPicker, setDisplayBackgroundPicker] = useState(false);
  const [textPosition, setTextPosition] = useState("left");

  const handleChange = (e) => {
    var t;
    clearTimeout(t);
    t = setTimeout(function() {
      console.log("handleChange", e.target.value);
      props.setUserName(e.target.value);
    }, 300);
  };

  const handleBackgroundColor = (color) => {
    console.log("backgroundColor", color);
    // buttonColorRef.current.value = color;
    // TODO figure this out
    props.setBackgroundColor({fill: true, color: color});
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
      width: '100%',
      height: '100%',
      borderRadius: '2px',
    };
    var backgroundStyles;
    switch (whichSwatch) {
      case "text":
        backgroundStyles = {
          background: `rgba(${ props.textColor.rgb.r }, ${ props.textColor.rgb.g }, ${ props.textColor.rgb.b }, ${ props.textColor.rgb.a })`,
        };
        break;
      case "button":
        backgroundStyles = {
          background: `rgba(${ props.buttonColor.rgb.r }, ${ props.buttonColor.rgb.g }, ${ props.buttonColor.rgb.b }, ${ props.buttonColor.rgb.a })`,
        };
        break;
      case "background":
        backgroundStyles = {
          background: `rgba(${ props.backgroundColor.color.rgb.r }, ${ props.backgroundColor.color.rgb.g }, ${ props.backgroundColor.color.rgb.b }, ${ props.backgroundColor.color.rgb.a })`,
        };
        break;
      default:
        console.warn("you MUST set a whichSwatch");
    }

    return {
      ...baseStyles,
      ...backgroundStyles,
    };
  };

  const swatchStyle = {
    marginLeft: "3px",
    padding: '2px',
    background: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
    width: "43px",
    height: "43px",
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

  const clickBackgroundSwatch = () => {
    console.log('clicked');
    setDisplayBackgroundPicker(true);
  };
  
  const closeBackgroundSwatch = () => {
    console.log('clicked');
    setDisplayBackgroundPicker(false);
  };

  const handleBodyPositionChange = (e) => {
    console.log(e.target.value);
    // props.applyTextLocation(e.target.value);
    setTextPosition(e.target.value);
  };

  useEffect(() => {
    if (textPosition) props.applyTextLocation(textPosition);
  }, [props, textPosition]);

  /**
   * creates a Preview Canvas to allow color Picker to work its magic
   * 
   * Process:
   *    1. draw pickerCanvas (background + pfp) set z-index = 2
   *    2. set cursor: "crosshair"
   *    3. addEventListener "click" (to picker canvas)
   *    4. pull color from canvas
   *    5. hide pickerCanvas
   *    6. re-open swatch
   *    7. set color in swatch & on text or button or background
   * 
   * @param {*} which string === "text", "button", OR "background"
   * @param {*} e event, not required
   */
  const eyeDropperClick = (which, e) => {
    if (which === "text") {
      closeTextSwatch();
    } else if (which === "button") {
      console.log('eyeDropperClick');
      closeButtonSwatch();
    } else {
      closeBackgroundSwatch();
    }
    props.previewFinalCanvas(which);
  };

  useEffect(() => {
    if (displayTextPicker) {
      // add element
      // textColorRef.current.
    } else if (displayButtonPicker) {
      // add Element
    }
  }, [displayButtonPicker, displayTextPicker])

  return (
    <Box style={{display: "flex", flexFlow: "column wrap", gap: "6px"}}>
      <TextField
        id="name-input"
        label="Your Name"
        variant="outlined"
        // style={{color: "white"}}
        onChange={handleChange}
      />
      <Box id="background-inputs" display="flex" justifyContent="space-between">
        <TextField
          id="select-background"
          select
          label="Background"
          defaultValue="image"
          // onChange={handleChange}
          variant="outlined"
          style={{flexGrow: "3"}}
        >
          <MenuItem value={"image"}>
            Image
          </MenuItem>
          <MenuItem value={"solid"}>
            Solid
          </MenuItem>
        </TextField>
        <Box style={ swatchStyle } onClick={ clickBackgroundSwatch }>
          <Box style={ colorStyle("background") } />
        </Box>
      </Box>
      <Box id="body-inputs" display="flex" justifyContent="space-between">
        <TextField
          id="select-body"
          select
          label="Body"
          value={textPosition}
          onChange={handleBodyPositionChange}
          variant="outlined"
          style={{flexGrow: "3"}}
        >
          <MenuItem value={"left"}>
            Left
          </MenuItem>
          <MenuItem value={"right"}>
            Right
          </MenuItem>
        </TextField>
        <Box style={ swatchStyle } onClick={ clickTextSwatch }>
          <Box style={ colorStyle("text") } />
        </Box>
      </Box>
      <Box>
        <Box style={ swatchStyle } onClick={ clickButtonSwatch }>
          <Box style={ colorStyle("button") } />
        </Box>
      </Box>
      {/* <Box>
        <CustomColorPicker colors={["#000000", "#FFFFFF"]}/>
      </Box> */}
      <Box>
        { displayTextPicker ? (
            <div style={ popoverStyle }>
              <div id="textcover" style={ coverStyle } onClick={ closeTextSwatch }/>
              <EyeDropper eyeDropperClick={(e) => eyeDropperClick("text", e)} />
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
              <div id="buttonCover" style={ coverStyle } onClick={ closeButtonSwatch }/>
              <EyeDropper eyeDropperClick={(e) => eyeDropperClick("button", e)} />
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
        { displayBackgroundPicker ? (
          <div style={ popoverStyle }>
            <div id="buttonCover" style={ coverStyle } onClick={ closeBackgroundSwatch }/>
            <EyeDropper eyeDropperClick={(e) => eyeDropperClick("background", e)} />
            <SketchPicker
              id="button-color"
              ref={backgroundColorRef}
              name='color'
              // defaultValue={backgroundColorString}
              color={props.backgroundColor}
              onChangeComplete={handleBackgroundColor}
            />
          </div>
        ) : (null)
      }
      </Box>
    </Box>
  );
}
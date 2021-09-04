// TextCanvas = Background Canvas
//
// Allows user to upload & position a background onto a canvas
import React from 'react';

import {
  Grid,
  Box,
  TextField,
  Switch,
  // Paper,
  // Typography,
  // Button,
  // CircularProgress,
  // Zoom,
} from "@material-ui/core";

export default function TextCanvas(props) {

  const handleChange = (e) => {
    var t;
    clearTimeout(t);
    t = setTimeout(function() {
      console.log("handleChange", e.target.value);
      props.setUserName(e.target.value);
    }, 300);
  }

  const toggleSwitch = (e) => {
    // console.log("toggleSwitch", e.target.value);
    if (props.blackText === true) {
      props.setBlackText(false)
    } else {
      props.setBlackText(true)
    }
  }

  return (
    <Box style={{marginBottom: "1em"}}>
      <TextField
        id="your-name"
        label="Your Name"
        variant="filled"
        onChange={handleChange} />

      <Grid component="label" container justifyContent="center" alignItems="center" spacing={1}>
        <Grid item>White Text</Grid>
        <Grid item>
          <Switch checked={props.blackText} onChange={toggleSwitch} name="checkedC" />
        </Grid>
        <Grid item>Black Text</Grid>
      </Grid>
    </Box>
  );
}
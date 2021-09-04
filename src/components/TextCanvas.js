// TextCanvas = Background Canvas
//
// Allows user to upload & position a background onto a canvas
import React, { useEffect } from 'react';

import {
  // Grid,
  Box,
  TextField,
  // Paper,
  // Typography,
  // Button,
  // CircularProgress,
  // Zoom,
} from "@material-ui/core";

export default function TextCanvas(props) {

  const handleChange = (e, v) => {
    var t;
    clearTimeout(t);
    t = setTimeout(function() {
      console.log("handleChange", e.target.value);
      props.setUserName(e.target.value);
    }, 300);
  }

  return (
    <Box style={{marginBottom: "1em"}}>
      <TextField
        id="your-name"
        label="Your Name"
        variant="filled"
        onChange={handleChange} />
    </Box>
  );
}
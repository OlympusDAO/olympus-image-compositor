import React from 'react';

import {
  Box,
  Typography,
  Icon
} from "@material-ui/core";

import ColorizeIcon from '@material-ui/icons/Colorize';

export default function EyeDropper(props) {

  return (
    <Box style={{marginBottom: "0.75rem"}}>
      <Typography gutterBottom color="textSecondary">Bucket Fill</Typography>
      <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
        <Icon
          viewBox="0 0 50 50"
          style={{ fontSize: "5.1875rem", height: "100px", width: "100px" }}
          component={ColorizeIcon}
        />
      </Box>
    </Box>
  );
}
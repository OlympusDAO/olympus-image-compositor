import React from 'react';

import {
  Box,
  Typography,
  Icon
} from "@material-ui/core";

import ColorizeIcon from '@material-ui/icons/Colorize';

export default function EyeDropper(props) {

  const eyeDropperStyle = {
    // position: 'absolute',
    zIndex: '3',
    top: "0",
    right: "0",
    width: "220px",
    // paddingLeft: "20px",
    // paddingRight: "20px",
    height: "24px",
    // margin: "0px 10px 10px 0px",
    borderRadius: "4px",
    background: "white",
  };

  const containerStyle = {
    // background: "rgb(255, 255, 255)",
    height: "100%",
    width: "100%",
    cursor: "pointer",
    position: "relative",
    paddingLeft: "10px",
    outline: "none",
    borderRadius: "5px",
    boxShadow: "rgb(0 0 0 / 15%) 0px 0px 0px 1px inset",
    display: "flex",
    gap: "5px",
  };

  const iconStyle = {
    // fontSize: "5.1875rem",
    height: "24px",
    // width: "220px",
    color: "black",
    flexDirection: "row-reverse",
  };

  return (
    <div style={ eyeDropperStyle } onClick={ props.eyeDropperClick }>
      <Box style={containerStyle} alignContent="center">
        <Box>
          <Icon
            viewBox="0 0 25 25"
            style={iconStyle}
            component={ColorizeIcon}
            color="primary"
          />
        </Box>
        <Typography style={{color: "black", alignSelf: "center"}}>Eye Dropper</Typography>
      </Box>
    </div>
  );
}
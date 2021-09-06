import React from 'react';

import {
  Grid,
  Typography,
} from "@material-ui/core";

import SizeSlider from './SizeSlider';

export default function LogoResizer(props) {

  return (
    <div style={{marginBottom: "0.75rem"}}>
      <Typography gutterBottom color="textSecondary">Image Resizer, click to replace</Typography>
      <img
        src={props.stampSrc}
        height={props.stampHeight}
        width={props.stampWidth}
        style={props.imgStyle}
        alt="stamp"
        onClick={props.onStampClick}
      />
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <SizeSlider
            valueLabelDisplay="auto"
            aria-label="size slider"
            defaultValue={props.stampWidth}
            min={props.minSize}
            max={props.maxSize}
            onChange={props.resizeStamp}
          />
        </Grid>
      </Grid>
    </div>
  );
}
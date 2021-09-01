import React from "react";
import {
  Grid,
  // Box,
  Paper,
  Typography,
  // Button,
  // CircularProgress,
  Zoom,
} from "@material-ui/core";

const compositorPaper = {
  padding: "15px",
  textAlign: "center",
  // marginBottom: "20px",
}

function OhmieCard(props) {
  return (
    <Zoom in={true}>
      <Paper className={`ohm-card`} elevation={3} style={compositorPaper}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Welcome, Incooohmer</Typography>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Zoom>
  );
}

export default OhmieCard;
import React from "react";
import {
  Grid,
  // Box,
  Paper,
  Typography,
  Button,
  // CircularProgress,
  Zoom,
} from "@material-ui/core";
import {
  NavLink,
} from "react-router-dom";

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
              <Typography variant="h5" color="textSecondary" style={{marginBottom: "0.5rem"}}>Pick an option</Typography>
            </div>
          </Grid>
          <Grid item>
            <Button
              component={NavLink}
              to="/pof"
              variant="contained"
              color="primary"
              className="connect-button"
              activeClassName="connect-button"
            >
              Proof of Ohmie
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={NavLink}
              to="/ohmiecard"
              variant="contained"
              color="primary"
              className="connect-button"
              activeClassName="connect-button"
            >
              Ohmie Card
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Zoom>
  );
}

export default OhmieCard;
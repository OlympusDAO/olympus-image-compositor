import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PanoramaOutlinedIcon from '@material-ui/icons/PanoramaOutlined';
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    "& .MuiBottomNavigationAction-root": {
      "@media (max-width: 768px)": {
        minWidth: "auto",
        padding: "6px 0"
      }
    }
  },
});

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction label="Background" value="background" icon={<PanoramaOutlinedIcon className="iconStyle" />} />
      <BottomNavigationAction label="pfp" value="pfp" icon={<FaceOutlinedIcon className="iconStyle" />} />
      <BottomNavigationAction label="Text" value="text" icon={<DescriptionOutlinedIcon className="iconStyle" />} />
      <BottomNavigationAction label="Download" value="download" icon={<GetAppOutlinedIcon className="iconStyle" />} />
    </BottomNavigation>
  );
}
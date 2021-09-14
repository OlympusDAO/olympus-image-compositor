import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
// import { dark as darkTheme } from "../themes/dark.js"

// import Typography from '@material-ui/core/Typography';
// import Tooltip from '@material-ui/core/Tooltip';

const SizeSlider = withStyles({
  root: {
    color: "#9DBAEC",
    height: 8,
  },
  thumb: {
    height: 12,
    width: 12,
    backgroundColor: '#9DBAEC',
    border: '2px solid #fff',
    marginTop: -4,
    marginLeft: -9,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% - 9px)',
  },
  track: {
    height: 4,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    color: "#fff",
    borderRadius: 4,
  },
})(Slider);

export default SizeSlider;
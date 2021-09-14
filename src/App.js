import './App.css';

// import { ThemeProvider } from "@material-ui/core/styles";
// import CssBaseline from "@material-ui/core/CssBaseline";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
// import useWindowSize from "./hooks/useWindowSize";


// import { dark as darkTheme } from "./themes/dark.js"
// import { light as lightTheme } from "./themes/light.js";
// import "./style.scss";
import "./components/stake.scss";

// import CompositorV2 from './components/CompositorV2';
// import MainNavLinks from './components/MainNavLinks';
// import OhmieCardV3 from './components/OhmieCardV3';
import CompositorV4 from './components/CompositorV4';
import MainNavLinksV4 from './components/MainNavLinksV4';
import OhmieCardV4 from './components/OhmieCardV4';
// import SOhmLogoBottomBar from "./components/SOhmLogoBottomBar";

import {
  Switch,
  Route,
} from "react-router-dom";

function App() {
  useGoogleAnalytics();
  // const windowSize = useWindowSize();

  // const stakeStyle = {
  //   overflow: "auto",
  //   height: windowSize.height,
  // }
  return (
    <div id="stake-view">
      <Switch>
        <Route path="/pof">
          <CompositorV4 />
        </Route>
        <Route path="/ohmiecard">
          <OhmieCardV4 />
        </Route>
        <Route exact path="/">
          <MainNavLinksV4 />
        </Route>
      </Switch>      
    </div>
    
  );
}

// function MainNavLinks() {
//   return (
//     <div>
//       <
//     </div>
//   );
// }

export default App;

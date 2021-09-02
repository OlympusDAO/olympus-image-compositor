import './App.css';

// import { ThemeProvider } from "@material-ui/core/styles";
// import CssBaseline from "@material-ui/core/CssBaseline";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useWindowSize from "./hooks/useWindowSize";


// import { dark as darkTheme } from "./themes/dark.js"
// import { light as lightTheme } from "./themes/light.js";
// import "./style.scss";
import "./components/stake.scss";

import CompositorV2 from './components/CompositorV2';
import OhmieCardV2 from './components/OhmieCardV2';
import LabelBottomNavigation from './components/BottomNav';

import {
  Switch,
  Route,
} from "react-router-dom";

function App() {
  useGoogleAnalytics();
  const windowSize = useWindowSize();

  const stakeStyle = {
    justifyContent: "start",
    overflow: "auto",
    height: windowSize.height,
  }
  return (
    <div id="stake-view" style={stakeStyle}>
      <Switch>
        <Route path="/sohm">
          <CompositorV2 />
        </Route>
        <Route path="/ohmie-card">
          <OhmieCardV2 />
        </Route>
        <Route exact path="/">
          <OhmieCardV2 />
        </Route>
      </Switch>
      <LabelBottomNavigation />
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

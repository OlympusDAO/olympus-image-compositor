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
import OhmieCard from './components/OhmieCard';
import MainNavLinks from './components/MainNavLinks';

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
    height: windowSize.height
  }
  return (
    <div id="stake-view" style={stakeStyle}>
      <Switch>
        <Route path="/sohm">
          <CompositorV2 />
        </Route>
        <Route path="/ohmie-card">
          <OhmieCard />
        </Route>
        <Route exact path="/">
          <MainNavLinks />
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

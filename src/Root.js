import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
// import useGoogleAnalytics from "./hooks/useGoogleAnalytics";

// import { dark as darkTheme } from "./themes/dark.js"
import { figma as figmaTheme } from "./themes/figma.js";
import "./style.scss";

import App from "./App";

import {
  BrowserRouter,
} from "react-router-dom";

function Root() {
  // useGoogleAnalytics();
  let themeMode = figmaTheme;
  return (
    <BrowserRouter basename={"/#"}>
      <ThemeProvider theme={themeMode}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default Root;

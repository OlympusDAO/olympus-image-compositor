import './App.css';

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { dark as darkTheme } from "./themes/dark.js"
// import { light as lightTheme } from "./themes/light.js";
import "./style.scss";

import CompositorV2 from './components/CompositorV2';

function App() {
  let themeMode = darkTheme;
  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <CompositorV2 />
    </ThemeProvider>
  );
}

export default App;

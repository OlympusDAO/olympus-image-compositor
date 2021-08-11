import './App.css';

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { dark as darkTheme } from "./themes/dark.js"

import Compositor from './components/Compositor';

function App() {
  let themeMode = darkTheme;
  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <Compositor />
    </ThemeProvider>
  );
}

export default App;

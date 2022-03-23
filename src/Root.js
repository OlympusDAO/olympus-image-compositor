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

import {
  Mainnet,
  DAppProvider,
} from '@usedapp/core'

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_IDS}`,
  },
}

const queryClient = new QueryClient();

function Root() {
  // useGoogleAnalytics();
  let themeMode = figmaTheme;
  return (
    <BrowserRouter basename={"/#"}>
      <ThemeProvider theme={themeMode}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <DAppProvider config={config}>
            <App />
          </DAppProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default Root;

import React from "react";
import "./App.css";
import { RootStoreContext } from "./stores/useRootStore";
import { Store } from "./stores/RootStore";
import { Content } from "./components/content/Content";
import { createTheme, ThemeProvider } from "@mui/material";

function App(): JSX.Element {
  const theme = createTheme({
    // todo: add custom messages type
    typography: {
      poster: {
        color: "red",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <RootStoreContext.Provider value={Store}>
        <Content />
      </RootStoreContext.Provider>
    </ThemeProvider>
  );
}

export default App;

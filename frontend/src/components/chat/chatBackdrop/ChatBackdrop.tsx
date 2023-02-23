import React from "react";
import { observer } from "mobx-react-lite";
import { Backdrop, CircularProgress, Grid, Typography } from "@mui/material";
import { useRootStore } from "../../../stores/useRootStore";
import { ReconnectingMessage } from "./ReconnectingMessage";
import { ReconnectingCountdown } from "./ReconnectingCountdown";

export const ChatBackdrop: React.FC = observer(() => {
  const store = useRootStore();

  return (
    <Backdrop
      open={store.UiStore.ChatWindowStore.reconnectBackdropShown}
      sx={{ position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(6px)", zIndex: 2 }}
    >
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={5}>
        <Grid item xs>
          <CircularProgress color="inherit" />
        </Grid>
        <Grid item container direction="column" alignItems="center" justifyContent="center">
          <Typography variant="h6">It seems like we've lost connection to the server</Typography>
          {store.ChatStore.chatConnecting ? <ReconnectingMessage /> : <ReconnectingCountdown />}
        </Grid>
      </Grid>
    </Backdrop>
  );
});

import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../../stores/useRootStore";
import { Typography } from "@mui/material";

export const ReconnectingCountdown: React.FC = observer(() => {
  const store = useRootStore();

  return (
    <Typography variant="h6">Reconnecting in {store.UiStore.ChatWindowStore.secondsLeftUntilReconnect}...</Typography>
  );
});

import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Button, Typography } from "@mui/material";
import { useRootStore } from "../../../stores/useRootStore";

export const HeadBarDisconnectButton: React.FC = observer(() => {
  const store = useRootStore();

  const handleClick = useCallback(() => {
    store.ChatStore.disconnectChat();
  }, [store.ChatStore]);

  return (
    <Button variant="text" color="secondary" onClick={handleClick}>
      <Typography variant="button">Disconnect</Typography>
    </Button>
  );
});

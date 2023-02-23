import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../stores/useRootStore";
import { Fade, LinearProgress } from "@mui/material";

export const LoginFormLoader: React.FC = observer(() => {
  const store = useRootStore();

  return (
    <Fade in={store.UiStore.LoginFormStore.loginInProgress} timeout={{ enter: 800, exit: 200 }} mountOnEnter>
      <LinearProgress color="primary" />
    </Fade>
  );
});

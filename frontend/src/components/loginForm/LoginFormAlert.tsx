import React, { useCallback } from "react";
import { Alert, Fade, Grid, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import CloseIcon from "@mui/icons-material/Close";
import { useRootStore } from "../../stores/useRootStore";

export const LoginFormAlert: React.FC = observer(() => {
  const store = useRootStore();

  const handleCloseClicked = useCallback(() => {
    store.UiStore.LoginFormStore.hideError();
  }, [store.UiStore.LoginFormStore]);

  // todo: possible edge case when user is seeing an error, but websocket closes at that moment
  // todo: this would result in error message changing without animation and therefore bad UX
  return (
    <Grid container>
      <Grid item xs>
        <Fade
          in={store.UiStore.LoginFormStore.showLoginError && !!store.UiStore.LoginFormStore.loginError}
          timeout={{ enter: 600, exit: 200 }}
          mountOnEnter
        >
          <Alert
            sx={{ alignItems: "center" }}
            severity="error"
            variant="outlined"
            action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseClicked}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {store.UiStore.LoginFormStore.loginError}
          </Alert>
        </Fade>
      </Grid>
    </Grid>
  );
});

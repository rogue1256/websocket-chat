import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../stores/useRootStore";
import { LoginForm } from "../loginForm";
import { Box, Paper } from "@mui/material";
import { ChatLayout, LoginFormLayout } from "../../shared/layout";
import { ChatWindowContainer } from "../chat";

export const Content: React.FC = observer(() => {
  const store = useRootStore();

  return store.UiStore.loginScreenShown.get() ? (
    <LoginFormLayout>
      <Paper elevation={6}>
        <Box padding={2}>
          <LoginForm />
        </Box>
      </Paper>
    </LoginFormLayout>
  ) : (
    <ChatLayout>
      <ChatWindowContainer />
    </ChatLayout>
  );
});

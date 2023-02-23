import React from "react";
import { Grid } from "@mui/material";
import { MessageContainer } from "./MessageContainer";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../../stores/useRootStore";

export const ChatBody: React.FC = observer(() => {
  const store = useRootStore();

  return (
    <Grid container direction="column-reverse" spacing={2}>
      {store.ChatStore.chat.messages
        .slice()
        .reverse()
        .map((chatMessage) => {
          return (
            <Grid item key={chatMessage.id}>
              <MessageContainer message={chatMessage} />
            </Grid>
          );
        })}
    </Grid>
  );
});

import React from "react";
import { Divider, Grid } from "@mui/material";
import { ChatHeader } from "./chatHeader";
import { ChatBody } from "./chatBody";
import { NewMessage } from "./newMessage";
import { ChatBackdrop } from "./chatBackdrop";

export const ChatWindowContainer: React.FC = () => {
  return (
    <Grid container direction="column" height="100vh" spacing={0} paddingBottom={0}>
      <Grid item container alignSelf="flex-start">
        <ChatHeader />
      </Grid>
      <Grid item container flexGrow={1} direction="column" sx={{ position: "relative" }} paddingTop={1}>
        <Grid
          item
          container
          direction="column-reverse"
          flex="1 1 0"
          flexWrap="nowrap"
          sx={{ minHeight: "100px", overflowY: "auto", overflowX: "hidden" }}
        >
          <ChatBody />
        </Grid>
        <Grid item paddingX={5} paddingTop={0.1}>
          <Divider />
        </Grid>
        <Grid item paddingX={5} paddingY={2}>
          <NewMessage />
        </Grid>
        <ChatBackdrop />
      </Grid>
    </Grid>
  );
};

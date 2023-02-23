import React from "react";
import { AppBar, Box, Grid, Typography } from "@mui/material";
import { HeadBarDisconnectButton } from "./HeadBarDisconnectButton";

export const ChatHeader: React.FC = () => {
  return (
    <AppBar position="relative" sx={{ borderRadius: "3px" }}>
      <Box paddingX={2}>
        <Grid
          container
          spacing={{ xs: 2, sm: 0 }}
          direction={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "initial", sm: "space-between" }}
          alignContent={{ xs: "center", sm: "initial" }}
          alignItems={"center"}
        >
          {/*todo: fix mobile layout*/}
          <Grid item xs={6} container justifyContent={{ xs: "center", sm: "initial" }}>
            <Typography variant="h6">Chat</Typography>
          </Grid>
          <Grid item xs={6} container justifyContent={{ xs: "center", sm: "flex-end" }}>
            <HeadBarDisconnectButton />
          </Grid>
        </Grid>
      </Box>
    </AppBar>
  );
};

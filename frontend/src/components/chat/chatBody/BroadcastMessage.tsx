import React from "react";
import { Box, Grid, Typography } from "@mui/material";

type BroadcastMessageProps = {
  text: string;
};

export const BroadcastMessage: React.FC<BroadcastMessageProps> = ({ text }) => {
  return (
    <Grid container justifyContent="center">
      <Box paddingX={5}>
        <Typography variant={"caption"}>{text}</Typography>
      </Box>
    </Grid>
  );
};

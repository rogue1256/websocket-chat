import React from "react";
import { Box, Grid, Slide, Typography } from "@mui/material";

type ChatMessageProps = {
  ownMessage: boolean;
  text: string;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ ownMessage, text }) => {
  return (
    <Grid container justifyContent={ownMessage ? "flex-end" : "flex-start"}>
      <Grid item xs={10} paddingX={5}>
        <Slide direction={ownMessage ? "left" : "right"} in={true} mountOnEnter>
          <Box sx={{ backgroundColor: ownMessage ? "#F0F1F6" : "#D4D8E4", borderRadius: "10px" }} padding={1}>
            <Typography variant="body2">{text}</Typography>
          </Box>
        </Slide>
      </Grid>
    </Grid>
  );
};

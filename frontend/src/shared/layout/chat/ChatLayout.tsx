import React from "react";
import { Grid } from "@mui/material";

type LayoutProps = {
  children?: React.ReactNode;
};

export const ChatLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Grid container spacing={{ xs: 0, md: 0 }} sx={{ minWidth: 375 }}>
      <Grid item xs={0} sm={1} md={2} xl={1} />
      <Grid item xs={12} sm={10} md={8} xl={10}>
        {children}
      </Grid>
      <Grid item xs={0} sm={1} md={2} xl={1} />
    </Grid>
  );
};

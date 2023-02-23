import React from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";

type LayoutProps = {
  children?: React.ReactNode;
};

export const LoginFormLayout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      spacing={{ xs: 0, md: 0 }}
      sx={{ minHeight: isBelowSm ? "initial" : "100vh", alignItems: isBelowSm ? "initial" : "center" }}
    >
      <Grid item xs={0} sm={2} md={3} />
      <Grid item xs={12} sm={8} md={6}>
        {children}
      </Grid>
      <Grid item xs={0} sm={2} md={3} />
    </Grid>
  );
};

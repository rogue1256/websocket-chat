import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRootStore } from "../../stores/useRootStore";
import { LoginButton } from "./LoginButton";
import { LoginFormInputs, validationSchema } from "./FormSchema";
import { LoginFormLoader } from "./LoginFormLoader";
import { observer } from "mobx-react-lite";
import { LoginFormAlert } from "./LoginFormAlert";

export const LoginForm: React.FC = observer(() => {
  const store = useRootStore();

  const formControls = useForm<LoginFormInputs>({
    defaultValues: {
      username: "",
      serverAddress: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
  } = formControls;

  const submitHandler: SubmitHandler<LoginFormInputs> = useCallback(
    (data) => {
      store.ChatStore.chat.setUsername(data.username);
      store.ChatStore.chat.setServerAddress(new URL(data.serverAddress));
      store.ChatStore.initiateConnection();
    },
    [store.ChatStore]
  );

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(
    () => setIsLoggingIn(store.UiStore.LoginFormStore.loginInProgress),
    [store.UiStore.LoginFormStore.loginInProgress, setIsLoggingIn]
  );

  useEffect(() => {
    setValue("serverAddress", store.ChatStore.chat.serverAddress?.href ?? "");
    setValue("username", store.ChatStore.chat.username ?? "");
  }, []);

  return (
    <Box padding={2}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <FormProvider {...formControls}>
          <Grid container direction={"column"} spacing={2}>
            <Grid item>
              <Typography variant="h5">Login:</Typography>
            </Grid>
            <Grid item>
              <Controller
                control={control}
                name={"username"}
                render={({ field }): JSX.Element => (
                  <TextField
                    {...field}
                    disabled={isLoggingIn}
                    error={isSubmitted && Boolean(errors.username?.message)}
                    helperText={errors.username?.message}
                    variant="outlined"
                    label="Username"
                    fullWidth
                    id="login-username-input-websocket"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <Controller
                name={"serverAddress"}
                control={control}
                render={({ field }): JSX.Element => (
                  <TextField
                    {...field}
                    disabled={isLoggingIn}
                    error={isSubmitted && Boolean(errors.serverAddress?.message)}
                    helperText={errors.serverAddress?.message}
                    variant="outlined"
                    label="Server"
                    fullWidth
                    id="login-server-input"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <LoginFormLoader />
            </Grid>
            <Grid item>
              <LoginFormAlert />
            </Grid>
            <Grid item container justifyContent="flex-end">
              <Grid item>
                <LoginButton />
              </Grid>
            </Grid>
          </Grid>
        </FormProvider>
      </form>
    </Box>
  );
});

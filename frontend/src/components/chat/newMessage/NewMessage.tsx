import React, { useCallback, useEffect, useMemo } from "react";
import { Grid, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../../stores/useRootStore";
import { debounce } from "lodash";

type NewMessageFormInput = {
  message: string;
};

const inputValidationSchema = yup.object({
  message: yup.string().trim().required(),
});

export const NewMessage: React.FC = observer(() => {
  const store = useRootStore();

  const { control, handleSubmit, formState, reset, watch, setValue, setFocus } = useForm<NewMessageFormInput>({
    defaultValues: {
      message: "",
    },
    resolver: yupResolver(inputValidationSchema),
  });

  // todo: fix this hook
  useEffect(() => setValue("message", store.ChatStore.chat.messageDraft), []);

  const updateStoreDraftValue = useCallback(
    (newValue: string) => store.ChatStore.chat.updateDraftValue(newValue),
    [store.ChatStore.chat]
  );

  const updateStoreDraftValueDebounced = useMemo(() => debounce(updateStoreDraftValue, 300), [updateStoreDraftValue]);

  const messageChangeWatch = watch("message");

  useEffect(() => {
    updateStoreDraftValueDebounced(messageChangeWatch);
  }, [messageChangeWatch, updateStoreDraftValueDebounced]);

  const submitHandler: SubmitHandler<NewMessageFormInput> = useCallback(
    (_) => {
      updateStoreDraftValueDebounced.flush();
      store.ChatStore.sendTextMessage();
      reset();
      setFocus("message");
    },
    [reset, setFocus, store.ChatStore, updateStoreDraftValueDebounced]
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs>
          <Controller
            control={control}
            name="message"
            render={({ field }): JSX.Element => (
              <TextField
                {...field}
                multiline
                fullWidth
                label="Message"
                autoComplete="off"
                placeholder="Type your message"
                maxRows={6}
                value={field.value}
                onChange={field.onChange}
                error={Boolean(formState.errors.message)}
                onKeyDown={(event): void => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit(submitHandler)();
                  }
                }}
              />
            )}
          />
        </Grid>
        <Grid item>
          <IconButton type="submit">
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );
});

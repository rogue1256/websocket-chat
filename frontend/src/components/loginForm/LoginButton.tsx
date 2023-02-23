import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../stores/useRootStore";

export const LoginButton: React.FC = observer(() => {
  const formControls = useFormContext();
  const store = useRootStore();

  const isFormButtonEnabledConditionValid = useMemo(
    () =>
      formControls.formState.isSubmitting || (formControls.formState.isSubmitted && !formControls.formState.isValid),
    [formControls.formState.isSubmitted, formControls.formState.isSubmitting, formControls.formState.isValid]
  );

  return (
    <Button
      type="submit"
      variant="contained"
      disabled={isFormButtonEnabledConditionValid || store.ChatStore.isSocketConnecting}
    >
      Login
    </Button>
  );
});

import { useEffect, useRef } from "react";
import { ActionState } from "@/components/form/utils/to-action-state";

type OnArgs<T> = {
  actionState: ActionState<T>;
};

type UseActionFeedbackOptions<T> = {
  onSuccess?: (onArgs: OnArgs<T>) => void;
  onError?: (onArgs: OnArgs<T>) => void;
};

const useActionFeedback = <T>(
  actionState: ActionState<T>,
  options: UseActionFeedbackOptions<T>
) => {
  const prevTimestamp = useRef(actionState.timestamp);
  const isUpdate = prevTimestamp.current !== actionState.timestamp;

  useEffect(() => {
    if (!isUpdate) return;

    if (actionState.status === "SUCCESS") {
      options.onSuccess?.({ actionState });
    }

    if (actionState.status === "ERROR") {
      options.onError?.({ actionState });
    }

    prevTimestamp.current = actionState.timestamp;
  }, [isUpdate, actionState, options]);
};

export { useActionFeedback };

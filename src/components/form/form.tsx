import { toast } from "sonner";
import { useActionFeedback } from "./hooks/use-action-feedback";
import { ActionState } from "./utils/to-action-state";

type FormProps<T = unknown> = {
  action: (payload: FormData) => void;
  actionState: ActionState<T>;
  children: React.ReactNode;
  onSuccess?: (actionState: ActionState<T>) => void;
  onError?: (actionState: ActionState) => void;
};

const Form = <T,>({
  action,
  actionState,
  children,
  onSuccess,
  onError,
}: FormProps<T>) => {
  useActionFeedback(actionState, {
    onSuccess: ({ actionState }) => {
      if (actionState.message) {
        toast.success(actionState.message);
      }

      onSuccess?.(actionState);
    },
    onError: ({ actionState }) => {
      if (actionState.message) {
        toast.error(actionState.message);
      }

      onError?.(actionState);
    },
  });

  return (
    <form action={action} className="flex flex-col gap-y-2">
      {children}
    </form>
  );
};

export { Form };

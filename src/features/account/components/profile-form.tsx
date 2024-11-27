"use client";

import { User as AuthUser } from "lucia";
import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "../actions/update-profile";

type ProfileFormProps = {
  user: AuthUser;
};

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [actionState, action] = useActionState(
    updateProfile,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        name="username"
        type="text"
        defaultValue={
          (actionState.payload?.get("username") as string) ?? user.username
        }
      />
      <FieldError actionState={actionState} name="username" />

      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="text"
        defaultValue={
          (actionState.payload?.get("email") as string) ?? user.email
        }
      />
      <FieldError actionState={actionState} name="email" />

      <SubmitButton label="Update" />
    </Form>
  );
};

export { ProfileForm };

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { accountProfilePath } from "@/paths";

// const updateProfileSchema = z.object({
//   username: z
//     .string()
//     .min(1)
//     .max(191)
//     .refine((value) => !value.includes(" "), "Username cannot contain spaces"),
//   email: z.string().min(1, { message: "Is required" }).max(191).email(),
// });

const updateProfileSchema = (id: string) => {
  return z.object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine((value) => !value.includes(" "), "Username cannot contain spaces")
      // Assure username has not been taken
      .refine(async (username) => {
        const user = await prisma.user.findFirst({
          where: {
            username,
          },
        });

        // ! By checking user.id === id we avoid to show error if user has not change current username
        return !user || user.id === id;
      }, "This username has been taken"),
    email: z
      .string()
      .min(1, { message: "Is required" })
      .max(191)
      .email()
      // Assure email has not been taken
      .refine(async (email) => {
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        // ! By checking user.id === id we avoid to show error if user has not change current email
        return !user || user.id === id;
      }, "This email has been taken"),
  });
};

export const updateProfile = async (
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  try {
    const data = await updateProfileSchema(user.id).parseAsync({
      username: formData.get("username"),
      email: formData.get("email"),
    });

    // * Alternative way to check unique email and username,
    // * but this will show error in toast and not in field error
    // const existingUser = await prisma.user.findFirst({
    //   where: {
    //     OR: [
    //       { username: data.username },
    //       { email: data.email },
    //     ],
    //   },
    // });

    // if (existingUser && existingUser.id !== user.id) {
    //   const emailExist = existingUser.email === data.email;
    //   const usernameExist = existingUser.username === data.username;

    //   const error =
    //     emailExist && usernameExist
    //       ? "This email and username has been already used"
    //       : `This ${emailExist ? "email" : "username"} has been already used`;

    //   throw new Error(error);
    // }

    await prisma.user.update({
      where: { id: user.id },
      data,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(accountProfilePath());

  return toActionState("SUCCESS", "Profile updated");
};

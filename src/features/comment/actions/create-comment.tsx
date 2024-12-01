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
import { ticketPath } from "@/paths";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1024),
});

export const createComment = async <T = unknown,>(
  ticketId: string,
  _actionState: ActionState<T>,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  let comment;

  try {
    const data = createCommentSchema.parse(Object.fromEntries(formData));

    comment = await prisma.comment.create({
      data: {
        userId: user.id,
        ticketId: ticketId,
        ...data,
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    return fromErrorToActionState<T>(error);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState<T>("SUCCESS", "Comment created", undefined, {
    ...comment,
    isOwner: true,
  } as T);
};

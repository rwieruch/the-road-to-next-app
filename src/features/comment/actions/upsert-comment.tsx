"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1024),
});

export const upsertComment = async (
  ticketId: string,
  commentId: string | undefined,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  try {
    if (commentId) {
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

      if (!comment || !isOwner(user, comment)) {
        return toActionState(
          "ERROR",
          "You are not authorized to edit this comment"
        );
      }
    }

    const data = createCommentSchema.parse(Object.fromEntries(formData));

    const dbData = {
      ...data,
      userId: user.id,
      ticketId: ticketId,
    };

    await prisma.comment.upsert({
      where: { id: commentId || "" },
      update: dbData,
      create: dbData,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  if (commentId) {
    await setCookieByKey("toast", "Comment updated successfully");
    redirect(ticketPath(ticketId));
  }

  return toActionState("SUCCESS", "Comment created successfully");
};

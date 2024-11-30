import { prisma } from "@/lib/prisma";

export const getComment = async (commentId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
};

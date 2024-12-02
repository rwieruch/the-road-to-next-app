"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { CardCompact } from "@/components/card-compact";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginatedData } from "@/types/pagination";
import { getComments } from "../queries/get-comments";
import { CommentWithMetadata } from "../types";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";

type CommentsProps = {
  ticketId: string;
  paginatedComments: PaginatedData<CommentWithMetadata>;
};

const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
  const queryKey = ["comments", ticketId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: paginatedComments.list,
            metadata: paginatedComments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const comments = data.pages.flatMap((page) => page.list);

  const queryClient = useQueryClient();

  const handleDeleteComment = (id: string) => {
    queryClient.setQueryData<{
      pages: PaginatedData<CommentWithMetadata>[];
      pageParams: string | undefined;
    }>(queryKey, (old) => {
      if (!old || !old.pages) {
        return old;
      }

      const filteredPages = old.pages.map((page) => ({
        ...page,
        list: page.list.filter((item) => item.id !== id), // Filter the list for each page
      }));

      const updatedPages = { ...old, pages: filteredPages };

      console.log({ pagesAfter: updatedPages });

      return updatedPages;
    });

    //queryClient.invalidateQueries({ queryKey });
  };

  const handleCreateComment = (comment: CommentWithMetadata | undefined) => {
    queryClient.setQueryData<{
      pages: PaginatedData<CommentWithMetadata>[];
      pageParams: string | undefined;
    }>(queryKey, (old) => {
      if (!comment) {
        return old;
      }

      if (!old) {
        return old;
      }

      const updatedPages = {
        ...old,
        pages: [
          {
            ...old.pages[0], // Adding to the first page
            list: [comment, ...(old.pages[0]?.list ?? [])], // Add comment to the list
          },
          ...old.pages.slice(1), // Preserve the rest of the pages
        ],
      };

      console.log({ pagesAfter: updatedPages });

      return updatedPages;
    });

    //queryClient.invalidateQueries({ queryKey });
  };

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={handleCreateComment}
          />
        }
      />
      <div className="flex flex-col gap-y-2 ml-8">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            buttons={[
              ...(comment.isOwner
                ? [
                    <CommentDeleteButton
                      key="0"
                      id={comment.id}
                      onDeleteComment={handleDeleteComment}
                    />,
                  ]
                : []),
            ]}
          />
        ))}

        {isFetchingNextPage && (
          <>
            <div className="flex gap-x-2">
              <Skeleton className="h-[82px] w-full" />
              <Skeleton className="h-[40px] w-[40px]" />
            </div>
            <div className="flex gap-x-2">
              <Skeleton className="h-[82px] w-full" />
              <Skeleton className="h-[40px] w-[40px]" />
            </div>
          </>
        )}
      </div>

      <div ref={ref}>
        {!hasNextPage && (
          <p className="text-right text-xs italic">No more comments.</p>
        )}
      </div>
    </>
  );
};

export { Comments };

"use client";

import { LucidePencil } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type CommentEditButtonProps = {
  id: string;
};

const CommentEditButton = ({ id }: CommentEditButtonProps) => {
  const pathname = usePathname();

  return (
    <>
      <Button variant="outline" size="icon" asChild>
        <Link prefetch href={`${pathname}?editCommentId=${id}`}>
          <LucidePencil className="h-4 w-4" />
        </Link>
      </Button>
    </>
  );
};

export { CommentEditButton };

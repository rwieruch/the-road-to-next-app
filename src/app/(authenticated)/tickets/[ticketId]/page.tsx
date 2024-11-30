import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { getComment } from "@/features/comment/queries/get-comment";
import { TicketItem } from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { homePath } from "@/paths";

type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
  searchParams: Promise<{
    editCommentId: string | null;
  }>;
};

const TicketPage = async ({ params, searchParams }: TicketPageProps) => {
  const { ticketId } = await params;
  const { editCommentId } = await searchParams;
  const ticket = await getTicket(ticketId);
  const comment = editCommentId ? await getComment(editCommentId) : null;

  console.log({ comment, editCommentId });

  if (!ticket) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath() },
          { title: ticket.title },
        ]}
      />

      <Separator />

      <div className="flex justify-center animate-fade-from-top">
        <TicketItem ticket={ticket} comment={comment} isDetail />
      </div>
    </div>
  );
};

export default TicketPage;

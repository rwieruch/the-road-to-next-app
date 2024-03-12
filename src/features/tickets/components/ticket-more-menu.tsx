'use client';

import { toast } from 'sonner';
import { TrashIcon } from 'lucide-react';
import { Ticket, TicketStatus } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { TICKET_STATUS_LABELS } from '../constants';
import { updateTicketStatus } from '../actions/update-ticket-status';
import { deleteTicket } from '../actions/delete-ticket';

type TicketMoreMenuProps = {
  isTicketOwner: boolean;
  ticket: Ticket;
  trigger: React.ReactElement;
};

const TicketMoreMenu = ({
  isTicketOwner,
  ticket,
  trigger,
}: TicketMoreMenuProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: (
      <DropdownMenuItem>
        <TrashIcon className="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    ),
  });

  const handleUpdateTicketStatus = async (value: string) => {
    const promise = updateTicketStatus(
      ticket.id,
      value as TicketStatus
    );

    toast.promise(promise, {
      loading: 'Updating status...',
    });

    const result = await promise;

    if (result.status === 'ERROR') {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
  };

  const ticketStatusRadioGroupItems = (
    <DropdownMenuRadioGroup
      value={ticket.status}
      onValueChange={handleUpdateTicketStatus}
    >
      {(Object.keys(TICKET_STATUS_LABELS) as Array<TicketStatus>).map(
        (key) => (
          <DropdownMenuRadioItem key={key} value={key}>
            {TICKET_STATUS_LABELS[key]}
          </DropdownMenuRadioItem>
        )
      )}
    </DropdownMenuRadioGroup>
  );

  return (
    <>
      {deleteDialog}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="right">
          {isTicketOwner && deleteButton}
          {isTicketOwner && <DropdownMenuSeparator />}
          {isTicketOwner && ticketStatusRadioGroupItems}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { TicketMoreMenu };
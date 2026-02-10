"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { deleteInvitationLink } from "@/src/actions/delete-invitation-link-action";

export default function DeleteInvitationLinkButton({ invitationId, projectId, isAccepted }: { invitationId: string, projectId: string, isAccepted: boolean }) {

    const handleDeleteInvitationLink = async () => {
        await deleteInvitationLink(invitationId, projectId);
    };

    return (
        <Button type="button" variant={"ghost"} className="w-full text-left" disabled={isAccepted} onClick={handleDeleteInvitationLink}>Supprimer l'invitation</Button>
    )
}
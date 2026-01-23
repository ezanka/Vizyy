"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { deleteInvitation } from "@/src/actions/delete-invitation-action";

export default function DeleteInvitationButton({ invitationId, projectId, isAccepted }: { invitationId: string, projectId: string, isAccepted: boolean }) {

    const handleDeleteInvitation = async () => {
        await deleteInvitation(invitationId, projectId);
    };

    return (
        <Button type="button" variant={"ghost"} className="w-full text-left" disabled={isAccepted} onClick={handleDeleteInvitation}>Supprimer l'invitation</Button>
    )
}
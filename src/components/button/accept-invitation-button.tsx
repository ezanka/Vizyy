"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { acceptInvitation } from "@/src/actions/accept-invitation-actions";
import { redirect } from "next/navigation";

export default function AcceptInvitationButton({ invitationId, projectId }: { invitationId: string, projectId: string }) {

    const handleAcceptInvitation = async () => {
        const result = await acceptInvitation(invitationId, projectId);

        if (result.success) {
            redirect(`/project/${projectId}/dashboard`);
        }
    };

    return (
        <Button type="button" onClick={handleAcceptInvitation}>Accepter l'invitation</Button>
    )
}
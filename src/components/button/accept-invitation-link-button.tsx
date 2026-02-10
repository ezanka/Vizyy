"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";
import { acceptInvitationLink } from "@/src/actions/accept-invitation-link-actions";

export default function AcceptInvitationLinkButton({ invitationId, projectId }: { invitationId: string, projectId: string }) {

    const handleAcceptInvitationLink = async () => {
        const result = await acceptInvitationLink(invitationId, projectId);

        if (result.success) {
            redirect(`/project/${projectId}/dashboard`);
        }
    };

    return (
        <Button type="button" onClick={handleAcceptInvitationLink}>Accepter l'invitation</Button>
    )
}
"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { acceptInvitationLink } from "@/src/actions/accept-invitation-link-actions";
import { useRouter } from "next/navigation";

export default function AcceptInvitationLinkButton({ invitationId, projectId }: { invitationId: string, projectId: string }) {
    const router = useRouter();

    const handleAcceptInvitationLink = async () => {
        const result = await acceptInvitationLink(invitationId, projectId);

        if (result.success) {
            router.push(`/project/${projectId}/dashboard`);
        }
    };

    return (
        <Button type="button" onClick={handleAcceptInvitationLink}>Accepter l'invitation</Button>
    )
}
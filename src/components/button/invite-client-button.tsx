"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { inviteClient } from "@/src/actions/invite-client-actions";

export default function InviteClientButton({ email, projectId, canClose }: { email: string, projectId: string, canClose: () => void }) {

    const handleInviteClient = async () => {
        const success = await inviteClient(email, projectId);
        
        if (success.success) {
            canClose();
        }
    };

    return (
        <Button type="button" onClick={handleInviteClient}>Inviter le client</Button>
    )
}
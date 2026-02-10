"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { inviteMaker } from "@/src/actions/invite-maker-actions";

export default function InviteMakerButton({ email, projectId, canClose }: { email: string, projectId: string, canClose: () => void }) {

    const handleInviteMaker = async () => {
        const success = await inviteMaker(email, projectId);
        
        if (success.success) {
            canClose();
        }
    };

    return (
        <Button type="button" onClick={handleInviteMaker}>Inviter le créateur</Button>
    )
}
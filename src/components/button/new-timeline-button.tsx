"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { createTimeline } from "@/src/actions/new-timeline-actions";

export default function NewTimelineButton({ projectId, name, startDate, endDate, updateId, onSuccess }: { projectId: string, name: string, startDate: Date, endDate: Date, updateId: string, onSuccess: () => void }) {

    const handleInviteClient = async () => {
        const success = await createTimeline(projectId, name, startDate, endDate, updateId);
        
        if (success.success) {
            onSuccess();
        }
    }; 

    return (
        <Button disabled={!name || !startDate || !endDate} onClick={handleInviteClient}>Créer</Button>
    )
}
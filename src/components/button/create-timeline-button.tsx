"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { createTimeline } from "@/src/actions/create-timeline-actions";

export default function CreateTimelineButton({ projectId, name, startDate, endDate, updateId, assignedTo, onSuccess }: { projectId: string, name: string, startDate: Date, endDate: Date, updateId: string, assignedTo?: string, onSuccess: () => void }) {

    const handleInviteClient = async () => {
        const success = await createTimeline(projectId, name, startDate, endDate, updateId, assignedTo);
        
        if (success.success) {
            onSuccess();
        }
    }; 

    return (
        <Button disabled={!name || !startDate || !endDate} onClick={handleInviteClient}>Créer</Button>
    )
}
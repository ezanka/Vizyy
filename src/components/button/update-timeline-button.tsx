"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { updateTimeline } from "@/src/actions/update-timeline-actions";

export default function UpdateTimelineButton({ projectId, name, startDate, endDate, updateId, timelineId, onSuccess }: { projectId: string, name: string, startDate: Date, endDate: Date, updateId: string, timelineId: string, onSuccess: () => void }) {

    const handleUpateTimeline = async () => {
        const success = await updateTimeline(projectId, name, startDate, endDate, timelineId, updateId);
        
        if (success.success) {
            onSuccess();
        }
    }

    return (
        <Button disabled={!name || !startDate || !endDate} className="flex-1" onClick={handleUpateTimeline}>Sauvegarder les modifications</Button>
    )
}
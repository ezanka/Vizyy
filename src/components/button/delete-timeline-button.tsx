"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { Trash } from "lucide-react";
import { deleteTimeline } from "@/src/actions/delete-timeline-actions";

export default function DeleteTimelineButton({ projectId, timelineId, onSuccess }: { projectId: string, timelineId: string, onSuccess: () => void }) {

    const handleDeleteTimeline = async () => {
        const success = await deleteTimeline(projectId, timelineId);
        
        if (success) {
            onSuccess();
        }
    }

    return (
        <Button className="aspect-square" onClick={handleDeleteTimeline}><Trash /></Button>
    )
}
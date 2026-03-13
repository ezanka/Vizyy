"use client";

import { createFeedback } from "@/src/actions/create-feedback-action";
import { Button } from "@/src/components/ui/shadcn/button";
import { toast } from "sonner";

export default function CreateFeedbackButton({ projectId, feedback, updateId, onSend }: { projectId: string, feedback: string, updateId: string | undefined, onSend: () => void }) {

    const handleCreateFeedback = async () => {
        if (!feedback || !updateId) {
            toast.error("Le feedback est obligatoire.");
            return;
        }

        const success = await createFeedback(projectId, feedback, updateId);

        if (success) {
            onSend();
        }
    }

    return (
        <>
            <Button disabled={!updateId || !feedback} type="button" onClick={handleCreateFeedback}>Envoyer</Button>
        </>
    )
}
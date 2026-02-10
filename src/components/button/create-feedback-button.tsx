"use client";

import { createFeedback } from "@/src/actions/create-feedback-action";
import { Button } from "@/src/components/ui/shadcn/button";

export default function CreateFeedbackButton({ projectId, feedback, updateId, onSend }: { projectId: string, feedback: string, updateId: string | undefined, onSend: () => void }) {

    const handleCreateFeedback = async () => {
        if (!feedback || !updateId) {
            alert("Le feedback est obligatoire.");
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
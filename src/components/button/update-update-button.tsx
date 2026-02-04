"use client";

import { updateUpdate } from "@/src/actions/update-update-action";
import { Button } from "@/src/components/ui/shadcn/button";
import type { UpdateStatus, UpdateType } from "@/src/generated/prisma/enums";
import { redirect } from "next/navigation";

export default function UpdateUpdateButton({ projectId, updateId, title, content, type, statut, needvalidation, previewLink, timeSpent, progress }: { projectId: string, updateId: string, title: string, content: string, type: UpdateType, statut: UpdateStatus, needvalidation: boolean, previewLink: string, timeSpent?: number, progress: number }) {

    const handleUpdateUpdate = () => {
        if (!title || !content) {
            alert("Le titre et le contenu sont obligatoires.");
            return;
        }

        updateUpdate(projectId, updateId, title, content, type, statut, needvalidation, previewLink, progress, timeSpent);
        redirect(`/project/${projectId}/updates/${updateId}`);
    }

    return (
        <>
            <Button type="button" onClick={handleUpdateUpdate}>Mettre à jour l'update</Button>
        </>
    )
}
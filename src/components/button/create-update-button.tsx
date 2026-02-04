"use client";

import { createUpdate } from "@/src/actions/create-update-action";
import { Button } from "@/src/components/ui/shadcn/button";
import type { UpdateStatus, UpdateType } from "@/src/generated/prisma/enums";
import { redirect } from "next/navigation";

export default function CreateUpdateButton({ projectId, title, content, type, statut, needvalidation, previewLink, timeSpent, progress }: { projectId: string, title: string, content: string, type: UpdateType, statut: UpdateStatus, needvalidation: boolean, previewLink: string, timeSpent?: number, progress: number }) {

    const handleCreateUpdate = () => {
        if (!title || !content) {
            alert("Le titre et le contenu sont obligatoires.");
            return;
        }

        createUpdate(projectId, title, content, type, statut, needvalidation, previewLink, progress, timeSpent);
        redirect(`/project/${projectId}/updates`);
    }

    return (
        <>
            <Button type="button" onClick={handleCreateUpdate}>Créer l'update</Button>
        </>
    )
}
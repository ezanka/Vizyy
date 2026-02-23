"use client";

import { createUpdate } from "@/src/actions/create-update-action";
import { Button } from "@/src/components/ui/shadcn/button";
import type { UpdateStatus, UpdateType } from "@/src/generated/prisma/enums";
import { redirect } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";

export default function CreateUpdateButton({ projectId, title, content, type, statut, needvalidation, previewLink, timeSpent, progress }: { projectId: string, title: string, content: string, type: UpdateType, statut: UpdateStatus, needvalidation: boolean, previewLink: string, timeSpent?: number, progress: number }) {

    const [isLoading, setIsLoading] = React.useState(false);

    const handleCreateUpdate = () => {
        setIsLoading(true);
        if (!title || !content) {
            alert("Le titre et le contenu sont obligatoires.");
            setIsLoading(false);
            return;
        }

        const result = createUpdate(projectId, title, content, type, statut, needvalidation, previewLink, progress, timeSpent);

        if (!result) {
            alert("Une erreur est survenue lors de la création de l'update");
            setIsLoading(false);
            return;
        }
        
        redirect(`/project/${projectId}/updates`);
    }

    return (
        <>
            <Button disabled={!title || !content || isLoading} type="button" onClick={handleCreateUpdate}>{isLoading ? <><Spinner /> Création en cours</> : "Créer l'update"}</Button>
        </>
    )
}
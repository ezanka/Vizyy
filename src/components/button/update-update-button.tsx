"use client";

import { updateUpdate } from "@/src/actions/update-update-action";
import { Button } from "@/src/components/ui/shadcn/button";
import type { UpdateStatus, UpdateType } from "@/src/generated/prisma/enums";
import { redirect } from "next/navigation";
import React from "react";
import { Spinner } from "../ui/shadcn/spinner";

export default function UpdateUpdateButton({ projectId, updateId, title, content, type, statut, needvalidation, previewLink, timeSpent, progress }: { projectId: string, updateId: string, title: string, content: string, type: UpdateType, statut: UpdateStatus, needvalidation: boolean, previewLink: string, timeSpent?: number, progress: number }) {

    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpdateUpdate = () => {
        setIsLoading(true);
        if (!title || !content) {
            alert("Le titre et le contenu sont obligatoires.");
            setIsLoading(false);
            return;
        }

        const result = updateUpdate(projectId, updateId, title, content, type, statut, needvalidation, previewLink, progress, timeSpent);
        if (!result) {
            alert("Une erreur est survenue lors de la mise à jour de l'update");
            setIsLoading(false);
            return;
        }
        redirect(`/project/${projectId}/updates/${updateId}`);
    }

    return (
        <>
            <Button disabled={!title || !content || isLoading} type="button" onClick={handleUpdateUpdate}>{isLoading ? <><Spinner /> Mise à jour en cours</> : "Mettre à jour l'update"}</Button>
        </>
    )
}
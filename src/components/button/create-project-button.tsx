"use client";

import { createProject } from "@/src/actions/new-project-actions";
import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";
import React from "react";
import { Spinner } from "../ui/shadcn/spinner";

export default function CreateFeedbackButton({ projectName, selectedLogo, deadline, progress }: { projectName: string, selectedLogo: string, deadline: Date | undefined, progress: number }) {

    const [isLoading, setIsLoading] = React.useState(false);

    async function handleCreateProject() {
        setIsLoading(true);
        const result = createProject(projectName, selectedLogo, deadline, progress);
        
        if(!result) {
            alert("Une erreur est survenue lors de la création du projet");
            setIsLoading(false);
            return;
        }

        const data = await result;

        redirect(`/project/${data.project?.id}/dashboard`);
    }

    return (
        <>
            <Button disabled={!projectName || !selectedLogo || isLoading} type="button" onClick={handleCreateProject}>{isLoading ? <><Spinner /> Création en cours</> : "Créer le projet"}</Button>
        </>
    )
}
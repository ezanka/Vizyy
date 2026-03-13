"use client";

import { createProject } from "@/src/actions/new-project-actions";
import { Button } from "@/src/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import React from "react";
import { Spinner } from "../ui/shadcn/spinner";
import { toast } from "sonner";

export default function CreateFeedbackButton({ projectName, selectedLogo, deadline, progress }: { projectName: string, selectedLogo: string, deadline: Date | undefined, progress: number }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    async function handleCreateProject() {
        setIsLoading(true);
        const result = await createProject(projectName, selectedLogo, deadline, progress);

        if (!result) {
            toast.error("Une erreur est survenue lors de la création du projet");
            setIsLoading(false);
            return;
        }

        const data = await result;

        router.push(`/project/${data.project?.id}/dashboard`);
    }

    return (
        <>
            <Button disabled={!projectName || !selectedLogo || isLoading} type="button" onClick={handleCreateProject}>{isLoading ? <><Spinner /> Création en cours</> : "Créer le projet"}</Button>
        </>
    )
}
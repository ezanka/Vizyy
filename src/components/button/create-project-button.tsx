"use client";

import { createProject } from "@/src/actions/new-project-actions";
import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";

export default function CreateFeedbackButton({ projectName, selectedLogo, deadline, progress }: { projectName: string, selectedLogo: string, deadline: Date | undefined, progress: number }) {

    async function handleCreateProject() {
        const result = createProject(projectName, selectedLogo, deadline, progress);
        const data = await result;

        redirect(`/project/${data.project?.id}/dashboard`);
    }

    return (
        <>
            <Button disabled={!projectName || !selectedLogo} type="button" onClick={handleCreateProject}>Créer le projet</Button>
        </>
    )
}
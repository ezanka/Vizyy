"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { deleteUpdate } from "@/src/actions/delete-update-actions";
import { Trash } from "lucide-react";

export default function DeleteUpdateButton({ projectId, updateId, authorized }: { projectId: string, updateId: string, authorized: boolean }) {

    const [isLoading, setIsLoading] = React.useState(false);

    const handleDeleteUpdate = () => {
        setIsLoading(true);

        const result = deleteUpdate(projectId, updateId);

        if (!result) {
            alert("Une erreur est survenue lors de la suppression de l'update");
            setIsLoading(false);
            return;
        }

        redirect(`/project/${projectId}/updates`);
    }

    return (
        <>
            <Button disabled={!authorized || isLoading} type="button" variant={"destructive"} onClick={handleDeleteUpdate}>{isLoading ? <Spinner /> : <Trash className="w-4 h-4" />}</Button>
        </>
    )
}
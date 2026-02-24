"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { deleteTest } from "@/src/actions/delete-test-actions";
import { Trash } from "lucide-react";

export default function DeleteTestButton({ projectId, authorized, test }: { projectId: string, authorized: boolean, test: { id: string } }) {

    const [isLoading, setIsLoading] = React.useState(false);

    const handleDeleteTest = () => {
        setIsLoading(true);
        if (!authorized) {
            alert("Vous n'êtes pas autorisé à supprimer un test");
            setIsLoading(false);
            return;
        }

        const result = deleteTest(projectId, test.id);

        if (!result) {
            alert("Une erreur est survenue lors de la suppression du test");
            setIsLoading(false);
            return;
        }

        redirect(`/project/${projectId}/test`);
    }

    return (
        <>
            <Button disabled={!authorized || isLoading} type="button" onClick={handleDeleteTest}>{isLoading ? <Spinner /> : <Trash className="w-4 h-4" />}</Button>
        </>
    )
}
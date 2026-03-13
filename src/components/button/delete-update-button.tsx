"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { deleteUpdate } from "@/src/actions/delete-update-actions";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export default function DeleteUpdateButton({ projectId, updateId, authorized }: { projectId: string, updateId: string, authorized: boolean }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const handleDeleteUpdate = () => {
        setIsLoading(true);

        const result = deleteUpdate(projectId, updateId);

        if (!result) {
            toast.error("Une erreur est survenue lors de la suppression de l'update");
            setIsLoading(false);
            return;
        }

        router.push(`/project/${projectId}/updates`);
    }

    return (
        <>
            <Button disabled={!authorized || isLoading} type="button" variant={"destructive"} onClick={handleDeleteUpdate}>{isLoading ? <Spinner /> : <Trash className="w-4 h-4" />}</Button>
        </>
    )
}
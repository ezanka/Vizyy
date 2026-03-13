"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { deleteTodo } from "@/src/actions/delete-todo-actions";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export default function DeleteTodoButton({ projectId, todoId, authorized }: { projectId: string, todoId: string, authorized: boolean }) {

    const [isLoading, setIsLoading] = React.useState(false);

    const handleDeleteTodo = async () => {
        setIsLoading(true);
        if (!authorized) {
            toast.error("Vous n'êtes pas autorisé à supprimer un todo");
            setIsLoading(false);
            return;
        }

        const result = deleteTodo(projectId, todoId);

        if (!result) {
            toast.error("Une erreur est survenue lors de la suppression du todo");
            setIsLoading(false);
            return;
        }

        redirect(`/project/${projectId}/todos`);
    }

    return (
        <>
            <Button disabled={!authorized || isLoading} type="button" variant={"destructive"} onClick={handleDeleteTodo}>{isLoading ? <><Spinner /> Suppression en cours</> : <><Trash /> Supprimer la todo</>}</Button>
        </>
    )
}
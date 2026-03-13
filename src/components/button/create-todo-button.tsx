"use client";

import { Update, User } from "@/src/generated/prisma/client";
import { Button } from "@/src/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { TodoType, TodoStatus, TodoPriority } from "@/src/generated/prisma/enums"
import { createTodo } from "@/src/actions/create-todo-actions";
import { toast } from "sonner";

export default function CreateTodoButton({ projectId, title, description, type, status, priority, assignedTo, update, authorized }: { projectId: string, title: string, description: string, type: TodoType, status: TodoStatus, priority: TodoPriority, assignedTo?: User, update?: Update, authorized: boolean }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const handleCreateTodo = async () => {
        setIsLoading(true);
        if (!authorized) {
            toast.error("Vous n'êtes pas autorisé à créer un todo");
            setIsLoading(false);
            return;
        }

        if (!title) {
            toast.error("Vous devez avoir un titre pour créer un todo");
            setIsLoading(false);
            return;
        }

        if (!description) {
            toast.error("Vous devez avoir une description pour créer un todo");
            setIsLoading(false);
            return;
        }

        const result = createTodo(projectId, title, description, type, status, priority, assignedTo, update);

        if (!result) {
            toast.error("Une erreur est survenue lors de la création du todo");
            setIsLoading(false);
            return;
        }

        router.push(`/project/${projectId}/todos`);
    }

    return (
        <>
            <Button disabled={!title || !description || !authorized || isLoading} type="button" onClick={handleCreateTodo}>{isLoading ? <><Spinner /> Création en cours</> : "Créer la todo"}</Button>
        </>
    )
}
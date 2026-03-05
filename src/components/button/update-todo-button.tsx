"use client";

import { Task, Update, User } from "@/src/generated/prisma/client";
import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { TodoType, TodoStatus, TodoPriority } from "@/src/generated/prisma/enums"
import { updateTodo } from "@/src/actions/update-todo-actions";

export default function UpdateTodoButton({ projectId, todoId, title, description, type, status, priority, assignedTo, update, tasks, authorized }: { projectId: string, todoId: string, title: string, description: string, type: TodoType, status: TodoStatus, priority: TodoPriority, assignedTo?: User, update?: Update, tasks: Task[], authorized: boolean }) {

    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpdateTodo = async () => {
        setIsLoading(true);
        if (!authorized) {
            alert("Vous n'êtes pas autorisé à mettre à jour un todo");
            setIsLoading(false);
            return;
        }

        if (!title) {
            alert("Vous devez avoir un titre pour mettre à jour un todo");
            setIsLoading(false);
            return;
        }

        if (!description) {
            alert("Vous devez avoir une description pour mettre à jour un todo");
            setIsLoading(false);
            return;
        }

        const result = updateTodo(projectId, todoId, title, description, type, status, priority, assignedTo, update, tasks);

        if (!result) {
            alert("Une erreur est survenue lors de la mise à jour du todo");
            setIsLoading(false);
            return;
        }

        redirect(`/project/${projectId}/todos`);
    }

    return (
        <>
            <Button disabled={!title || !description || !authorized || isLoading} type="button" onClick={handleUpdateTodo}>{isLoading ? <><Spinner /> Mise à jour en cours</> : "Mettre à jour la todo"}</Button>
        </>
    )
}
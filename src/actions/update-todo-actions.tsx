"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import type { TodoStatus, TodoType, TodoPriority } from "@/src/generated/prisma/enums";
import { Task, Update, User } from "../generated/prisma/client";

export async function updateTodo(
    projectId: string,
    todoId: string,
    title: string,
    description: string,
    type: TodoType,
    status: TodoStatus,
    priority: TodoPriority,
    assignedTo?: User,
    update?: Update,
    tasks?: Task[]
) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour modifier une todo" };
    }

    await prisma.todo.update({
        where: { id: todoId },
        data: {
            title,
            description,
            type,
            priority,
            status,
            assigneeId: assignedTo?.id ?? null,
            updateId: update?.id ?? null,
            updatedAt: new Date()
        },
    });

    if (tasks !== undefined) {
        const existingTasks = await prisma.task.findMany({ where: { todoId } });
        const existingIds = existingTasks.map(t => t.id);
        const newIds = tasks.map(t => t.id);

        const toDelete = existingIds.filter(id => !newIds.includes(id));
        const toCreate = tasks.filter(t => !existingIds.includes(t.id));

        if (toDelete.length > 0) {
            await prisma.task.deleteMany({ where: { id: { in: toDelete } } });
        }

        if (toCreate.length > 0) {
            await prisma.task.createMany({
                data: toCreate.map(t => ({
                    id: t.id,
                    content: t.content,
                    todoId,
                    authorId: user.id,
                })),
            });
        }
    }

    revalidatePath(`/project/${projectId}/todos`);

    return { success: true };
}

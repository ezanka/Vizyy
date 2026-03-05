"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import type { TodoStatus, TodoType, TodoPriority } from "@/src/generated/prisma/enums";
import { Update, User } from "../generated/prisma/client";
import { randomUUID } from "crypto";

export async function createTodo(projectId: string, title: string, description: string, type: TodoType, status: TodoStatus, priority: TodoPriority, assignedTo?: User, update?: Update) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour modifier un update" };
    }

    await prisma.todo.create({
        data: {
            id: randomUUID(),
            title,
            description,
            type,
            priority,
            assigneeId: assignedTo?.id,
            updateId: update?.id,
            projectId,
            status,
            createdById: user.id,
        },
    });

    revalidatePath(`/project/${projectId}/todos`);

    return { success: true };
}

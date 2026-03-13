"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { TodoStatus, TodoType, TodoPriority } from "@/src/generated/prisma/enums";
import { Update, User } from "../generated/prisma/client";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function createTodo(projectId: string, title: string, description: string, type: TodoType, status: TodoStatus, priority: TodoPriority, assignedTo?: User, update?: Update) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour modifier un update" };
    }

    const schema = z.object({
        title: z.string().min(1).max(150),
        description: z.string().max(1000),
        type: z.enum(TodoType),
        status: z.enum(TodoStatus),
        priority: z.enum(TodoPriority),
    });
    const parsed = schema.safeParse({ title, description, type, status, priority });
    if (!parsed.success) return { error: "Données invalides" };

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
            updatedAt: null
        },
    });

    revalidatePath(`/project/${projectId}/todos`);

    return { success: true };
}

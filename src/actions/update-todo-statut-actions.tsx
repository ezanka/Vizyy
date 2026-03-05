"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import type { TodoStatus } from "@/src/generated/prisma/enums";

export async function updateTodoStatus(projectId: string, todoId: string, status: TodoStatus) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour modifier un update" };
    }

    await prisma.todo.update({
        where: { id: todoId },
        data: {
            status,
        },
    });

    revalidatePath(`/project/${projectId}/todos`);

    return { success: true };
}

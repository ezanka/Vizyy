"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { isMaker } from "./is-maker-actions";

export async function deleteTodo(
    projectId: string,
    todoId: string,
) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour supprimer une todo" };
    }

    const imMaker = (await isMaker(projectId)).isMaker;

    if (!imMaker) {
        return { error: "Vous n'avez pas les permissions pour supprimer ce todo" };
    }

    await prisma.todo.delete({
        where: { id: todoId },
    });

    revalidatePath(`/project/${projectId}/todos`);

    return { success: true };
}

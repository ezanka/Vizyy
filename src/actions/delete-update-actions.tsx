"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { isMaker } from "./is-maker-actions";

export async function deleteUpdate(projectId: string, updateId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour supprimer un update" };
    }

    const imMaker = (await isMaker(projectId)).isMaker;

    if (!imMaker) {
        return { error: "Vous n'avez pas les permissions pour supprimer cet update" };
    }

    await prisma.update.delete({
        where: {
            id: updateId,
            organizationId: projectId,
        },
    });

    revalidatePath(`/project/${projectId}/updates`);

    return { success: true };
}

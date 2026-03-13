"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { isMaker } from "./is-maker-actions";

export async function deleteTest(projectId: string, testId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un test" };
    }

    const imMaker = (await isMaker(projectId)).isMaker;

    if (!imMaker) {
        return { error: "Vous n'avez pas les permissions pour supprimer ce test" };
    }

    await prisma.test.delete({
        where: {
            id: testId,
        },
    });

    revalidatePath(`/project/${projectId}/test`);

    return { success: true };
}

"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function deleteUpdate(projectId: string, updateId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour supprimer un update" };
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

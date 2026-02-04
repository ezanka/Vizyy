"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function UpdateValidUpdate(updateId: string, projectId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }

    await prisma.update.update({
        where: { id: updateId },
        data: {
            valid: true,
            validatedAt: new Date(),
            validatedById: user.id,
        },
    });

    revalidatePath(`/project/${projectId}/updates`);

    return { success: true };
}

"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import type { UpdateType, UpdateStatus } from "@/src/generated/prisma/enums";

export async function updateUpdate(projectId: string, updateId: string, title: string, content: string, type: UpdateType, statut: UpdateStatus, needvalidation: boolean, previewLink: string, progress: number, timeSpent?: number) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour modifier un update" };
    }

    await prisma.update.update({
        where: { id: updateId },
        data: {
            organizationId: projectId,
            title,
            content,
            type,
            status: statut,
            needsValidation: needvalidation,
            previewLink,
            timeSpent,
            updatedAt: new Date(),
            updaterId: user.id,
        },
    });

    await prisma.organization.update({
        where: { id: projectId },
        data: { progress },
    });

    revalidatePath(`/project/${projectId}/updates`);

    return { success: true };
}

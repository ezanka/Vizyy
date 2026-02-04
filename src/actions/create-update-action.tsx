"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import type { UpdateType, UpdateStatus } from "@/src/generated/prisma/enums";

export async function createUpdate(projectId: string, title: string, content: string, type: UpdateType, statut: UpdateStatus, needvalidation: boolean, previewLink: string, progress: number, timeSpent?: number) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }

    await prisma.update.create({
        data: {
            id: randomUUID(),
            organizationId: projectId,
            title,
            content,
            type,
            status: statut,
            needsValidation: needvalidation,
            previewLink,
            timeSpent,
            authorId: user.id,
            createdAt: new Date(),
        },
    });

    await prisma.organization.update({
        where: { id: projectId },
        data: { progress },
    });

    revalidatePath(`/project/${projectId}/updates`);

    return { success: true };
}

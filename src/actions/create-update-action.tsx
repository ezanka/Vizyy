"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { UpdateType, UpdateStatus } from "@/src/generated/prisma/enums";
import { z } from "zod";

export async function createUpdate(projectId: string, title: string, content: string, type: UpdateType, statut: UpdateStatus, needvalidation: boolean, previewLink: string, progress: number, timeSpent?: number) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }

    const schema = z.object({
        title: z.string().min(1).max(100),
        content: z.string().min(1).max(5555),
        type: z.enum(UpdateType),
        statut: z.enum(UpdateStatus),
        previewLink: z.string().max(500).optional().or(z.literal("")),
        progress: z.number().int().min(0).max(100),
        timeSpent: z.number().int().min(0).optional(),
    });
    const parsed = schema.safeParse({ title, content, type, statut, previewLink, progress, timeSpent });
    if (!parsed.success) return { error: "Données invalides" };

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

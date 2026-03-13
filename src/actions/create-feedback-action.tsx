"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function createFeedback(projectId: string, feedback: string, updateId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un feedback" };
    }

    const isMember = await prisma.member.findUnique({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId: projectId,
            },
        },
    });

    if (!isMember) {
        return { error: "Vous n'avez pas les permissions pour créer un feedback" };
    }

    const schema = z.object({
        feedback: z.string().min(1).max(2000),
    });
    const parsed = schema.safeParse({ feedback });
    if (!parsed.success) return { error: "Données invalides" };

    await prisma.feedback.create({
        data: {
            id: randomUUID(),
            updateId: updateId,
            content: feedback,
            userId: user.id,
            createdAt: new Date(),
        },
    });

    revalidatePath(`/project/${projectId}/feedback`);

    return { success: true };
}

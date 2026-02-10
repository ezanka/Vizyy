"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function createFeedback(projectId: string, feedback: string, updateId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un feedback" };
    }

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

"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function createTimeline(projectId: string, name: string, startDate: Date, endDate: Date, updateId?: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }

    await prisma.timeline.create({
        data: {
            id: randomUUID(),
            organizationId: projectId,
            name: name,
            startDate: startDate,
            endDate: endDate,
            ...(updateId && { updateId: updateId }),
            createdAt: new Date(),
        },
    });

    revalidatePath(`/project/${projectId}/timeline`);

    return { success: true };
}

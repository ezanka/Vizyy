"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function createTimeline(projectId: string, name: string, startDate: Date, endDate: Date, updateId?: string, assignedTo?: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }

    const schema = z.object({
        name: z.string().min(1).max(100),
        startDate: z.date(),
        endDate: z.date(),
    }).refine(d => d.endDate >= d.startDate, { message: "La date de fin doit être après la date de début" });
    const parsed = schema.safeParse({ name, startDate, endDate });
    if (!parsed.success) return { error: "Données invalides" };

    await prisma.timeline.create({
        data: {
            id: randomUUID(),
            organizationId: projectId,
            name: name,
            startDate: startDate,
            endDate: endDate,
            ...(updateId && { updateId: updateId }),
            ...(assignedTo && { assigneeId: assignedTo }),
            createdAt: new Date(),
        },
    });

    revalidatePath(`/project/${projectId}/timeline`);

    return { success: true };
}

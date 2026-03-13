"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { MemberRole } from "../generated/prisma/enums";
import { z } from "zod";

export async function updateTimeline(projectId: string, name: string, startDate: Date, endDate: Date, timelineId: string, updateId?: string, assignedTo?: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }

    if(!timelineId) {
        return { error: "ID de timeline manquant" };
    }

    const isMaker = await prisma.member.findUnique({
        where: {
            userId_organizationId: {
                organizationId: projectId,
                userId: user.id,
            },
            role: MemberRole.MAKER,
        },
    });

    if (!isMaker) {
        return { error: "Vous n'êtes pas autorisé à modifier cette timeline" };
    }

    const schema = z.object({
        name: z.string().min(1).max(100),
        startDate: z.date(),
        endDate: z.date(),
    }).refine(d => d.endDate >= d.startDate, { message: "La date de fin doit être après la date de début" });
    const parsed = schema.safeParse({ name, startDate, endDate });
    if (!parsed.success) return { error: "Données invalides" };

    await prisma.timeline.update({
        where: {
            id: timelineId
        },
        data: {
            name: name,
            startDate: startDate,
            endDate: endDate,
            ...(updateId && { updateId: updateId }),
            assigneeId: assignedTo || null,
            updatedAt: new Date(),
        },
    });

    revalidatePath(`/project/${projectId}/timeline`);

    return { success: true };
}

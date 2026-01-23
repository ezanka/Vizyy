"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { MemberRole } from "../generated/prisma/enums";

export async function updateTimeline(projectId: string, name: string, startDate: Date, endDate: Date, timelineId: string, updateId?: string) {
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

    await prisma.timeline.update({
        where: {
            id: timelineId
        },
        data: {
            name: name,
            startDate: startDate,
            endDate: endDate,
            ...(updateId && { updateId: updateId }),
            updatedAt: new Date(),
        },
    });

    revalidatePath(`/project/${projectId}/timeline`);

    return { success: true };
}

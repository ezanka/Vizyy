"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { MemberRole } from "../generated/prisma/enums";
import { z } from "zod";

export async function updateProject(
    projectId: string,
    name: string,
    logo: string,
    deadline: Date | null,
    progress: number
) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour modifier un projet" };
    }

    const member = await prisma.member.findFirst({
        where: {
            userId: user.id,
            organizationId: projectId,
            role: MemberRole.MAKER,
        },
    });

    if (!member) {
        return { error: "Vous n'avez pas les droits pour modifier ce projet" };
    }

    const schema = z.object({
        name: z.string().min(1).max(100),
        logo: z.string().max(500).optional().or(z.literal("")),
        progress: z.number().int().min(0).max(100),
    });
    const parsed = schema.safeParse({ name, logo, progress });
    if (!parsed.success) return { error: "Données invalides" };

    await prisma.organization.update({
        where: { id: projectId },
        data: {
            name,
            logo: logo || null,
            deadline,
            progress,
        },
    });

    revalidatePath(`/project/${projectId}/settings`);
    revalidatePath(`/project/${projectId}/dashboard`);

    return { success: true };
}

"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { MemberRole } from "../generated/prisma/enums";

export async function isMaker(projectId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour vérifier votre rôle" };
    }

    const member = await prisma.member.findFirst({
        where: {
            userId: user.id,
            organizationId: projectId,
            role: MemberRole.MAKER,
        },
    });

    return { isMaker: !!member };
}
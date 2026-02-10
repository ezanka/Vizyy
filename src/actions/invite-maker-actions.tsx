"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { MemberRole } from "../generated/prisma/enums";

export async function inviteMaker(email: string, projectId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }

    const authorized = await prisma.member.findFirst({
        where: {
            organizationId: projectId,
            userId: user.id,
            role: MemberRole.MAKER,
        },
    });

    if (!authorized) {
        return { error: "Vous n'êtes pas autorisé à ajouter des créateurs à ce projet" };
    }

    const userToAdd = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (!userToAdd) {
        return { error: "Aucun utilisateur trouvé avec cet email" };
    }

    const existingMember = await prisma.member.findFirst({
        where: {
            organizationId: projectId,
            userId: userToAdd.id,
        }
    });

    if (existingMember) {
        return { error: "Cet utilisateur est déjà membre de ce projet" };
    }

    const existingInvitation = await prisma.invitation.findFirst({
        where: {
            organizationId: projectId,
            email: email,
        }
    });

    if (existingInvitation) {
        return { error: "Une invitation a déjà été envoyée à cet email pour ce projet" };
    }

    await prisma.invitation.create({
        data: {
            id: crypto.randomUUID(),
            email: email,
            role: MemberRole.MAKER,
            organizationId: projectId,
            inviterId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    });

    revalidatePath(`/project/${projectId}/team`);

    return { success: true };
}

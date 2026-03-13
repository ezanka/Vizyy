"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { InvitationStatus } from "../generated/prisma/enums";

export async function acceptInvitation(invitationId: string, projectId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }
    const invitation = await prisma.invitation.findUnique({
        where: {
            id: invitationId,
        }
    });

    if (!invitation) {
        return { error: "Invitation non trouvée" };
    }

    if (!invitation || invitation.status !== InvitationStatus.PENDING || invitation.expiresAt < new Date()) {
        return { error: "Invitation invalide ou expirée" };
    }

    const joinerEmail = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            email: true,
        }
    });

    if (!joinerEmail) {
        return { error: "Utilisateur non trouvé" };
    }

    const existingMember = await prisma.member.findFirst({
        where: {
            organizationId: projectId,
            userId: user.id,
        }
    });

    if (existingMember) {
        return { error: "Cet utilisateur est déjà membre de ce projet" };
    }

    await prisma.invitation.update({
        where: {
            id: invitationId,
        },
        data: {
            status: InvitationStatus.ACCEPTED,
        }
    });

    await prisma.member.create({
        data: {
            id: crypto.randomUUID(),
            userId: user.id,
            organizationId: projectId,
            role: invitation.role,
            createdAt: new Date(),
        }
    });

    revalidatePath(`/notifications`);

    return { success: true };
}

"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { InvitationStatus } from "../generated/prisma/enums";

export async function acceptInvitationLink(invitationId: string, projectId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }
    const invitation = await prisma.invitationLink.findUnique({
        where: {
            id: invitationId,
        }
    });

    if (!invitation) {
        return { error: "Invitation non trouvée" };
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

    await prisma.invitationLink.update({
        where: {
            id: invitationId,
        },
        data: {
            status: InvitationStatus.ACCEPTED,
            joinerId: user.id,
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
    revalidatePath(`/project/${projectId}/team`);
    revalidatePath(`/project/${projectId}/clients`);

    return { success: true };
}

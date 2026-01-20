"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { InvitationStatus } from "../generated/prisma/enums";

export async function deleteInvitation(invitationId: string, projectId: string) {
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

    if (invitation.status === InvitationStatus.ACCEPTED) {
        return { error: "Impossible de supprimer une invitation acceptée" };
    }

    await prisma.invitationLink.delete({
        where: {
            id: invitationId,
        }
    });

    console.log("Revalidating path /project/" + projectId + "/links");

    revalidatePath(`/project/${projectId}/links`);

    return { success: true };
}

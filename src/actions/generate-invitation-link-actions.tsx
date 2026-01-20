

"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { MemberRole } from "../generated/prisma/enums";

export async function generateInvitationLink(projectId: string) {
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
        return { error: "Vous n'êtes pas autorisé à ajouter des clients à ce projet" };
    }

    const invitationId = crypto.randomUUID();

    const invitationLink = await prisma.invitationLink.create({
        data: {
            id: invitationId,
            role: MemberRole.CLIENT,
            organizationId: projectId,
            link: `${process.env.NEXT_PUBLIC_APP_URL}/project/${projectId}/invitation/${invitationId}`,
            inviterId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    });

    revalidatePath(`/project/${projectId}/clients`);

    return { success: true, invitationLink };
}

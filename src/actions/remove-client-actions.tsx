"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { MemberRole } from "../generated/prisma/enums";

export async function removeClient(clientId: string, projectId: string) {
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
        return { error: "Vous n'êtes pas autorisé à supprimer des clients de ce projet" };
    }

    await prisma.member.deleteMany({
        where: {
            organizationId: projectId,
            userId: clientId,
        }
    });

    revalidatePath(`/project/${projectId}/clients`);

    return { success: true };
}

"use server";

import { getUser } from "@/src/lib/auth-server";
import { prisma } from "@/src/lib/prisma";
import { MemberRole } from "@/src/generated/prisma/enums";
import { redirect } from "next/navigation";

export async function deleteProject(projectId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour supprimer un projet" };
    }

    const member = await prisma.member.findFirst({
        where: {
            userId: user.id,
            organizationId: projectId,
            role: MemberRole.MAKER,
        },
    });

    if (!member) {
        return { error: "Vous n'avez pas les droits pour supprimer ce projet" };
    }

    await prisma.organization.delete({
        where: { id: projectId },
    });

    redirect("/projects");
}
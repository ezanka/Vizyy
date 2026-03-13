"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function deleteTest(projectId: string, testId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un test" };
    }

    const isMember = await prisma.member.findUnique({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId: projectId,
            },
        },
    });

    if (!isMember) {
        return { error: "Vous n'avez pas les permissions pour supprimer ce test" };
    }

    await prisma.test.delete({
        where: {
            id: testId,
        },
    });

    revalidatePath(`/project/${projectId}/test`);

    return { success: true };
}

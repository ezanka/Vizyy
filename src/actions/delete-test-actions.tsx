"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function deleteTest(projectId: string, testId: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un test" };
    }

    await prisma.test.delete({
        where: {
            id: testId,
        },
    });

    revalidatePath(`/project/${projectId}/test`);

    return { success: true };
}

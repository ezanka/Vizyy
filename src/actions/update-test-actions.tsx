"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { TestType, TestStatus } from "@/src/generated/prisma/enums";
import { Update } from "@/src/generated/prisma/client";

export async function updateTest(projectId: string, testId: string, type: TestType, status: TestStatus, details: string, update: Update) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un test" };
    }

    await prisma.test.update({
        where: {
            id: testId,
        },
        data: {
            type,
            status,
            details,
            update: {
                connect: {
                    id: update?.id,
                }
            },
            updatedAt: new Date(),
            updatedBy: {
                connect: {
                    id: user.id,
                }
            },
            passedAt: status === TestStatus.PASSED ? new Date() : null,
            passedBy: status === TestStatus.PASSED ? {
                connect: {
                    id: user.id,
                }
            } : {
                disconnect: true,
            },
        },
    });

    revalidatePath(`/project/${projectId}/test`);

    return { success: true };
}

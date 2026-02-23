"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { TestType, TestStatus } from "@/src/generated/prisma/enums";
import { Update } from "@/src/generated/prisma/client";

export async function createTest(projectId: string, type: TestType, status: TestStatus, details: string, update: Update) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un test" };
    }

    await prisma.test.create({
        data: {
            id: randomUUID(),
            projectId,
            updateId: update?.id,
            type,
            status,
            details,
            createdById: user.id,
            createdAt: new Date(),
            updatedAt: null,
            passedById: status === TestStatus.PASSED ? user.id : null,
            passedAt: status === TestStatus.PASSED ? new Date() : null,
        },
    });

    revalidatePath(`/project/${projectId}/test`);

    return { success: true };
}

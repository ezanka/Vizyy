"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { TestType, TestStatus, TestEnvironment } from "@/src/generated/prisma/enums";
import { Update } from "@/src/generated/prisma/client";
import { z } from "zod";

export async function createTest(projectId: string, name: string, actions: string, results: string, type: TestType, status: TestStatus, environment: TestEnvironment, update: Update) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un test" };
    }

    const schema = z.object({
        name: z.string().min(1).max(150),
        actions: z.string().min(1).max(2000),
        results: z.string().min(1).max(2000),
        type: z.enum(TestType),
        status: z.enum(TestStatus),
        environment: z.enum(TestEnvironment),
    });
    const parsed = schema.safeParse({ name, actions, results, type, status, environment });
    if (!parsed.success) return { error: "Données invalides" };

    await prisma.test.create({
        data: {
            id: randomUUID(),
            projectId,
            updateId: update?.id,

            name,
            actions,
            results,

            type,
            status,
            environment,

            isApproved: false,

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

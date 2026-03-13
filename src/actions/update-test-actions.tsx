"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { TestType, TestStatus, TestEnvironment } from "@/src/generated/prisma/enums";
import { Update } from "@/src/generated/prisma/client";
import { z } from "zod";

export async function updateTest(projectId: string, testId: string, name: string, type: TestType, status: TestStatus, actions: string, results: string, environment: TestEnvironment, update: Update) {
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

    await prisma.test.update({
        where: {
            id: testId,
        },
        data: {
            name,
            type,
            status,
            actions,
            results,
            environment,
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

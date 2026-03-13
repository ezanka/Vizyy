"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProfile(name: string, company: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour modifier votre profil" };
    }

    const schema = z.object({
        name: z.string().min(1).max(100),
        company: z.string().max(100).optional().or(z.literal("")),
    });
    const parsed = schema.safeParse({ name, company });
    if (!parsed.success) return { error: "Données invalides" };

    await prisma.user.update({
        where: { id: user.id },
        data: {
            name,
            company: company || null,
            updatedAt: new Date(),
        },
    });

    revalidatePath("/profile");

    return { success: true };
}

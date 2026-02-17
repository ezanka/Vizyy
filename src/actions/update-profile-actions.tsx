"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string, company: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour modifier votre profil" };
    }

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
